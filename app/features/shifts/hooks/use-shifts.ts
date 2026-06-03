import { useState, useEffect, useCallback } from "react";
import { apiRequest, apiGet } from "~/lib/api.client";
import type { BaristaShift, CreateShiftDto, UpdateShiftDto } from "../api/shifts.model";

export type ShiftWeekSummary = {
  totalShifts: number;
  coveredShifts: number;
  uncoveredShifts: number;
  peakHourShifts: number;
  baristas: string[];
};

function getWeekStart(date?: Date): string {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

export function useShifts(initialWeekStart?: string) {
  const [weekStart, setWeekStart] = useState(initialWeekStart ?? getWeekStart());
  const [shifts, setShifts] = useState<BaristaShift[]>([]);
  const [summary, setSummary] = useState<ShiftWeekSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [shiftsRes, summaryRes] = await Promise.all([
      apiGet<BaristaShift[]>("/api/shifts", { week: weekStart }),
      apiGet<ShiftWeekSummary>("/api/shifts/summary", { week: weekStart }),
    ]);
    if (shiftsRes.success && shiftsRes.data) setShifts(shiftsRes.data);
    else setError(shiftsRes.message ?? "Failed to load shifts");
    if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
    setLoading(false);
  }, [weekStart]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const createShift = useCallback(async (dto: CreateShiftDto) => {
    const res = await apiRequest<BaristaShift>("/api/shifts", { method: "POST", data: dto });
    if (res.success) await fetchShifts();
    return res;
  }, [fetchShifts]);

  const updateShift = useCallback(async (id: string, dto: UpdateShiftDto) => {
    const res = await apiRequest<BaristaShift>(`/api/shifts/${id}`, { method: "PUT", data: dto });
    if (res.success) await fetchShifts();
    return res;
  }, [fetchShifts]);

  const deleteShift = useCallback(async (id: string) => {
    const res = await apiRequest<void>(`/api/shifts/${id}`, { method: "DELETE" });
    if (res.success) await fetchShifts();
    return res;
  }, [fetchShifts]);

  const prevWeek = useCallback(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().split("T")[0]);
  }, [weekStart]);

  const nextWeek = useCallback(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().split("T")[0]);
  }, [weekStart]);

  const goToCurrentWeek = useCallback(() => {
    setWeekStart(getWeekStart());
  }, []);

  return {
    weekStart,
    shifts,
    summary,
    loading,
    error,
    refetch: fetchShifts,
    createShift,
    updateShift,
    deleteShift,
    prevWeek,
    nextWeek,
    goToCurrentWeek,
  };
}
