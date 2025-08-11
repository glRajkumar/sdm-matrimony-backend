import type { Context, ValidationTargets } from "hono";
import type { z } from "zod";

type zContext<Targets extends Partial<Record<keyof ValidationTargets, z.ZodTypeAny>>> = Context<
  {},
  "",
  {
    out: {
      [K in keyof Targets]: z.infer<Targets[K]>
    }
  }
>
