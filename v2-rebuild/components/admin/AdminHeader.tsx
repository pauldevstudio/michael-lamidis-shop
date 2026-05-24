"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

interface Props { userName: string; }

export function AdminHeader({ userName }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-3">
      <div>
        <p className="text-xs text-ink-500">Signed in as</p>
        <p className="text-sm font-medium text-ink-900">{userName}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </header>
  );
}
