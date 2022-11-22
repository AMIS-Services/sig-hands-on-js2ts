const { getEnvironmentVariables } = require('./utils')
const { logStart, logInfo, logFinished, logWarning } = require('./logging')
const { updateTicketInSNOW } = require('./snow')

/**
 * Triggered by new event on topic /incident-reports
 * @param {Context} context object to pass data to and from your function and to let you communicate with the runtime
 * @param {array} eventGridMessages The received event grid events
 */
async function run (context, eventGridEvent) {
  logStart(context.log, 'Received event from incident-reports topic')
  logInfo(context.log, `${JSON.stringify(eventGridEvent)}`)
  const config = getEnvironmentVariables()
  const logger = context.log
  // Get relevant payload from eventgrid message
  logInfo(context.log, 'Get actual message from EventGrid message')
  const eventData = await getDataFromPayload(eventGridEvent)
  if (!eventData) {
    logWarning(context.log, 1, 'No relevant data in event grid message.')
    logFinished(context.log, 'Finished')
    return
  }

  if (eventData.businessRuleNumber === 'F') {
    await processCloseTicket({ eventData, logger, config })
  }
  logFinished(logger, 'Message from EventGrid processed')
}

/**
 * Process an incoming event with close request for ticket
 * @param {object} params
 * @param {string} params.eventData - The data object retrieved from the event
 * @param {function} params.logger Function reference used for logging
 * @param {import('./utils').ApplicationConfiguration} params.config - Configuration object containing environment variables
 */
async function processCloseTicket ({ eventData, logger, config }) {
  logInfo(logger, 'Processing an incident with business rule (close/update request)')
  logInfo(logger, 'Closing ticket')
  await updateTicketInSNOW({
    snowTicketId: eventData.incidentSNOWId,
    newState: 'Resolved',
    closeNotes: `anomaly not detected anymore ${new Date().toISOString()}`,
    logger,
    config
  })
}

/**
 * Return the actual device message payload from the eventgrid message payload
 *
 * @param {Object} eventGridPayload - Eventgrid message
 * @returns {object} data object from payload
 */
function getDataFromPayload (eventGridPayload) {
  let data = {}
  if ('data' in eventGridPayload) {
    data = eventGridPayload.data
  } else {
    data = null
  }
  return data
}

module.exports = {
  run
}
