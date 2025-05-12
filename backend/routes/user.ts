import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.ts";
import { auth } from "../middlewares/auth.ts";

const router = Router();

router.get("/", auth, getUsers);
router.post("/", createUser);

router.get("/:id", getUser);

// Protected routes
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export { router as userRouter };
