const logger = require('../../config/logger');
async function send(userId, message) {
    // In-app notification logic...
    logger.info(`In-app notification delivered to ${userId}: ${message}`);
}
module.exports = { send };
