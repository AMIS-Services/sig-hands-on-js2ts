const fetch = require('node-fetch')
const base64 = require('base-64')
const { logInfo, logError } = require('./logging')

/**
 * Close a ticket in Service NOW
 * @param {object} params
 * @param {string} params.correlationId - the correlation ID of the incident
 * @param {string} params.eventData - The incoming event data
 * @param {function} params.logger Function reference used for logging
 * @param {import('./utils').ApplicationConfiguration} params.config - Configuration object containing environment variables
 */
async function updateTicketInSNOW ({ snowTicketId, newState, closeNotes, logger, config }) {
  logInfo(logger, `Close a new SNOW ticket with SNOW ID: ${snowTicketId}`)
  const url = config.serviceNowBaseUrl + 'generic_incident'
  const Headers = fetch.Headers
  const headers = new Headers()
  const encoding = base64.encode(config.serviceNowUsername + ':' + config.serviceNowPassword)

  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', 'Basic ' + encoding)

  const body = {
    incident_id: snowTicketId,
    state: newState,
    close_notes: closeNotes
  }

  logInfo(logger, `Composed body for update ticket: ${JSON.stringify(body)}`)

  const response = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers })
  const data = await response.json()

  logInfo(logger, `Response from SNOW API: ${JSON.stringify(data)}`)
  if (data.result && data.result.ticket_number) {
    return data.result.ticket_number
  } else {
    logError(logger, 2, `Updating ticket in Service NOW failed. Message: ${JSON.stringify(data.result)}`)
    return null
  }
}

module.exports = {
  updateTicketInSNOW
}
