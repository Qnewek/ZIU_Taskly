import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Fab, Tooltip, Dialog, DialogContent,
  DialogTitle, IconButton, Alert,
} from '@mui/material';
import AddIcon   from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm, TaskFormData } from '../components/forms/TaskForm';
import { useTaskContext } from '../context/TaskContext';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import type { Task } from '../types/task.types';

interface Props {
  isLoading:   boolean;
  onAdd:       (data: TaskFormData) => Promise<void>;
  onShowToast: (msg: string, sev: 'success' | 'error') => void;
}

export function TasksPage({ isLoading, onAdd, onShowToast }: Props) {
  const navigate  = useNavigate();
  const { dispatch } = useTaskContext();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [editTask,  setEditTask]  = useState<Task | null>(null);
  const [editOpen,  setEditOpen]  = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const handleEdit = (task: Task) => { setEditTask(task); setEditOpen(true); };
  const handleClose = () => { setEditOpen(false); setEditTask(null); };

  const handleUpdate = async (data: TaskFormData) => {
    if (!editTask) return;
    try {
      const updated = { ...editTask, ...data, dueDate: data.dueDate ?? null };
      await updateTask.mutateAsync(updated);
      dispatch({ type: 'UPDATE', payload: updated });
      onShowToast('Zadanie zaktualizowane!', 'success');
      handleClose();
    } catch {
      onShowToast('Błąd podczas aktualizacji', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      dispatch({ type: 'DELETE', payload: id });
      onShowToast('Zadanie usunięte', 'success');
      setDeleteErr(null);
    } catch {
      setDeleteErr('Nie udało się usunąć zadania. Spróbuj ponownie.');
      onShowToast('Błąd podczas usuwania', 'error');
    }
  };

  const handleDone = async (task: Task) => {
    const updated = { ...task, status: 'done' as const };
    try {
      await updateTask.mutateAsync(updated);
      dispatch({ type: 'SET_STATUS', payload: { id: task.id, status: 'done' } });
      onShowToast('Zadanie ukończone! 🎉', 'success');
    } catch {
      onShowToast('Błąd podczas aktualizacji statusu', 'error');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Typography variant="h4" fontWeight={700} gutterBottom>Zadania</Typography>

      {deleteErr && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }} onClose={() => setDeleteErr(null)}>
          {deleteErr}
        </Alert>
      )}

      <TaskList
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDone={handleDone}
      />

      <Tooltip title="Dodaj zadanie">
        <Fab
          color="primary"
          aria-label="Dodaj nowe zadanie"
          onClick={() => navigate('/tasks/new')}
          component={motion.button}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          sx={{ position: 'fixed', bottom: { xs: 80, md: 32 }, right: 24 }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <AnimatePresence>
        {editOpen && (
          <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth
            aria-labelledby="edit-dialog-title"
            PaperProps={{ component: motion.div, initial: { opacity:0, scale:0.96 }, animate: { opacity:1, scale:1 }, exit: { opacity:0, scale:0.96 } }}>
            <DialogTitle id="edit-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Edytuj zadanie
              <IconButton onClick={handleClose} aria-label="Zamknij dialog">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box pt={1}>
                <TaskForm
                  defaultValues={editTask ?? undefined}
                  onSubmit={handleUpdate}
                  onCancel={handleClose}
                  isSubmitting={updateTask.isPending}
                  title=""
                />
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
