import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        marginTop: '2.5rem',
      }}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '0.4rem 0.6rem' }}
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{
              minWidth: '34px',
              padding: '0.4rem 0.5rem',
              fontWeight: isCurrent ? 700 : 500,
            }}
          >
            {page}
          </button>
        );
      })}

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '0.4rem 0.6rem' }}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
