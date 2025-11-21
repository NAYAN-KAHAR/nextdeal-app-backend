
import { createClient } from 'redis';

const redisClient =  createClient({
   url: "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

await redisClient.connect();

export default redisClient;