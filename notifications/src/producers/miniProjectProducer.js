const kafka = require('../config/kafka');
const producer = kafka.producer();
const logger = require('../config/logger');

async function notifyTaskDeadline(taskName, userId) {
    await producer.connect();
    await producer.send({
        topic: 'mini-project-events',
        messages: [
            { key: userId, value: JSON.stringify({ taskName, userId }) }
        ]
    });
    await producer.disconnect();
    logger.info(`Mini Project event produced for task: ${taskName}`);
}

module.exports = { notifyTaskDeadline };
