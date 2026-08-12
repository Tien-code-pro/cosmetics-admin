// components/products/ProductForm.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Category, Product, Spec } from "@/type/product";
import { SKIN_TYPES } from "@/app/lib/constants";

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
  originalPrice: "",
  skinType: [] as string[],
};

type FormData = typeof initialForm;

interface ProductFormProps {
  categories: Category[];
  editingProduct: Product | null;
  submitting: boolean;
  onSubmit: (data: {
    form: FormData;
    specs: Spec[];
    imageFiles: File[];
    existingImages: string[];
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const editingId = editingProduct?.id ?? null;

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialForm);
      setSpecs([]);
      setImageFiles([]);
      setExistingImages([]);
      setImagePreviews([]);
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
      originalPrice: editingProduct.originalPrice
        ? String(editingProduct.originalPrice)
        : "",
      skinType: editingProduct.skinType || [],
    });

    setSpecs(
      editingProduct.specifications
        ? Object.entries(editingProduct.specifications).map(([key, value]) => ({
            key,
            value,
          }))
        : [],
    );

    const oldImages = editingProduct.images || [];

    setImageFiles([]);
    setExistingImages(oldImages);
    setImagePreviews(oldImages);

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

  const toggleSkinType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter((t) => t !== type)
        : [...prev.skinType, type],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (imagePreviews.length + files.length > 6) {
      setFormError("Bạn chỉ được chọn tối đa 6 ảnh");
      e.target.value = "";
      return;
    }

    setFormError("");

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...files]);

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
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
      setUploading(imageFiles.length > 0);

      await onSubmit({
        form,
        specs,
        imageFiles,
        existingImages,
      });
    } catch (error: any) {
      console.error(error);
      setFormError(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];

    if (!preview) return;

    // Ảnh cũ trên server
    if (existingImages.includes(preview)) {
      setExistingImages((prev) => prev.filter((image) => image !== preview));
    } else {
      // Ảnh mới vừa chọn
      const newFileIndex = imagePreviews
        .slice(0, index)
        .filter((image) => !existingImages.includes(image)).length;

      setImageFiles((prev) => prev.filter((_, i) => i !== newFileIndex));

      URL.revokeObjectURL(preview);
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

      {/* {formError && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          ⚠️ {formError}
        </div>
      )} */}

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
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
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
              placeholder="200.000"
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Giá gốc (nếu có giảm giá)
            </label>
            <input
              name="originalPrice"
              type="number"
              min="0"
              value={form.originalPrice}
              onChange={handleChange}
              placeholder="250.000"
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
              placeholder="200"
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

          <div className="flex flex-wrap gap-4">
            {/* ẢNH CHÍNH */}
            <label
              htmlFor="product-image"
              className="relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50"
            >
              {imagePreviews[0] ? (
                <img
                  src={imagePreviews[0]}
                  alt="Ảnh chính"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="mb-2 text-3xl">📷</div>

                  <p className="text-sm font-medium text-slate-600">
                    Ảnh chính
                  </p>

                  <p className="mt-1 text-xs text-slate-400">Chọn ảnh</p>
                </div>
              )}

              {imagePreviews[0] && (
                <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                  Ảnh chính
                </span>
              )}

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* ẢNH PHỤ */}
            <div className="flex flex-wrap gap-3">
              {imagePreviews.slice(1).map((preview, index) => (
                <div
                  key={preview + index}
                  className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                >
                  <img
                    src={preview}
                    alt={`Ảnh sản phẩm ${index + 2}`}
                    className="h-full w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const actualIndex = index + 1;
                      removeImage(actualIndex);
                    }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Ô thêm ảnh */}
              {imagePreviews.length < 6 && (
                <label
                  htmlFor="product-image"
                  className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="text-center">
                    <div className="text-2xl">+</div>

                    <div className="mt-1 text-xs">Thêm ảnh</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-slate-500">
              Tối đa 6 ảnh. Ảnh đầu tiên sẽ được sử dụng làm ảnh chính.
            </p>

            <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP</p>

            {uploading && (
              <p className="mt-2 text-xs text-blue-600">Đang tải ảnh lên...</p>
            )}
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
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Loại da phù hợp
            </label>
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPES.map((type) => {
                const isSelected = form.skinType.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleSkinType(type)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
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
        {formError && (
          <div className="mt-5 mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            ⚠️ {formError}
          </div>
        )}

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
