/* istanbul ignore file */
/**
 * Helper class as replacement of context
 * Contains counter to check in a test
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
      self.log_messages.push(msg)
    }

    this.log.warn = function (msg) {
      self.log_messages.push(msg)
    }

    this.log.error = function (msg) {
      self.log_messages.push(msg)
    }
  }
}

module.exports = {
  ContextLogger
}
