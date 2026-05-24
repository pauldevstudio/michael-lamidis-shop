"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  ok: boolean;
  data?: { reply: string };
  error?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const send = useCallback(async (text: string) => {
    const user: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, user]);
    setSending(true);
    try {
      const res = await api.post<ChatResponse>("/chat", { message: text });
      const reply = res.data.data?.reply ?? "Sorry, I couldn't respond right now.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }, []);

  return { messages, send, sending };
}
