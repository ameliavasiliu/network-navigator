import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Network, Users, Building2 } from "lucide-react";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg-app text-text-primary" data-testid="screen-shell">
      <div className="flex min-h-screen">
        <aside
          className="w-[248px] shrink-0 border-r border-border bg-bg-sidebar px-4 py-5"
          data-testid="sidebar"
        >
          <div className="mb-6 px-2" data-testid="brand">
            <div className="text-sm font-semibold tracking-tight">OpenDoorAI</div>
          </div>

          <nav className="space-y-1" data-testid="nav-main">
            <ShellNavItem to="/" icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" testId="link-dashboard" />
            <ShellNavItem to="/network-navigator" icon={<Network className="h-4 w-4" />} label="Network Navigator" testId="link-network-navigator" />
            <ShellNavItem to="/contacts" icon={<Users className="h-4 w-4" />} label="Contacts" testId="link-contacts" />
            <ShellNavItem to="/companies" icon={<Building2 className="h-4 w-4" />} label="Companies" testId="link-companies" />
          </nav>
        </aside>

        <main className="flex-1 px-10 py-8" data-testid="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ShellNavItem({
  to,
  icon,
  label,
  testId,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  testId: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          !isActive ? "text-text-primary/85 hover:bg-black/5" : "",
          isActive ? "bg-primary-muted text-text-primary" : "",
        ].join(" ")
      }
      data-testid={testId}
      end={to === "/"}
    >
      <span className="text-text-primary/80" aria-hidden>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
