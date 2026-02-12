"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Tag,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Trash2,
  Pencil,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Lead, Stage, Niche } from "@/lib/types";
import {
  STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  STAGE_TEXT_COLORS,
  STAGE_BG_LIGHT,
  NICHES,
  NICHE_ICONS,
} from "@/lib/types";

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onMoveStage: (id: string, stage: Stage) => void;
  onEdit: (id: string, data: Partial<Omit<Lead, "id" | "createdAt">>) => void;
  onDelete: (id: string) => void;
}

export function LeadDetail({
  lead,
  onBack,
  onMoveStage,
  onEdit,
  onDelete,
}: LeadDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    companyName: lead.companyName,
    contactPerson: lead.contactPerson,
    phone: lead.phone,
    niche: lead.niche as Niche,
    notes: lead.notes,
  });

  const currentStageIndex = STAGES.indexOf(lead.stage);
  const canAdvance = currentStageIndex < STAGES.length - 1;
  const canRevert = currentStageIndex > 0;
  const nextStage = canAdvance ? STAGES[currentStageIndex + 1] : null;
  const prevStage = canRevert ? STAGES[currentStageIndex - 1] : null;
  const isClosed = lead.stage === "fechamento";
  const Icon = NICHE_ICONS[lead.niche] || Building2;

  function handleSaveEdit() {
    onEdit(lead.id, editData);
    setIsEditing(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 truncate text-lg font-bold text-foreground">
          {lead.companyName}
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-border",
            isEditing ? "bg-primary text-primary-foreground" : "bg-card",
          )}
          aria-label={isEditing ? "Cancelar edicao" : "Editar lead"}
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Stage Progress */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn("h-3 w-3 rounded-full", STAGE_COLORS[lead.stage])}
          />
          <span className="text-sm font-semibold text-foreground">
            {STAGE_LABELS[lead.stage]}
          </span>
          {isClosed && (
            <Badge className="ml-auto bg-accent text-accent-foreground">
              <Check className="mr-1 h-3 w-3" />
              Fechado
            </Badge>
          )}
        </div>

        {/* Stage Steps */}
        <div className="mb-4 flex items-center gap-1">
          {STAGES.map((stage, index) => (
            <div key={stage} className="flex flex-1 items-center">
              <button
                onClick={() => onMoveStage(lead.id, stage)}
                className={cn(
                  "h-2 w-full rounded-full transition-all",
                  index <= currentStageIndex
                    ? STAGE_COLORS[lead.stage]
                    : "bg-secondary",
                )}
                aria-label={`Mover para ${STAGE_LABELS[stage]}`}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {canRevert && prevStage && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1 text-xs"
              onClick={() => onMoveStage(lead.id, prevStage)}
            >
              <ChevronLeft className="h-3 w-3" />
              {STAGE_LABELS[prevStage]}
            </Button>
          )}
          {canAdvance && nextStage && (
            <Button
              size="sm"
              className="flex-1 gap-1 text-xs"
              onClick={() => onMoveStage(lead.id, nextStage)}
            >
              {STAGE_LABELS[nextStage]}
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Details / Edit Form */}
      {isEditing ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">
            Editar Informações
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-2 text-xs">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                Empresa
              </Label>
              <Input
                value={editData.companyName}
                onChange={(e) =>
                  setEditData({ ...editData, companyName: e.target.value })
                }
                className="bg-secondary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-2 text-xs">
                <User className="h-3 w-3 text-muted-foreground" />
                Contato
              </Label>
              <Input
                value={editData.contactPerson}
                onChange={(e) =>
                  setEditData({ ...editData, contactPerson: e.target.value })
                }
                className="bg-secondary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-2 text-xs">
                <Phone className="h-3 w-3 text-muted-foreground" />
                Telefone
              </Label>
              <Input
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="bg-secondary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-2 text-xs">
                <Icon className="h-3 w-3 text-muted-foreground" />
                Nicho
              </Label>
              <Select
                value={editData.niche}
                onValueChange={(value) =>
                  setEditData({ ...editData, niche: value as Niche })
                }
              >
                <SelectTrigger className="bg-secondary/30">
                  <SelectValue placeholder="Selecione o nicho" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label className="flex items-center gap-2 text-xs">
                <FileText className="h-3 w-3 text-muted-foreground" />
                Observações
              </Label>
              <Textarea
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                rows={4}
                className="bg-secondary/30"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Informações de Contato
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Nome</span>
                    <span className="text-sm font-medium">
                      {lead.contactPerson}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Telefone
                    </span>
                    <span className="text-sm font-medium">{lead.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Nicho</span>
                    <Badge
                      variant="outline"
                      className="w-fit text-xs font-medium"
                    >
                      {lead.niche}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Histórico
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Criado em
                    </span>
                    <span className="text-xs font-medium tabular-nums">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Última atualização
                    </span>
                    <span className="text-xs font-medium tabular-nums">
                      {formatDate(lead.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Observações
              </h3>
              <div className="rounded-lg bg-secondary/30 p-4 min-h-[120px]">
                {lead.notes ? (
                  <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                    {lead.notes}
                  </p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    Nenhuma observação registrada.
                  </p>
                )}
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Lead
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Lead?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente os dados da empresa {lead.companyName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(lead.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {/* Quick stage buttons */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Mover para etapa
        </h3>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => onMoveStage(lead.id, stage)}
              disabled={lead.stage === stage}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                lead.stage === stage
                  ? cn(STAGE_COLORS[stage], "text-primary-foreground")
                  : cn(STAGE_BG_LIGHT[stage], STAGE_TEXT_COLORS[stage]),
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  lead.stage === stage
                    ? "bg-primary-foreground"
                    : STAGE_COLORS[stage],
                )}
              />
              {STAGE_LABELS[stage]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  isPhone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        {isPhone ? (
          <a
            href={`tel:${value.replace(/\D/g, "")}`}
            className="text-sm font-medium text-primary underline"
          >
            {value}
          </a>
        ) : (
          <span className="text-sm font-medium text-foreground">{value}</span>
        )}
      </div>
    </div>
  );
}
