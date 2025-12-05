import dotenv from 'dotenv';
dotenv.config(); 

import { createClient } from 'redis';

// const redisClient =  createClient({
//    url: "redis://127.0.0.1:6379"
// });

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

await redisClient.connect();

export default redisClient;
