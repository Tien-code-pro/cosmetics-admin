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
  isActive: true, // thêm dòng này, mặc định true
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
      isActive: editingProduct.status !== "inactive", // true nếu không phải inactive
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
      className={`mb-8 overflow-hidden rounded-2xl border bg-white shadow-sm ${
        editingId
          ? "border-amber-300 ring-2 ring-amber-100"
          : "border-slate-200"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                  editingId
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {editingId ? "✏️" : "📦"}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  {editingId
                    ? "Cập nhật thông tin và cấu hình sản phẩm"
                    : "Nhập đầy đủ thông tin để tạo sản phẩm mới"}
                </p>
              </div>
            </div>
          </div>

          {editingId && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Đang chỉnh sửa
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ================= BASIC INFO ================= */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Thông tin cơ bản
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Thông tin định danh của sản phẩm
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ví dụ: Kem dưỡng ABC"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* SLUG */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug <span className="text-red-500">*</span>
              </label>

              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="kem-duong-abc"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Đường dẫn hiển thị của sản phẩm
              </p>
            </div>

            {/* SKU */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                SKU <span className="text-red-500">*</span>
              </label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                placeholder="SKU001"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Mã định danh riêng của sản phẩm
              </p>
            </div>
          </div>
        </div>

        {/* ================= PRICE / STOCK ================= */}
        <div className="border-b border-slate-200 bg-slate-50/40 p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Giá & kho hàng
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Thiết lập giá bán, giá gốc và số lượng tồn kho
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* PRICE */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Giá bán <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="200000"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  VNĐ
                </span>
              </div>
            </div>

            {/* ORIGINAL PRICE */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Giá gốc
              </label>

              <div className="relative">
                <input
                  name="originalPrice"
                  type="number"
                  min="0"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="250000"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  VNĐ
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Dùng khi sản phẩm có giảm giá
              </p>
            </div>

            {/* STOCK */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
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
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Số lượng sản phẩm hiện có
              </p>
            </div>

            {/* CATEGORY */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Danh mục
              </label>

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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

          {/* STATUS */}
          {/* STATUS */}
          <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  form.isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {form.isActive ? "✓" : "−"}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Trạng thái hiển thị
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {form.isActive
                    ? "Sản phẩm đang được hiển thị trên trang bán hàng"
                    : "Sản phẩm đang được ẩn khỏi trang bán hàng"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
              className="flex shrink-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
            >
              <span
                className={`relative block h-6 w-11 shrink-0 rounded-full transition-colors ${
                  form.isActive ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    form.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>

              <span
                className={`whitespace-nowrap text-sm font-medium ${
                  form.isActive ? "text-blue-600" : "text-slate-500"
                }`}
              >
                {form.isActive ? "Đang hiển thị" : "Đang ẩn"}
              </span>
            </button>
          </div>
        </div>

        {/* ================= IMAGES ================= */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Hình ảnh sản phẩm
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Hình ảnh đầu tiên sẽ được sử dụng làm ảnh chính
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {imagePreviews.length}/6 ảnh
            </span>
          </div>

          <div className="flex flex-col gap-5 xl:flex-row">
            {/* MAIN IMAGE */}
            <label
              htmlFor="product-image"
              className="group relative flex h-64 w-full max-w-[260px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              {imagePreviews[0] ? (
                <>
                  <img
                    src={imagePreviews[0]}
                    alt="Ảnh chính"
                    className="h-full w-full object-contain"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10">
                    <span className="inline-flex rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
                      Ảnh chính
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    📷
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Chọn ảnh chính
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG hoặc WEBP
                  </p>
                </div>
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

            {/* OTHER IMAGES */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-3">
                {imagePreviews.slice(1).map((preview, index) => (
                  <div
                    key={preview + index}
                    className="group relative h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
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
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                    >
                      ✕
                    </button>

                    <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                      Ảnh {index + 2}
                    </div>
                  </div>
                ))}

                {/* ADD IMAGE */}
                {imagePreviews.length < 6 && (
                  <label
                    htmlFor="product-image"
                    className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-light">+</div>

                      <div className="mt-1 text-xs font-medium">Thêm ảnh</div>
                    </div>
                  </label>
                )}
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">
                  Tối đa <span className="font-semibold">6 ảnh</span>. Ảnh đầu
                  tiên sẽ được sử dụng làm ảnh chính.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Định dạng hỗ trợ: JPG, PNG, WEBP
                </p>

                {uploading && (
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    Đang tải ảnh lên...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="border-b border-slate-200 bg-slate-50/40 p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Nội dung sản phẩm
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Mô tả chi tiết và thông tin hướng dẫn cho khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* SHORT DESCRIPTION */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <label className="text-sm font-semibold text-slate-700">
                  Mô tả ngắn
                </label>

                <p className="mt-0.5 text-xs text-slate-400">
                  Nội dung giới thiệu ngắn về sản phẩm
                </p>
              </div>

              <div className="p-3">
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
            </div>

            {/* USAGE */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <label className="text-sm font-semibold text-slate-700">
                  Hướng dẫn sử dụng
                </label>

                <p className="mt-0.5 text-xs text-slate-400">
                  Cách sử dụng và lưu ý khi sử dụng sản phẩm
                </p>
              </div>

              <div className="p-3">
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
            </div>

            {/* DESCRIPTION */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <label className="text-sm font-semibold text-slate-700">
                  Mô tả chi tiết
                </label>

                <p className="mt-0.5 text-xs text-slate-400">
                  Thông tin đầy đủ về sản phẩm
                </p>
              </div>

              <div className="p-3">
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
            </div>

            {/* INGREDIENTS */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <label className="text-sm font-semibold text-slate-700">
                  Thành phần
                </label>

                <p className="mt-0.5 text-xs text-slate-400">
                  Các thành phần có trong sản phẩm
                </p>
              </div>

              <div className="p-3">
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
            </div>
          </div>
        </div>

        {/* ================= ADDITIONAL INFO ================= */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Thông tin bổ sung
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Thương hiệu, xuất xứ và đối tượng sử dụng
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* BRAND */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Thương hiệu
              </label>

              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ví dụ: La Roche-Posay"
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* ORIGIN */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Xuất xứ
              </label>

              <input
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="Ví dụ: Pháp"
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* SKIN TYPE */}
            <div className="lg:col-span-2">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Loại da phù hợp
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map((type) => {
                    const isSelected = form.skinType.includes(type);

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSkinType(type)}
                        className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {isSelected && <span className="mr-1.5">✓</span>}
                        {type}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Có thể chọn nhiều loại da phù hợp với sản phẩm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SPECIFICATIONS ================= */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Thông số kỹ thuật
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Thêm các thông số hoặc đặc điểm kỹ thuật của sản phẩm
              </p>
            </div>

            <button
              type="button"
              onClick={addSpec}
              className="w-fit cursor-pointer rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
            >
              + Thêm thông số
            </button>
          </div>

          {specs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center">
              <div className="mb-2 text-2xl">📋</div>

              <p className="text-sm font-medium text-slate-600">
                Chưa có thông số kỹ thuật
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Nhấn "Thêm thông số" để bắt đầu
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <div className="min-w-[650px]">
                <div className="grid grid-cols-[1fr_1fr_90px] border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tên thông số
                  </div>

                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Giá trị
                  </div>

                  <div />
                </div>

                <div className="divide-y divide-slate-100 bg-white">
                  {specs.map((spec, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_90px] gap-3 px-4 py-3"
                    >
                      <input
                        placeholder="Ví dụ: Dung tích"
                        value={spec.key}
                        onChange={(e) =>
                          updateSpec(index, "key", e.target.value)
                        }
                        className="h-10 min-w-0 rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      <input
                        placeholder="Ví dụ: 50ml"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpec(index, "value", e.target.value)
                        }
                        className="h-10 min-w-0 rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="h-10 cursor-pointer rounded-lg border border-red-100 bg-white px-3 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= ERROR ================= */}
        {formError && (
          <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-base">⚠️</span>

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Không thể lưu sản phẩm
                </p>

                <p className="mt-0.5 text-sm text-red-600">{formError}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="flex flex-col-reverse gap-3 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="h-11 cursor-pointer rounded-xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Hủy
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 cursor-pointer rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
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
