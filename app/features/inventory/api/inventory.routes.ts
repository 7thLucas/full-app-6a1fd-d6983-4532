import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import {
  listBeans,
  getBean,
  createBean,
  updateBean,
  restockBean,
  deleteBean,
  getLowStockAlerts,
} from "./inventory.controller";

const router = Router();

router.get("/inventory/beans", requireAuth, listBeans);
router.get("/inventory/alerts", requireAuth, getLowStockAlerts);
router.get("/inventory/beans/:id", requireAuth, getBean);
router.post("/inventory/beans", requireAuth, createBean);
router.put("/inventory/beans/:id", requireAuth, updateBean);
router.post("/inventory/beans/:id/restock", requireAuth, restockBean);
router.delete("/inventory/beans/:id", requireAuth, deleteBean);

export default router;
