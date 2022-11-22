const uuid = require('uuid').v4
const { EventGridPublisherClient, AzureKeyCredential } = require('@azure/eventgrid')
const { logDebug } = require('./common/logging')

/** A list of possible event types to use when publishing an event
  *
  * @typedef {string} EventTypes
  * @property {string} EVENT - 'Amis.Events'
  * @property {string} TELEMETRY - 'Amis.Events.DeviceTelemetry'
  * @public
  */
const EventTypes = {
  EVENT: 'Amis.Events',
  TELEMETRY: 'Amis.Events.DeviceTelemetry'
}

/** @type Map(EventGridPublisherClient) */
const eventGridPublisherClientPool = new Map()

/**
 * Find an existing EventGridPublisher or create a new one.
 *
 * @param {string} topicEndpoint - URL of the Event Grid Topic
 * @param {string} topicKey - Key to access the Event Grid Topic
 * @param {function} logContext Reference to context.log of a function
 * @returns {EventGridPublisherClient}
 */
function getEventGridPublisherClient (topicEndpoint, topicKey, logContext) {
  logDebug(logContext, 'Event Grid Publisher asked')
  let eventGridPublisherClient = eventGridPublisherClientPool[topicEndpoint]
  if (!eventGridPublisherClient) {
    eventGridPublisherClient = new EventGridPublisherClient(topicEndpoint, 'EventGrid', new AzureKeyCredential(topicKey))
    eventGridPublisherClientPool[topicEndpoint] = eventGridPublisherClient
    logDebug(logContext, 'New Publisher created for topic: ' + topicEndpoint)
  } else {
    logDebug(logContext, 'Publisher reused for topic: ' + topicEndpoint)
  }
  return eventGridPublisherClient
}

/**
 * Utility class for working with Event Grid Topics
 * @class
 * @property {string} topicKey Key to access the Event Grid Topic
 * @property {string} topicEndpoint URL of the Event Grid Topic
 * @property {string} topicHostName Hostname part of topicEndpoint
 * @property {EventGridPublisherClient} egClient Reference to Eventgrid publisher client
 */
class EventTopic {
  /**
   * Creates an instance of EventTopic.
   * @param {object} params - Inputparameters
   * @param {string} params.topicKey - Key to access the Event Grid Topic
   * @param {string} params.topicEndpoint - URL of the Event Grid Topic
   * @param {function} params.logContext Reference to context.log of a function
   * @constructor
   * @memberof EventTopic
   */
  constructor ({ topicKey, topicEndpoint, logContext }) {
    this.topicKey = topicKey
    this.topicEndpoint = topicEndpoint
    this.egClient = getEventGridPublisherClient(this.topicEndpoint, this.topicKey, logContext)
    this.topicHostName = new URL(topicEndpoint).hostname
  }

  /**
   * Publish an event to the Event Grid Topic defines in the constructor of the class
   * See README for example of usage.
   *
   * @param {object} params - Inputparameters
   * @param {object} [params.data={}] - The data part of the event message (default={})
   * @param {string} [params.dataVersion='1.0'] - The (mandatory) data version in event message
   * @param {string} [params.subject='Event'] - The (mandatory) subject in the event message
   * @param {EventTypes} [params.eventType=EventTypes.EVENT] - The (mandatory) event type in the event message
   *                                        Any string values is allowed, but some have been predefined in EventTypes
   * @returns {Promise<string>} uuid of message when no error, otherwise an error will be raised
   * @memberof EventTopic
   */
  async publishEvent ({ data = {}, dataVersion = '1.0', subject = 'Event', eventType = EventTypes.EVENT }) {
    const currentDate = new Date()
    const events = [
      {
        id: uuid(),
        subject,
        dataVersion,
        eventType,
        data,
        eventTime: currentDate
      }
    ]
    try {
      await this.egClient.send(events)
      return events[0].id
    } catch (error) {
      throw new Error(`Error while publishing event: ${error.message}`)
    }
  }
}

module.exports = {
  EventTypes,
  EventTopic
}
