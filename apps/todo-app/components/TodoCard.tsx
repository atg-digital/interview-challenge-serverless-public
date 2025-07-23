import {
  Box,
  Checkbox,
  ListItem,
  ListItemText,
  Paper,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TodoItem } from '../types/todo';

const ThemedCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.status?.active?.main,
  '&:hover': {
    color: theme.status?.active?.dark,
  },
  '&.Mui-checked': {
    color: theme.status?.active?.main,
  },
}));

interface TodoCardProps {
  todo: TodoItem;
  onStatusChange: (id: string, task: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function TodoCard({
  todo,
  onStatusChange,
  onDelete,
  loading,
}: TodoCardProps) {
  return (
    <Paper>
      <Box
        style={{
          width: '100%',
          height: '200px',
          backgroundImage: `url(${todo.image})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <ListItem>
        <ThemedCheckbox
          checked={todo.completed}
          onChange={() => onStatusChange(todo.id, todo.task, todo.completed)}
          disabled={loading}
        />
        <ListItemText
          primary={todo.task}
          secondary={todo.completed ? 'Completed' : 'Pending'}
        />
        <Button
          onClick={() => onDelete(todo.id)}
          disabled={loading}
          color="error"
          size="small"
          variant="outlined"
        >
          Delete
        </Button>
      </ListItem>
    </Paper>
  );
}
