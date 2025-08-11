import { z } from "zod";

export const extractImageSchema = z.object({
  images: z.array(z.instanceof(File, { message: "Images are required" }))
    .length(2, "Exactly two images are required"),
})
