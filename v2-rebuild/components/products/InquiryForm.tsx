"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { LeadInput } from "@/types";

interface Props { productSlug?: string; productName?: string; }

export function InquiryForm({ productSlug, productName }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: LeadInput = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      message: String(formData.get("message") ?? ""),
      productSlug,
    };

    try {
      await api.post("/leads", payload);
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
        Thanks — we'll be in touch within an hour.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-ink-100 bg-white p-6 shadow-card space-y-3"
    >
      <h3 className="font-heading text-lg font-semibold text-ink-900">
        {productName ? "Ask about this item" : "Get in touch"}
      </h3>
      <p className="text-sm text-ink-500">Typical reply in under an hour during showroom hours.</p>
      <Input name="name" placeholder="Your name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" type="tel" placeholder="Phone (optional)" />
      <Textarea
        name="message"
        placeholder={productName ? `I'm interested in the ${productName}…` : "How can we help?"}
        required
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
