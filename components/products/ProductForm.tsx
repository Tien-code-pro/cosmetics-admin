// components/products/ProductForm.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Category, Product, Spec } from "@/type/product";

const RichTextEditor = dynamic(() => import("../RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-slate-50" />
  ),
});

const initialForm = {
  name: "",
  slug: "",
  sku: "",
  price: "",
  stock: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  ingredients: "",
  usageInstructions: "",
  brand: "",
  origin: "",
};

type FormData = typeof initialForm;

interface ProductFormProps {
  categories: Category[];
  editingProduct: Product | null;
  submitting: boolean;
  onSubmit: (data: {
    form: FormData;
    specs: Spec[];
    imageFile: File | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  categories,
  editingProduct,
  submitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const editingId = editingProduct?.id ?? null;

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialForm);
      setSpecs([]);
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setForm({
      name: editingProduct.name,
      slug: editingProduct.slug,
      sku: editingProduct.sku,
      price: String(editingProduct.price),
      stock: String(editingProduct.stock),
      categoryId: editingProduct.categoryId || "",
      shortDescription: editingProduct.shortDescription || "",
      description: editingProduct.description || "",
      ingredients: editingProduct.ingredients || "",
      usageInstructions: editingProduct.usageInstructions || "",
      brand: editingProduct.brand || "",
      origin: editingProduct.origin || "",
    });

    setSpecs(
      editingProduct.specifications
        ? Object.entries(editingProduct.specifications).map(([key, value]) => ({
            key,
            value,
          }))
        : [],
    );

    setImageFile(null);
    setImagePreview(editingProduct.images?.[0] || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [editingProduct]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addSpec = () => {
    setSpecs((prev) => [
      ...prev,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    setSpecs((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    try {
      setUploading(!!imageFile);

      await onSubmit({
        form,
        specs,
        imageFile,
      });
    } catch (error: any) {
      console.error(error);
      setFormError(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`mb-8 rounded-2xl border bg-white p-6 shadow-sm ${
        editingId
          ? "border-amber-300 ring-2 ring-amber-100"
          : "border-slate-200"
      }`}
    >
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

      {formError && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          ⚠️ {formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* THÔNG TIN CƠ BẢN */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tên sản phẩm
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Kem dưỡng ABC"
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Slug
            </label>

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="kem-duong-abc"
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              SKU
            </label>

            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              placeholder="SKU001"
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* GIÁ / KHO / DANH MỤC */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Giá bán
            </label>

            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tồn kho
            </label>

            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Danh mục
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

        {/* ẢNH */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Ảnh sản phẩm
          </label>

          <div className="flex gap-4">
            <label
              htmlFor="product-image"
              className="group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Ảnh sản phẩm"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="mb-2 text-2xl">📷</div>

                  <span className="text-xs text-slate-600">Chọn ảnh</span>
                </div>
              )}

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-700">
                {imagePreview ? "Ảnh sản phẩm" : "Tải ảnh sản phẩm lên"}
              </p>

              <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP</p>

              {uploading && (
                <p className="mt-2 text-xs text-blue-600">
                  Đang tải ảnh lên...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MÔ TẢ */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mô tả ngắn
            </label>

            <RichTextEditor
              value={form.shortDescription}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  shortDescription: value,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Hướng dẫn sử dụng
            </label>

            <RichTextEditor
              value={form.usageInstructions}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  usageInstructions: value,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mô tả chi tiết
            </label>

            <RichTextEditor
              value={form.description}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Thành phần
            </label>

            <RichTextEditor
              value={form.ingredients}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  ingredients: value,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Thương hiệu
            </label>

            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Xuất xứ
            </label>

            <input
              name="origin"
              value={form.origin}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* SPEC */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Thông số kỹ thuật
            </label>

            <button
              type="button"
              onClick={addSpec}
              className="text-sm font-medium text-blue-600"
            >
              + Thêm thông số
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  placeholder="Tên thông số"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, "key", e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
                />

                <input
                  placeholder="Giá trị"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
                />

                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="rounded-lg border border-red-100 px-3 text-sm text-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-6 flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="h-11 rounded-lg border border-slate-300 px-5 text-sm"
            >
              Hủy
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting
              ? "Đang lưu..."
              : editingId
                ? "Cập nhật sản phẩm"
                : "Thêm sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
