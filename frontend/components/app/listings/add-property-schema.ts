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
  location: z
    .string({ required_error: "Location is required." })
    .min(3, "Provide correct location."),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required",
  }),
  agent: z.string().optional(),
});

export type AddPropertySchemaType = z.infer<typeof addPropertySchema>;
