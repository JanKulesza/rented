import z from "zod";

export const signinSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 8 characters long.")
    .max(32, "Password must be less than 32 characters"),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;
