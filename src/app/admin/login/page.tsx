"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Vérifier si déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) {
          router.push("/admin");
        }
      } catch (e) {
        // Non authentifié, rester sur la page login
      }
    };
    checkAuth();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      // Redirection après login réussi
      router.push(next);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cacao-50 to-creme-50 dark:from-cacao-950 dark:to-creme-950">
      <div className="w-full max-w-md p-8">
        <div className="card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
            <p className="mt-2 text-sm text-cacao-900/70 dark:text-creme/70">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 rounded-lg">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}