import { useState, useEffect } from 'react';
import type { TodoItem } from '../types/todo';

export function usePagination(items: TodoItem[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pagedItems, setPagedItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPagedItems(items.slice(indexOfFirstItem, indexOfLastItem));
  }, [items, currentPage, itemsPerPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    pagedItems,
    handlePrevious,
    handleNext,
    resetToFirstPage,
  };
}
