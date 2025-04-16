import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .nonempty("Please enter your email.")
    .email("This is not a valid email."),
  password: z
    .string({ message: "Please enter your password." })
    .min(6, "Invalid password."),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;
