import { useState, useEffect, useCallback } from "react";
import { apiRequest, apiGet, type ApiResponse } from "~/lib/api.client";
import type { BeanInventory, CreateBeanInventoryDto, UpdateBeanInventoryDto, RestockBeanDto } from "../api/inventory.model";

export function useInventory() {
  const [beans, setBeans] = useState<BeanInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBeans = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiGet<BeanInventory[]>("/api/inventory/beans");
    if (res.success && res.data) {
      setBeans(res.data);
    } else {
      setError(res.message ?? "Failed to load inventory");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBeans();
  }, [fetchBeans]);

  const createBean = useCallback(async (dto: CreateBeanInventoryDto): Promise<ApiResponse<BeanInventory>> => {
    const res = await apiRequest<BeanInventory>("/api/inventory/beans", {
      method: "POST",
      data: dto,
    });
    if (res.success) await fetchBeans();
    return res;
  }, [fetchBeans]);

  const updateBean = useCallback(async (id: string, dto: UpdateBeanInventoryDto): Promise<ApiResponse<BeanInventory>> => {
    const res = await apiRequest<BeanInventory>(`/api/inventory/beans/${id}`, {
      method: "PUT",
      data: dto,
    });
    if (res.success) await fetchBeans();
    return res;
  }, [fetchBeans]);

  const restockBean = useCallback(async (id: string, dto: RestockBeanDto): Promise<ApiResponse<BeanInventory>> => {
    const res = await apiRequest<BeanInventory>(`/api/inventory/beans/${id}/restock`, {
      method: "POST",
      data: dto,
    });
    if (res.success) await fetchBeans();
    return res;
  }, [fetchBeans]);

  const deleteBean = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiRequest<void>(`/api/inventory/beans/${id}`, { method: "DELETE" });
    if (res.success) await fetchBeans();
    return res;
  }, [fetchBeans]);

  const alerts = beans.filter((b) => b.status === "low" || b.status === "critical");

  return {
    beans,
    loading,
    error,
    alerts,
    refetch: fetchBeans,
    createBean,
    updateBean,
    restockBean,
    deleteBean,
  };
}
