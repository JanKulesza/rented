import { type NextFunction, type Request, type Response } from "express";
import { signinSchema, type SigninSchemaType } from "../utils/schemas/auth.ts";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";
import { parse, serialize } from "cookie";
import { isPast, addDays, fromUnixTime } from "date-fns";

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

  const isAuthorized = await user.comparePasswords(password);

  if (!isAuthorized) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  const { _id, role } = user;

  const payload = { _id, email, role };

  const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET!, {
    expiresIn: 60 * 15,
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const serialized = serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  res.cookie("refreshToken", serialized);

  res.json(accessToken);
};

export const signout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  res.json({});
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.status(200).json(user);
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = parse(req.headers.cookie ?? "");
  const refreshToken = cookies.refreshToken
    ? cookies.refreshToken.split(";")[0].slice("refreshToken=".length)
    : null;
  let payload;

  if (!refreshToken) {
    res.status(401).json({ error: "Access denied. No refresh token." });
    return;
  }

  try {
    payload = jwt.verify(
      refreshToken!,
      process.env.REFRESH_SECRET!
    ) as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Access denied. Unauthorized user." });
      return;
    }
    return next(error);
  }
  const { _id, email, role } = payload;

  const newAccessToken = jwt.sign(
    { _id, email, role },
    process.env.ACCESS_SECRET!,
    {
      expiresIn: 60 * 15,
    }
  );
  res.setHeader("Authorization", `Bearer ${newAccessToken}`);

  if (payload.iat && isPast(addDays(fromUnixTime(payload.iat), 7))) {
    const refreshToken = jwt.sign(
      { _id, email, role },
      process.env.REFRESH_SECRET!,
      {
        expiresIn: 60 * 60 * 24 * 30,
      }
    );

    const serialized = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    res.cookie("refreshToken", serialized);
  }

  res.status(200).json(newAccessToken);
};
