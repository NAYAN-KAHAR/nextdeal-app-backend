import dotenv from 'dotenv';
dotenv.config(); 

import { createClient } from 'redis';

const redisClient =  createClient({
   url: "redis://127.0.0.1:6379"
});


// const redisClient = createClient({
//   url: process.env.REDIS_URL  // use the environment variable
// });

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

await redisClient.connect();

export default redisClient;

