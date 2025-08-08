import { z } from "zod";

export const searchPropertiesSchema = z.object({
  where: z.string().min(1, "Location is required"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().min(1, "At least one guest is required").optional(),
});

export type SearchPropertiesSchema = z.infer<typeof searchPropertiesSchema>;
