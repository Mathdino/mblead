"use client";

import { useState, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { BottomNav, type TabId } from "@/components/bottom-nav";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { PipelineView } from "@/components/pipeline-view";
import { LeadsList } from "@/components/leads-list";
import { LeadForm } from "@/components/lead-form";
import { LeadDetail } from "@/components/lead-detail";
import { StatsView } from "@/components/stats-view";
import { useLeads } from "@/hooks/use-leads";
import type { Lead } from "@/lib/types";
import { STAGE_LABELS } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pipeline");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { leads, stats, addLead, moveLeadToStage, editLead, removeLead } =
    useLeads();
  const isMobile = useIsMobile();

  const handleSelectLead = useCallback((lead: Lead) => {
    setSelectedLead(lead);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedLead(null);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setSelectedLead(null);
  }, []);

  const handleAddLead = useCallback(
    (data: Parameters<typeof addLead>[0]) => {
      addLead(data);
      toast.success("Lead cadastrado com sucesso!", {
        description: `${data.companyName} foi adicionado ao pipeline.`,
      });
      setActiveTab("pipeline");
    },
    [addLead],
  );

  const handleMoveStage = useCallback(
    (id: string, stage: Parameters<typeof moveLeadToStage>[1]) => {
      moveLeadToStage(id, stage);
      const updatedLead = leads.find((l) => l.id === id);
      if (updatedLead) {
        setSelectedLead({
          ...updatedLead,
          stage,
          updatedAt: new Date().toISOString(),
        });
      }
      toast.success(`Lead movido para ${STAGE_LABELS[stage]}`);
    },
    [moveLeadToStage, leads],
  );

  const handleEdit = useCallback(
    (id: string, data: Parameters<typeof editLead>[1]) => {
      editLead(id, data);
      const updatedLead = leads.find((l) => l.id === id);
      if (updatedLead) {
        setSelectedLead({
          ...updatedLead,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }
      toast.success("Lead atualizado!");
    },
    [editLead, leads],
  );

  const handleDelete = useCallback(
    (id: string) => {
      removeLead(id);
      setSelectedLead(null);
      toast.success("Lead excluido.");
    },
    [removeLead],
  );

  function renderTitle() {
    switch (activeTab) {
      case "pipeline":
        return "Pipeline";
      case "leads":
        return "Leads";
      case "add":
        return "Novo Lead";
      case "stats":
        return "Resumo";
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          stats={stats}
        />

        <SidebarInset className="flex flex-col flex-1">
          <Toaster position="top-center" richColors />

          {/* Top Header */}
          <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 hidden md:flex" />
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary md:hidden">
                    <span className="text-sm font-bold text-primary-foreground">
                      MBL
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-foreground leading-tight">
                      {selectedLead ? "Detalhes do Lead" : renderTitle()}
                    </h1>
                    {selectedLead && (
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        {selectedLead.companyName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isMobile && stats && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 border border-border/50">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-xs font-semibold text-secondary-foreground tabular-nums">
                      {stats.total} leads no total
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main
            className={cn(
              "mx-auto w-full flex-1 px-4 py-6 md:px-8 overflow-x-hidden flex flex-col",
              isMobile ? "max-w-lg pb-24" : "max-w-7xl",
            )}
          >
            {selectedLead ? (
              <LeadDetail
                lead={selectedLead}
                onBack={handleBack}
                onMoveStage={handleMoveStage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
                {activeTab === "pipeline" && (
                  <PipelineView
                    leads={leads}
                    onSelectLead={handleSelectLead}
                    onMoveLead={moveLeadToStage}
                  />
                )}
                {activeTab === "leads" && (
                  <LeadsList leads={leads} onSelectLead={handleSelectLead} />
                )}
                {activeTab === "add" && (
                  <div className={cn(!isMobile && "max-w-2xl mx-auto")}>
                    <LeadForm onSubmit={handleAddLead} />
                  </div>
                )}
                {activeTab === "stats" && <StatsView stats={stats} />}
              </div>
            )}
          </main>

          {/* Bottom Navigation (Mobile Only) */}
          {isMobile && (
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
