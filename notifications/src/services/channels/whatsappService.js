const logger = require('../../config/logger');
async function send(userId, message) {
    // Send WhatsApp message logic...
    logger.info(`WhatsApp message sent to ${userId}: ${message}`);
}
module.exports = { send };
