import { FastifyInstance } from "fastify";
import { connect } from 'mongoose';

async function connectDb(fastify: FastifyInstance,obt:any,done:any) {
  try {
    await connect(fastify.config.MONGODB_URL)
    console.log("MongoDB is connected now")
done()
  } catch (error) {
    console.log("cant connect to db")
    process.exit(1)
  }
  
}

export default connectDb
