import { connect } from 'mongoose';
import { env } from '../utils/index.js';

export async function connectMongo() {
  try {
    await connect(env.MONGODB_URL)
    console.log("MongoDB is connected now")

  } catch (error) {
    console.log("Can't connect to MongoDB")
  }
}
