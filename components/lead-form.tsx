"use client";

import { useState } from "react";
import { Building2, User, Phone, Tag, FileText, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NICHES, type Niche } from "@/lib/types";

interface LeadFormProps {
  onSubmit: (data: {
    companyName: string;
    contactPerson: string;
    phone: string;
    niche: Niche;
    notes?: string;
  }) => void;
}

export function LeadForm({ onSubmit }: LeadFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [niche, setNiche] = useState<Niche | "">("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 7)
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  function handlePhoneChange(value: string) {
    const formatted = formatPhone(value);
    setPhone(formatted);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = "Nome da empresa obrigatorio";
    if (!contactPerson.trim())
      newErrors.contactPerson = "Nome do responsavel obrigatorio";
    if (phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Telefone invalido";
    if (!niche) newErrors.niche = "Selecione um nicho";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone,
      niche: niche as Niche,
      notes: notes.trim() || undefined,
    });
    setCompanyName("");
    setContactPerson("");
    setPhone("");
    setNiche("");
    setNotes("");
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-6 text-sm font-bold text-foreground uppercase tracking-wider">
          Informações do Novo Lead
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="companyName" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              Nome da Empresa
            </Label>
            <Input
              id="companyName"
              placeholder="Ex: Restaurante Sabor & Arte"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-secondary/30"
            />
            {errors.companyName && (
              <span className="text-xs font-medium text-destructive">{errors.companyName}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactPerson" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="h-3.5 w-3.5" />
              Contato / Responsável
            </Label>
            <Input
              id="contactPerson"
              placeholder="Ex: João Silva"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="bg-secondary/30"
            />
            {errors.contactPerson && (
              <span className="text-xs font-medium text-destructive">{errors.contactPerson}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Phone className="h-3.5 w-3.5" />
              Telefone
            </Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              type="tel"
              className="bg-secondary/30"
            />
            {errors.phone && (
              <span className="text-xs font-medium text-destructive">{errors.phone}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5" />
              Nicho de Mercado
            </Label>
            <Select
              value={niche}
              onValueChange={(val) => setNiche(val as Niche)}
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
            {errors.niche && (
              <span className="text-xs font-medium text-destructive">{errors.niche}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5" />
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Adicione informações relevantes sobre o lead, interesses ou contexto inicial..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="bg-secondary/30 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="w-full md:w-auto md:px-12 gap-2 shadow-lg shadow-primary/20">
          <Send className="h-4 w-4" />
          Cadastrar Lead
        </Button>
      </div>
    </form>
  );
}
