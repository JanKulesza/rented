import { z } from "zod";

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
});
