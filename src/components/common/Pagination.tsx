import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  totalItems,
}) => {
  if (totalPages <= 1 && (!onLimitChange || !totalItems)) {
    return null;
  }

  // Generate intelligent page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="fb-pagination-container">
      {/* Items per page selector if enabled */}
      {onLimitChange && limit && (
        <div className="fb-pagination-limit-wrap">
          <span className="fb-pagination-limit-label">Show:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="fb-pagination-select"
            aria-label="Items per page"
          >
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>
          {totalItems !== undefined && (
            <span className="fb-pagination-total-info">({totalItems} total)</span>
          )}
        </div>
      )}

      {/* Page navigation buttons */}
      {totalPages > 1 && (
        <nav className="fb-pagination-nav" aria-label="Pagination Navigation">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="fb-page-arrow-btn"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            <span className="hide-mobile">Prev</span>
          </button>

          <div className="fb-page-numbers-group">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="fb-page-ellipsis">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isCurrent = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`fb-page-number-btn ${isCurrent ? 'active' : ''}`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="fb-page-arrow-btn"
            title="Next page"
            aria-label="Next page"
          >
            <span className="hide-mobile">Next</span>
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
