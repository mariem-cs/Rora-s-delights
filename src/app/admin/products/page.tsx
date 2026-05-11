"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import type { Product } from "@/lib/types";

type ProductsResponse = { products: Product[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = useMemo(() => products.find((p) => p.id === editingId) ?? null, [editingId, products]);

  const [slug, setSlug] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descFr, setDescFr] = useState("");
  const [descAr, setDescAr] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("/images/placeholder-cookies.svg");
  const [category, setCategory] = useState("Cookies");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);

  const resetForm = () => {
    setEditingId(null);
    setSlug("");
    setNameFr("");
    setNameAr("");
    setDescFr("");
    setDescAr("");
    setPrice(0);
    setImage("/images/placeholder-cookies.svg");
    setCategory("Cookies");
    setTags("");
    setFeatured(false);
    setInStock(true);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = (await res.json()) as ProductsResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setProducts(data.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!editing) return;
    setSlug(editing.slug);
    setNameFr(editing.name.fr);
    setNameAr(editing.name.ar);
    setDescFr(editing.description.fr);
    setDescAr(editing.description.ar);
    setPrice(editing.price);
    setImage(editing.image);
    setCategory(editing.category);
    setTags((editing.tags || []).join(", "));
    setFeatured(Boolean(editing.featured));
    setInStock(editing.inStock !== false);
  }, [editing]);

  const save = () => {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          slug,
          name: { fr: nameFr, ar: nameAr },
          description: { fr: descFr, ar: descAr },
          price: Number(price),
          image,
          category,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          featured,
          inStock,
        };

        const res = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
          method: editingId ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Save failed");
        await load();
        resetForm();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Delete failed");
        await load();
        if (editingId === id) resetForm();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Products</h2>
          <button className="btn-outline px-4 py-2 text-xs" type="button" onClick={load}>
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-cacao-900/70 dark:text-creme/70">Loading…</p>
        ) : error ? (
          <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-cacao-900/60 dark:text-creme/60">
                <tr>
                  <th className="py-2 pr-3">Name (FR)</th>
                  <th className="py-2 pr-3">Slug</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cacao-900/10">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3 font-medium">{p.name.fr}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{p.slug}</td>
                    <td className="py-2 pr-3">{p.price}</td>
                    <td className="py-2 pr-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="btn-outline px-3 py-1 text-xs" type="button" onClick={() => setEditingId(p.id)}>
                          Edit
                        </button>
                        <button className="btn-outline px-3 py-1 text-xs" type="button" onClick={() => remove(p.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{editingId ? "Edit product" : "Create product"}</h2>
          {editingId ? (
            <button className="btn-outline px-4 py-2 text-xs" type="button" onClick={resetForm}>
              New
            </button>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          <label className="text-sm">
            Slug
            <input className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </label>
          <label className="text-sm">
            Name (FR)
            <input className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" value={nameFr} onChange={(e) => setNameFr(e.target.value)} />
          </label>
          <label className="text-sm">
            Name (AR)
            <input className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
          </label>
          <label className="text-sm">
            Description (FR)
            <textarea className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" rows={2} value={descFr} onChange={(e) => setDescFr(e.target.value)} />
          </label>
          <label className="text-sm">
            Description (AR)
            <textarea className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              Price (TND)
              <input
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Category
              <input className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" value={category} onChange={(e) => setCategory(e.target.value)} />
            </label>
          </div>
          <label className="text-sm">
            Image path
            <input className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" value={image} onChange={(e) => setImage(e.target.value)} />
          </label>
          <label className="text-sm">
            Tags (comma-separated)
            <input className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
              In stock
            </label>
          </div>
        </div>

        {error && <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>}

        <button className="btn-primary mt-6 w-full justify-center" type="button" disabled={pending} onClick={save}>
          {pending ? "..." : editingId ? "Save changes" : "Create"}
        </button>
      </div>
    </div>
  );
}

