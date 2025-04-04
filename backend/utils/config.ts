import { configDotenv } from "dotenv";

configDotenv();
const { MONGODB_URI, JWT_SECRET } = process.env;

if (!MONGODB_URI || !JWT_SECRET)
  throw new Error("FATAL ERROR: environmental variables are not defined.");
