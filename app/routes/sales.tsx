import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AdminLayout } from "~/components/admin/admin-layout";
import { useConfigurables } from "~/modules/configurables";
import { useSalesSummary, useSalesRecords } from "~/features/sales/hooks/use-sales";
import { SalesSummaryCards } from "~/features/sales/components/sales-summary-cards";
import { SalesChart } from "~/features/sales/components/sales-chart";
import { SalesEntryForm } from "~/features/sales/components/sales-entry-form";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus, BarChart3, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { CreateDailySalesDto } from "~/features/sales/api/sales.model";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function SalesPage() {
  const { config, loading: cfgLoading } = useConfigurables();
  const primaryColor = cfgLoading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const borderColor = cfgLoading ? "#E8DDD0" : (config?.borderColor ?? "#E8DDD0");
  const currency = cfgLoading ? "$" : (config?.currencySymbol ?? "$");

  const { summary, loading: summaryLoading, error: summaryError } = useSalesSummary(7);
  const { records, loading: recordsLoading, upsertSales } = useSalesRecords(30);

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  async function handleUpsert(data: CreateDailySalesDto) {
    setFormLoading(true);
    const res = await upsertSales(data);
    setFormLoading(false);
    if (res.success) {
      setShowForm(false);
    } else {
      alert(res.message ?? "Failed to log sales");
    }
  }

  return (
    <AdminLayout
      title="Sales"
      actions={
        <Button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: primaryColor }}
          className="text-white border-0 hover:opacity-90 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Sales
        </Button>
      }
    >
      <div className="space-y-6 max-w-6xl">
        {/* Sales Entry Form (collapsible) */}
        {showForm && (
          <Card className="p-5 rounded-xl shadow-sm" style={{ borderColor }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: primaryColor }}>
              Log Daily Sales
            </h3>
            <SalesEntryForm
              onSubmit={handleUpsert}
              onCancel={() => setShowForm(false)}
              isLoading={formLoading}
            />
          </Card>
        )}

        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: primaryColor }} />
          </div>
        ) : summaryError ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
            <AlertTriangle className="w-4 h-4" />
            {summaryError}
          </div>
        ) : summary ? (
          <SalesSummaryCards summary={summary} />
        ) : null}

        {/* Revenue Chart */}
        <Card className="p-5 rounded-xl shadow-sm" style={{ borderColor }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-sm font-semibold text-gray-700">Daily Revenue (last 14 days)</h3>
          </div>
          {recordsLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: primaryColor }} />
            </div>
          ) : (
            <SalesChart records={records} />
          )}
        </Card>

        {/* Recent Records Table */}
        <Card className="rounded-xl shadow-sm overflow-hidden" style={{ borderColor }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor, backgroundColor: "#FAF6F0" }}>
            <h3 className="text-sm font-semibold text-gray-700">Sales Records</h3>
            <span className="text-xs text-gray-400">{records.length} records</span>
          </div>
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="w-8 h-8 mb-2 text-gray-300" />
              <p className="text-gray-500 font-medium text-sm">No sales recorded yet</p>
              <p className="text-gray-400 text-xs mt-1">Click "Log Sales" to add your first record</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 bg-gray-50/50">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 bg-gray-50/50">Revenue</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 bg-gray-50/50">Transactions</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 bg-gray-50/50">Avg Ticket</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 bg-gray-50/50">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, i) => (
                    <tr
                      key={record.id}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF6F0",
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{record.date}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: primaryColor }}>
                        {currency}{record.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{record.total_transactions}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-500">
                        {currency}{record.average_ticket.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{record.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
