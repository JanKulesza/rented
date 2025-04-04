import { type Application } from "express";
import { agencyRouter } from "./agency.ts";
import { propertyRouter } from "./property.ts";
import { userRouter } from "./user.ts";
import { propertyTypeRoutes } from "./property-type.ts";

const setupRoutes = (app: Application) => {
  app.use("/api/agencies", agencyRouter);
  app.use("/api/properties", propertyRouter);
  app.use("/api/users", userRouter);
  app.use("/api/property-types", propertyTypeRoutes);
};

export default setupRoutes;
