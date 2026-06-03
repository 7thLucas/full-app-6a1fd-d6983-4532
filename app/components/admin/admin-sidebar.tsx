import { Link, useLocation, Form } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication/use-authentication";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  Bean,
  BarChart3,
  Clock,
  LogOut,
  Coffee,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Bean Inventory",
    href: "/inventory",
    icon: Bean,
  },
  {
    label: "Sales",
    href: "/sales",
    icon: BarChart3,
  },
  {
    label: "Shifts",
    href: "/shifts",
    icon: Clock,
  },
];

export function AdminSidebar() {
  const { config, loading } = useConfigurables();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const appName = loading ? "BrewOps" : (config?.appName ?? "BrewOps");
  const primary = loading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const secondary = loading ? "#C8832A" : (config?.brandColor?.secondary ?? "#C8832A");

  const sidebarContent = (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: primary }}
    >
      {/* Logo / App Name */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {config?.logoUrl && !config.logoUrl.includes("FILL") ? (
          <img src={config.logoUrl} alt={appName} className="w-8 h-8 rounded object-cover" />
        ) : (
          <Coffee className="w-7 h-7 flex-shrink-0" style={{ color: secondary }} />
        )}
        <span className="text-white font-bold text-lg tracking-tight">{appName}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
              style={isActive ? { backgroundColor: secondary } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {user && (
          <div className="mb-3 px-1">
            <p className="text-white/90 text-sm font-medium truncate">{user.username}</p>
            <p className="text-white/50 text-xs truncate">{user.email}</p>
          </div>
        )}
        <Form method="post" action="/auth/logout">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </Form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Header Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: primary }}
      >
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5" style={{ color: secondary }} />
          <span className="text-white font-bold text-base">{appName}</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-1"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-56">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
