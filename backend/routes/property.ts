// /api/properties
import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getProperty,
  updateProperty,
} from "../controllers/property.ts";

const router = Router();

router.get("/", getProperties);
router.post("/", createProperty);

router.get("/:id", getProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export { router as propertyRouter };
