import { z } from "zod";
import User from "../../models/user.ts";
import mongoose from "mongoose";
import Agency from "../../models/agency.ts";

export const userSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required." })
    .min(3, "Invalid first name."),
  lastName: z
    .string({ required_error: "Last name is required." })
    .min(3, "Invalid last name."),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email.")
    .refine(async (arg) => !!(await User.findOne({ email: arg }))),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 8 characters long."),
  sold: z.number().min(0, "Invalid number,").optional(),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine(async (arg) => {
      if (!mongoose.isValidObjectId(arg)) return false;
      return !!(await Agency.findById(arg));
    }, "Invalid agency id."),
});

export type UserSchemaType = z.infer<typeof userSchema>;
