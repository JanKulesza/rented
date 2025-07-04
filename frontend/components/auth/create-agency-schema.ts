import { z } from "zod";
import { signupSchema } from "./signup-schema";

const createAgencySchemaBase = signupSchema._def.schema.extend({
  name: z.string({ required_error: "Name is required." }),
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

export type CreateAgencyType = z.infer<typeof createAgencySchema>;
export type CreateAgencyGoogleSchema = z.infer<typeof createAgencyGoogleSchema>;
