"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Category, Product, Spec } from "@/type/product";

import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import ProductViewModal from "@/components/products/ProductViewModal";

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
  isActive: true,
};

type FormData = typeof initialForm;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sản phẩm đang sửa
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sản phẩm đang xem
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [formResetKey, setFormResetKey] = useState(0);

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

  // =========================
  // UPLOAD IMAGE
  // =========================

  const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();

    formData.append("file", imageFile);

    const token = localStorage.getItem("access_token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(err.message || "Upload ảnh thất bại");
    }

    const data = await res.json();

    return data.url;
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmitProduct = async ({
    form,
    specs,
    imageFiles,
    existingImages,
  }: {
    form: FormData;
    specs: Spec[];
    imageFiles: File[];
    existingImages: string[];
  }) => {
    try {
      setSubmitting(true);

      // =========================
      // UPLOAD TẤT CẢ ẢNH
      // =========================

      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map((file) => uploadImage(file)),
        );
      }

      // =========================
      // SPECIFICATIONS
      // =========================

      const specifications = specs.reduce(
        (acc, { key, value }) => {
          if (key.trim()) {
            acc[key.trim()] = value;
          }

          return acc;
        },
        {} as Record<string, string>,
      );

      // =========================
      // PAYLOAD
      // =========================

      const finalImages = [...existingImages, ...imageUrls];

      const payload = {
        name: form.name,
        slug: form.slug,
        sku: form.sku,
        price: Number(form.price),
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
        stock: Number(form.stock) || 0,

        categoryId: form.categoryId || undefined,

        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        ingredients: form.ingredients || undefined,
        usageInstructions: form.usageInstructions || undefined,
        brand: form.brand || undefined,
        origin: form.origin || undefined,

        ...(Object.keys(specifications).length ? { specifications } : {}),

        images: finalImages,
        skinType: form.skinType.length > 0 ? form.skinType : undefined,
        status: form.isActive ? "active" : "inactive", // thêm dòng này
      };

      // =========================
      // CREATE / UPDATE
      // =========================

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setEditingProduct(null);
      setFormResetKey((prev) => prev + 1);

      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }

      await loadData();
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";

    // Cập nhật ngay trên UI, không load lại toàn bộ (giống Category)
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p)),
    );

    try {
      await api.patch(`/products/${product.id}`, { status: newStatus });
    } catch (error: any) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, status: product.status } : p,
        ),
      );
      alert(error.message || "Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">
              🛍️
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Quản lý sản phẩm
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Quản lý thông tin, giá bán và tồn kho
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <ProductForm
          categories={categories}
          editingProduct={editingProduct}
          submitting={submitting}
          onSubmit={handleSubmitProduct}
          onCancel={() => setEditingProduct(null)}
          key={formResetKey}
        />

        {/* LIST */}

        <ProductList
          products={products}
          loading={loading}
          onView={(product) => setViewingProduct(product)}
          onEdit={(product) => setEditingProduct(product)}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

        {/* VIEW MODAL */}

        <ProductViewModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      </div>
    </div>
  );
}
