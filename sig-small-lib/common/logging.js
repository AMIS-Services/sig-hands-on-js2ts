const FUNCTIONALIAS = 'EGLIBR'

/**
* Log Debug message
*
* @param {object} logger - Supply with context.log
* @param {string} message - The message to display
*/
const logDebug = (logger, message) => {
  if (process.env.DEBUG && (process.env.DEBUG.split(',').includes('*') || process.env.DEBUG.split(',').includes(FUNCTIONALIAS))) {
    logger.info(`DBUG-${FUNCTIONALIAS}-0001: ${message}`)
  }
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
 */
const logError = (logger, errno, message) => {
  const errnum = errno.toString().padStart(4, '0')
  logger.error(`ERRO-${FUNCTIONALIAS}-${errnum}: ${message}`)
}

module.exports = { logDebug, logWarning, logError, FUNCTIONALIAS }
