import { type Request, type Response } from "express";
import { signinSchema, type SigninSchemaType } from "../utils/schemas/auth.ts";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";

export const signin = async (req: Request, res: Response) => {
  const { success, error } = await signinSchema.safeParseAsync(req.body);
  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }

  const { email, password } = req.body as SigninSchemaType;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  const isAuthorized = user.comparePasswords(password);

  if (!isAuthorized) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  const { _id, role } = user;

  const token = jwt.sign({ _id, email, role }, process.env.AUTH_SECRET!, {
    expiresIn: "1d",
  });

  res.json({ token });
};
