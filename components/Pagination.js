import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Jika hanya ada 1 halaman, tidak perlu menampilkan pagination
  if (totalPages <= 1) return null;
  
  // Buat array halaman yang akan ditampilkan
  const getPageNumbers = () => {
    const pages = [];
    
    // Selalu tampilkan halaman pertama
    pages.push(1);
    
    // Tambahkan ellipsis jika diperlukan
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Tambahkan halaman di sekitar halaman saat ini
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Tambahkan ellipsis jika diperlukan
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Selalu tampilkan halaman terakhir jika lebih dari 1 halaman
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-6 space-x-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === page
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
} 