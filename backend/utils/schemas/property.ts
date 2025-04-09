import { z } from "zod";
import mongoose from "mongoose";
import Agency from "../../models/agency.ts";
import User from "../../models/user.ts";

export enum PropertyTypes {
  APARTAMENT = "Apartment",
  STUDIO = "Studio",
  HOUSE = "House",
  VILLA = "Villa",
  CONDO = "Condo",
  TOWNHOUSE = "Townhouse",
  COMMERCIAL = "Commercial",
  INDUSTRIAL = "Industrial",
}

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const propertySchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(5, "Provide correct name."),
  image: z
    .any({ required_error: "File is required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype), {
      message: "Invalid image file type",
    }),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, "Provide correct description."),
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
  agent: z
    .string({ required_error: "Agent is required." })
    .refine(async (arg) => {
      if (!mongoose.isValidObjectId(arg)) return false;
      return !!(await User.findById(arg));
    }, "Invalid agent id."),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Name is required",
  }),
});

export type PropertySchemaType = z.infer<typeof propertySchema>;
