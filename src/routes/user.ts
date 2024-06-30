import { FastifyInstance } from "fastify";
import multer from 'fastify-multer';

import { loginShcema, registerShcema, uploadSchema } from "../schemas/user.js";

import {
  login, logout, me,
  register, imgUpload,
} from "../controllers/user.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post("/register", { schema: registerShcema }, register)
    .post("/login", { schema: loginShcema }, login)
    .get("/me", { schema: registerShcema }, me)
    .post("/logout", { schema: registerShcema }, logout)
    .put("/imgupload", { schema: uploadSchema, preHandler: upload.single('image') }, imgUpload)
}

export default userRoutes;
