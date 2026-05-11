import { Suspense } from "react";

import { SuccessPageClient } from "@/components/success-page-client";

export const metadata = { title: "Success" };

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container-page py-12">Loading…</div>}>
      <SuccessPageClient />
    </Suspense>
  );
}
