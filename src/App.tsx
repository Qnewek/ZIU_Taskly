import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { muiTheme } from './theme/muiTheme';
import { TaskProvider } from './context/TaskContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage }     from './pages/TasksPage';
import { NewTaskPage }   from './pages/NewTaskPage';
import { SettingsPage }  from './pages/SettingsPage';
import { ToastStack }    from './components/common/ToastStack';
import { useToast }      from './hooks/useToast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api/tasksApi';
import { useTaskContext } from './context/TaskContext';
import { useEffect } from 'react';
import type { TaskFormData } from './components/forms/TaskForm';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 2, staleTime: 60_000 } } });

function InnerApp() {
  const location             = useLocation();
  const { dispatch }         = useTaskContext();
  const { toasts, showToast, closeToast } = useToast();
  const queryClient          = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn:  async () => {
      const data = await api.getTasks();
      data.forEach(task => dispatch({ type: 'ADD', payload: task }));
      return data;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: api.createTask,
    onSuccess: (task) => {
      dispatch({ type: 'ADD', payload: task });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Zadanie dodane!', 'success');
    },
    onError: () => showToast('Błąd podczas dodawania zadania', 'error'),
  });

  const handleAdd = async (data: TaskFormData) => {
    await createMutation.mutateAsync({
      title:       data.title,
      description: data.description ?? '',
      priority:    data.priority,
      status:      data.status,
      dueDate:     data.dueDate ?? null,
    });
  };

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<DashboardPage />} />
          <Route path="/tasks"      element={<TasksPage isLoading={isLoading} onAdd={handleAdd} onShowToast={showToast} />} />
          <Route path="/tasks/new"  element={<NewTaskPage onAdd={handleAdd} isSubmitting={createMutation.isPending} />} />
          <Route path="/settings"   element={<SettingsPage onShowToast={showToast} />} />
        </Routes>
      </AnimatePresence>
      <ToastStack toasts={toasts} onClose={closeToast} />
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <TaskProvider>
            <InnerApp />
          </TaskProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
