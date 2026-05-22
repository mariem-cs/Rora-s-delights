"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";

export function SuccessPageClient() {
  const { locale } = useLocale();
  const tr = t(locale);
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const wa = params.get("wa");

  return (
    <div className="container-page py-12">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-cacao-900 dark:text-creme">{tr.success.title}</h1>
        <p className="mt-3 text-sm sm:text-base text-cacao-800 dark:text-creme/70">{tr.success.subtitle}</p>
        {orderId && (
          <p className="mt-4 text-xs sm:text-sm text-cacao-700 dark:text-creme/70">
            Order ID: <span className="font-mono font-semibold text-cacao-900 dark:text-creme">{orderId}</span>
          </p>
        )}

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {wa ? (
            <Link className="btn-primary" href={wa} target="_blank">
              {tr.actions.openWhatsApp}
            </Link>
          ) : null}
          <Link className="btn-outline" href="/products">
            {tr.actions.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}

