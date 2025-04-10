import { configDotenv } from "dotenv";
import { configCloudinary } from "./cloudinary.ts";

configDotenv();
const { MONGODB_URI, AUTH_SECRET } = process.env;

if (!MONGODB_URI || !AUTH_SECRET)
  throw new Error("FATAL ERROR: environmental variables are not defined.");

configCloudinary();
