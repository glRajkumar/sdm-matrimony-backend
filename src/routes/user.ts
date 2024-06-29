import { FastifyInstance } from "fastify";
import { loginShcema, registerShcema, uploadSchema } from "../schemas/user.js";
import {
  login,
  logout,
  me,
  register,
  // updateImg,
  imgUpload
} from "../controllers/user.js";
// import multer from 'fastify-multer';

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post("/register", { schema: registerShcema }, register)
    .post("/login", { schema: loginShcema }, login)
    .get("/me", { schema: registerShcema }, me)
    .post("/logout", { schema: registerShcema }, logout)
    // .put("/imgupload",{schema: registerShcema},imgUpload)
    .put("/imgupload",{schema: uploadSchema},imgUpload)
}

export default userRoutes;

// export default function (fastify: FastifyInstance, opts: any, done: () => void) {
//   fastify.post('/upload', { preHandler: upload.single('image') }, imgUpload);
//   done();
// }