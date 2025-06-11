import { unknown, z } from "zod";
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

const nonEmptyStr = (val: unknown) =>
  typeof val === "string" && val.trim() !== "" ? Number(val) : null;

export const addressSchema = z.object({
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
  address: z
    .string({ required_error: "Address is required." })
    .min(5, "Provide correct address."),
  suite: z.string().optional(),
  lat: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Latitude is required." })
      .min(-90, "Please provide correct latitude.")
      .max(90, "Please provide correct latitude.")
  ),
  lon: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Longitude is required." })
      .min(-180, "Please provide correct longitude.")
      .max(180, "Please provide correct longitude.")
  ),
});

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
  price: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Price is required." })
      .min(0, "Provide correct price.")
  ),
  rating: z
    .preprocess(
      nonEmptyStr,
      z
        .number({ required_error: "Rating is required." })
        .min(0, "Provide correct rating.")
        .max(100, "Provide correct rating.")
    )
    .optional(),
  listingType: z.nativeEnum(ListingTypes, {
    required_error: "Listing type is required.",
  }),
  isSold: z.boolean().optional().default(false),
  address: addressSchema,
  agency: z
    .string({ required_error: "Agency is required." })
    .refine((arg) => mongoose.isValidObjectId(arg), "Invalid agency id."),
  agent: z.preprocess((val) => {
    if (!val) return null;
    if (val === "undefined" || val === "null") return null;
    if (typeof val === "string" && val.trim() === "") return null;

    return val;
  }, z.union([z.literal(null), z.string().refine((arg) => mongoose.isValidObjectId(arg), "Invalid agent id.")])),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required.",
  }),
});

export type AddressType = z.infer<typeof addressSchema>;
export type PropertySchemaType = z.infer<typeof propertySchema>;
