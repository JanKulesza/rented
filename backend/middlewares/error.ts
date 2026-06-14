import { MongooseError } from "mongoose";
import { type Response, type Request, type NextFunction } from "express";
import formatErrRes from "../utils/format-err-res.ts";

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Send a response
  res.status(500).json(formatErrRes("An unexpected error occurred."));

  if (process.env.NODE_ENV !== "development") return;

  // Log the error
  if (err instanceof MongooseError) {
    console.log("Mongoose Error:", err);
  } else {
    console.log("Unexpected Error:", err);
  }
};
