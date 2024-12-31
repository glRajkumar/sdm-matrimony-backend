import { serve } from '@hono/node-server';

import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { Hono } from 'hono';

import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';

import connectDb from './lib/connect-db.js';

const app = new Hono().basePath("api")

app.use(logger())
app.use(cors())
app.use(csrf())

await connectDb()

app.get("/health", c => c.json({ status: "ok" }))

app.route("/user", userRoutes)
app.route("/admin", adminRoutes)

app.notFound(c => c.json({ message: 'Route not found' }, 404))

app.onError((err, c) => {
  console.log(err)
  return c.json({ message: err?.message || "Internal sever eror" }, 500)
})

const port = Number(process.env.PORT || 5000)
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
