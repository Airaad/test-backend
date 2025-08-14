import { z } from "zod";

export const userSchema = z.object({
  email: z.email(),
  username: z.string().min(6).max(10),
  password: z.string(),
  role: z.enum(["regular", "host"]),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
