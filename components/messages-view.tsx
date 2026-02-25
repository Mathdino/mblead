"use client";

import { useState } from "react";
import { MessageSquare, Save } from "lucide-react";
import { NICHES, type Niche } from "@/lib/types";
import { useMessages } from "@/hooks/use-messages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function MessagesView() {
  const { messages, saveMessage } = useMessages();
  const [local, setLocal] = useState<Record<Niche, string>>(() => {
    const initial: Record<Niche, string> = {} as any;
    NICHES.forEach((n) => {
      initial[n] = (messages as any)[n] || "";
    });
    return initial;
  });

  const handleChange = (niche: Niche, value: string) => {
    setLocal((prev) => ({ ...prev, [niche]: value }));
  };

  const handleSave = async (niche: Niche) => {
    await saveMessage(niche, local[niche] || "");
    toast.success("Mensagem salva", { description: `Nicho: ${niche}` });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Mensagens por Nicho
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Cadastre a mensagem padrão para cada nicho. Ela será usada ao enviar
          WhatsApp pelo card do lead.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NICHES.map((niche) => (
          <div
            key={niche}
            className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">{niche}</span>
            </div>
            <Textarea
              value={local[niche] || ""}
              onChange={(e) => handleChange(niche, e.target.value)}
              placeholder="Escreva a mensagem padrão para este nicho..."
              className="min-h-32 bg-secondary/30"
            />
            <div className="flex items-center justify-end">
              <Button onClick={() => handleSave(niche)} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
