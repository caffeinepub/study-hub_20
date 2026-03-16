import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Code2,
  GraduationCap,
  Link2,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../store";
import { ThemeSwitcher } from "./ThemeSwitcher";

const NAV_ITEMS = [
  {
    to: "/resources",
    label: "Resources",
    icon: BookOpen,
    ocid: "nav.resources.link",
  },
  { to: "/links", label: "Links", icon: Link2, ocid: "nav.links.link" },
  { to: "/codes", label: "Code", icon: Code2, ocid: "nav.codes.link" },
  {
    to: "/deadlines",
    label: "Deadlines",
    icon: CalendarClock,
    ocid: "nav.deadlines.link",
  },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  function logout() {
    dispatch({ type: "SET_USER", payload: null });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-in-out shrink-0",
          collapsed ? "w-16" : "w-56",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-14 px-3 gap-2.5",
            collapsed && "justify-center",
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shrink-0">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-base font-normal text-sidebar-foreground tracking-tight">
              Study Hub
            </span>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => {
            const active =
              location.pathname === to ||
              location.pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors duration-100",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* Bottom */}
        <div
          className={cn(
            "p-2 space-y-1",
            collapsed && "flex flex-col items-center",
          )}
        >
          <ThemeSwitcher compact={collapsed} />

          {!collapsed && (
            <div className="px-2.5 py-2 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {state.user?.name?.[0] ?? "?"}
                </span>
              </div>
              <span className="text-sm text-sidebar-foreground font-medium truncate flex-1">
                {state.user?.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                onClick={logout}
                title="Leave hub"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={logout}
              title="Leave hub"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full text-muted-foreground h-7",
              collapsed && "justify-center px-1",
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <>
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-12 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded bg-primary">
              <GraduationCap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-sm">Study Hub</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeSwitcher compact />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t border-border bg-background shrink-0">
          {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors",
                  active ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
