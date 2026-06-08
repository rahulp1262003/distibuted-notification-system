import Redis from "ioredis";

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

      lastId = id;
    }
  }
}

consume();