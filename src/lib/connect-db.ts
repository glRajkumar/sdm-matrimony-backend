import { connect } from 'mongoose';
import { env } from '../utils/index.js';

async function connectDb() {
  try {
    await connect(env.MONGODB_URL)
    console.log("MongoDB is connected now")

  } catch (error) {
    console.log("cant connect to db")
    process.exit(1)
  }
}

export default connectDb
