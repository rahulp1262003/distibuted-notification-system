import Redis from "ioredis";
import { publishFanOutEvents } from "../events/publisher";
import { NotificationCreatedEvent } from "@repo/event-contracts";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

async function consume() {
  let lastId = "$";

  while (true) {
    const response = await redis.xread(
      "BLOCK",
      0,
      "STREAMS",
      "notification-stream",
      lastId
    );

    if (!response) continue;

    const [, messages] = response[0];

    for (const [id, fields] of messages) {
      console.log("Received Event:");

      console.log(id);

      console.log(fields);

      const eventData = Object.fromEntries(
        Array.from({ length: fields.length / 2 }, (_, i) => [
          fields[i * 2],
          fields[i * 2 + 1],
        ])
      );

      const event: NotificationCreatedEvent = {
        notificationId: eventData.notificationId,
        userId: eventData.userId,
        eventType: eventData.eventType,
      };

      await publishFanOutEvents(event);

      lastId = id;
    }
  }
}

consume();