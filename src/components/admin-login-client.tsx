"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok) throw new Error(data.error || "Login failed");
        router.push(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-md card p-6 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-cacao-900/70 dark:text-creme/70">
          Use <code className="font-mono">ADMIN_EMAIL</code> / <code className="font-mono">ADMIN_PASSWORD</code>.
        </p>

        <div className="mt-6 space-y-4">
          <label className="text-sm">
            Email
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm dark:bg-black/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Password
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm dark:bg-black/30"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>}

        <button className="btn-primary mt-6 w-full justify-center" type="button" disabled={pending} onClick={submit}>
          {pending ? "..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}

