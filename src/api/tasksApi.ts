import axios from 'axios';
import type { Task } from '../types/task.types';

const BASE = '/api';

export const api = {
  getTasks:    ()              => axios.get<Task[]>(`${BASE}/tasks`).then(r => r.data),
  createTask:  (t: Omit<Task,'id'|'createdAt'|'updatedAt'>) =>
    axios.post<Task>(`${BASE}/tasks`, t).then(r => r.data),
  updateTask:  (t: Task)      => axios.put<Task>(`${BASE}/tasks/${t.id}`, t).then(r => r.data),
  deleteTask:  (id: string)   => axios.delete(`${BASE}/tasks/${id}`),
};
