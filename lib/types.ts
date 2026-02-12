import {
  Utensils,
  IceCreamCone,
  Pizza,
  Ham,
  Croissant,
  Fish,
  CakeSlice,
  Drumstick,
  Hamburger,
  ChefHat,
  Building2,
} from "lucide-react";

export const NICHES = [
  "Marmita",
  "Acai e Sorvete",
  "Pizzaria",
  "Hamburgueria",
  "Pastelaria",
  "Japa",
  "Bolos e Doces",
  "Salgadinhos",
  "Outros",
] as const;

export type Niche = (typeof NICHES)[number];

export const NICHE_ICONS: Record<Niche, any> = {
  Marmita: Utensils,
  "Acai e Sorvete": IceCreamCone,
  Pizzaria: Pizza,
  Hamburgueria: Hamburger,
  Pastelaria: Croissant,
  Japa: Fish,
  "Bolos e Doces": CakeSlice,
  Salgadinhos: Drumstick,
  Outros: ChefHat,
};

export const STAGES = [
  "prospeccao",
  "contato",
  "proposta",
  "negociacao",
  "fechamento",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  prospeccao: "Prospecção",
  contato: "Contato Inicial",
  proposta: "Proposta Enviada",
  negociacao: "Negociação",
  fechamento: "Fechamento",
};

export const STAGE_COLORS: Record<Stage, string> = {
  prospeccao: "bg-[hsl(217,91%,50%)]",
  contato: "bg-[hsl(262,83%,58%)]",
  proposta: "bg-[hsl(35,92%,53%)]",
  negociacao: "bg-[hsl(25,95%,53%)]",
  fechamento: "bg-[hsl(160,84%,39%)]",
};

export const STAGE_TEXT_COLORS: Record<Stage, string> = {
  prospeccao: "text-[hsl(217,91%,50%)]",
  contato: "text-[hsl(262,83%,58%)]",
  proposta: "text-[hsl(35,92%,53%)]",
  negociacao: "text-[hsl(25,95%,53%)]",
  fechamento: "text-[hsl(160,84%,39%)]",
};

export const STAGE_BG_LIGHT: Record<Stage, string> = {
  prospeccao: "bg-[hsl(217,91%,50%)]/10",
  contato: "bg-[hsl(262,83%,58%)]/10",
  proposta: "bg-[hsl(35,92%,53%)]/10",
  negociacao: "bg-[hsl(25,95%,53%)]/10",
  fechamento: "bg-[hsl(160,84%,39%)]/10",
};

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  niche: Niche;
  stage: Stage;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
