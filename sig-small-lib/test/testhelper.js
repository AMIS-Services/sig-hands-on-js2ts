/* istanbul ignore file */
const { FUNCTIONALIAS } = require('../common/logging')

/**
 * Helper class as replacement of context
 * Only implemented log method, as redirect to console.log
 * And log property
 *
 * @class ContextLogger
 */
class ContextLogger {
  constructor () {
    const self = this
    this.log_messages = []

    this.log = function (message) {
      throw new Error('Do not use default log level')
    }

    this.log.info = function (msg) {
      if (!msg.includes(`DBUG-${FUNCTIONALIAS}`)) {
        throw new Error('Wrong DBUG code: ' + msg)
      }
      self.log_messages.push(msg)
    }

    this.log.warn = function (msg) {
      if (!msg.includes(`WARN-${FUNCTIONALIAS}`)) {
        throw new Error('Wrong WARN code: ' + msg)
      }
      self.log_messages.push(msg)
    }

    this.log.error = function (msg) {
      if (!msg.includes(`ERRO-${FUNCTIONALIAS}`)) {
        throw new Error('Wrong ERROR code: ' + msg)
      }
      self.log_messages.push(msg)
    }
  }
}

module.exports = {
  ContextLogger
}