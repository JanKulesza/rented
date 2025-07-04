import { z } from "zod";
import mongoose from "mongoose";
import { ACCEPTED_IMAGE_TYPES } from "./property.ts";
import { addressSchema } from "./address.ts";

export enum UserRoles {
  OWNER = "owner",
  AGENT = "agent",
  USER = "user",
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const userSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required." })
    .min(3, "Invalid first name."),
  lastName: z
    .string({ required_error: "Last name is required." })
    .min(3, "Invalid last name."),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email."),
  phone: z
    .string({ required_error: "Phone number is required." })
    .regex(phoneRegex, "Invalid phone number."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters long.")
    .max(32, "Password must be less than 32 characters"),
  image: z
    .any({ required_error: "File is required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype), {
      message: "Invalid image file type",
    })
    .optional(),
  address: addressSchema,
  sold: z.number().min(0, "Invalid number,").optional(),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine(async (arg) => {
      if (!mongoose.isValidObjectId(arg)) return false;
      return true;
    }, "Invalid agency id.")
    .optional(),
  properties: z
    .array(z.string({ required_error: "Properties are required." }))
    .refine(async (args) => {
      if (args.length === 0) return true;
      for (const arg of args) {
        if (!mongoose.isValidObjectId(arg)) return false;
      }
      return true;
    }, "Invalid property id.")
    .optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
