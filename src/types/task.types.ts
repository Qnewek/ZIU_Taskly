export type Priority = 'low' | 'medium' | 'high';
export type Status   = 'todo' | 'in-progress' | 'done';

export interface Task {
  id:          string;
  title:       string;
  description: string;
  priority:    Priority;
  status:      Status;
  dueDate:     string | null;
  createdAt:   string;
  updatedAt:   string;
}

export type TaskAction =
  | { type: 'SET';    payload: Task[] }
  | { type: 'ADD';    payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE'; payload: Task }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_STATUS'; payload: { id: string; status: Status } };

export type FilterType = 'all' | Status;
export type SortType   = 'createdAt' | 'dueDate' | 'priority' | 'title';
