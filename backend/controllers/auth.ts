import { type NextFunction, type Request, type Response } from "express";
import { signinSchema, type SigninSchemaType } from "../utils/schemas/auth.ts";
import jwt from "jsonwebtoken";
import User, { OAuthProviders } from "../models/user.ts";
import { parse, serialize } from "cookie";
import { isPast, addDays, fromUnixTime } from "date-fns";
import { OAuth2Client } from "google-auth-library";
import { userSchema } from "../utils/schemas/user.ts";

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

  const accessToken = user.generateAccessToken();
  console.log(accessToken);

  res.cookie("refreshToken", user.generateRefreshToken());

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
  const { _id } = payload;
  const user = await User.findById(_id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const newAccessToken = user.generateAccessToken();
  res.setHeader("Authorization", `Bearer ${newAccessToken}`);

  if (payload.iat && isPast(addDays(fromUnixTime(payload.iat), 7)))
    res.cookie("refreshToken", user.generateRefreshToken());

  res.status(200).json(newAccessToken);
};

const REDIRECTURI = "http://localhost:8080/api/auth/google/oauth";

export const getGoogleOAuthURL = async (req: Request, res: Response) => {
  res.setHeader("Referrer-Policy", "no-refferer-when-downgrade");
  const oAuth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: REDIRECTURI,
  });

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
  });

  res.status(200).json({ url: authorizeUrl });
};

export const googleOAuth = async (req: Request, res: Response) => {
  const code =
    "code" in req.query && typeof req.query.code == "string"
      ? req.query.code
      : null;

  if (!code) {
    res.status(500).json({ error: "Missing code." });
    return;
  }

  const oAuth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: REDIRECTURI,
  });

  const googleRes = await oAuth2Client.getToken(code);
  if (!googleRes.tokens.access_token) {
    res.status(500).json({ error: "No access token returned from Google." });
    return;
  }
  await oAuth2Client.setCredentials(googleRes.tokens);
  const { credentials } = oAuth2Client;
  if (!credentials.access_token) {
    res
      .status(500)
      .json({ error: "No access token returned from user credentials." });
    return;
  }

  const oAuthData = await getUserData(credentials.access_token);

  const user = await User.findOne({
    email: oAuthData.email,
    oauthId: oAuthData.sub,
    oauthProvider: OAuthProviders.GOOGLE,
  });

  if (user) {
    res.cookie("refreshToken", user.generateRefreshToken());

    res.redirect("http://localhost:3000");
    return;
  }

  const googleOAuthPayload = jwt.sign(
    {
      firstName: oAuthData.given_name,
      lastName: oAuthData.family_name,
      email: oAuthData.email,
      oauthId: oAuthData.sub,
      oauthProvider: OAuthProviders.GOOGLE,
    },
    process.env.JWT_SECRET!
  );

  const serialized = serialize("googleOAuthJWT", googleOAuthPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 10,
    path: "/",
  });

  res.cookie("googleOAuthJWT", serialized);

  res.redirect("http://localhost:3000/signup/google");
};

export const createGoogleOAuthUser = async (req: Request, res: Response) => {
  const cookies = parse(req.headers.cookie ?? "");
  const googleOAuthJWT = cookies.googleOAuthJWT
    ? cookies.googleOAuthJWT!.split(";")[0].slice("googleOAuthJWT=".length)
    : null;

  if (!googleOAuthJWT) {
    res.status(401).json({ error: "Access denied. No oauth access token." });
    return;
  }
  let googleOAuthPayload;
  try {
    googleOAuthPayload = jwt.verify(
      googleOAuthJWT!,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Access denied. Token expired." });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Access denied. Unauthorized user." });
      return;
    }
    throw error;
  }

  const { success, error, data } = await userSchema
    .pick({ address: true, phone: true, role: true })
    .safeParseAsync(req.body);

  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }

  const { address, phone, role } = data;

  delete googleOAuthPayload.iat;
  const user = new User({
    ...googleOAuthPayload,
    address,
    phone,
    role,
  });

  await user.save();

  res.cookie("refreshToken", user.generateRefreshToken());

  const accessToken = user.generateAccessToken;

  res.status(200).json({ token: accessToken });
};

export const getUserData = async (accessToken: string) =>
  (
    await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    )
  ).json();
