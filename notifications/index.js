require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes/api');
const logger = require('./src/config/logger');

const app = express();
app.use(bodyParser.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.info(`Notification service running on port ${PORT}`);
});

// Optionally, if you want to start Kafka consumers in the same process:
// require('./src/consumers/miniProjectConsumer');
// require('./src/consumers/dockeriseConsumer');
