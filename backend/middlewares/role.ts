import { type Response, type Request, type NextFunction } from "express";
import { UserRoles } from "../types/user.ts";

export const owner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: "Access denied. Unauthorized user." });
    return;
  }

  if (req.user.role === UserRoles.Owner) return next();

  res.status(403).json({ error: "Forbidden. You are not an owner." });
};

export const agent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: "Access denied. Unauthorized user." });
    return;
  }

  if ([UserRoles.Agent, UserRoles.Owner].includes(req.user.role)) return next();

  res
    .status(403)
    .json({ error: "Forbidden. You are neither an agent nor an owner." });
};
