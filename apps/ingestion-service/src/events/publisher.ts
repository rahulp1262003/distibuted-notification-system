import Redis from "ioredis";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

export async function publishFanOutEvents(
    notificationId: string,
    userId: string,
    eventType: string
) {
    await redis.xadd(
        "email-stream",
        "*",
        "event",
        "notification.email.send",
        "notificationId",
        notificationId,
        "userId",
        userId,
        "eventType",
        eventType
    );

    await redis.xadd(
        "sms-stream",
        "*",
        "event",
        "notification.sms.send",
        "notificationId",
        notificationId,
        "userId",
        userId,
        "eventType",
        eventType
    );

    await redis.xadd(
        "push-stream",
        "*",
        "event",
        "notification.push.send",
        "notificationId",
        notificationId,
        "userId",
        userId,
        "eventType",
        eventType
    );

    console.log("Fan-Out Completed");
}