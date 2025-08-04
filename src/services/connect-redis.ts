import { createClient } from 'redis';
import { env } from '../utils/enums.js';

export const redisClient = createClient({
  url: env.REDIS_URL
})

export async function connectRedis() {
  try {
    await redisClient.connect()
    console.log("Redis is connected now")

  } catch (error) {
    console.log("Can't connect to Redis")
  }
}

