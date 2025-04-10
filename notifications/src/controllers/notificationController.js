const prisma = require('../db/client');

async function getNotifications(req, res) {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
    res.json({ notifications });
}

async function markAsRead(req, res) {
    const { notificationId } = req.body;
    if (!notificationId) return res.status(400).json({ error: 'notificationId is required' });
    const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });
    res.json({ updated });
}

module.exports = { getNotifications, markAsRead };
