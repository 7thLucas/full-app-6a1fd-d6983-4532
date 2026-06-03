import { useState } from "react";
import { Package2, Plus, RefreshCw, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useConfigurables } from "~/modules/configurables";
import { StockStatusBadge } from "./stock-status-badge";
import { BeanForm } from "./bean-form";
import { RestockForm } from "./restock-form";
import { useInventory } from "../hooks/use-inventory";
import type { BeanInventory, CreateBeanInventoryDto, RestockBeanDto } from "../api/inventory.model";

type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; bean: BeanInventory }
  | { type: "restock"; bean: BeanInventory }
  | { type: "delete"; bean: BeanInventory };

export function InventoryTable() {
  const { config, loading: cfgLoading } = useConfigurables();
  const { beans, loading, error, createBean, updateBean, restockBean, deleteBean } = useInventory();
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [actionLoading, setActionLoading] = useState(false);

  const primaryColor = cfgLoading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const warningColor = cfgLoading ? "#E8A020" : (config?.warningColor ?? "#E8A020");
  const dangerColor = cfgLoading ? "#C0392B" : (config?.dangerColor ?? "#C0392B");
  const borderColor = cfgLoading ? "#E8DDD0" : (config?.borderColor ?? "#E8DDD0");

  const alerts = beans.filter((b) => b.status === "low" || b.status === "critical");

  async function handleCreate(data: CreateBeanInventoryDto) {
    setActionLoading(true);
    const res = await createBean(data);
    setActionLoading(false);
    if (res.success) setModal({ type: "none" });
    else alert(res.message ?? "Failed to add bean");
  }

  async function handleUpdate(bean: BeanInventory, data: CreateBeanInventoryDto) {
    setActionLoading(true);
    const res = await updateBean(bean.id, data);
    setActionLoading(false);
    if (res.success) setModal({ type: "none" });
    else alert(res.message ?? "Failed to update bean");
  }

  async function handleRestock(bean: BeanInventory, data: RestockBeanDto) {
    setActionLoading(true);
    const res = await restockBean(bean.id, data);
    setActionLoading(false);
    if (res.success) setModal({ type: "none" });
    else alert(res.message ?? "Failed to restock");
  }

  async function handleDelete(bean: BeanInventory) {
    setActionLoading(true);
    await deleteBean(bean.id);
    setActionLoading(false);
    setModal({ type: "none" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: primaryColor }} />
          <p className="text-sm text-gray-500">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto" style={{ color: dangerColor }} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 text-sm"
          style={{
            borderLeftColor: alerts.some((a) => a.status === "critical") ? dangerColor : warningColor,
            backgroundColor: alerts.some((a) => a.status === "critical") ? `${dangerColor}10` : `${warningColor}10`,
            color: alerts.some((a) => a.status === "critical") ? dangerColor : warningColor,
          }}
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold">
              {alerts.length} bean{alerts.length > 1 ? "s" : ""} need restocking:
            </span>{" "}
            {alerts.map((a) => a.name).join(", ")}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package2 className="w-5 h-5" style={{ color: primaryColor }} />
          <span className="font-semibold text-gray-700">
            {beans.length} bean{beans.length !== 1 ? "s" : ""} tracked
          </span>
        </div>
        <Button
          onClick={() => setModal({ type: "add" })}
          style={{ backgroundColor: primaryColor }}
          className="text-white border-0 hover:opacity-90 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Bean
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden rounded-xl shadow-sm" style={{ borderColor }}>
        {beans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package2 className="w-10 h-10 mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">No beans in inventory yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first bean to get started</p>
            <Button
              onClick={() => setModal({ type: "add" })}
              className="mt-4 gap-1.5 text-white border-0 hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add First Bean
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#FAF6F0", borderBottom: `1px solid ${borderColor}` }}>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Bean</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Origin</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock (kg)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Low Alert</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {beans.map((bean, i) => (
                  <tr
                    key={bean.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF6F0",
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{bean.name}</td>
                    <td className="px-4 py-3 text-gray-600">{bean.origin}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-gray-800">
                      {bean.quantity_kg.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-500">
                      {bean.low_stock_threshold_kg.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StockStatusBadge status={bean.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ type: "restock", bean })}
                          className="p-1.5 rounded-md hover:bg-amber-50 text-amber-600 transition-colors"
                          title="Restock"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setModal({ type: "edit", bean })}
                          className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setModal({ type: "delete", bean })}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      {modal.type !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal({ type: "none" })} />
          <Card
            className="relative w-full max-w-lg rounded-2xl shadow-xl p-6 z-10 bg-white"
            style={{ borderColor }}
          >
            {modal.type === "add" && (
              <>
                <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Add Bean to Inventory</h2>
                <BeanForm
                  onSubmit={handleCreate}
                  onCancel={() => setModal({ type: "none" })}
                  isLoading={actionLoading}
                />
              </>
            )}
            {modal.type === "edit" && (
              <>
                <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Edit Bean</h2>
                <BeanForm
                  initialData={modal.bean}
                  onSubmit={(data) => handleUpdate(modal.bean, data)}
                  onCancel={() => setModal({ type: "none" })}
                  isLoading={actionLoading}
                />
              </>
            )}
            {modal.type === "restock" && (
              <>
                <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Restock Bean</h2>
                <RestockForm
                  bean={modal.bean}
                  onSubmit={(data) => handleRestock(modal.bean, data)}
                  onCancel={() => setModal({ type: "none" })}
                  isLoading={actionLoading}
                />
              </>
            )}
            {modal.type === "delete" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold" style={{ color: dangerColor }}>Remove Bean</h2>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to remove <strong>{modal.bean.name}</strong> from inventory?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setModal({ type: "none" })} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDelete(modal.bean)}
                    disabled={actionLoading}
                    style={{ backgroundColor: dangerColor }}
                    className="text-white border-0 hover:opacity-90"
                  >
                    {actionLoading ? "Removing..." : "Remove Bean"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
