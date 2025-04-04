import { z } from "zod";
import Agency from "../../models/agency.ts";
import mongoose from "mongoose";

export const propertySchema = z.object({
  name: z
    .string({ required_error: "Name ise required." })
    .min(5, "Provide correct name."),
  price: z
    .number({ required_error: "Price is required." })
    .min(0, "Provide correct price."),
  rating: z
    .number({ required_error: "Rating is required." })
    .min(0, "Provide correct rating.")
    .max(100, "Provide correct rating."),
  isRented: z.boolean().optional(),
  location: z
    .string({ required_error: "Location is required." })
    .min(3, "Provide correct location."),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine(async (arg) => {
      if (!mongoose.isValidObjectId(arg)) return false;
      return !!(await Agency.findById(arg));
    }, "Invalid agency id."),
});

export type PropertySchemaType = z.infer<typeof propertySchema>;
