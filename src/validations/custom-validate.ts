import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodError, ZodType } from "zod";

function formatErrors(error: ZodError) {
  const messages: Record<string, string> = {}
  error.issues.forEach(issue => {
    const key = issue.path[0] as string
    if (messages[key]) {
      messages[key] = messages[key] + `, ${issue.message}`
    }
    else {
      messages[key] = issue.message
    }
  })

  return messages
}

export const zValidate = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const messages = formatErrors(result.error as any)
      const message = Object.entries(messages).map(([key, value]) => `${key}: ${value}`).join("; ")
      // const message = Object.values(messages).join("; ")
      return c.json({ message }, 400)
    }
  })