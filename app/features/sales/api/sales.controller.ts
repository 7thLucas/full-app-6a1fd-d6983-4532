import type { Request, Response } from "express";
import { SalesService } from "./sales.service";

export async function listSales(req: Request, res: Response): Promise<void> {
  try {
    const days = parseInt(String(req.query.days ?? "30"), 10);
    const records = await SalesService.listRecent(days);
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSalesByDate(req: Request, res: Response): Promise<void> {
  try {
    const record = await SalesService.getByDate(req.params.date);
    if (!record) {
      res.status(404).json({ success: false, message: "No sales record for that date" });
      return;
    }
    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSalesSummary(req: Request, res: Response): Promise<void> {
  try {
    const days = parseInt(String(req.query.days ?? "7"), 10);
    const summary = await SalesService.getSummary(days);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function upsertSales(req: Request, res: Response): Promise<void> {
  try {
    const record = await SalesService.upsert(req.body);
    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateSales(req: Request, res: Response): Promise<void> {
  try {
    const record = await SalesService.update(req.params.id, req.body);
    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
