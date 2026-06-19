import { motion } from 'framer-motion';
import {
  Card, CardContent, CardActions, Typography, Chip, IconButton,
  Box, Tooltip, LinearProgress,
} from '@mui/material';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon  from '@mui/icons-material/Check';
import { listItem } from '../../animations/variants';
import type { Task } from '../../types/task.types';
import { format, isPast, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const PRIORITY_COLOR: Record<string, 'error' | 'warning' | 'success'> = {
  high: 'error', medium: 'warning', low: 'success',
};
const PRIORITY_LABEL: Record<string, string> = {
  high: 'Wysoki', medium: 'Średni', low: 'Niski',
};
const STATUS_COLOR: Record<string, 'default' | 'primary' | 'success'> = {
  todo: 'default', 'in-progress': 'primary', done: 'success',
};
const STATUS_LABEL: Record<string, string> = {
  todo: 'Do zrobienia', 'in-progress': 'W toku', done: 'Ukończone',
};

interface Props {
  task:     Task;
  onEdit:   (t: Task) => void;
  onDelete: (id: string) => void;
  onDone:   (t: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onDone }: Props) {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'done';

  return (
    <motion.div variants={listItem} whileHover={{ y: -2 }} layout>
      <Card
        sx={{
          opacity: task.status === 'done' ? 0.7 : 1,
          borderLeft: 4,
          borderColor: `${PRIORITY_COLOR[task.priority]}.main`,
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: 4 },
        }}
      >
        {task.status === 'in-progress' && <LinearProgress variant="indeterminate" sx={{ height: 2 }} />}
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ textDecoration: task.status === 'done' ? 'line-through' : 'none', flex: 1 }}
            >
              {task.title}
            </Typography>
            <Chip label={PRIORITY_LABEL[task.priority]} color={PRIORITY_COLOR[task.priority]} size="small" />
          </Box>

          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip label={STATUS_LABEL[task.status]} color={STATUS_COLOR[task.status]} size="small" variant="outlined" />
            {task.dueDate && (
              <Chip
                label={`📅 ${format(parseISO(task.dueDate), 'd MMM yyyy', { locale: pl })}`}
                size="small"
                color={isOverdue ? 'error' : 'default'}
                variant={isOverdue ? 'filled' : 'outlined'}
              />
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
          {task.status !== 'done' && (
            <Tooltip title="Oznacz jako ukończone">
              <IconButton
                size="small"
                color="success"
                onClick={() => onDone(task)}
                aria-label={`Oznacz "${task.title}" jako ukończone`}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edytuj">
            <IconButton size="small" onClick={() => onEdit(task)} aria-label={`Edytuj zadanie: ${task.title}`}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń">
            <IconButton size="small" color="error" onClick={() => onDelete(task.id)} aria-label={`Usuń zadanie: ${task.title}`}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </motion.div>
  );
}
