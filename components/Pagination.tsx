"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center px-5 py-5">
      <div className="flex items-center gap-1.5">
        {/* PREVIOUS */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="
            cursor-pointer flex h-9 w-9 items-center justify-center
            rounded-lg border border-slate-200
            bg-white text-slate-500
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Trang trước"
        >
          ←
        </button>

        {/* PAGES */}
        {pages.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="
                  flex h-9 w-9 items-center justify-center
                  text-sm text-slate-400
                "
              >
                …
              </span>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`
                cursor-pointer
                flex h-9 min-w-9 items-center justify-center
                rounded-lg border
                px-2.5 text-sm font-medium
                transition
                ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="
            cursor-pointer flex h-9 w-9 items-center justify-center
            rounded-lg border border-slate-200
            bg-white text-slate-500
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Trang sau"
        >
          →
        </button>
      </div>
    </div>
  );
}
