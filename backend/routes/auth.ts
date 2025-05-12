// /api/auth
import { Router } from "express";
import { getMe, refreshToken, signin, signout } from "../controllers/auth.ts";
import { auth } from "../middlewares/auth.ts";

const router = Router();

router.get("/me", auth, getMe);
router.get("/refresh", refreshToken);

router.post("/signin", signin);
router.post("/signout", auth, signout);

export { router as authRouter };
