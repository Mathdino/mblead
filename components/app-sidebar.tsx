"use client";

import {
  LayoutDashboard,
  Users,
  Plus,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { type TabId } from "@/components/bottom-nav";

interface AppSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  stats?: { total: number };
}

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: "pipeline", label: "Pipeline", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "add", label: "Novo Lead", icon: Plus },
  { id: "stats", label: "Resumo", icon: BarChart3 },
];

export function AppSidebar({ activeTab, onTabChange, stats }: AppSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background"
    >
      <SidebarHeader className="flex h-20 items-center px-4 mb-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <span className="text-sm font-black text-primary-foreground tracking-tighter">
              MBL
            </span>
          </div>
          {state === "expanded" && (
            <div className="flex flex-col transition-all duration-300">
              <h1 className="text-base font-black text-foreground leading-none tracking-tight">
                MB Lead
              </h1>
              <span className="text-[10px] font-bold text-primary leading-none uppercase tracking-[0.2em] mt-1">
                Leads CRM
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 mb-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">
            Gestão de Vendas
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {tabs.map((tab) => (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    isActive={activeTab === tab.id}
                    onClick={() => onTabChange(tab.id)}
                    tooltip={tab.label}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-5 transition-all duration-300 ease-in-out",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:translate-x-1",
                    )}
                  >
                    <tab.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                        activeTab === tab.id
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary",
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold tracking-tight transition-colors duration-300",
                        activeTab === tab.id
                          ? "text-primary"
                          : "group-hover:text-foreground",
                      )}
                    >
                      {tab.label}
                    </span>

                    {activeTab === tab.id && (
                      <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                    )}

                    {activeTab === tab.id && state === "expanded" && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary/50" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {state === "expanded" && stats && (
        <SidebarFooter className="p-4">
          <div className="rounded-xl bg-secondary/50 p-4 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Status Atual
                </span>
                <span className="text-sm font-bold text-secondary-foreground tabular-nums">
                  {stats.total} leads ativos
                </span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
