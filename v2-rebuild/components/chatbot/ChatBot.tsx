"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const { messages, send, sending } = useChat();
  const [draft, setDraft] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    await send(draft);
    setDraft("");
  }

  return (
    <>
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink-900 text-bone shadow-elevated transition-all hover:bg-ink-800 hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex h-[28rem] w-[20rem] flex-col rounded-xl border border-ink-100 bg-white shadow-elevated overflow-hidden">
          <div className="border-b border-ink-100 px-4 py-3 bg-bone-100/60">
            <p className="font-heading text-sm font-semibold text-ink-900">Chat with us</p>
            <p className="text-xs text-ink-500">Typical reply in under an hour</p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm bg-bone">
            {messages.length === 0 && (
              <p className="text-ink-400">Ask about products, delivery, or warranties.</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2",
                  m.role === "user"
                    ? "ml-auto bg-ink-900 text-bone"
                    : "bg-ink-50 text-ink-900"
                )}
              >
                {m.content}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex border-t border-ink-100 p-2 gap-2 bg-white">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="h-10 flex-1 rounded-md border border-ink-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900"
            />
            <button
              type="submit"
              disabled={sending}
              aria-label="Send"
              className="grid h-10 w-10 place-items-center rounded-md bg-ink-900 text-bone hover:bg-ink-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
