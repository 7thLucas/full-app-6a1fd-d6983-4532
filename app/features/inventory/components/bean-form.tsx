import { useState, type FormEvent } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useConfigurables } from "~/modules/configurables";
import type { BeanInventory, CreateBeanInventoryDto } from "../api/inventory.model";

type Props = {
  initialData?: BeanInventory;
  onSubmit: (data: CreateBeanInventoryDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function BeanForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
  const { config, loading: cfgLoading } = useConfigurables();
  const lowDefault = cfgLoading ? 2 : (config?.lowStockThresholdDefault ?? 2);
  const criticalDefault = cfgLoading ? 0.5 : (config?.criticalStockThresholdDefault ?? 0.5);

  const [name, setName] = useState(initialData?.name ?? "");
  const [origin, setOrigin] = useState(initialData?.origin ?? "");
  const [quantity, setQuantity] = useState(String(initialData?.quantity_kg ?? "0"));
  const [lowThreshold, setLowThreshold] = useState(String(initialData?.low_stock_threshold_kg ?? lowDefault));
  const [criticalThreshold, setCriticalThreshold] = useState(
    String(initialData?.critical_stock_threshold_kg ?? criticalDefault)
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !origin.trim()) {
      setError("Name and origin are required.");
      return;
    }
    try {
      await onSubmit({
        name: name.trim(),
        origin: origin.trim(),
        quantity_kg: parseFloat(quantity) || 0,
        low_stock_threshold_kg: parseFloat(lowThreshold) || lowDefault,
        critical_stock_threshold_kg: parseFloat(criticalThreshold) || criticalDefault,
        notes: notes.trim(),
      });
    } catch (err: any) {
      setError(err.message ?? "An error occurred");
    }
  }

  const primaryColor = config?.brandColor?.primary ?? "#3B1F0A";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bean-name">Bean Name *</Label>
          <Input
            id="bean-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ethiopia Yirgacheffe"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bean-origin">Origin *</Label>
          <Input
            id="bean-origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g. Ethiopia"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bean-qty">Current Stock (kg)</Label>
          <Input
            id="bean-qty"
            type="number"
            min="0"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bean-low">Low Alert (kg)</Label>
          <Input
            id="bean-low"
            type="number"
            min="0"
            step="0.1"
            value={lowThreshold}
            onChange={(e) => setLowThreshold(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bean-critical">Critical Alert (kg)</Label>
          <Input
            id="bean-critical"
            type="number"
            min="0"
            step="0.1"
            value={criticalThreshold}
            onChange={(e) => setCriticalThreshold(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bean-notes">Notes</Label>
        <Input
          id="bean-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: primaryColor }}
          className="text-white border-0 hover:opacity-90"
        >
          {isLoading ? "Saving..." : initialData ? "Update Bean" : "Add Bean"}
        </Button>
      </div>
    </form>
  );
}
