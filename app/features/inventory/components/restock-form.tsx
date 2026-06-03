import { useState, type FormEvent } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useConfigurables } from "~/modules/configurables";
import type { BeanInventory, RestockBeanDto } from "../api/inventory.model";

type Props = {
  bean: BeanInventory;
  onSubmit: (data: RestockBeanDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function RestockForm({ bean, onSubmit, onCancel, isLoading }: Props) {
  const { config } = useConfigurables();
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const primaryColor = config?.brandColor?.primary ?? "#3B1F0A";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }
    try {
      await onSubmit({ quantity_added: qty, notes: notes.trim() });
    } catch (err: any) {
      setError(err.message ?? "An error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <span className="font-semibold">{bean.name}</span>
        {" — "}Current stock:{" "}
        <span className="font-mono font-semibold">{bean.quantity_kg.toFixed(2)} kg</span>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="restock-qty">Quantity to Add (kg) *</Label>
        <Input
          id="restock-qty"
          type="number"
          min="0.1"
          step="0.1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 5"
          required
          autoFocus
        />
        {quantity && parseFloat(quantity) > 0 && (
          <p className="text-xs text-gray-500">
            New total:{" "}
            <span className="font-mono font-semibold">
              {(bean.quantity_kg + parseFloat(quantity)).toFixed(2)} kg
            </span>
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="restock-notes">Notes (optional)</Label>
        <Input
          id="restock-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Delivered by supplier"
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
          {isLoading ? "Restocking..." : "Confirm Restock"}
        </Button>
      </div>
    </form>
  );
}
