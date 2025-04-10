// /api/auth

import { Router } from "express";
import { signin } from "../controllers/auth.ts";

const router = Router();

router.post("/signin", signin);

export { router as authRouter };
