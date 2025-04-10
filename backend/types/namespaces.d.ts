import jwt from "jsonwebtoken";
import { UserRoles } from "../utils/schemas/user.ts";

declare global {
  namespace Express {
    export interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    _id: string;
    email: string;
    role: UserRoles;
  }
}
