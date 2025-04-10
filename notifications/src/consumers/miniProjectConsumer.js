const kafka = require('../config/kafka');
const consumer = kafka.consumer({ groupId: 'mini-project-group' });
const { handleMiniProjectEvent } = require('../services/notificationService');
const logger = require('../config/logger');

async function consumeMiniProjectEvents() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'mini-project-events', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const data = JSON.parse(message.value.toString());
                await handleMiniProjectEvent(data);
            } catch (error) {
                logger.error(`Error processing mini project event: ${error.message}`);
            }
        }
    });
}

consumeMiniProjectEvents();
