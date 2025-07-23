import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.status?.active?.main,
  '&:hover': {
    backgroundColor: theme.status?.active?.dark,
  },
}));

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPrevious,
  onNext,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isLastPage = currentPage === totalPages;

  return (
    <Box mt={2}>
      <ThemedButton
        onClick={onPrevious}
        variant="contained"
        disabled={currentPage === 1}
      >
        Previous
      </ThemedButton>
      <Typography variant="body1" component="span" mx={2}>
        Page {currentPage}
      </Typography>
      <ThemedButton onClick={onNext} variant="contained" disabled={isLastPage}>
        Next
      </ThemedButton>
    </Box>
  );
}
