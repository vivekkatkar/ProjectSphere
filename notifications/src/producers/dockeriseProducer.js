const kafka = require('../config/kafka');
const producer = kafka.producer();
const logger = require('../config/logger');

async function notifyTagMatch(projectId, tags, uploaderId) {
    await producer.connect();
    await producer.send({
        topic: 'dockerise-events',
        messages: [
            { value: JSON.stringify({ projectId, tags, uploaderId }) }
        ]
    });
    await producer.disconnect();
    logger.info(`Dockerise event produced for project: ${projectId}`);
}

module.exports = { notifyTagMatch };
