const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// GET notifications?userId=xxx
router.get('/notifications', getNotifications);
// POST to mark notification as read
router.post('/notifications/read', markAsRead);

module.exports = router;
