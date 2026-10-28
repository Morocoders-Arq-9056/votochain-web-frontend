import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001"),
  USE_MOCK_API: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

export const env = EnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  USE_MOCK_API: process.env.USE_MOCK_API,
});
