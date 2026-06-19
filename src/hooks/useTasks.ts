import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/tasksApi';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types/task.types';
import { useEffect } from 'react';

const TASKS_KEY = ['tasks'] as const;

export function useTasks() {
  const { dispatch } = useTaskContext();

  const query = useQuery({
    queryKey: TASKS_KEY,
    queryFn:  api.getTasks,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });

  useEffect(() => {
    if (query.data) {
      query.data.forEach(task => dispatch({ type: 'ADD', payload: task }));
    }
  }, [query.data]);

  return query;
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createTask,
    onSuccess:  () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateTask,
    onSuccess:  () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess:  () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useFilteredTasks() {
  const { tasks, filter, sort, search } = useTaskContext();

  let result = [...tasks];

  const seen = new Set<string>();
  result = result.filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });

  if (filter !== 'all') result = result.filter(t => t.status === filter);
  if (search.trim())    result = result.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
  result.sort((a, b) => {
    if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (sort === 'title')    return a.title.localeCompare(b.title);
    if (sort === 'dueDate')  return (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999');
    return b.createdAt.localeCompare(a.createdAt);
  });

  return result;
}
