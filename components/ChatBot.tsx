"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type LeadStep = "none" | "ask_name" | "ask_phone" | "done";

interface LeadState {
  name?: string;
  phone?: string;
  captured: boolean;
  step: LeadStep;
}

const QUICK_REPLIES = [
  { label: "🏷️ View Products", value: "What products do you have available?" },
  { label: "💰 Pricing Info", value: "What are your prices?" },
  { label: "🚚 Delivery", value: "Do you offer delivery?" },
  { label: "📞 Contact Us", value: "How can I contact you?" },
];

const GREETING =
  "Hi! 👋 Welcome to Michael Lamidis!\n\nI'm your AI shopping assistant — here 24/7 to help you find the perfect open-box appliance. Ask me anything about products, pricing, delivery, or warranty!";

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "#2563EB" }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold shadow"
          style={{ background: "linear-gradient(135deg, #1A3C5E, #2563EB)" }}
        >
          ML
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
          isUser
            ? "rounded-br-sm text-white"
            : "rounded-bl-sm text-gray-800 bg-white border border-gray-100"
        }`}
        style={
          isUser
            ? { background: "linear-gradient(135deg, #2563EB 0%, #1A3C5E 100%)" }
            : undefined
        }
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "assistant", content: GREETING, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lead, setLead] = useState<LeadState>({ captured: false, step: "none" });
  const [hasUnread, setHasUnread] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMsgCount = useRef(0);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [isOpen]);

  // Scroll button visibility
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 80);
  };

  const addMessage = (role: "user" | "assistant", content: string): Message => {
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const callChatAPI = async (text: string, history: Message[]): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.reply ?? "I'm sorry, I couldn't process that. Please try again!";
    } catch {
      return "I'm having trouble connecting right now. Please try again or contact us directly! 📞";
    }
  };

  const saveLead = (name: string, phone: string, chatLog: Message[]) => {
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        chatLog: chatLog.map((m) => ({ role: m.role, content: m.content })),
      }),
    }).catch(() => {});
  };

  const handleSend = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isTyping) return;
    setInput("");

    addMessage("user", userText);
    userMsgCount.current += 1;

    // ── Lead capture flow ──
    if (lead.step === "ask_name") {
      setLead((prev) => ({ ...prev, name: userText, step: "ask_phone" }));
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 700));
      setIsTyping(false);
      addMessage("assistant", `Great, ${userText}! 😊 What's the best phone number to reach you on?`);
      return;
    }

    if (lead.step === "ask_phone") {
      const name = lead.name ?? "Customer";
      const finalLead: LeadState = { name, phone: userText, step: "done", captured: true };
      setLead(finalLead);
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 700));
      setIsTyping(false);
      const savedMessages = [...messages, { id: "tmp", role: "user" as const, content: userText, timestamp: new Date() }];
      saveLead(name, userText, savedMessages);
      addMessage(
        "assistant",
        `Thank you, ${name}! ✅ We've saved your contact details and our team will reach out to you shortly at ${userText}.\n\nIs there anything else I can help you with? 😊`
      );
      return;
    }

    // ── Regular AI response ──
    setIsTyping(true);
    const snapshot = [...messages, { id: "tmp", role: "user" as const, content: userText, timestamp: new Date() }];
    const reply = await callChatAPI(userText, snapshot);
    setIsTyping(false);
    addMessage("assistant", reply);

    // Trigger lead capture after 2nd user message (one time)
    if (userMsgCount.current === 2 && !lead.captured && lead.step === "none") {
      setTimeout(async () => {
        setLead((prev) => ({ ...prev, step: "ask_name" }));
        addMessage(
          "assistant",
          "By the way, I'd love to save your info so our team can send you personalised deals! 🎁\n\nWhat's your name?"
        );
      }, 1200);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder =
    lead.step === "ask_name"
      ? "Enter your name…"
      : lead.step === "ask_phone"
      ? "Enter your phone number…"
      : "Type a message…";

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* ── Floating button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)" }}
          >
            <MessageCircle className="w-7 h-7 text-white" />
            {hasUnread && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow"
              >
                1
              </motion.span>
            )}
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "#2563EB" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="absolute bottom-0 right-0 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: "min(380px, calc(100vw - 20px))",
              height: "min(560px, calc(100dvh - 80px))",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)" }}
            >
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                ML
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">Michael Lamidis AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <p className="text-white/75 text-[11px]">Online · Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="w-4.5 h-4.5" style={{ width: "1.125rem", height: "1.125rem" }} />
              </button>
            </div>

            {/* Messages area */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ background: "#F8FAFC" }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex gap-2 justify-start"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold shadow"
                      style={{ background: "linear-gradient(135deg, #1A3C5E, #2563EB)" }}
                    >
                      ML
                    </div>
                    <div
                      className="px-3.5 py-3 rounded-2xl rounded-bl-sm bg-white border border-gray-100 shadow-sm"
                    >
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-to-bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-[72px] right-4 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick replies (shown early in conversation) */}
            <AnimatePresence>
              {messages.length <= 2 && !isTyping && lead.step === "none" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pt-2 pb-1 flex gap-1.5 flex-wrap border-t border-gray-100"
                  style={{ background: "#F8FAFC" }}
                >
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.value}
                      onClick={() => handleSend(qr.value)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all font-medium"
                    >
                      {qr.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <div className="px-3 py-3 border-t border-gray-100 flex gap-2 items-center flex-shrink-0 bg-white">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 focus:bg-white"
                disabled={isTyping}
                autoComplete="off"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed flex-shrink-0 shadow"
                style={{ background: "linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)" }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
