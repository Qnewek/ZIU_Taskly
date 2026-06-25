import { createContext, useContext, useReducer, useState, ReactNode } from 'react';
import type { Task, TaskAction, FilterType, SortType } from '../types/task.types';

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      return [{ ...action.payload, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...state];
    case 'UPDATE':
      return state.map(t => t.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    case 'SET_STATUS':
      return state.map(t => t.id === action.payload.id ? { ...t, status: action.payload.status, updatedAt: new Date().toISOString() } : t);
    default:
      return state;
  }
}

interface TaskContextType {
  tasks:     Task[];
  dispatch:  (a: TaskAction) => void;
  filter:    FilterType;
  setFilter: (f: FilterType) => void;
  sort:      SortType;
  setSort:   (s: SortType) => void;
  search:    string;
  setSearch: (s: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children, initialTasks = [] }: { children: ReactNode; initialTasks?: Task[] }) {
  const [tasks,   dispatch]  = useReducer(taskReducer, initialTasks);
  const [filter,  setFilter] = useState<FilterType>('all');
  const [sort,    setSort]   = useState<SortType>('createdAt');
  const [search,  setSearch] = useState('');

  return (
    <TaskContext.Provider value={{ tasks, dispatch, filter, setFilter, sort, setSort, search, setSearch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext musi być użyty wewnątrz <TaskProvider>');
  return ctx;
}
