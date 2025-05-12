import { type Response, type Request, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  let payload;

  if (!accessToken) {
    res.status(401).json({ error: "Access denied. No access token." });
    return;
  }

  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_SECRET!);

    req.user = payload as jwt.JwtPayload;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Access denied. Unauthorized user." });
      return;
    } else return next(error);
  }
};
