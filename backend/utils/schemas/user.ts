import { z } from "zod";
import mongoose from "mongoose";
import Agency from "../../models/agency.ts";
import Property from "../../models/property.ts";
import { ACCEPTED_IMAGE_TYPES } from "./property.ts";

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
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 8 characters long."),
  image: z
    .any({ required_error: "File is required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype), {
      message: "Invalid image file type",
    })
    .optional(),
  sold: z.number().min(0, "Invalid number,").optional(),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine(async (arg) => {
      if (!mongoose.isValidObjectId(arg)) return false;
      return !!(await Agency.findById(arg));
    }, "Invalid agency id.")
    .optional(),
  properties: z
    .array(z.string({ required_error: "Properties are required." }))
    .refine(async (args) => {
      if (args.length === 0) return true;
      for (const arg of args) {
        if (!mongoose.isValidObjectId(arg)) return false;
        return !!(await Property.findById(arg));
      }
    }, "Invalid property id.")
    .optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
