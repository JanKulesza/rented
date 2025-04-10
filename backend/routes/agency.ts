import { Router } from "express";
import {
  createAgency,
  deleteAgency,
  getAgencies,
  getAgency,
  updateAgency,
} from "../controllers/agency.ts";
import { owner } from "../middlewares/role.ts";
import { auth } from "../middlewares/auth.ts";

const router = Router();

router.get("/", getAgencies);
router.post("/", createAgency);

router.get("/:id", getAgency);
router.put("/:id", auth, owner, updateAgency);
router.delete("/:id", auth, owner, deleteAgency);

export { router as agencyRouter };
