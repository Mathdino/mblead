"use client";

import { LayoutDashboard, Users, Plus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "pipeline" | "leads" | "add" | "stats";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "pipeline", label: "Pipeline", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "add", label: "Novo", icon: Plus },
  { id: "stats", label: "Resumo", icon: BarChart3 },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card"
      role="tablist"
      aria-label="Navegacao principal"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isAdd = tab.id === "add";
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors",
                isAdd
                  ? "text-primary"
                  : isActive
                    ? "text-primary"
                    : "text-muted-foreground"
              )}
            >
              {isAdd ? (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg -translate-y-3">
                  <tab.icon className="h-5 w-5" />
                </span>
              ) : (
                <tab.icon className="h-5 w-5" />
              )}
              <span
                className={cn(
                  "font-medium",
                  isAdd && "-mt-2"
                )}
              >
                {tab.label}
              </span>
              {isActive && !isAdd && (
                <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
