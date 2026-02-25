import type { Niche } from "./types";

const STORAGE_KEY = "crm-messages";

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
  return readLocal();
}

export async function setMessage(niche: Niche, text: string): Promise<void> {
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
  const digits = (phone || "").replace(/\D+/g, "");
  const prefix = companyName ? `Olá, ${companyName} ` : "";
  const text = encodeURIComponent(`${prefix}${message || ""}`);
  return `https://wa.me/${digits}?text=${text}`;
}
