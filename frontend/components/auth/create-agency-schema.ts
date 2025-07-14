import { z } from "zod";
import { signupSchema } from "./signup-schema";
import {
  ACCEPTED_IMAGE_TYPES,
  addressSchema,
} from "../app/listings/add-property/add-property-schema";

const createAgencySchemaBase = signupSchema._def.schema.extend({
  name: z.string({ required_error: "Name is required." }).min(4).max(32),
  image: z
    .instanceof(File, { message: "File is required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid image file type",
    })
    .optional(),
  address: addressSchema,
});

export const createAgencySchema = createAgencySchemaBase.refine(
  ({ confirmPassword, password }) => confirmPassword === password,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

export const createAgencyGoogleSchema = createAgencySchemaBase.pick({
  name: true,
  address: true,
  phone: true,
});

export const editAgencyShema = createAgencySchemaBase
  .pick({
    address: true,
    name: true,
    image: true,
  })
  .partial();

export type CreateAgencyType = z.infer<typeof createAgencySchema>;
export type CreateAgencyGoogleSchema = z.infer<typeof createAgencyGoogleSchema>;
export type EditAgencySchema = z.infer<typeof editAgencyShema>;
