import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password too short")
    .max(32, "Password too long"),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;
