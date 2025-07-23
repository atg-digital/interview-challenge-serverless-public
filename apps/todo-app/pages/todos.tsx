import {
  Box,
  Container,
  Grid2 as Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import TodoSearch from '../components/TodoSearch';
import TodoCard from '../components/TodoCard';
import Pagination from '../components/Pagination';
import { useTodoApi } from '../hooks/useTodoApi';
import { usePagination } from '../hooks/usePagination';
import type { TodoItem, TodosPageProps } from '../types/todo';

export default function TodosPage({ todos, error }: TodosPageProps) {
  const [todosList, setTodosList] = useState<TodoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const todosPerPage = 9;

  const {
    loading,
    searchResults,
    setSearchResults,
    isSearching,
    searchTodos,
    updateTodoStatus,
    deleteTodo,
  } = useTodoApi();

  const {
    currentPage,
    pagedItems: todosPaged,
    handlePrevious,
    handleNext,
    resetToFirstPage,
  } = usePagination(searchQuery ? searchResults : todosList, todosPerPage);

  useEffect(() => {
    setTodosList(todos);
  }, [todos]);

  const handleStatusChange = (id: string, task: string, completed: boolean) => {
    updateTodoStatus(id, task, !completed, (updatedTodo) => {
      setTodosList((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );

      setSearchResults((prevResults) =>
        prevResults.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    });
  };

  const handleDelete = (id: string) => {
    deleteTodo(id, () => {
      setTodosList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setSearchResults((prevResults) =>
        prevResults.filter((todo) => todo.id !== id)
      );
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchTodos(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    resetToFirstPage();
  };

  if (error) {
    return <div>Error fetching TODOs: {error.message}</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        TODOs List
      </Typography>

      <TodoSearch
        onSearch={handleSearch}
        onClear={clearSearch}
        isSearching={isSearching}
        searchResults={searchResults}
      />

      {/* TODOs Grid */}
      <Grid container spacing={2}>
        {todosPaged.length === 0 && searchQuery && !isSearching ? (
          <Grid size={{ xs: 12 }}>
            <Paper>
              <Box p={3} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No TODOs found matching "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Try a different search term or clear the search to see all
                  TODOs.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ) : (
          todosPaged.map((todo) => (
            <Grid key={todo.id} size={{ xs: 6, md: 4, xl: 3 }}>
              <TodoCard
                todo={todo}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                loading={loading}
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={searchQuery ? searchResults.length : todos.length}
        itemsPerPage={todosPerPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<
  TodosPageProps
> = async () => {
  try {
    const res = await fetch(`${process.env.LAMBDA_API_ENDPOINT}/todos`);

    if (!res.ok) {
      throw new Error('Failed to fetch TODOs');
    }

    const response = await res.json();
    const todos: TodoItem[] = response.items || [];

    return {
      props: {
        todos: todos,
      },
    };
  } catch (error) {
    return {
      props: {
        todos: [],
        error: { message: (error as Error).message },
      },
    };
  }
};
