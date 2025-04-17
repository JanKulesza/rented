import { z } from "zod";

export enum UserRoles {
  OWNER = "owner",
  AGENT = "agent",
  USER = "user",
}

export const signupSchema = z
  .object({
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
    avatar: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "Image size must be less than 10MB",
      })
      .optional(),
    role: z
      .nativeEnum(UserRoles, { required_error: "Password is required" })
      .optional(),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;
