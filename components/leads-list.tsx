"use client";

import { useState } from "react";
import { Search, Building2, Phone, User, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useMessages } from "@/hooks/use-messages";
import { buildWhatsAppLink, isPhoneValid } from "@/lib/messages-store";
import { toast } from "sonner";

interface LeadsListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function LeadsList({ leads, onSelectLead }: LeadsListProps) {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<Stage | "all">("all");
  const { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, isDragging } =
    useDragScroll();
  const { getFor } = useMessages();

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);
    const matchesStage = filterStage === "all" || lead.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className={cn(
          "flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:inline">
            Filtrar:
          </span>
        </div>
        <button
          onClick={() => setFilterStage("all")}
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
            filterStage === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          Todos ({leads.length})
        </button>
        {STAGES.map((stage) => {
          const count = leads.filter((l) => l.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filterStage === stage
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {STAGE_LABELS[stage]} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
          <Building2 className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {search ? "Nenhum lead encontrado" : "Nenhum lead cadastrado ainda"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((lead) => {
            const Icon = NICHE_ICONS[lead.niche] || Building2;
            const waLink = buildWhatsAppLink(
              lead.phone,
              getFor(lead.niche),
              lead.companyName,
            );
            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      STAGE_BG_LIGHT[lead.stage],
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5", STAGE_TEXT_COLORS[lead.stage])}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {lead.companyName}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate">{lead.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          STAGE_COLORS[lead.stage],
                        )}
                      />
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {STAGE_LABELS[lead.stage]}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] whitespace-nowrap"
                    >
                      {lead.niche}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPhoneValid(lead.phone)) {
                        e.preventDefault();
                        toast.error("Telefone inválido para WhatsApp");
                      }
                    }}
                  >
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLead(lead);
                    }}
                  >
                    Detalhes
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
