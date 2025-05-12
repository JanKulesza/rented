import { configDotenv } from "dotenv";
import { configCloudinary } from "./cloudinary.ts";
import * as Sentry from "@sentry/node";

configDotenv();
const { MONGODB_URI, ACCESS_SECRET, REFRESH_SECRET, SENTRY_DSN } = process.env;

if (!MONGODB_URI || !ACCESS_SECRET || !REFRESH_SECRET || !SENTRY_DSN)
  throw new Error("FATAL ERROR: environmental variables are not defined.");

Sentry.init({
  dsn: SENTRY_DSN,
});

configCloudinary();
