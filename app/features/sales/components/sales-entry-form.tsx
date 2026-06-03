import { useState, type FormEvent } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useConfigurables } from "~/modules/configurables";
import type { CreateDailySalesDto, SalesCategoryBreakdownDto } from "../api/sales.model";

type Props = {
  initialData?: Partial<CreateDailySalesDto>;
  onSubmit: (data: CreateDailySalesDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function SalesEntryForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
  const { config, loading: cfgLoading } = useConfigurables();
  const primaryColor = config?.brandColor?.primary ?? "#3B1F0A";
  const categories = cfgLoading ? [] : (config?.salesCategories ?? [
    "Espresso Drinks", "Drip Coffee", "Cold Brew", "Tea", "Food", "Merchandise"
  ]);
  const currency = cfgLoading ? "$" : (config?.currencySymbol ?? "$");

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(initialData?.date ?? today);
  const [revenue, setRevenue] = useState(String(initialData?.total_revenue ?? ""));
  const [transactions, setTransactions] = useState(String(initialData?.total_transactions ?? ""));
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [categoryAmounts, setCategoryAmounts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (initialData?.category_breakdown ?? []).forEach((c) => {
      init[c.category] = String(c.amount);
    });
    return init;
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const rev = parseFloat(revenue);
    const txns = parseInt(transactions, 10);
    if (!date) { setError("Date is required."); return; }
    if (isNaN(rev) || rev < 0) { setError("Please enter a valid revenue amount."); return; }
    if (isNaN(txns) || txns < 0) { setError("Please enter a valid transaction count."); return; }

    const category_breakdown: SalesCategoryBreakdownDto[] = categories
      .filter((cat) => categoryAmounts[cat] && parseFloat(categoryAmounts[cat]) > 0)
      .map((cat) => ({
        category: cat,
        amount: parseFloat(categoryAmounts[cat]) || 0,
        transactions: 0,
      }));

    try {
      await onSubmit({
        date,
        total_revenue: rev,
        total_transactions: txns,
        category_breakdown,
        notes: notes.trim(),
      });
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
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="sale-date">Date *</Label>
          <Input
            id="sale-date"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sale-revenue">Total Revenue ({currency}) *</Label>
          <Input
            id="sale-revenue"
            type="number"
            min="0"
            step="0.01"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sale-txns">Transactions *</Label>
          <Input
            id="sale-txns"
            type="number"
            min="0"
            value={transactions}
            onChange={(e) => setTransactions(e.target.value)}
            placeholder="0"
            required
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Revenue by Category (optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-28 truncate">{cat}</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={categoryAmounts[cat] ?? ""}
                  onChange={(e) => setCategoryAmounts((prev) => ({ ...prev, [cat]: e.target.value }))}
                  placeholder="0.00"
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="sale-notes">Notes</Label>
        <Input
          id="sale-notes"
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
          {isLoading ? "Saving..." : "Log Sales"}
        </Button>
      </div>
    </form>
  );
}
