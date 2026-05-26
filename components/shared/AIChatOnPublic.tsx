"use client";

import { usePathname } from "next/navigation";
import ChatBot from "@/components/ChatBot";

/**
 * Mount the AI chatbot on public pages only. Admin / Payload routes
 * skip it so the dashboard stays uncluttered.
 */
export default function AIChatOnPublic() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/cms")) return null;
  return <ChatBot />;
}
