import { z } from "zod";
import { phoneRegex, UserRoles } from "./signup-schema";

export const googleSignupSchema = z.object({
  phone: z
    .string({ required_error: "Phone number is required." })
    .regex(phoneRegex, "Invalid phone number."),
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
});

export type GoogleSignupSchema = z.infer<typeof googleSignupSchema>;
