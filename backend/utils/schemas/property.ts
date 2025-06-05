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

export enum ListingTypes {
  SALE = "Sale",
  RENT = "Rent",
  PENDING = "Pending",
}

export const propertySchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(5, "Provide correct name."),
  image: z
    .any({ required_error: "File is required." })
    .optional()
    .refine(
      (file) => (file ? ACCEPTED_IMAGE_TYPES.includes(file.mimetype) : true),
      {
        message: "Invalid image file type",
      }
    ),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, "Provide correct description."),
  price: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") return Number(val);
    return val;
  }, z.number({ required_error: "Price is required." }).min(0, "Provide correct price.")),
  rating: z
    .preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") return Number(val);
      return val;
    }, z.number({ required_error: "Rating is required." }).min(0, "Provide correct rating.").max(100, "Provide correct rating."))
    .optional(),
  listingType: z.nativeEnum(ListingTypes, {
    required_error: "Listing type is required.",
  }),
  isSold: z.boolean().optional().default(false),
  location: z
    .string({ required_error: "Location is required." })
    .min(3, "Provide correct location."),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine((arg) => mongoose.isValidObjectId(arg), "Invalid agency id."),
  agent: z.preprocess((val) => {
    if (val === undefined || val === null) return null;
    if (typeof val === "string" && (val.trim() === "" || val === "undefined")) {
      return null;
    }
    return val;
  }, z.union([z.literal(null), z.string().refine((arg) => mongoose.isValidObjectId(arg), "Invalid agent id.")])),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required.",
  }),
});

export type PropertySchemaType = z.infer<typeof propertySchema>;
