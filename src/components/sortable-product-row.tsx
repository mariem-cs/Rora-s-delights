// app/admin/products/sortable-product-row.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface SortableProductRowProps {
  product: Product;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableProductRow({ product, index, onEdit, onDelete }: SortableProductRowProps) {
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
    <tr ref={setNodeRef} style={style} className={isDragging ? "bg-gray-50" : ""}>
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
        <div className="flex flex-wrap gap-2">
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