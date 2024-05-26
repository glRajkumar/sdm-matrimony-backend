import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';

interface User {
  username: string;
  password: string;
}

let users: User[] = [];

export async function registerUser(req: FastifyRequest, res: FastifyReply) {
  const { username, password } = req.body as User;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.code(201).send({ username });
}

export async function loginUser(req: FastifyRequest, res: FastifyReply) {
  const { username, password } = req.body as User;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.code(401).send({ message: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.code(401).send({ message: 'Invalid username or password' });
  }

  const token = (req.server as FastifyInstance).jwt.sign({ username });
  res.send({ token });
}
