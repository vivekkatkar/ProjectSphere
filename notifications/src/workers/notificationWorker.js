const prisma = require('../db/client');
const logger = require('../config/logger');
const emailService = require('../services/channels/emailService');
const whatsappService = require('../services/channels/whatsappService');
const inAppService = require('../services/channels/inAppService');

async function processPendingNotifications() {
    try {
        const pending = await prisma.notification.findMany({
            where: { status: 'pending' }
        });
        for (const notification of pending) {
            // Dispatch based on channel
            switch (notification.channel) {
                case 'email':
                    await emailService.send(notification.userId, notification.message);
                    break;
                case 'whatsapp':
                    await whatsappService.send(notification.userId, notification.message);
                    break;
                case 'in-app':
                    await inAppService.send(notification.userId, notification.message);
                    break;
                default:
                    logger.warn(`Unknown channel ${notification.channel} for notification ${notification.id}`);
            }
            // Mark as sent
            await prisma.notification.update({
                where: { id: notification.id },
                data: { status: 'sent', sentAt: new Date() }
            });
            logger.info(`Notification ${notification.id} sent via ${notification.channel}`);
        }
    } catch (error) {
        logger.error(`Error in notification worker: ${error.message}`);
    }
}

// Run worker periodically
setInterval(processPendingNotifications, 10000);
