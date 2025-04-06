import { Router } from "express";
import {
  createAgency,
  deleteAgency,
  getAgencies,
  getAgency,
  updateAgency,
} from "../controllers/agency.ts";

const router = Router();

router.get("/", getAgencies);
router.post("/", createAgency);

router.get("/:id", getAgency);
router.put("/:id", updateAgency);
router.delete("/:id", deleteAgency);

export { router as agencyRouter };
