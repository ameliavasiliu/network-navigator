import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Network, Users, Building2, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AppShell() {
  const { user, logout } = useAuth();
  const initials = (user?.name || "?")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-bg-app text-text-primary" data-testid="screen-shell">
      <div className="flex min-h-screen">
        <aside
          className="w-[248px] shrink-0 border-r border-border bg-bg-sidebar px-4 py-5 flex flex-col"
          data-testid="sidebar"
        >
          <div className="mb-6 px-2" data-testid="brand">
            <div className="text-sm font-semibold tracking-tight">OpenDoorAI</div>
          </div>

          <nav className="space-y-1 flex-1" data-testid="nav-main">
            <ShellNavItem to="/" icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" testId="link-dashboard" />
            <ShellNavItem to="/network-navigator" icon={<Network className="h-4 w-4" />} label="Network Navigator" testId="link-network-navigator" />
            <ShellNavItem to="/contacts" icon={<Users className="h-4 w-4" />} label="Contacts" testId="link-contacts" />
            <ShellNavItem to="/companies" icon={<Building2 className="h-4 w-4" />} label="Companies" testId="link-companies" />
          </nav>

          {user && (
            <div className="mt-4 border-t border-border pt-4 px-2" data-testid="profile-card">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold" aria-hidden>
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold" data-testid="text-profile-name">{user.name}</div>
                  <div className="truncate text-[11px] text-text-secondary" data-testid="text-profile-email">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-border bg-white px-2 py-1.5 text-xs font-medium text-text-secondary hover:bg-black/5"
                data-testid="button-logout"
              >
                <LogOut className="h-3 w-3" /> Log out
              </button>
            </div>
          )}
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
