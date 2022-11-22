const FUNCTIONALIAS = 'SNOREP'

/**
 * Log Info message when function is started
 *
 * @param {object} logger - Supply with context.log
 * @param {string} message - The message to display
 */
const logStart = (logger, message) => {
  logger.info(`INFO-${FUNCTIONALIAS}-0001: ${message} (${new Date().toISOString()})`)
}

/**
 * Log Info message when function is finished
 *
 * @param {object} logger - Supply with context.log
 * @param {string} message - The message to display
 */
const logFinished = (logger, message) => {
  logger.info(`INFO-${FUNCTIONALIAS}-0003: ${message} (${new Date().toISOString()})`)
}

/**
 * Log Info message
 *
 * @param {object} logger - Supply with context.log
 * @param {string} message - The message to display
 */
const logInfo = (logger, message) => {
  logger.info(`INFO-${FUNCTIONALIAS}-0002: ${message}`)
}

/**
 * Log warning messags (functional unhappy flow)
 *
 * @param {object} logger - Supply with context.log
 * @param {number} errno - The error number
 * @param {string} message - The message to display
 */
const logWarning = (logger, errno, message) => {
  const errnum = errno.toString().padStart(4, '0')
  logger.warn(`WARN-${FUNCTIONALIAS}-${errnum}: ${message}`)
}

/**
 * Log error messags (unexpected errors occured intercation with other components or systems)
 *
 * @param {object} logger - Supply with context.log
 * @param {number} errno - The error number
 * @param {string} message - The message to display
 * @returns {string} - The message including the error code
 */
const logError = (logger, errno, message) => {
  const errnum = errno.toString().padStart(4, '0')
  const logmesage = `ERRO-${FUNCTIONALIAS}-${errnum}: ${message}`
  logger.error(logmesage)
  return logmesage
}

module.exports = { logStart, logFinished, logInfo, logWarning, logError, FUNCTIONALIAS }
