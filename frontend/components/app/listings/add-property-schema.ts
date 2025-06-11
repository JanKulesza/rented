import {
  ListingTypes,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

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
  lat: z
    .number({ required_error: "Latitude is required." })
    .min(-90, "Please provide correct latitude.")
    .max(90, "Please provide correct latitude."),
  lon: z
    .number({ required_error: "Longitude is required." })
    .min(-180, "Please provide correct longitude.")
    .max(180, "Please provide correct longitude."),
});

export const addPropertySchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(5, "Provide correct name."),
  image: z
    .instanceof(File, { message: "File is required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid image file type",
    }),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, "Provide correct description."),
  price: z.coerce
    .number({ required_error: "Price is required." })
    .min(0, "Provide correct price."),
  listingType: z.nativeEnum(ListingTypes, {
    required_error: "Listing type is required.",
  }),
  address: addressSchema,
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required",
  }),
  agent: z.string().optional(),
});

export type AddressType = z.infer<typeof addressSchema>;

export type AddPropertySchemaType = z.infer<typeof addPropertySchema>;
