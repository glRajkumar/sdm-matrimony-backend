import type { Context } from "hono";

import { saveImageLocally } from "../utils/index.js";

export async function extractImg(c: Context) {
  const formData = await c.req.formData()

  const image = formData.get("image")

  if (!image) return c.json({ message: 'No images found' }, 400)

  const url = await saveImageLocally(image)

  return c.json({ url })

}
