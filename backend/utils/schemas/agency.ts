import { z } from "zod";
import User from "../../models/user.ts";
import mongoose from "mongoose";
import Property from "../../models/property.ts";
import { addressSchema } from "./address.ts";

export const agencySchema = z.object({
  name: z.string({ required_error: "Name is required." }),
  address: addressSchema,
  owner: z
    .string({ required_error: "Owner is required." })
    .refine(async (arg) => {
      if (!mongoose.isValidObjectId(arg)) return false;
      else return true;
    }, "Invalid owner id."),
  agents: z
    .array(z.string(), { required_error: "Agents are required." })
    .refine(async (args) => {
      if (args.length === 0) return true;
      for (const arg of args) {
        if (!mongoose.isValidObjectId(arg)) return false;
        return !!(await User.findById(arg));
      }
    }, "Invalid agent id.")
    .optional(),
  properties: z
    .array(z.string(), { required_error: "Properties are required." })
    .refine(async (args) => {
      if (args.length === 0) return true;
      for (const arg of args) {
        if (!mongoose.isValidObjectId(arg)) return false;
        return !!(await Property.findById(arg));
      }
    }, "Invalid property id.")
    .optional(),
});

export type AgencySchemaType = z.infer<typeof agencySchema>;
