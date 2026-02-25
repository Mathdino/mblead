"use client";

import useSWR, { mutate } from "swr";
import type { Niche } from "@/lib/types";
import {
  getMessages,
  setMessage,
  getMessageForNiche,
} from "@/lib/messages-store";

const MESSAGES_KEY = "messages-map";

export function useMessages() {
  const { data: messages = {}, isLoading } = useSWR(MESSAGES_KEY, () =>
    getMessages(),
  );

  const saveMessage = async (niche: Niche, text: string) => {
    await setMessage(niche, text);
    mutate(MESSAGES_KEY);
  };

  const getFor = (niche: Niche): string => {
    return getMessageForNiche(messages, niche);
  };

  return {
    messages,
    isLoading,
    saveMessage,
    getFor,
  };
}
