import { z } from "zod";

enum PropertyTypes {
  "Apartment",
  "House",
  "Villa",
  "Condo",
  "Townhouse",
  "Land",
  "Commercial",
  "Industrial",
}

export const propertyTypeSchema = z.object({
  name: z.nativeEnum(PropertyTypes, { required_error: "Name is required" }),
});

export type PropertySchemaType = z.infer<typeof propertyTypeSchema>;
