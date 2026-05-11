"use client";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState, useTransition, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { GripVertical, Upload, X, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import Image from "next/image";

type ProductsResponse = { products: Product[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [order, setOrder] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetForm = () => {
    setEditingId(null);
    setSlug("");
    setNameFr("");
    setNameAr("");
    setDescFr("");
    setDescAr("");
    setPrice(0);
    setImage("/images/placeholder-cookies.svg");
    setImagePreview("");
    setCategory("Cookies");
    setTags("");
    setFeatured(false);
    setInStock(true);
    setOrder(0);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = (await res.json()) as ProductsResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      const sortedProducts = (data.products || []).sort((a, b) => {
        const orderA = (a as any).order ?? 0;
        const orderB = (b as any).order ?? 0;
        return orderA - orderB;
      });
      setProducts(sortedProducts);
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
    setImagePreview(editing.image);
    setCategory(editing.category);
    setTags((editing.tags || []).join(", "));
    setFeatured(Boolean(editing.featured));
    setInStock(editing.inStock !== false);
    setOrder((editing as any).order ?? 0);
  }, [editing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.url);
      setSuccess("Image uploaded successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setImagePreview("");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    setImage("/images/placeholder-cookies.svg");
    setImagePreview("");
  };

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
          image,
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          featured,
          inStock,
          order: order,
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
        setSuccess(editingId ? "Product updated successfully" : "Product created successfully");
        setTimeout(() => setSuccess(null), 3000);
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
        setSuccess("Product deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over?.id);
      
      const newProducts = arrayMove(products, oldIndex, newIndex);
      const updatedProducts = newProducts.map((product, index) => ({
        ...product,
        order: index,
      }));
      
      setProducts(updatedProducts);
      
      try {
        const res = await fetch("/api/admin/products/reorder", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ products: updatedProducts.map((p) => ({ id: p.id, order: p.order })) }),
        });
        
        if (!res.ok) throw new Error("Failed to save order");
        
        setSuccess("Products reordered successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save order");
        await load();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_480px]">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <button className="btn-outline px-4 py-2 text-xs" type="button" onClick={load}>
            Refresh
          </button>
        </div>
        
        {success && (
          <div className="mb-3 p-2 text-sm text-green-700 bg-green-50 rounded-lg">
            {success}
          </div>
        )}
        
        {loading ? (
          <p className="text-sm">Loading…</p>
        ) : error ? (
          <p className="text-sm font-medium text-rose-700">{error}</p>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <GripVertical className="h-3 w-3" />
              Drag the dots to reorder products
            </p>
            <div className="overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={products.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-500">
                      <tr>
                        <th className="py-2 pr-2 w-8"></th>
                        <th className="py-2 pr-3">Image</th>
                        <th className="py-2 pr-3">Name (FR)</th>
                        <th className="py-2 pr-3">Price</th>
                        <th className="py-2 pr-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product) => (
                        <SortableProductRow
                          key={product.id}
                          product={product}
                          onEdit={() => setEditingId(product.id)}
                          onDelete={() => remove(product.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            </div>
          </>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">{editingId ? "Edit product" : "Create product"}</h2>
          {editingId && (
            <button className="btn-outline px-4 py-2 text-xs" type="button" onClick={resetForm}>
              New
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Product Image</label>
            
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">No image selected</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-caramel-600 text-white rounded-lg cursor-pointer hover:bg-caramel-700"
              >
                <Upload className="h-4 w-4" />
                {uploadingImage ? "Uploading..." : "Choose Image"}
              </label>
            </div>
          </div>

          <label className="text-sm block">
            Order (position)
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </label>
          
          <label className="text-sm block">
            Slug
            <input className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </label>
          
          <label className="text-sm block">
            Name (FR)
            <input className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" value={nameFr} onChange={(e) => setNameFr(e.target.value)} />
          </label>
          
          <label className="text-sm block">
            Name (AR)
            <input className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
          </label>
          
          <label className="text-sm block">
            Description (FR)
            <textarea className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" rows={2} value={descFr} onChange={(e) => setDescFr(e.target.value)} />
          </label>
          
          <label className="text-sm block">
            Description (AR)
            <textarea className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} />
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm block">
              Price (TND)
              <input
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>
            <label className="text-sm block">
              Category
              <input className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)} />
            </label>
          </div>
          
          <label className="text-sm block">
            Tags (comma-separated)
            <input className="mt-1 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm" value={tags} onChange={(e) => setTags(e.target.value)} />
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

// Composant pour la ligne du tableau
function SortableProductRow({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="py-2 pr-2 cursor-grab align-middle" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-gray-400" />
      </td>
      <td className="py-2 pr-3 align-middle">
        <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name.fr}
            fill
            className="object-cover"
          />
        </div>
      </td>
      <td className="py-2 pr-3 font-medium align-middle">{product.name.fr}</td>
      <td className="py-2 pr-3 align-middle">{product.price} DT</td>
      <td className="py-2 pr-3 align-middle">
        <div className="flex gap-2">
          <button className="btn-outline px-3 py-1 text-xs" type="button" onClick={onEdit}>
            Edit
          </button>
          <button className="btn-outline px-3 py-1 text-xs text-rose-600" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}