"use client";

import useSWR, { mutate } from "swr";
import {
  getAllLeads,
  createLead,
  updateLeadStage,
  updateLead,
  deleteLead,
  getStats,
} from "@/lib/leads-store";
import type { Lead, Stage, Niche } from "@/lib/types";

const LEADS_KEY = "leads";
const STATS_KEY = "leads-stats";

export function useLeads() {
  const { data: leads = [], isLoading } = useSWR<Lead[]>(LEADS_KEY, () =>
    getAllLeads()
  );

  const { data: stats } = useSWR(STATS_KEY, () => getStats());

  const addLead = (data: {
    companyName: string;
    contactPerson: string;
    phone: string;
    niche: Niche;
    notes?: string;
  }) => {
    createLead(data);
    mutate(LEADS_KEY);
    mutate(STATS_KEY);
  };

  const moveLeadToStage = (id: string, stage: Stage) => {
    updateLeadStage(id, stage);
    mutate(LEADS_KEY);
    mutate(STATS_KEY);
  };

  const editLead = (
    id: string,
    data: Partial<Omit<Lead, "id" | "createdAt">>
  ) => {
    updateLead(id, data);
    mutate(LEADS_KEY);
    mutate(STATS_KEY);
  };

  const removeLead = (id: string) => {
    deleteLead(id);
    mutate(LEADS_KEY);
    mutate(STATS_KEY);
  };

  return {
    leads,
    stats,
    isLoading,
    addLead,
    moveLeadToStage,
    editLead,
    removeLead,
  };
}
