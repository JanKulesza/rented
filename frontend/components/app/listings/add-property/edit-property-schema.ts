import { z } from "zod";
import { addPropertySchema } from "./add-property-schema";

export const editPropertySchema = addPropertySchema.partial();

export type EditPropertySchema = z.infer<typeof editPropertySchema>;
