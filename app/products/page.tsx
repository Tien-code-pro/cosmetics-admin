"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string | null;
  category?: Category;
};

const initialForm = {
  name: "",
  slug: "",
  sku: "",
  price: "",
  stock: "",
  categoryId: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsData, categoriesData] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        name: form.name,
        slug: form.slug,
        sku: form.sku,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        categoryId: form.categoryId || undefined,
      };

      if (editingId) {
        await api.patch(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await api.delete(`/products/${id}`);

      if (editingId === id) {
        resetForm();
      }

      await loadData();
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Hết hàng",
        className: "bg-red-50 text-red-700",
        dotClassName: "bg-red-500",
      };
    }

    if (stock <= 10) {
      return {
        label: "Sắp hết",
        className: "bg-amber-50 text-amber-700",
        dotClassName: "bg-amber-500",
      };
    }

    return {
      label: "Còn hàng",
      className: "bg-emerald-50 text-emerald-700",
      dotClassName: "bg-emerald-500",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-sm">
              🛍️
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Quản lý sản phẩm
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Quản lý thông tin, giá bán và tồn kho sản phẩm
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div
          className={`mb-8 rounded-2xl border bg-white p-6 shadow-sm ${
            editingId
              ? "border-amber-300 ring-2 ring-amber-100"
              : "border-slate-200"
          }`}
        >
          {/* Form header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Cập nhật thông tin sản phẩm"
                  : "Nhập thông tin để tạo sản phẩm mới"}
              </p>
            </div>

            {editingId && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Đang chỉnh sửa
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tên sản phẩm
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Ví dụ: Kem dưỡng ABC"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Slug
                </label>

                <input
                  name="slug"
                  type="text"
                  placeholder="kem-duong-abc"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  SKU
                </label>

                <input
                  name="sku"
                  type="text"
                  placeholder="SKU001"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-mono text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Giá bán
                </label>

                <div className="relative">
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="199000"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    đ
                  </span>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tồn kho
                </label>

                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={form.stock}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Danh mục
                </label>

                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">-- Chọn danh mục --</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Hủy
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang lưu...
                  </span>
                ) : editingId ? (
                  "Cập nhật sản phẩm"
                ) : (
                  "Thêm sản phẩm"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================= PRODUCT LIST ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* List Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Danh sách sản phẩm
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : `${products.length} sản phẩm`}
              </p>
            </div>

            {!loading && products.length > 0 && (
              <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                {products.length} sản phẩm
              </div>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-6 px-6 py-5">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                  </div>

                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="ml-auto h-9 w-28 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                🛍️
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                Chưa có sản phẩm
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Hãy thêm sản phẩm đầu tiên để bắt đầu quản lý kho hàng.
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Sản phẩm
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      SKU
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Giá bán
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tồn kho
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Danh mục
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);

                    return (
                      <tr
                        key={product.id}
                        className="group transition hover:bg-slate-50"
                      >
                        {/* Product */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
                              📦
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-6 py-5">
                          <code className="rounded-md bg-slate-100 px-2.5 py-1.5 text-sm text-slate-600">
                            {product.sku}
                          </code>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-5">
                          <span className="font-semibold text-slate-900">
                            {formatPrice(product.price)}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium text-slate-900">
                              {product.stock}
                            </p>

                            <span
                              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${stockStatus.dotClassName}`}
                              />

                              {stockStatus.label}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-5">
                          {product.category ? (
                            <span className="inline-flex items-center rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Chưa phân loại
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              ✏️
                              <span>Sửa</span>
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              🗑️
                              <span>Xóa</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && products.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <p className="text-sm text-slate-500">
                Tổng cộng{" "}
                <span className="font-semibold text-slate-700">
                  {products.length}
                </span>{" "}
                sản phẩm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
