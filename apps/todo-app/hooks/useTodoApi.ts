import { useState, useCallback } from 'react';
import type { TodoItem } from '../types/todo';

export function useTodoApi() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TodoItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTodos = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT}/todos/search?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search TODOs');
      }

      const results = await response.json();
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching TODOs:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const updateTodoStatus = useCallback(
    async (
      id: string,
      task: string,
      completed: boolean,
      onUpdate: (updatedTodo: TodoItem) => void
    ) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT}/todos/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task, completed }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update TODO');
        }

        const updatedTodo: TodoItem = await response.json();
        onUpdate(updatedTodo);
      } catch (error) {
        console.error('Error updating TODO:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    searchResults,
    setSearchResults,
    isSearching,
    searchTodos,
    updateTodoStatus,
  };
}
