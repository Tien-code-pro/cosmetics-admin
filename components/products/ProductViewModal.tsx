// components/products/ProductViewModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/type/product";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductViewModal({ product, onClose }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Khi mở sản phẩm khác thì luôn quay về ảnh đầu tiên
  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  if (!product) return null;

  const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

  const images = product.images || [];

  const currentImage = images[selectedImage] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900">
              {product.name}
            </h2>

            <p className="mt-1 text-xs text-slate-400">Chi tiết sản phẩm</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[calc(90vh-73px)] overflow-y-auto">
          <div className="space-y-7 p-6">
            {/* ========================= */}
            {/* IMAGE */}
            {/* ========================= */}

            {images.length > 0 && (
              <div>
                {/* ẢNH CHÍNH */}
                <div className="flex h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* THUMBNAILS */}
                {images.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-slate-50 transition ${
                          selectedImage === index
                            ? "border-blue-500 ring-2 ring-blue-100"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-contain"
                        />

                        {index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-blue-600/90 px-1 py-0.5 text-center text-[9px] font-medium text-white">
                            Ảnh chính
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================= */}
            {/* BASIC INFORMATION */}
            {/* ========================= */}

            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Thông tin sản phẩm
                </h3>

                <div className="mt-1 h-0.5 w-10 rounded-full bg-blue-600" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* SKU */}
                <InfoItem label="SKU" value={product.sku} />

                {/* GIÁ */}
                <InfoItem
                  label="Giá bán"
                  value={formatPrice(product.price)}
                  valueClassName="text-blue-600 text-base"
                />

                {/* TỒN KHO */}
                <InfoItem
                  label="Tồn kho"
                  value={`${product.stock ?? 0} sản phẩm`}
                  valueClassName={
                    product.stock > 0 ? "text-emerald-600" : "text-red-600"
                  }
                />

                {/* DANH MỤC */}
                <InfoItem
                  label="Danh mục"
                  value={product.category?.name || "—"}
                />

                {/* THƯƠNG HIỆU */}
                <InfoItem label="Thương hiệu" value={product.brand || "—"} />

                {/* XUẤT XỨ */}
                <InfoItem label="Xuất xứ" value={product.origin || "—"} />
              </div>
            </div>

            {/* ========================= */}
            {/* SHORT DESCRIPTION */}
            {/* ========================= */}

            {product.shortDescription && (
              <ContentSection title="Mô tả ngắn">
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: product.shortDescription,
                  }}
                />
              </ContentSection>
            )}

            {/* ========================= */}
            {/* DESCRIPTION */}
            {/* ========================= */}

            {product.description && (
              <ContentSection title="Mô tả chi tiết">
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              </ContentSection>
            )}

            {/* ========================= */}
            {/* INGREDIENTS */}
            {/* ========================= */}

            {product.ingredients && (
              <ContentSection title="Thành phần">
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: product.ingredients,
                  }}
                />
              </ContentSection>
            )}

            {/* ========================= */}
            {/* USAGE */}
            {/* ========================= */}

            {product.usageInstructions && (
              <ContentSection title="Hướng dẫn sử dụng">
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: product.usageInstructions,
                  }}
                />
              </ContentSection>
            )}

            {/* ========================= */}
            {/* SPECIFICATIONS */}
            {/* ========================= */}

            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <ContentSection title="Thông số kỹ thuật">
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(product.specifications).map(
                          ([key, value], index) => (
                            <tr
                              key={key}
                              className={
                                index % 2 === 0 ? "bg-slate-50" : "bg-white"
                              }
                            >
                              <td className="w-1/3 border-b border-slate-200 px-4 py-3 font-medium text-slate-500">
                                {key}
                              </td>

                              <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                                {value}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </ContentSection>
              )}

            {/* ========================= */}
            {/* FOOTER */}
            {/* ========================= */}

            <div className="flex justify-end border-t pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* INFO ITEM */
/* ========================= */

function InfoItem({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>

      <p className={`break-words font-medium text-slate-700 ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

/* ========================= */
/* CONTENT SECTION */
/* ========================= */

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>

        <div className="mt-1 h-0.5 w-10 rounded-full bg-blue-600" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        {children}
      </div>
    </div>
  );
}
