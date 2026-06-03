import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import {
  listShiftsByWeek,
  listShiftsByDate,
  getWeekSummary,
  createShift,
  updateShift,
  deleteShift,
} from "./shifts.controller";

const router = Router();

router.get("/shifts", requireAuth, listShiftsByWeek);
router.get("/shifts/summary", requireAuth, getWeekSummary);
router.get("/shifts/date/:date", requireAuth, listShiftsByDate);
router.post("/shifts", requireAuth, createShift);
router.put("/shifts/:id", requireAuth, updateShift);
router.delete("/shifts/:id", requireAuth, deleteShift);

export default router;
