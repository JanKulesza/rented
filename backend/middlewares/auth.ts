import { type Response, type Request, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "Access denied. Unauthorized user." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!);

    req.user = decoded as jwt.JwtPayload;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Access denied. Unauthorized user." });
      return;
    }
    next(error);
  }
};
