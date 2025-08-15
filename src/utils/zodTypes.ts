import { z } from "zod";

export const userSchema = z.object({
  email: z.email(),
  username: z.string().min(5).max(10),
  password: z.string(),
  profileImage: z.string().optional(),
  role: z.enum(["regular", "host"]),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const listingSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  address: z.string().min(15).max(50),
});
