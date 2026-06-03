import { cn } from "~/lib/utils";
import { useConfigurables } from "~/modules/configurables";

type StockStatus = "ok" | "low" | "critical";

type Props = {
  status: StockStatus;
  className?: string;
};

export function StockStatusBadge({ status, className }: Props) {
  const { config, loading } = useConfigurables();

  const successColor = loading ? "#4A7C59" : (config?.successColor ?? "#4A7C59");
  const warningColor = loading ? "#E8A020" : (config?.warningColor ?? "#E8A020");
  const dangerColor = loading ? "#C0392B" : (config?.dangerColor ?? "#C0392B");

  const styles: Record<StockStatus, { bg: string; text: string; label: string }> = {
    ok: { bg: `${successColor}20`, text: successColor, label: "In Stock" },
    low: { bg: `${warningColor}25`, text: warningColor, label: "Low Stock" },
    critical: { bg: `${dangerColor}20`, text: dangerColor, label: "Critical" },
  };

  const s = styles[status];

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", className)}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}
