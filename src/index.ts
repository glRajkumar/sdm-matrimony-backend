import { serve } from '@hono/node-server';

import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { Hono } from 'hono';

import createRateLimiter from './middlewares/rate-limit.js';
import migrationRoutes from './routes/migration.js';
import fakerRoutes from './routes/faker.js';

import superAdminRoutes from './routes/super-admin.js';
import extractorRoutes from './routes/extractor.js';
import accountRoutes from './routes/account.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';

import { connectMongo, connectRedis } from './services/index.js';
import { env } from './utils/enums.js';

try {
  await Promise.all([connectMongo(), connectRedis()])
} catch (error) {
  process.exit(1)
}

const app = new Hono().basePath("api")

app.use(logger())
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(secureHeaders())
app.use(compress())

app.route("/account", accountRoutes)

app.use(createRateLimiter())

app.get("/health", c => c.json({ status: "ok" }))

app.route("/user", userRoutes)
app.route("/admin", adminRoutes)
app.route("/super-admin", superAdminRoutes)
app.route("/extractor", extractorRoutes)
app.route("/payment", paymentRoutes)

app.route("/faker", fakerRoutes)
app.route("/migration", migrationRoutes)

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
