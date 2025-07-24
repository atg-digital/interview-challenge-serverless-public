import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';

interface CreateTodoFormProps {
  onSubmit: (task: string) => void;
  loading: boolean;
}

export default function CreateTodoForm({
  onSubmit,
  loading,
}: CreateTodoFormProps) {
  const [task, setTask] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.trim()) {
      setError('Please enter a task');
      return;
    }

    setError('');
    onSubmit(task.trim());
    setTask('');
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Todo
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Task"
          value={task}
          onChange={handleTaskChange}
          disabled={loading}
          placeholder="Enter a new task..."
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !task.trim()}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Creating...' : 'Create Todo'}
        </Button>
      </Box>
    </Paper>
  );
}
