import {
  Box,
  Button,
  Grid2 as Grid,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, KeyboardEvent, ChangeEvent } from 'react';
import type { TodoSearchProps } from '../types/todo';

const ThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.status?.active?.main,
  '&:hover': {
    backgroundColor: theme.status?.active?.dark,
  },
}));

export default function TodoSearch({
  onSearch,
  onClear,
  isSearching,
  searchResults,
}: TodoSearchProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query);
    onClear(); // clear search when typing
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box mb={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            label="Search TODOs"
            variant="outlined"
            value={inputValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter search term and press Enter or click Search..."
            disabled={isSearching}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box display="flex" gap={1}>
            <ThemedButton
              variant="contained"
              onClick={handleSearch}
              disabled={!inputValue.trim() || isSearching}
              sx={{ flex: 1 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </ThemedButton>
            <ThemedButton
              variant="outlined"
              onClick={handleClear}
              disabled={!inputValue}
              sx={{ flex: 1 }}
            >
              Clear
            </ThemedButton>
          </Box>
        </Grid>
      </Grid>

      {/* Search Status */}
      {isSearching && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Searching...
        </Typography>
      )}
      {inputValue && !isSearching && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Found {searchResults.length} result
          {searchResults.length !== 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  );
}
