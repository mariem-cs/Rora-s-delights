export default function AdminDashboardPage() {
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <p className="mt-2 text-sm text-cacao-900/70 dark:text-creme/70">
        {hasBlob
          ? "Vercel Blob persistence is enabled."
          : "Vercel Blob persistence is not configured. Product/order changes may not persist in production."}
      </p>
      <ul className="mt-4 list-disc pl-6 text-sm text-cacao-900/80 dark:text-creme/80">
        <li>Manage products (CRUD)</li>
        <li>View orders and update status</li>
      </ul>
    </div>
  );
}

