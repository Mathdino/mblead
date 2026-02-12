import type { Lead, Stage, Niche } from "./types";

const STORAGE_KEY = "crm-leads";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isCloudEnabled = SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL !== "seu_url_do_supabase";

async function supabaseFetch(path: string, options: RequestInit = {}) {
  if (!isCloudEnabled) return null;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY!,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Supabase Error:", error);
    throw new Error(error.message || "Erro na comunicação com o banco de dados");
  }

  return res.json();
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getLocalLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export async function getAllLeads(): Promise<Lead[]> {
  if (isCloudEnabled) {
    try {
      const leads = await supabaseFetch("leads?select=*");
      return (leads as Lead[]).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (e) {
      console.warn("Falha ao buscar na nuvem, usando local:", e);
    }
  }

  return getLocalLeads().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function createLead(data: {
  companyName: string;
  contactPerson: string;
  phone: string;
  niche: Niche;
  notes?: string;
}): Promise<Lead> {
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

  if (isCloudEnabled) {
    try {
      const created = await supabaseFetch("leads", {
        method: "POST",
        body: JSON.stringify(lead),
      });
      return created[0];
    } catch (e) {
      console.warn("Falha ao salvar na nuvem, salvando local:", e);
    }
  }

  const leads = getLocalLeads();
  leads.push(lead);
  saveLocalLeads(leads);
  return lead;
}

export async function updateLeadStage(id: string, stage: Stage): Promise<Lead | undefined> {
  const updatedAt = new Date().toISOString();

  if (isCloudEnabled) {
    try {
      const updated = await supabaseFetch(`leads?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ stage, updatedAt }),
      });
      return updated[0];
    } catch (e) {
      console.warn("Falha ao atualizar na nuvem, tentando local:", e);
    }
  }

  const leads = getLocalLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  leads[index].stage = stage;
  leads[index].updatedAt = updatedAt;
  saveLocalLeads(leads);
  return leads[index];
}

export async function updateLead(
  id: string,
  data: Partial<Omit<Lead, "id" | "createdAt">>
): Promise<Lead | undefined> {
  const updatedAt = new Date().toISOString();

  if (isCloudEnabled) {
    try {
      const updated = await supabaseFetch(`leads?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...data, updatedAt }),
      });
      return updated[0];
    } catch (e) {
      console.warn("Falha ao atualizar na nuvem, tentando local:", e);
    }
  }

  const leads = getLocalLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  leads[index] = {
    ...leads[index],
    ...data,
    updatedAt: updatedAt,
  };
  saveLocalLeads(leads);
  return leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  if (isCloudEnabled) {
    try {
      await supabaseFetch(`leads?id=eq.${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (e) {
      console.warn("Falha ao deletar na nuvem, tentando local:", e);
    }
  }

  const leads = getLocalLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  saveLocalLeads(filtered);
  return true;
}

export async function getStats() {
  const leads = await getAllLeads();
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
