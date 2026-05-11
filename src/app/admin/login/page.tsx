import { Suspense } from "react";

import { AdminLoginClient } from "@/components/admin-login-client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-12">Loading…</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
