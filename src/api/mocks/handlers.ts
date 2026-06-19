import { http, HttpResponse, delay } from 'msw';
import type { Task } from '../../types/task.types';

let tasks: Task[] = [
  { id:'1', title:'Zaprojektować makiety hi-fi', description:'Wszystkie ekrany w Figma zgodnie z wymaganiami Lab 3.', priority:'high',   status:'done',        dueDate:'2025-04-20', createdAt:'2025-04-01T10:00:00Z', updatedAt:'2025-04-01T10:00:00Z' },
  { id:'2', title:'Skonfigurować projekt Vite',  description:'Tryb strict, ESLint, React 18, MUI.',                  priority:'high',   status:'done',        dueDate:'2025-04-25', createdAt:'2025-04-05T08:00:00Z', updatedAt:'2025-04-05T08:00:00Z' },
  { id:'3', title:'Implementacja formularzy',    description:'React Hook Form + Zod, walidacja kliencka.',           priority:'high',   status:'in-progress', dueDate:'2025-06-20', createdAt:'2025-05-10T09:00:00Z', updatedAt:'2025-05-10T09:00:00Z' },
  { id:'4', title:'Audyt dostępności WCAG',      description:'Lighthouse + axe, score ≥ 90.',                       priority:'medium', status:'in-progress', dueDate:'2025-06-22', createdAt:'2025-05-12T10:00:00Z', updatedAt:'2025-05-12T10:00:00Z' },
  { id:'5', title:'Deployment na Vercel',        description:'CI/CD, zmienne środowiskowe, publiczny URL.',          priority:'medium', status:'todo',        dueDate:'2025-06-18', createdAt:'2025-05-14T11:00:00Z', updatedAt:'2025-05-14T11:00:00Z' },
  { id:'6', title:'Napisać README.md',           description:'Opis projektu, technologie, instrukcja uruchomienia.', priority:'low',   status:'todo',        dueDate:'2025-06-18', createdAt:'2025-05-15T12:00:00Z', updatedAt:'2025-05-15T12:00:00Z' },
];

export const handlers = [
  http.get('/api/tasks', async () => {
    await delay(400);
    return HttpResponse.json(tasks);
  }),

  http.post('/api/tasks', async ({ request }) => {
    await delay(300);
    const body = await request.json() as Omit<Task,'id'|'createdAt'|'updatedAt'>;
    const newTask: Task = { ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    tasks = [newTask, ...tasks];
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put('/api/tasks/:id', async ({ request, params }) => {
    await delay(300);
    const body = await request.json() as Task;
    tasks = tasks.map(t => t.id === params.id ? { ...body, updatedAt: new Date().toISOString() } : t);
    return HttpResponse.json(tasks.find(t => t.id === params.id));
  }),

  http.delete('/api/tasks/:id', async ({ params }) => {
    await delay(200);
    tasks = tasks.filter(t => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
