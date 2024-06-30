import { FastifyInstance } from "fastify";
import { connect } from 'mongoose';

async function connectDb(fastify: FastifyInstance) {
  try {
    await connect(fastify.config.MONGODB_URL)
    console.log("MongoDB is connected now")

  } catch (error) {
    console.log("cant connect to db")
    process.exit(1)
  }
}

export default connectDb
