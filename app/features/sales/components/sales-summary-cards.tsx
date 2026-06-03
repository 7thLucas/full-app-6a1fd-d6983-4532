import { DollarSign, ShoppingCart, TrendingUp, Receipt } from "lucide-react";
import { Card } from "~/components/ui/card";
import { useConfigurables } from "~/modules/configurables";
import type { SalesSummary } from "../hooks/use-sales";

type Props = {
  summary: SalesSummary;
};

export function SalesSummaryCards({ summary }: Props) {
  const { config, loading } = useConfigurables();
  const primary = loading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const secondary = loading ? "#C8832A" : (config?.brandColor?.secondary ?? "#C8832A");
  const accent = loading ? "#E8A020" : (config?.brandColor?.accent ?? "#E8A020");
  const success = loading ? "#4A7C59" : (config?.successColor ?? "#4A7C59");
  const currency = loading ? "$" : (config?.currencySymbol ?? "$");
  const border = loading ? "#E8DDD0" : (config?.borderColor ?? "#E8DDD0");

  const stats = [
    {
      label: "Total Revenue",
      value: `${currency}${summary.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: primary,
      bg: `${primary}10`,
    },
    {
      label: "Total Transactions",
      value: summary.totalTransactions.toLocaleString(),
      icon: ShoppingCart,
      color: secondary,
      bg: `${secondary}15`,
    },
    {
      label: "Avg Ticket Size",
      value: `${currency}${summary.averageTicket.toFixed(2)}`,
      icon: Receipt,
      color: accent,
      bg: `${accent}15`,
    },
    {
      label: "Daily Avg Revenue",
      value: `${currency}${summary.dailyAvgRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: success,
      bg: `${success}15`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-5 rounded-xl shadow-sm"
            style={{ borderColor: border }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 font-mono" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: stat.bg }}>
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
