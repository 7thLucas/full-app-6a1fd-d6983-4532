import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AdminLayout } from "~/components/admin/admin-layout";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useInventory } from "~/features/inventory/hooks/use-inventory";
import { useSalesSummary } from "~/features/sales/hooks/use-sales";
import { useShifts } from "~/features/shifts/hooks/use-shifts";
import { StockStatusBadge } from "~/features/inventory/components/stock-status-badge";
import { Card } from "~/components/ui/card";
import { Bean, BarChart3, Clock, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

function DashboardStatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
  href,
  borderColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  href: string;
  borderColor: string;
}) {
  return (
    <Link to={href}>
      <Card
        className="p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        style={{ borderColor }}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold mt-1 font-mono truncate" style={{ color }}>
              {value}
            </p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
          </div>
          <div className="p-2 rounded-lg flex-shrink-0 ml-2" style={{ backgroundColor: bg }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { config, loading: cfgLoading } = useConfigurables();
  const { user } = useAuth();
  const { beans, loading: invLoading, alerts } = useInventory();
  const { summary, loading: salesLoading } = useSalesSummary(7);
  const { summary: shiftSummary, loading: shiftsLoading } = useShifts();

  const primary = cfgLoading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const secondary = cfgLoading ? "#C8832A" : (config?.brandColor?.secondary ?? "#C8832A");
  const accent = cfgLoading ? "#E8A020" : (config?.brandColor?.accent ?? "#E8A020");
  const success = cfgLoading ? "#4A7C59" : (config?.successColor ?? "#4A7C59");
  const danger = cfgLoading ? "#C0392B" : (config?.dangerColor ?? "#C0392B");
  const borderColor = cfgLoading ? "#E8DDD0" : (config?.borderColor ?? "#E8DDD0");
  const currency = cfgLoading ? "$" : (config?.currencySymbol ?? "$");
  const welcomeMsg = cfgLoading ? "Here's your operations overview." : (config?.dashboardWelcomeMessage ?? "Here's your operations overview.");
  const shopName = cfgLoading ? "Your Coffee Shop" : (config?.shopName ?? "Your Coffee Shop");

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 max-w-6xl">
        {/* Welcome */}
        <div>
          <h2 className="text-lg font-semibold" style={{ color: primary }}>
            {greeting}{user ? `, ${user.username}` : ""}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{welcomeMsg}</p>
          <p className="text-xs text-gray-400 mt-0.5">{shopName}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardStatCard
            label="Bean Inventory"
            value={invLoading ? "..." : `${beans.length} types`}
            sub={alerts.length > 0 ? `${alerts.length} need restocking` : "All stock OK"}
            icon={Bean}
            color={alerts.length > 0 ? danger : success}
            bg={alerts.length > 0 ? `${danger}12` : `${success}12`}
            href="/inventory"
            borderColor={borderColor}
          />
          <DashboardStatCard
            label="7-Day Revenue"
            value={salesLoading ? "..." : `${currency}${(summary?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            sub={salesLoading ? "" : `${summary?.totalTransactions ?? 0} transactions`}
            icon={BarChart3}
            color={secondary}
            bg={`${secondary}15`}
            href="/sales"
            borderColor={borderColor}
          />
          <DashboardStatCard
            label="This Week Shifts"
            value={shiftsLoading ? "..." : (shiftSummary?.totalShifts ?? 0)}
            sub={
              shiftSummary
                ? shiftSummary.uncoveredShifts > 0
                  ? `${shiftSummary.uncoveredShifts} uncovered`
                  : "All covered"
                : ""
            }
            icon={Clock}
            color={shiftSummary?.uncoveredShifts && shiftSummary.uncoveredShifts > 0 ? danger : primary}
            bg={shiftSummary?.uncoveredShifts && shiftSummary.uncoveredShifts > 0 ? `${danger}12` : `${primary}12`}
            href="/shifts"
            borderColor={borderColor}
          />
        </div>

        {/* Alerts */}
        {(alerts.length > 0 || (shiftSummary?.uncoveredShifts ?? 0) > 0) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: danger }} />
              Active Alerts
            </h3>
            {alerts.map((bean) => (
              <Link key={bean.id} to="/inventory">
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 text-sm cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    borderLeftColor: bean.status === "critical" ? danger : accent,
                    backgroundColor: bean.status === "critical" ? `${danger}08` : `${accent}08`,
                  }}
                >
                  <Bean className="w-4 h-4 flex-shrink-0" style={{ color: bean.status === "critical" ? danger : accent }} />
                  <div className="flex-1">
                    <span className="font-medium">{bean.name}</span>
                    <span className="text-gray-500 ml-2">({bean.origin})</span>
                    <span className="text-gray-400 ml-2 font-mono text-xs">{bean.quantity_kg.toFixed(2)} kg remaining</span>
                  </div>
                  <StockStatusBadge status={bean.status} />
                </div>
              </Link>
            ))}
            {(shiftSummary?.uncoveredShifts ?? 0) > 0 && (
              <Link to="/shifts">
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 text-sm cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderLeftColor: danger, backgroundColor: `${danger}08` }}
                >
                  <Users className="w-4 h-4 flex-shrink-0" style={{ color: danger }} />
                  <div className="flex-1">
                    <span className="font-medium">
                      {shiftSummary!.uncoveredShifts} shift{shiftSummary!.uncoveredShifts > 1 ? "s" : ""} uncovered this week
                    </span>
                    <span className="text-gray-400 ml-2 text-xs">Assign coverage</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Quick Stats Row */}
        {!salesLoading && summary && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: secondary }} />
              7-Day Sales Snapshot
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Daily Revenue", value: `${currency}${summary.dailyAvgRevenue.toFixed(2)}` },
                { label: "Avg Ticket Size", value: `${currency}${summary.averageTicket.toFixed(2)}` },
                { label: "Days Recorded", value: summary.records.length },
              ].map((stat) => (
                <Card key={stat.label} className="p-4 rounded-xl text-center shadow-sm" style={{ borderColor }}>
                  <div className="text-lg font-bold font-mono" style={{ color: secondary }}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
