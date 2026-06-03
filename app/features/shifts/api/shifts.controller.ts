import type { Request, Response } from "express";
import { ShiftsService } from "./shifts.service";

export async function listShiftsByWeek(req: Request, res: Response): Promise<void> {
  try {
    const weekStart = String(req.query.week ?? new Date().toISOString().split("T")[0]);
    const shifts = await ShiftsService.listByWeek(weekStart);
    res.json({ success: true, data: shifts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function listShiftsByDate(req: Request, res: Response): Promise<void> {
  try {
    const shifts = await ShiftsService.listByDate(req.params.date);
    res.json({ success: true, data: shifts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getWeekSummary(req: Request, res: Response): Promise<void> {
  try {
    const weekStart = String(req.query.week ?? new Date().toISOString().split("T")[0]);
    const summary = await ShiftsService.getWeekSummary(weekStart);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createShift(req: Request, res: Response): Promise<void> {
  try {
    const shift = await ShiftsService.create(req.body);
    res.status(201).json({ success: true, data: shift });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateShift(req: Request, res: Response): Promise<void> {
  try {
    const shift = await ShiftsService.update(req.params.id, req.body);
    res.json({ success: true, data: shift });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteShift(req: Request, res: Response): Promise<void> {
  try {
    await ShiftsService.remove(req.params.id);
    res.json({ success: true, message: "Shift deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
