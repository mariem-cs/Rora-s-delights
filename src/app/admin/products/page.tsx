"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Trash2, RefreshCw, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Product, ProductSize } from "@/lib/types";

type ProductsResponse = { products: Product[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = useMemo(() => products.find((p) => p.id === editingId) ?? null, [editingId, products]);

  const [slug, setSlug] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descFr, setDescFr] = useState("");
  const [descAr, setDescAr] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
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
    setSizes([]);
    setImage("/images/placeholder-cookies.svg");
    setCategory("Cookies");
    setTags("");
    setFeatured(false);
    setInStock(true);
    setSuccess(null);
    setError(null);
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
    setSizes(editing.sizes || []);
    setImage(editing.image);
    setCategory(editing.category);
    setTags((editing.tags || []).join(", "));
    setFeatured(Boolean(editing.featured));
    setInStock(editing.inStock !== false);
  }, [editing]);

  const save = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const payload = {
          slug,
          name: { fr: nameFr, ar: nameAr },
          description: { fr: descFr, ar: descAr },
          price: Number(price),
          sizes: sizes.length > 0 ? sizes : undefined,
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
        setSuccess(editingId ? "Product updated successfully" : "Product created successfully");
        await load();
        setTimeout(() => resetForm(), 1500);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Delete failed");
        setSuccess("Product deleted successfully");
        await load();
        if (editingId === id) {
          setTimeout(() => resetForm(), 1500);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
      {/* Products List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cacao-900/10 bg-white/40 dark:border-white/10 dark:bg-black/20 backdrop-blur-sm p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Products</h2>
            <p className="mt-1 text-sm text-cacao-900/60 dark:text-creme/60">{products.length} product{products.length !== 1 ? "s" : ""}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs"
            type="button"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="animate-pulse rounded-xl h-12 bg-cacao-900/10 dark:bg-white/10"
              ></motion.div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-cacao-900/60 dark:text-creme/60 font-medium">
                <tr className="border-b border-cacao-900/10 dark:border-white/10">
                  <th className="py-3 px-3">Name (FR)</th>
                  <th className="py-3 px-3">Slug</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cacao-900/10 dark:divide-white/10">
                <AnimatePresence mode="popLayout">
                  {products.map((p, idx) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-cacao-900/2 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-3 font-medium">{p.name.fr}</td>
                      <td className="py-3 px-3 font-mono text-xs text-cacao-900/70 dark:text-creme/70">{p.slug}</td>
                      <td className="py-3 px-3 font-semibold">{p.price} €</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          p.inStock
                            ? "bg-green-100/60 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-rose-100/60 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                        }`}>
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline px-3 py-1 text-xs"
                            type="button"
                            onClick={() => setEditingId(p.id)}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline px-2 py-1 text-xs text-rose-700 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-900/20"
                            type="button"
                            onClick={() => remove(p.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {!loading && products.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <p className="text-cacao-900/60 dark:text-creme/60">No products yet. Create one to get started!</p>
          </motion.div>
        )}
      </motion.div>

      {/* Form Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-cacao-900/10 bg-white/40 dark:border-white/10 dark:bg-black/20 backdrop-blur-sm p-6 h-fit sticky top-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">{editingId ? "Edit product" : "Create product"}</h2>
          {editingId ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn-outline px-2 py-2 text-xs"
              type="button"
              onClick={resetForm}
            >
              <X className="h-4 w-4" />
            </motion.button>
          ) : null}
        </div>

        <div className="max-h-[70vh] overflow-y-auto space-y-3">
          <label className="text-sm">
            Slug
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Name (FR)
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              value={nameFr}
              onChange={(e) => setNameFr(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Name (AR)
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Description (FR)
            <textarea
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              rows={2}
              value={descFr}
              onChange={(e) => setDescFr(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Description (AR)
            <textarea
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              rows={2}
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              Price (EUR)
              <input
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Category
              <input
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>
          </div>
          <label className="text-sm">
            Image path
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Tags (comma-separated)
            <input
              className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
              In stock
            </label>
          </div>

          {/* Sizes Management */}
          <div className="border-t border-cacao-900/10 dark:border-white/10 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Sizes (Optional)</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setSizes([...sizes, { name: "", price: 0 }])}
                className="btn-outline px-2 py-1 text-xs inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </motion.button>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {sizes.map((size, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    layout
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Size name"
                      className="flex-1 rounded-xl2 border border-cacao-900/15 bg-white/70 px-3 py-2 text-xs dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
                      value={size.name}
                      onChange={(e) => {
                        const updated = [...sizes];
                        updated[idx].name = e.target.value;
                        setSizes(updated);
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      className="w-20 rounded-xl2 border border-cacao-900/15 bg-white/70 px-3 py-2 text-xs dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
                      value={size.price}
                      onChange={(e) => {
                        const updated = [...sizes];
                        updated[idx].price = Number(e.target.value);
                        setSizes(updated);
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                      className="btn-outline px-2 py-2 text-xs text-rose-700 dark:text-rose-400"
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {sizes.length === 0 && (
                <p className="text-xs text-cacao-900/50 dark:text-creme/50">No sizes. Add sizes for different pricing options.</p>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-4 text-sm font-medium text-rose-700 dark:text-rose-400"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-4 text-sm font-medium text-green-700 dark:text-green-400"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary mt-6 w-full justify-center"
          type="button"
          disabled={pending}
          onClick={save}
        >
          {pending ? "..." : editingId ? "Save changes" : "Create"}
        </motion.button>
      </motion.div>
    </div>
  );
}

