import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, TextField, InputAdornment, ToggleButtonGroup, ToggleButton,
  Select, MenuItem, FormControl, InputLabel, Typography, Skeleton,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TaskCard } from './TaskCard';
import { listContainer } from '../../animations/variants';
import { useTaskContext } from '../../context/TaskContext';
import { useFilteredTasks } from '../../hooks/useTasks';
import type { Task, FilterType, SortType } from '../../types/task.types';

interface Props {
  isLoading: boolean;
  onEdit:   (t: Task) => void;
  onDelete: (id: string) => void;
  onDone:   (t: Task) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all',         label: 'Wszystkie' },
  { value: 'todo',        label: 'Do zrobienia' },
  { value: 'in-progress', label: 'W toku' },
  { value: 'done',        label: 'Ukończone' },
];

export function TaskList({ isLoading, onEdit, onDelete, onDone }: Props) {
  const { filter, setFilter, sort, setSort, search, setSearch } = useTaskContext();
  const tasks = useFilteredTasks();

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Szukaj zadań…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          aria-label="Wyszukaj zadanie"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="sort-label">Sortuj</InputLabel>
          <Select
            labelId="sort-label"
            value={sort}
            label="Sortuj"
            onChange={e => setSort(e.target.value as SortType)}
            inputProps={{ 'aria-label': 'Sortuj zadania' }}
          >
            <MenuItem value="createdAt">Najnowsze</MenuItem>
            <MenuItem value="dueDate">Termin</MenuItem>
            <MenuItem value="priority">Priorytet</MenuItem>
            <MenuItem value="title">Alfabetycznie</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, v) => v && setFilter(v)}
        size="small"
        sx={{ mb: 3, flexWrap: 'wrap' }}
        aria-label="Filtruj zadania według statusu"
      >
        {FILTERS.map(f => (
          <ToggleButton key={f.value} value={f.value} aria-label={f.label}>
            {f.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {isLoading && (
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} />
          ))}
        </Stack>
      )}

      {!isLoading && tasks.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {search ? 'Brak wyników wyszukiwania' : 'Brak zadań w tej kategorii'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search ? 'Spróbuj zmienić frazę wyszukiwania' : 'Dodaj nowe zadanie klikając przycisk +'}
          </Typography>
        </Box>
      )}

      {!isLoading && tasks.length > 0 && (
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="visible"
        >
          <Stack spacing={2}>
            <AnimatePresence mode="popLayout">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDone={onDone}
                />
              ))}
            </AnimatePresence>
          </Stack>
        </motion.div>
      )}
    </Box>
  );
}
