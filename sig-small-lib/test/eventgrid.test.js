require('dotenv').config()
const { EventTopic, EventTypes } = require('../eventtopic')
const { publishEventToEventGridTopic } = require('../index')
const { ContextLogger } = require('./testhelper')

const config = {
  topicKey: process.env.TOPIC_KEY
}

describe('Send an event to an unknown topic', () => {

  it('Should raise an error', async () => {
    const context = new ContextLogger()
    expect.assertions(1)
    const topic = new EventTopic({
      topicKey: config.topicKey,
      topicEndpoint: 'https://blabla.westeurope-1.eventgrid.azure.net/api/events',
      logContext: context.log
    })
    try {
      await topic.publishEvent({}).then((resp) => { console.log(resp) })
    } catch (error) {
      expect(error.message).toEqual(expect.stringContaining('Error while publishing event'))
    }
  })
},30000)

describe('publishEventToEventGridTopic: send an event to an unknown topic', () => {

  it('Should raise an error', async () => {
    process.env.DEBUG = '*'
    expect.assertions(4)
    const context = new ContextLogger()
    try {
      await publishEventToEventGridTopic({
        topicKey: config.topicKey,
        topicEndpoint: 'https://blabla.westeurope-1.eventgrid.azure.net/api/events',
        eventType: EventTypes.ECM,
        subject: 'Test',
        message: { test: 'true' },
        logContext: context.log
      })
    } catch (error) {
      expect(error.message).toEqual(expect.stringContaining('Error while publishing event'))
      expect(context.log_messages.filter(m => m.startsWith('ERRO-EGLIBR-0001')).length).toBe(5) // Error while publishing (5 times)
      expect(context.log_messages.filter(m => m.startsWith('DBUG-EGLIBR-0001: Wait')).length).toBe(4) // DEBUG message Wait (4 times)
      expect(context.log_messages.filter(m => m.indexOf('Maximum number of retries reached: 5') >= 0).length).toBe(1) // number of retries
      delete process.env.DEBUG
    }
  }, 70000)
})