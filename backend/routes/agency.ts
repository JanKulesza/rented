// /api/agencies
import { Router } from "express";
import {
  createAgency,
  deleteAgency,
  generateAddUserToken,
  getAgencies,
  getAgency,
  joinAgency,
  updateAgency,
} from "../controllers/agency.ts";
import { agent, owner } from "../middlewares/role.ts";
import { auth } from "../middlewares/auth.ts";

const router = Router();

router.get("/", getAgencies);
router.get("/:id", getAgency);
router.get("/:id/invitation-token", auth, agent, generateAddUserToken);

router.post("/", createAgency);
router.post("/join", auth, joinAgency);

router.put("/:id", auth, owner, updateAgency);

router.delete("/:id", auth, owner, deleteAgency);

export { router as agencyRouter };
