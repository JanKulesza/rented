// /api/properties
import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getProperty,
  updateProperty,
} from "../controllers/property.ts";
import { auth } from "../middlewares/auth.ts";
import { agent } from "../middlewares/role.ts";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getProperty);

router.post("/", auth, agent, createProperty);
router.put("/:id", auth, agent, updateProperty);
router.delete("/:id", auth, agent, deleteProperty);

export { router as propertyRouter };
