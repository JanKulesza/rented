import { z } from "zod";

export enum UserRoles {
  OWNER = "owner",
  AGENT = "agent",
  USER = "user",
}

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

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
    phone: z
      .string({ required_error: "Phone number is required." })
      .regex(phoneRegex, "Invalid phone number."),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password too short")
      .max(32, "Password too long"),
    confirmPassword: z
      .string({ required_error: "Passwords don't match" })
      .min(6, "Passwords don't match")
      .max(32, "Passwords don't match"),
    address: z.object({
      city: z
        .string({ required_error: "City is required." })
        .min(1, "Provide correct city."),
      state: z
        .string({ required_error: "State is required." })
        .min(2, "Provide correct state."),
      country: z
        .string({ required_error: "Country is required." })
        .min(4, "Provide correct country."),
      zip: z
        .string({ required_error: "Zip code is required." })
        .min(3, "Provide correct zip code.")
        .max(10, "Zip code is too long."),
    }),
    role: z
      .nativeEnum(UserRoles, { required_error: "Password is required" })
      .optional(),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;
