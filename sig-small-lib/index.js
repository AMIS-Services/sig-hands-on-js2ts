const { EventTopic, EventTypes } = require('./eventtopic')

/**
 * Publish an event to an Event Grid Topic
 *
 * @param {object} params - The inputparameters
 * @param {string} params.topicKey - Key to access the Event Grid Topic
 * @param {string} params.topicEndpoint - URL of the Event Grid Topic
 * @param {string} params.eventType - The type of event
 * @param {string} params.subject - The subject of the event
 * @param {object} params.message - The message as (JSON) object
 * @param {function} params.logContext Reference to context.log of a function
 * @returns {Promise<string>} The generated uuid of the event
 */
async function publishEventToEventGridTopic ({ topicKey, topicEndpoint, eventType, subject, message, logContext }) {
  const topic = new EventTopic({
    topicKey,
    topicEndpoint,
    logContext
  })
  const resp = await topic.publishEvent({
    data: message,
    subject,
    eventType
  })
  return resp
}

module.exports = {
  EventTopic,
  EventTypes,
  publishEventToEventGridTopic
}
