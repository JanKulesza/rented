import { type Application } from "express";
import { agencyRouter } from "./agency.ts";
import { propertyRouter } from "./property.ts";
import { userRouter } from "./user.ts";
import { authRouter } from "./auth.ts";
import { getGeoCode } from "../controllers/geocode.ts";

const setupRoutes = (app: Application) => {
  app.use("/api/auth", authRouter);
  app.use("/api/agencies", agencyRouter);
  app.use("/api/properties", propertyRouter);
  app.use("/api/users", userRouter);

  //@ts-ignore
  app.get("/api/geocode", getGeoCode);
};

export default setupRoutes;
