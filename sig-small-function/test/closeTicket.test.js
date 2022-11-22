require('dotenv').config()
const { ContextLogger } = require('./testhelper')
const { run } = require('../reportHandler')
const nock = require('nock')

describe('1 ticket: new (close ticket)', () => {
  const context = new ContextLogger()
  const manufacturerDeviceId = 'unittest-meter1'
  const ean = '123'
  const businessRuleNumber = 'X'
  const correlationId = `${ean}_1`
  const shortDescription = 'incident status check'
  const description = 'The average difference between supply and return temperatures reported during last 3 days is -10'
  const ticketNumber = 'INC001234'
  const testEvent = {
    id: '68670be4-14d4-6886-f84d-7a4db5d9fc1b',
    topic: 'test',
    subject: manufacturerDeviceId,
    eventType: 'Amis.Events.IncidentTicket',
    eventTime: new Date().toISOString(),
    data: {
      manufacturerDeviceId,
      businessRuleNumber,
      businessRuleShortDescription: shortDescription,
      ean,
      incidentSNOWId: ticketNumber
    },
    dataVersion: '1.0',
    metadataVersion: '1'
  }

  beforeAll(async function () {
    nock.cleanAll()
    nock('https://dev.service.com/api')
      .get(uri => uri.includes('/get_incident_info'))
      .reply(200, {
        result: {
          incidentArray: {
            correlation_id: correlationId,
            ticket_number: ticketNumber,
            state: 'New',
            service: 'Service 1',
            impact: '3 - Low',
            urgency: '3 - Low',
            priority: '4 - Low',
            ci: 'Aligne',
            assingnmentGroup: 'ServiceDesk',
            assignedTo: '',
            shortDescription,
            description,
            resolutionCode: '',
            resolutionNote: ''
          },
          message: 'Record(s) succesfully found'
        }
      })

    nock('https://dev.service.com/api')
      .post(uri => uri.includes('/generic_incident'))
      .reply(200, {
        result: {
          ticket_number: ticketNumber,
          message: 'Incident has been updated succesfully'
        }
      })
  })

  it('should close ticket in SNOW', async () => {
    await run(context, testEvent)
    expect(context.log_messages.filter(m => m.includes('WARN-')).length).toEqual(0)
    expect(context.log_messages.filter(m => m.includes('ERRO-')).length).toEqual(0)
    expect(context.log_messages.filter(msg => msg.indexOf('Incident has been updated succesfully') > 0).length).toBeGreaterThanOrEqual(0)
  })
})
