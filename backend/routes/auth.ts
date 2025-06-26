// /api/auth
import { Router } from "express";
import {
  createGoogleOAuthUser,
  getGoogleOAuthURL,
  getMe,
  googleOAuth,
  refreshToken,
  signin,
  signout,
} from "../controllers/auth.ts";
import { auth } from "../middlewares/auth.ts";

const router = Router();

router.get("/me", auth, getMe);
router.get("/refresh", refreshToken);

router.post("/signin", signin);
router.post("/signout", auth, signout);

router.get("/google/callback", getGoogleOAuthURL);
router.get("/google/oauth", googleOAuth);
router.post("/google/signup", createGoogleOAuthUser);

export { router as authRouter };
