import { z } from "zod";
import mongoose from "mongoose";
import { detailedAddressSchema } from "./address.ts";
import zodToInt from "../utils/zod-to-int.ts";
import { Amenities, ListingTypes, PropertyTypes } from "../types/property.ts";



export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const livingAreaSchema = z.object({
  beds: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Number of beds is required." })
      .min(1, "Please provide correct number of beds.")
  ),
  bedrooms: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Number of bedrooms is required." })
      .min(1, "Please provide correct number of bedrooms.")
  ),
  bathrooms: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Number of bathrooms is required." })
      .min(1, "Please provide correct number of bathrooms.")
  ),
  kitchens: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Number of kitchens is required." })
      .min(1, "Please provide correct number of kitchens.")
  ),
});

export const propertySchema = z.object({
  image: z
    .any({ required_error: "File is required." })
    .optional()
    .refine(
      (file) => (file ? ACCEPTED_IMAGE_TYPES.includes(file.mimetype) : true),
      {
        message: "Invalid image file type",
      }
    ),
  name: z
    .string({ required_error: "Name is required." })
    .min(4, "Name too short.")
    .max(32, "Name too long."),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, "Description too short.")
    .max(500, "Description too long."),
  price: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Price is required." })
      .min(0, "Provide correct price.")
  ),
  rating: z
    .preprocess(
      zodToInt,
      z
        .number({ required_error: "Rating is required." })
        .min(0, "Provide correct rating.")
        .max(100, "Provide correct rating.")
    )
    .optional(),
  listingType: z.nativeEnum(ListingTypes, {
    required_error: "Listing type is required.",
  }),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required.",
  }),
  isSold: z.boolean().optional().default(false),
  squareFootage: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Square footage is required." })
      .min(1, "Please provide correct square footage.")
  ),
  address: detailedAddressSchema,
  livingArea: z.preprocess(
    (val) => (val === "null" ? null : val),
    livingAreaSchema.nullable()
  ),
  amenities: z.preprocess(
    (val) =>
      typeof val === "string" && val.trim() !== ""
        ? !["undefined", "null"].includes(val)
          ? val === "[]"
            ? []
            : val.split(",")
          : null
        : null,
    z.array(z.nativeEnum(Amenities))
  ),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine((arg) => mongoose.isValidObjectId(arg), "Invalid agency id."),
  agent: z.preprocess((val) => {
    if (!val) return null;
    if (val === "undefined" || val === "null") return null;
    if (typeof val === "string" && val.trim() === "") return null;

    return val;
  }, z.union([z.literal(null), z.string().refine((arg) => mongoose.isValidObjectId(arg), "Invalid agent id.")])),
});

export type PropertySchemaType = z.infer<typeof propertySchema>;
