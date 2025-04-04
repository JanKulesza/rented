import "./utils/config.ts";
import express from "express";
import { handleError } from "./middlewares/error.ts";
import connectDB from "./utils/db.ts";
import setupRoutes from "./routes/index.ts";

export const app = express();

// Middlewares
app.use(express.json());

setupRoutes(app);

// Error handler
app.use(handleError);

const PORT = process.env.PORT ?? 8080;
export const server = app.listen(PORT, () => {
  connectDB(process.env.MONGODB_URI!);
  console.log(`Started server at http://localhost:${PORT}...`);
});
