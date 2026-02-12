"use client";

import { ChevronRight, Building2, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import type { Lead, Stage } from "@/lib/types";
import {
  STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  STAGE_TEXT_COLORS,
  STAGE_BG_LIGHT,
  NICHE_ICONS,
} from "@/lib/types";

interface PipelineViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onMoveLead: (id: string, stage: Stage) => void;
}

export function PipelineView({
  leads,
  onSelectLead,
  onMoveLead,
}: PipelineViewProps) {
  const { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, isDragging } =
    useDragScroll();

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      onMoveLead(leadId, stage);
    }
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-start md:overflow-x-auto md:pb-8 lg:gap-8 hide-scrollbar select-none flex-1",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        return (
          <div
            key={stage}
            className="md:w-80 md:shrink-0 lg:w-96 h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <PipelineStage
              stage={stage}
              leads={stageLeads}
              onSelectLead={onSelectLead}
              onDragStart={handleDragStart}
            />
          </div>
        );
      })}
    </div>
  );
}

function PipelineStage({
  stage,
  leads,
  onSelectLead,
  onDragStart,
}: {
  stage: Stage;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
}) {
  return (
    <section className="flex flex-col h-full min-h-[150px]">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className={cn("h-2.5 w-2.5 rounded-full", STAGE_COLORS[stage])} />
        <h2 className="text-sm font-semibold text-foreground">
          {STAGE_LABELS[stage]}
        </h2>
        <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
          {leads.length}
        </Badge>
      </div>
      <div className="flex-1 flex flex-col gap-2 rounded-xl p-1">
        {leads.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground h-full min-h-[100px] flex items-center justify-center">
            Nenhum lead nesta etapa
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              stage={stage}
              onSelect={() => onSelectLead(lead)}
              onDragStart={(e) => onDragStart(e, lead.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function LeadCard({
  lead,
  stage,
  onSelect,
  onDragStart,
}: {
  lead: Lead;
  stage: Stage;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const Icon = NICHE_ICONS[lead.niche] || Building2;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all active:scale-[0.98] cursor-move",
        "hover:shadow-md hover:border-primary/20",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          STAGE_BG_LIGHT[stage],
        )}
      >
        <Icon className={cn("h-5 w-5", STAGE_TEXT_COLORS[stage])} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pointer-events-none">
        <span className="truncate text-sm font-semibold text-foreground">
          {lead.companyName}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{lead.contactPerson}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 pointer-events-none">
        <Badge variant="outline" className="text-[10px] whitespace-nowrap">
          {lead.niche}
        </Badge>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </div>
  );
}
