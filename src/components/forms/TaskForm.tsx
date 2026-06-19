// Lab 7 integration: React Hook Form + Zod, wszystkie pola walidowane
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Typography, Stack, Divider, CircularProgress,
} from '@mui/material';
import SaveIcon   from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Task, Priority, Status } from '../../types/task.types';

const taskSchema = z.object({
  title:       z.string().min(2, 'Tytuł musi mieć co najmniej 2 znaki').max(100, 'Tytuł zbyt długi'),
  description: z.string().max(500, 'Opis zbyt długi').optional().default(''),
  priority:    z.enum(['low', 'medium', 'high']),
  status:      z.enum(['todo', 'in-progress', 'done']),
  dueDate:     z.string().optional().nullable(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface Props {
  defaultValues?: Partial<Task>;
  onSubmit:       (data: TaskFormData) => Promise<void>;
  onCancel:       () => void;
  isSubmitting?:  boolean;
  title:          string;
}

export function TaskForm({ defaultValues, onSubmit, onCancel, isSubmitting, title }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title:       defaultValues?.title       ?? '',
      description: defaultValues?.description ?? '',
      priority:    (defaultValues?.priority   ?? 'medium') as Priority,
      status:      (defaultValues?.status     ?? 'todo')   as Status,
      dueDate:     defaultValues?.dueDate     ?? '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        title:       defaultValues.title       ?? '',
        description: defaultValues.description ?? '',
        priority:    defaultValues.priority    ?? 'medium',
        status:      defaultValues.status      ?? 'todo',
        dueDate:     defaultValues.dueDate     ?? '',
      });
    }
  }, [defaultValues, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" fontWeight={700} gutterBottom>{title}</Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2.5}>
        {/* Tytuł */}
        <TextField
          {...register('title')}
          label="Tytuł zadania *"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          inputProps={{ 'aria-required': 'true', 'aria-describedby': errors.title ? 'title-error' : undefined }}
          FormHelperTextProps={{ id: 'title-error', role: 'alert' }}
          autoFocus
        />

        <TextField
          {...register('description')}
          label="Opis (opcjonalny)"
          fullWidth
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel id="priority-label">Priorytet *</InputLabel>
                <Select {...field} labelId="priority-label" label="Priorytet *"
                  inputProps={{ 'aria-required': 'true', 'aria-label': 'Wybierz priorytet' }}>
                  <MenuItem value="high">🔴 Wysoki</MenuItem>
                  <MenuItem value="medium">🟡 Średni</MenuItem>
                  <MenuItem value="low">🟢 Niski</MenuItem>
                </Select>
                {errors.priority && <FormHelperText role="alert">{errors.priority.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select {...field} labelId="status-label" label="Status"
                  inputProps={{ 'aria-label': 'Wybierz status zadania' }}>
                  <MenuItem value="todo">Do zrobienia</MenuItem>
                  <MenuItem value="in-progress">W toku</MenuItem>
                  <MenuItem value="done">Ukończone</MenuItem>
                </Select>
                {errors.status && <FormHelperText role="alert">{errors.status.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Stack>

        <TextField
          {...register('dueDate')}
          label="Termin realizacji"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'aria-label': 'Wybierz termin realizacji' }}
          error={!!errors.dueDate}
          helperText={errors.dueDate?.message}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" pt={1}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Anuluj i wróć"
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            aria-label="Zapisz zadanie"
          >
            {isSubmitting ? 'Zapisywanie…' : 'Zapisz zadanie'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
