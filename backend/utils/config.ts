import { configDotenv } from "dotenv";
import { configCloudinary } from "./cloudinary.ts";

configDotenv();
const { MONGODB_URI, JWT_SECRET, CLOUDINARY_URL } = process.env;

if (!MONGODB_URI || !JWT_SECRET || !CLOUDINARY_URL)
  throw new Error("FATAL ERROR: environmental variables are not defined.");

configCloudinary();
