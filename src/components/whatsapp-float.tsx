"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/cn";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export function WhatsAppFloat({ className }: { className?: string }) {
  if (!WHATSAPP_NUMBER) return null;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour ! Je souhaite commander chez Rora’s Delights.")}`;
  return (
    <Link
      href={url}
      target="_blank"
      className={cn(
        "fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-emerald-700",
        className,
      )}
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </Link>
  );
}

