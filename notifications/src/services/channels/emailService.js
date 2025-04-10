const logger = require('../../config/logger');
async function send(userId, message) {
    // Send email logic here...
    logger.info(`Email sent to ${userId}: ${message}`);
}
module.exports = { send };
