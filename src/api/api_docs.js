/**
 * @typedef {Object} vehicleMedia
 * @property {string} name - Name of image
 * @property {string} url - URL of image
 * @property {string} query - relevant media query for image
 */

/**
 * @typedef {Object} vehicleMeta
 * @property {string} passengers - number of seats
 * @property {Array.<string>} drivetrain - drive train
 * @property {Array.<string>} bodystyles - type of vehicle body
 * @property {Object.<string>} emissions - detail of vehicle CO2 emission
 */

/**
 * @typedef {Object} vehicleSummaryPayload
 * @property {string} id - ID of the vehicle
 * @property {string} apiUrl - API URL for price, description & other details
 * @property {string} description - Description
 * @property {string} price - Price
 * @property {Array.<vehicleMedia>} media - Array of vehicle images
 * @property {Object.<vehicleMeta>} meta - meta information about this vehicle
 */
