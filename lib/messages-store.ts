import type { Niche } from "./types";

const STORAGE_KEY = "crm-messages";
const DEFAULT_DDI = process.env.NEXT_PUBLIC_DEFAULT_DDI || "55";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isCloudEnabled =
  SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL !== "seu_url_do_supabase";
// Client-side: sempre tenta API /api/messages; fallback para Supabase/local se falhar

type MessagesMap = Record<Niche, string>;

function readLocal(): MessagesMap {
  if (typeof window === "undefined") return {} as MessagesMap;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {} as MessagesMap;
  try {
    return JSON.parse(raw) as MessagesMap;
  } catch {
    return {} as MessagesMap;
  }
}

function writeLocal(map: MessagesMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function getMessages(): Promise<MessagesMap> {
  try {
    const res = await fetch("/api/messages", { cache: "no-store" });
    if (res.ok) {
      const rows = (await res.json()) as Array<{ Niche: Niche; Text: string }>;
      const map: MessagesMap = {} as any;
      rows.forEach((r) => {
        map[r.Niche] = r.Text || "";
      });
      return map;
    }
  } catch (e) {
    console.warn(
      "Falha ao buscar via API /api/messages, tentando fallback:",
      e,
    );
  }
  if (isCloudEnabled) {
    try {
      const res = await supabaseFetch("messages?select=niche,text");
      const map: MessagesMap = {} as any;
      (res as Array<{ niche: Niche; text: string }>).forEach((row) => {
        map[row.niche] = row.text || "";
      });
      return map;
    } catch (e) {
      console.warn("Falha ao buscar mensagens na nuvem, usando local:", e);
    }
  }
  return readLocal();
}

export async function setMessage(niche: Niche, text: string): Promise<void> {
  try {
    const res = await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, text }),
    });
    if (res.ok) return;
  } catch (e) {
    console.warn(
      "Falha ao salvar via API /api/messages, tentando fallback:",
      e,
    );
  }
  if (isCloudEnabled) {
    const now = new Date().toISOString();
    try {
      const updated = await supabaseFetch(
        `messages?niche=eq.${encodeURIComponent(niche)}`,
        { method: "PATCH", body: JSON.stringify({ text }) },
      );
      if (Array.isArray(updated) && updated.length > 0) return;
      const created = await supabaseFetch("messages", {
        method: "POST",
        body: JSON.stringify({ niche, text }),
      });
      if (Array.isArray(created) && created.length > 0) return;
    } catch (e) {
      console.warn("Falha ao salvar na nuvem, salvando local:", e);
    }
  }
  const map = readLocal();
  map[niche] = text;
  writeLocal(map);
}

export function getMessageForNiche(
  map: MessagesMap | undefined,
  niche: Niche,
): string {
  if (map && map[niche]) return map[niche];
  return "";
}

export function buildWhatsAppLink(
  phone: string,
  message: string,
  companyName?: string,
): string {
  const digits = normalizePhone(phone);
  const prefix = companyName ? `Olá, ${companyName} 👋🏼` : "";
  const text = encodeURIComponent(`${prefix}${message || ""}`);
  return `https://wa.me/${digits}?text=${text}`;
}

export function normalizePhone(phone: string): string {
  const raw = (phone || "").replace(/\D+/g, "");
  if (!raw) return "";
  let digits = raw.replace(/^0+/, "");
  if (digits.startsWith(DEFAULT_DDI)) return digits;
  if (digits.length <= 11) return `${DEFAULT_DDI}${digits}`;
  return digits;
}

export function isPhoneValid(phone: string): boolean {
  const digits = normalizePhone(phone);
  return digits.length >= 12;
}

async function supabaseFetch(path: string, options: RequestInit = {}) {
  if (!isCloudEnabled) throw new Error("Cloud disabled");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    let err: any = undefined;
    try {
      err = await res.json();
    } catch {}
    const msg = err?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}
