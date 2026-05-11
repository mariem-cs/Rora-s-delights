"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch("/api/admin/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.status === 401 || res.status === 403) {
          // Not authenticated
          setIsAuthenticated(false);
          setIsChecking(false);
          // Redirect after a brief delay to allow state update
          setTimeout(() => {
            router.push("/admin/login");
          }, 100);
          return;
        }

        if (!res.ok) {
          throw new Error(`Auth check failed with status ${res.status}`);
        }

        // User is authenticated
        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setIsChecking(false);
        // Redirect to login
        setTimeout(() => {
          router.push("/admin/login");
        }, 100);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isChecking || isAuthenticated === null) {
    return (
      <div className="container-page py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded-lg bg-gradient-to-r from-cacao-900/10 to-cacao-900/5 dark:from-white/10 dark:to-white/5"></div>
          <div className="mt-6 space-y-3">
            <div className="h-12 w-full rounded-xl bg-gradient-to-r from-cacao-900/10 to-cacao-900/5 dark:from-white/10 dark:to-white/5"></div>
            <div className="h-64 w-full rounded-xl bg-gradient-to-r from-cacao-900/10 to-cacao-900/5 dark:from-white/10 dark:to-white/5"></div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated - redirect is in progress
  return null;
}
