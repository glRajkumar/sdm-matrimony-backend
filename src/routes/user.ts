import { FastifyInstance } from "fastify";
import { loginShcema, registerShcema } from "../schemas/user.js";
import {
  login,
  logout,
  me,
  register,
  genrateSignature,
} from "../controllers/user.js";

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post("/register", { schema: registerShcema }, register)
    .post("/login", { schema: loginShcema }, login)
    .get("/me", { schema: registerShcema }, me)
    .post("/logout", { schema: registerShcema }, logout)
    .post("/genrateSignature", { schema: registerShcema }, genrateSignature);
}

export default userRoutes;
