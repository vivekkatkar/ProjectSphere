const prisma = require('../db/client');
const logger = require('../config/logger');

// Helper: create a notification event record
async function createEvent({ eventName, triggerSource, metadata }) {
    return await prisma.notificationEvent.create({
        data: { eventName, triggerSource, metadata }
    });
}

// For regular notifications (Mini Project events)
async function createNotificationsForUsers(event, userIds, baseMessage) {
    // For each user, check preferences and create notifications per channel enabled.
    for (const userId of userIds) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { preferences: { include: { channel: true } } }
        });

        if (!user) continue;
        for (const pref of user.preferences) {
            if (pref.isEnabled) {
                await prisma.notification.create({
                    data: {
                        userId: user.id,
                        eventId: event.id,
                        message: baseMessage,
                        channel: pref.channel.name,
                        status: 'pending'
                    }
                });
                logger.info(`Notification created for user ${user.id} via channel ${pref.channel.name}`);
            }
        }
    }
}

// For dockerise events (group similar events for summary)
async function createOrUpdateSummaryNotification({ eventName, triggerSource, metadata, tag }) {
    // Check if there's an existing unsent summary event within a 5-minute window for this tag
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingEvent = await prisma.notificationEvent.findFirst({
        where: {
            eventName,
            triggerSource,
            createdAt: { gte: fiveMinutesAgo },
            metadata: { path: ['tag'], equals: tag }
        }
    });

    let event;
    if (existingEvent) {
        // Update metadata to add count or consolidate info
        let count = existingEvent.metadata.count || 1;
        count++;
        event = await prisma.notificationEvent.update({
            where: { id: existingEvent.id },
            data: { metadata: { ...existingEvent.metadata, count, tag } }
        });
    } else {
        // Create a new event with a count of 1.
        event = await prisma.notificationEvent.create({
            data: { eventName, triggerSource, metadata: { tag, count: 1 } }
        });
    }
    return event;
}

// Called by Kafka consumers for Mini Project events (e.g., task deadlines)
async function handleMiniProjectEvent({ taskName, userId }) {
    const event = await createEvent({
        eventName: 'TASK_DEADLINE',
        triggerSource: 'MINI_PROJECT',
        metadata: { taskName }
    });
    // In this case, notification per user (could be expanded to multiple users)
    await createNotificationsForUsers(event, [userId], `Deadline approaching for task: ${taskName}`);
}

// Called by Kafka consumer for Dockerise events (tag-match events)
async function handleDockeriseEvent({ projectId, tags, uploaderId }) {
    // For each tag, create/update summary notifications to avoid spamming users.
    for (const tag of tags) {
        const event = await createOrUpdateSummaryNotification({
            eventName: 'TAG_MATCH_SUMMARY',
            triggerSource: 'DOCKERISE',
            metadata: { tag, projectId },
            tag
        });
        // For summary, assume we deliver one aggregated notification per user who follows that tag.
        // In a real app, you might have a mapping from tag -> interested users.
        // For this demo, we will fetch all users who have enabled in-app notifications.
        const users = await prisma.user.findMany({
            where: {
                preferences: {
                    some: { channel: { name: 'in-app' } }
                }
            }
        });
        const summaryMessage = `New project(s) uploaded with tag ${tag}. Total updates: ${event.metadata.count}`;
        await createNotificationsForUsers(event, users.map(u => u.id).filter(id => id !== uploaderId), summaryMessage);
    }
}

module.exports = {
    handleMiniProjectEvent,
    handleDockeriseEvent
};
