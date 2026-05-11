import { AdminNav } from "@/components/admin-nav";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <div className="mt-5">
        <AdminNav />
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

