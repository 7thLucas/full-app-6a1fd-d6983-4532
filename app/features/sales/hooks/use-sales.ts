import { useState, useEffect, useCallback } from "react";
import { apiRequest, apiGet } from "~/lib/api.client";
import type { DailySales, CreateDailySalesDto, UpdateDailySalesDto } from "../api/sales.model";

export type SalesSummary = {
  totalRevenue: number;
  totalTransactions: number;
  averageTicket: number;
  dailyAvgRevenue: number;
  records: DailySales[];
};

export function useSalesSummary(days = 7) {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiGet<SalesSummary>("/api/sales/summary", { days });
    if (res.success && res.data) {
      setSummary(res.data);
    } else {
      setError(res.message ?? "Failed to load sales summary");
    }
    setLoading(false);
  }, [days]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}

export function useSalesRecords(days = 30) {
  const [records, setRecords] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiGet<DailySales[]>("/api/sales", { days });
    if (res.success && res.data) {
      setRecords(res.data);
    } else {
      setError(res.message ?? "Failed to load sales records");
    }
    setLoading(false);
  }, [days]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const upsertSales = useCallback(async (dto: CreateDailySalesDto) => {
    const res = await apiRequest<DailySales>("/api/sales", { method: "POST", data: dto });
    if (res.success) await fetchRecords();
    return res;
  }, [fetchRecords]);

  const updateSales = useCallback(async (id: string, dto: UpdateDailySalesDto) => {
    const res = await apiRequest<DailySales>(`/api/sales/${id}`, { method: "PUT", data: dto });
    if (res.success) await fetchRecords();
    return res;
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords, upsertSales, updateSales };
}
