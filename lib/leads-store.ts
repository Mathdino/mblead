import type { Lead, Stage, Niche } from "./types";

const STORAGE_KEY = "crm-leads";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function getAllLeads(): Lead[] {
  return getLeads().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getLeadById(id: string): Lead | undefined {
  return getLeads().find((l) => l.id === id);
}

export function getLeadsByStage(stage: Stage): Lead[] {
  return getLeads()
    .filter((l) => l.stage === stage)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export function createLead(data: {
  companyName: string;
  contactPerson: string;
  phone: string;
  niche: Niche;
  notes?: string;
}): Lead {
  const now = new Date().toISOString();
  const lead: Lead = {
    id: generateId(),
    companyName: data.companyName,
    contactPerson: data.contactPerson,
    phone: data.phone,
    niche: data.niche,
    stage: "prospeccao",
    notes: data.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  const leads = getLeads();
  leads.push(lead);
  saveLeads(leads);
  return lead;
}

export function updateLeadStage(id: string, stage: Stage): Lead | undefined {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  leads[index].stage = stage;
  leads[index].updatedAt = new Date().toISOString();
  saveLeads(leads);
  return leads[index];
}

export function updateLead(
  id: string,
  data: Partial<Omit<Lead, "id" | "createdAt">>
): Lead | undefined {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  leads[index] = {
    ...leads[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveLeads(leads);
  return leads[index];
}

export function deleteLead(id: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  saveLeads(filtered);
  return true;
}

export function getStats() {
  const leads = getLeads();
  return {
    total: leads.length,
    byStage: {
      prospeccao: leads.filter((l) => l.stage === "prospeccao").length,
      contato: leads.filter((l) => l.stage === "contato").length,
      proposta: leads.filter((l) => l.stage === "proposta").length,
      negociacao: leads.filter((l) => l.stage === "negociacao").length,
      fechamento: leads.filter((l) => l.stage === "fechamento").length,
    },
  };
}
