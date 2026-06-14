import { z } from "zod";
import zodToInt from "../utils/zod-to-int.ts";

export const addressSchema = z.object({
  city: z
    .string({ required_error: "City is required." })
    .min(1, "Provide correct city."),
  state: z
    .string({ required_error: "State is required." })
    .min(1, "Provide correct state."),
  country: z
    .string({ required_error: "Country is required." })
    .min(1, "Provide correct country."),
  zip: z
    .string({ required_error: "Zip code is required." })
    .min(3, "Provide correct zip code.")
    .max(10, "Zip code is too long."),
});

export const detailedAddressSchema = addressSchema.extend({
  address: z
    .string({ required_error: "Address is required." })
    .min(1, "Provide correct address."),
    suite: z.string().optional(),
  lat: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Latitude is required." })
      .min(-90, "Please provide correct latitude.")
      .max(90, "Please provide correct latitude.")
  ),
  lon: z.preprocess(
    zodToInt,
    z
      .number({ required_error: "Longitude is required." })
      .min(-180, "Please provide correct longitude.")
      .max(180, "Please provide correct longitude.")
  ),
})

export type AddressType = z.infer<typeof addressSchema>;
export type DetailedAddressType = z.infer<typeof detailedAddressSchema>;
