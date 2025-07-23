export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  image?: string;
}

export interface TodoSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
  searchResults: TodoItem[];
}

export interface TodosPageProps {
  todos: TodoItem[];
  error?: { message: string };
}
