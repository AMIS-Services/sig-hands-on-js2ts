/**
 * @typedef {Object} ApplicationConfiguration
 * @property {string} serviceNowBaseUrl - the base URL for Service NOW, setting: SERVICENOW_BASE_URL
 * @property {string} serviceNowUsername - the user name for Service NOW, setting: SERVICENOW_USERNAME
 * @property {string} serviceNowPassword - the password for Service NOW, setting: SERVICENOW_PASSWORD
 */

/**
 * Function configuration object containing all environment settings
 *
 * @returns {ApplicationConfiguration}
 */
function getEnvironmentVariables () {
  return {
    serviceNowBaseUrl: process.env.SERVICENOW_BASE_URL,
    serviceNowUsername: process.env.SERVICENOW_USERNAME,
    serviceNowPassword: process.env.SERVICENOW_PASSWORD
  }
}

module.exports = {
  getEnvironmentVariables
}
