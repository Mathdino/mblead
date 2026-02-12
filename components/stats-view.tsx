"use client";

import { Users, TrendingUp, Target, Handshake, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  type Stage,
} from "@/lib/types";

interface StatsViewProps {
  stats:
    | {
        total: number;
        byStage: Record<Stage, number>;
      }
    | undefined;
}

const stageIcons: Record<Stage, typeof Users> = {
  prospeccao: Target,
  contato: Users,
  proposta: ArrowRight,
  negociacao: TrendingUp,
  fechamento: Handshake,
};

export function StatsView({ stats }: StatsViewProps) {
  if (!stats) return null;

  const conversionRate =
    stats.total > 0
      ? ((stats.byStage.fechamento / stats.total) * 100).toFixed(1)
      : "0";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Leads</span>
          </div>
          <span className="text-3xl font-bold text-foreground tabular-nums">
            {stats.total}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Conversão</span>
          </div>
          <span className="text-3xl font-bold text-accent tabular-nums">
            {conversionRate}%
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Handshake className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Fechamentos</span>
          </div>
          <span className="text-3xl font-bold text-primary tabular-nums">
            {stats.byStage.fechamento}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-bold text-foreground uppercase tracking-wider">
          Funil de Vendas Detalhado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {STAGES.map((stage) => {
            const count = stats.byStage[stage];
            const percentage =
              stats.total > 0
                ? Math.round((count / stats.total) * 100)
                : 0;
            const Icon = stageIcons[stage];
            return (
              <div key={stage} className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/20 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-lg font-bold tabular-nums text-foreground">
                    {count}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    {STAGE_LABELS[stage]}
                  </span>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        STAGE_COLORS[stage]
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground text-right tabular-nums">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
