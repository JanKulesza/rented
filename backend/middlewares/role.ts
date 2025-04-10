import { type Response, type Request, type NextFunction } from "express";
import { UserRoles } from "../utils/schemas/user.ts";

export const owner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: "Access denied. Unauthorized user." });
    return;
  }

  if (req.user.role === UserRoles.OWNER) return next();

  res.status(403).json({ error: "Forbidden." });
};

export const agent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: "Access denied. Unauthorized user." });
    return;
  }

  if ([UserRoles.AGENT, UserRoles.OWNER].includes(req.user.role)) return next();

  res.status(403).json({ error: "Forbidden." });
};
