import "./utils/config.ts";
import express from "express";
import { handleError } from "./middlewares/error.ts";
import connectDB from "./utils/db.ts";
import setupRoutes from "./routes/index.ts";
import upload from "./utils/multer.ts";
import * as Sentry from "@sentry/node";
import cors from "cors";

export const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(upload.single("image"));

setupRoutes(app);

// Sentry
Sentry.setupExpressErrorHandler(app);

// Error handler
app.use(handleError);

const PORT = process.env.PORT ?? 8080;
export const server = app.listen(PORT, () => {
  connectDB(process.env.MONGODB_URI!);
  console.log(`Started server at http://localhost:${PORT}...`);
});
