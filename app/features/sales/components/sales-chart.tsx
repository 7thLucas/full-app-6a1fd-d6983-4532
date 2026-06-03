import { useConfigurables } from "~/modules/configurables";
import type { DailySales } from "../api/sales.model";

type Props = {
  records: DailySales[];
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SalesChart({ records }: Props) {
  const { config, loading } = useConfigurables();
  const primary = loading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const secondary = loading ? "#C8832A" : (config?.brandColor?.secondary ?? "#C8832A");
  const border = loading ? "#E8DDD0" : (config?.borderColor ?? "#E8DDD0");
  const bg = loading ? "#FAF6F0" : (config?.backgroundColor ?? "#FAF6F0");
  const currency = loading ? "$" : (config?.currencySymbol ?? "$");

  // Take last 14 days, sorted ascending
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        No sales data to display
      </div>
    );
  }

  const maxRevenue = Math.max(...sorted.map((r) => r.total_revenue), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1.5 h-40">
        {sorted.map((record) => {
          const height = Math.max((record.total_revenue / maxRevenue) * 100, 2);
          return (
            <div
              key={record.date}
              className="flex-1 flex flex-col items-center justify-end gap-1 group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                <div
                  className="px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap shadow"
                  style={{ backgroundColor: primary }}
                >
                  {currency}{record.total_revenue.toFixed(0)}
                </div>
              </div>
              <div
                className="w-full rounded-t-sm transition-all duration-200 hover:opacity-80 cursor-default"
                style={{
                  height: `${height}%`,
                  backgroundColor: record.total_revenue > 0 ? secondary : border,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div className="flex gap-1.5">
        {sorted.map((record) => (
          <div key={record.date} className="flex-1 text-center text-xs text-gray-400 truncate">
            {formatDate(record.date)}
          </div>
        ))}
      </div>
    </div>
  );
}
