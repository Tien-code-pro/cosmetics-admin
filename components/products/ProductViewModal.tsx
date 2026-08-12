// components/products/ProductViewModal.tsx
"use client";

import { Product } from "@/type/product";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductViewModal({ product, onClose }: Props) {
  if (!product) return null;

  const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          {product.images?.[0] && (
            <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>

            <div>
              <p className="text-slate-400">Giá</p>
              <p className="font-medium">{formatPrice(product.price)}</p>
            </div>

            <div>
              <p className="text-slate-400">Thương hiệu</p>
              <p className="font-medium">{product.brand || "—"}</p>
            </div>

            <div>
              <p className="text-slate-400">Xuất xứ</p>
              <p className="font-medium">{product.origin || "—"}</p>
            </div>
          </div>

          {product.shortDescription && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Mô tả ngắn</h3>

              <div
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: product.shortDescription,
                }}
              />
            </div>
          )}

          {product.description && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Mô tả chi tiết</h3>

              <div
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            </div>
          )}

          {product.ingredients && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Thành phần</h3>

              <div
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: product.ingredients,
                }}
              />
            </div>
          )}

          {product.usageInstructions && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Hướng dẫn sử dụng</h3>

              <div
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: product.usageInstructions,
                }}
              />
            </div>
          )}

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Thông số kỹ thuật
                </h3>

                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <tr key={key} className="border-b border-slate-100">
                          <td className="py-2 pr-4 text-slate-400">{key}</td>

                          <td className="py-2 font-medium text-slate-700">
                            {value}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
