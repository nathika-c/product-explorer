"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};
export default function ProductForm(
  { editing, onSave, onCancel }: ProductFormProps
) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? { title: editing.title, price: editing.price,
          stock: editing.stock, category: editing.category }
      : { title: "", price: undefined, stock: undefined },
  });

    function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
    }


  return (
  <form onSubmit={handleSubmit(saveProduct)} className="space-y-4">
    {/* จัด Grid ให้อินพุตแบ่งเป็น 4 คอลัมน์บนจอใหญ่ และ 1-2 คอลัมน์บนจอมือถือ/แท็บเล็ต */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. ชื่อสินค้า */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-slate-300">
          ชื่อสินค้า <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          required
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
          placeholder="เช่น iPhone 15 Pro"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        {errors.title && (
          <span id="title-error" role="alert" className="text-xs text-red-400">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* 2. ราคา */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="price" className="text-sm font-medium text-slate-300">
          ราคา <span className="text-red-400">*</span>
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          required
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
          aria-describedby="price-error"
          placeholder="0.00"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        {errors.price && (
          <span id="price-error" role="alert" className="text-xs text-red-400">
            {errors.price.message}
          </span>
        )}
      </div>

      {/* 3. จำนวนคงเหลือ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="stock" className="text-sm font-medium text-slate-300">
          จำนวนคงเหลือ <span className="text-red-400">*</span>
        </label>
        <input
          id="stock"
          type="number"
          required
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
          aria-describedby="stock-error"
          placeholder="0"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        {errors.stock && (
          <span id="stock-error" role="alert" className="text-xs text-red-400">
            {errors.stock.message}
          </span>
        )}
      </div>

      {/* 4. หมวดหมู่ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-slate-300">
          หมวดหมู่ <span className="text-red-400">*</span>
        </label>
        <select
          id="category"
          required
          {...register("category")}
          aria-invalid={!!errors.category}
          aria-describedby="category-error"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="" disabled className="text-slate-500">
            กรุณาเลือกหมวดหมู่
          </option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name} className="bg-slate-800 text-white">
              {name}
            </option>
          ))}
        </select>
        {errors.category && (
          <span id="category-error" role="alert" className="text-xs text-red-400">
            {errors.category.message}
          </span>
        )}
      </div>

    </div>

    {/* ปุ่มกด Action อยู่ด้านล่างชิดขวา */}
    <div className="flex items-center justify-end gap-3 pt-2">
      {editing && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
        >
          ยกเลิก
        </button>
      )}

      <button
        type="submit"
        disabled={!isDirty || !isValid}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg border border-transparent transition-all shadow-sm"
      >
        {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
      </button>
    </div>
  </form>
);
}
