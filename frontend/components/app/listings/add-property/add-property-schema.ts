import {
  ListingTypes,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { Amenity } from "@/entities/amenities";
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

const livingAreaSchema = z.object({
  beds: z
    .number({ required_error: "Number of beds is required." })
    .min(1, "Please provide correct number of beds."),
  bedrooms: z
    .number({ required_error: "Number of bedrooms is required." })
    .min(1, "Please provide correct number of bedrooms."),
  bathrooms: z
    .number({ required_error: "Number of bathrooms is required." })
    .min(1, "Please provide correct number of bathrooms."),
  kitchens: z
    .number({ required_error: "Number of kitchens is required." })
    .min(1, "Please provide correct number of kitchens."),
});

export const addPropertySchema = z.object({
  image: z
    .instanceof(File, { message: "File is required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid image file type",
    }),
  name: z
    .string({ required_error: "Name is required." })
    .min(4, "Name too short.")
    .max(32, "Name too long."),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, "Description too short.")
    .max(500, "Description too long."),
  price: z.coerce
    .number({ required_error: "Price is required." })
    .min(0, "Provide correct price."),
  squareFootage: z
    .number({ required_error: "Square footage is required." })
    .min(1, "Please provide correct square footage."),
  listingType: z.nativeEnum(ListingTypes, {
    required_error: "Listing type is required.",
  }),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required",
  }),
  address: addressSchema,
  livingArea: livingAreaSchema.nullable(),
  amenities: z.array(z.nativeEnum(Amenity)),
  agent: z.string().nullable(),
});

export type AddressType = z.infer<typeof addressSchema>;
export type LivingAreaType = z.infer<typeof livingAreaSchema>;

export type AddPropertySchemaType = z.infer<typeof addPropertySchema>;
