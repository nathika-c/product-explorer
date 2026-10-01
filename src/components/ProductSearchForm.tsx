"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm(
  { onSearch }: ProductSearchFormProps
) {

    //==v1
//   const { register } = useForm<SearchQuery>({
//     defaultValues: defaultQuery,
//   });

    //==v2
    // const {
    //     register,
    //     formState: { errors },
    // } = useForm<SearchQuery>({
    //     // เติม: ตัวเชื่อมที่ทำให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
    //     resolver: zodResolver(SearchQuerySchema),
    //     mode: "onTouched",
    //     defaultValues: defaultQuery,
    // });


    const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });


  return (
    <form 
      onSubmit={handleSubmit(onSearch)} 
      noValidate 
      className="flex flex-wrap items-center gap-4 p-4 bg-gray-900 rounded-lg"
    >
      {/* ช่องค้นหา */}
      <div className="flex items-center gap-2">
        <label htmlFor="q" className="text-sm font-medium text-gray-300">คำค้น</label>
        <input
          id="q"
          {...register("q")}
          placeholder="phone"
          className="px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* จำนวนรายการ */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm font-medium text-gray-300">จำนวนรายการ</label>
          <input
            id="limit"
            type="number"
            required
            {...register("limit", { valueAsNumber: true })}
            aria-invalid={!!errors.limit}
            aria-describedby="limit-error"
            className="w-20 px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        {errors.limit && (
          <span id="limit-error" role="alert" className="text-xs text-red-500">
            {errors.limit.message}
          </span>
        )}
      </div>

      {/* เรียงตาม */}
      <div className="flex items-center gap-2">
        <label htmlFor="sortBy" className="text-sm font-medium text-gray-300">เรียงตาม</label>
        <select
          id="sortBy"
          {...register("sortBy")}
          className="px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      {/* ปุ่มค้นหา */}
      <button 
        type="submit" 
        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
      >
        ค้นหา
      </button>
    </form>
  );
}
