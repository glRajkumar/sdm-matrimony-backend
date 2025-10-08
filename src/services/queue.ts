import { Queue } from 'bullmq';
import { env } from '../utils/enums.js';

export const queue = new Queue("sdm", {
  connection: {
    url: env.REDIS_URL,
  },
  streams: {
    events: { maxLen: 50 }
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 24 * 60 * 60,
  }
})
