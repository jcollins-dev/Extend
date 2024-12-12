import { useState } from 'react';

interface Returns {
  onPageChange: (page: number) => void;
  pageNumber: number;
}

/**
 * Utility hook used in conjunction with Pagination component, to handle page change events
 * and set the offset to be used in paginated queries
 */
const usePaginatedQueryOffset = (): Returns => {
  const [pageNumber, setPage] = useState(0);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return {
    onPageChange,
    pageNumber
  };
};

export default usePaginatedQueryOffset;
