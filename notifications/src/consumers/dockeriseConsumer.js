const kafka = require('../config/kafka');
const consumer = kafka.consumer({ groupId: 'dockerise-group' });
const { handleDockeriseEvent } = require('../services/notificationService');
const logger = require('../config/logger');

async function consumeDockeriseEvents() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'dockerise-events', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const data = JSON.parse(message.value.toString());
                await handleDockeriseEvent(data);
            } catch (error) {
                logger.error(`Error processing dockerise event: ${error.message}`);
            }
        }
    });
}

consumeDockeriseEvents();
