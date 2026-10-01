"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<LoadState>("loading");
  
  // 1. เพิ่ม State สำหรับเก็บ ID สินค้าที่กำลังแก้ไข
  const [editingId, setEditingId] = useState<number | null>(null);

  // 2. ค้นหาข้อมูลสินค้าที่กำลังแก้ไขส่งให้ ProductForm
  const editing = products.find((item) => item.id === editingId) ?? null;

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  // 3. ปรับปรุง saveProduct ให้รองรับทั้งเพิ่มและแก้ไข
  function saveProduct(draft: ProductDraft) {
    if (editingId !== null) {
      setProducts(
        products.map((item) =>
          item.id === editingId ? { ...draft, id: editingId } : item
        )
      );
      setEditingId(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  // 4. ฟังก์ชันสำหรับลบสินค้า
 function removeProduct(id: number) {
  // สร้าง Array ใหม่โดยกรองรายการที่ต้องการลบออก (Immutable)
  setProducts(products.filter((item) => item.id !== id));
  
  // หากรายการที่กำลังแก้ไขโดนลบ ให้สลับกลับสู่โหมดเพิ่มสินค้า
  if (editingId === id) {
    setEditingId(null);
  }
}

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 text-slate-100">
      {/* Header & Control Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            รายการสินค้า
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            จัดการและดูรายการสินค้าทั้งหมดในระบบ
          </p>
        </div>

        <ProductSearchForm onSearch={loadProducts} />

        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูล"}
        </button>
      </div>

      {/* Content Section */}
      <section aria-live="polite">
        {status === "idle" && (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-800 rounded-xl">
            คลิกปุ่มโหลดข้อมูลเพื่อเริ่มแสดงรายการ
          </div>
        )}

        {status === "loading" && products.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            กำลังดึงข้อมูลรายการสินค้า...
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
            {errorMessage}
          </div>
        )}

        {status === "ready" && products.length === 0 && (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-800 rounded-xl">
            ไม่พบสินค้าที่ตรงกับเงื่อนไข
          </div>
        )}

        {/* 5. ส่ง editing และ onCancel ให้ ProductForm */}
        <section className="mt-2 mb-4 rounded-xl border border-slate-400 bg-slate-900/60 p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
          </h2>
          <ProductForm
            key={editingId ?? "new"}
            editing={editing}
            onSave={saveProduct}
            onCancel={() => setEditingId(null)} // สลับกลับเป็นโหมดเพิ่มสินค้าเมื่อกดลบ/ยกเลิก
/>
        </section>

        {status === "ready" && products.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">รูปภาพ</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">ชื่อสินค้า</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">ราคา ($)</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-center">คงเหลือ</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">หมวดหมู่</th>
                  {/* เพิ่มคอลัมน์จัดการ */}
                  <th scope="col" className="px-5 py-3.5 font-semibold text-center">จัดการ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-white">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-md flex items-center justify-center">
                          <span className="text-slate-500 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{item.title}</td>
                    <td className="px-5 py-4 text-right font-mono text-emerald-400">
                      ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock < 10 
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800/50" 
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 capitalize">
                        {item.category}
                      </span>
                    </td>
                    {/* 6. เพิ่มปุ่มแก้ไขและลบในแถวของตาราง */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(item.id)}
                          className="px-2.5 py-1 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProduct(item.id)}
                          className="px-2.5 py-1 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}