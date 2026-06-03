import type { Request, Response } from "express";
import { InventoryService } from "./inventory.service";

export async function listBeans(req: Request, res: Response): Promise<void> {
  try {
    const beans = await InventoryService.list();
    res.json({ success: true, data: beans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getBean(req: Request, res: Response): Promise<void> {
  try {
    const bean = await InventoryService.getById(req.params.id);
    res.json({ success: true, data: bean });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function createBean(req: Request, res: Response): Promise<void> {
  try {
    const bean = await InventoryService.create(req.body);
    res.status(201).json({ success: true, data: bean });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateBean(req: Request, res: Response): Promise<void> {
  try {
    const bean = await InventoryService.update(req.params.id, req.body);
    res.json({ success: true, data: bean });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function restockBean(req: Request, res: Response): Promise<void> {
  try {
    const bean = await InventoryService.restock(req.params.id, req.body);
    res.json({ success: true, data: bean });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteBean(req: Request, res: Response): Promise<void> {
  try {
    await InventoryService.remove(req.params.id);
    res.json({ success: true, message: "Bean removed from inventory" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getLowStockAlerts(req: Request, res: Response): Promise<void> {
  try {
    const alerts = await InventoryService.getLowStockAlerts();
    res.json({ success: true, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
