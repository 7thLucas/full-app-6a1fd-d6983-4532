import { type ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { useConfigurables } from "~/modules/configurables";

type Props = {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
};

export function AdminLayout({ children, title, actions }: Props) {
  const { config, loading } = useConfigurables();
  const bg = loading ? "#FAF6F0" : (config?.backgroundColor ?? "#FAF6F0");
  const textPrimary = loading ? "#1A0F00" : (config?.textPrimaryColor ?? "#1A0F00");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: bg }}>
      <AdminSidebar />
      {/* Main content — offset for sidebar on desktop, header on mobile */}
      <div className="flex-1 md:ml-56 flex flex-col">
        <div className="md:hidden h-14" /> {/* Mobile header spacer */}
        {(title || actions) && (
          <header
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-sm"
            style={{ borderColor: "#E8DDD0" }}
          >
            <h1
              className="text-xl font-bold"
              style={{ color: textPrimary }}
            >
              {title}
            </h1>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </header>
        )}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
