import { z } from "zod";

export const createAgencySchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(3, "First name is too short"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(3, "Last name is too short"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password too short")
    .max(32, "Password too long"),
  confirmPassword: z
    .string({ required_error: "Passwords don't match" })
    .min(6, "Passwords don't match")
    .max(32, "Passwords don't match"),
  name: z.string({ required_error: "Name is required." }),
  location: z
    .string({ required_error: "Location is required." })
    .min(3, "Provide correct location."),
});

export type CreateAgencyType = z.infer<typeof createAgencySchema>;
