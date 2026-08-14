"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";
import { Category, Product, Spec } from "@/type/product";

import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import ProductViewModal from "@/components/products/ProductViewModal";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

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

type ProductMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const initialMeta: ProductMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export default function ProductsPage() {
  // =========================
  // DATA
  // =========================

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // =========================
  // UI STATE
  // =========================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [formResetKey, setFormResetKey] = useState(0);

  // =========================
  // SEARCH / FILTER
  // =========================

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState<ProductMeta>(initialMeta);

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "10");

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if (categoryFilter) {
        params.set("categoryId", categoryFilter);
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const [productsRes, categoriesRes] = await Promise.all([
        api.get(`/products?${params.toString()}`),
        api.get("/categories?limit=100"),
      ]);

      // Products
      setProducts(productsRes.data);
      setMeta(productsRes.meta);

      // Categories dùng cho dropdown/filter
      setCategories(categoriesRes.data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        return;
      }

      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, categoryFilter, statusFilter]);

  // =========================
  // SEARCH / FILTER HANDLERS
  // =========================

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    // Search mới => quay về trang đầu
    setPage(1);
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

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
  // CREATE / UPDATE PRODUCT
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

      // Upload ảnh
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map((file) => uploadImage(file)),
        );
      }

      // Specifications
      const specifications = specs.reduce(
        (acc, { key, value }) => {
          if (key.trim()) {
            acc[key.trim()] = value;
          }

          return acc;
        },
        {} as Record<string, string>,
      );

      // Payload
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

        status: form.isActive ? "active" : "inactive",
      };

      // Update
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, payload);
      }

      // Create
      else {
        await api.post("/products", payload);
      }

      setEditingProduct(null);
      setFormResetKey((prev) => prev + 1);

      await loadData();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        return;
      }

      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");

      // alert(error instanceof Error ? error.message : "Không thể lưu sản phẩm");
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

      // Nếu xóa sản phẩm cuối cùng của page
      // thì quay về page trước
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadData();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        return;
      }

      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      // console.error("Lỗi xóa sản phẩm:", error);

      // alert(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";

    // Optimistic UI
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              status: newStatus,
            }
          : p,
      ),
    );

    try {
      await api.patch(`/products/${product.id}`, {
        status: newStatus,
      });
    } catch (error) {
      // Rollback
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                status: product.status,
              }
            : p,
        ),
      );
      if (error instanceof ApiError) {
        toast.error(error.message);
        return;
      }

      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      // alert(
      //   error instanceof Error
      //     ? error.message
      //     : "Không thể cập nhật trạng thái",
      // );
    }
  };

  // =========================
  // RENDER
  // =========================

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

        {/* PRODUCT LIST */}

        <ProductList
          products={products}
          categories={categories}
          loading={loading}
          search={search}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          meta={meta}
          onSearchChange={handleSearchChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onPageChange={setPage}
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
