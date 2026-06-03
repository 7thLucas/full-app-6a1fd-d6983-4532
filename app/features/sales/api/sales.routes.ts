import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import { listSales, getSalesByDate, getSalesSummary, upsertSales, updateSales } from "./sales.controller";

const router = Router();

router.get("/sales", requireAuth, listSales);
router.get("/sales/summary", requireAuth, getSalesSummary);
router.get("/sales/date/:date", requireAuth, getSalesByDate);
router.post("/sales", requireAuth, upsertSales);
router.put("/sales/:id", requireAuth, updateSales);

export default router;
