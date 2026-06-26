import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, CardContent, Typography, Box, Button,
  LinearProgress, Fab, Tooltip, Stack, Divider, Chip,
} from '@mui/material';
import AddIcon         from '@mui/icons-material/Add';
import TaskAltIcon     from '@mui/icons-material/TaskAlt';
import HourglassIcon   from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListIcon        from '@mui/icons-material/List';
import { motion } from 'framer-motion';
import { pageVariants, listContainer, listItem } from '../animations/variants';
import { useTaskContext } from '../context/TaskContext';
import { format, parseISO, isPast } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Task } from '../types/task.types';

interface StatCardProps { label: string; value: number; color: string; icon: React.ReactNode; total?: number; }
function StatCard({ label, value, color, icon, total }: StatCardProps) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <motion.div variants={listItem}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
              <Typography variant="h3" fontWeight={700} color={color}>{value}</Typography>
            </Box>
            <Box sx={{ bgcolor: `${color}22`, p: 1.5, borderRadius: 3, color }}>{icon}</Box>
          </Box>
          {total !== undefined && (
            <>
              <LinearProgress variant="determinate" value={pct} sx={{ mb: 0.5, borderRadius: 4, bgcolor: `${color}22`, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
              <Typography variant="caption" color="text.secondary">{pct}% wszystkich zadań</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

const PRIORITY_COLOR: Record<string, string> = { high: '#d32f2f', medium: '#ed6c02', low: '#2e7d32' };
const STATUS_LABEL:   Record<string, string> = { todo: 'Do zrobienia', 'in-progress': 'W toku', done: 'Ukończone' };

function RecentTaskRow({ task }: { task: Task }) {
  const overdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'done';
  return (
    <motion.div variants={listItem}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
        <Box sx={{ width: 4, height: 40, borderRadius: 2, bgcolor: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
            {task.title}
          </Typography>
          <Typography variant="caption" color={overdue ? 'error' : 'text.secondary'}>
            {STATUS_LABEL[task.status]}
            {task.dueDate && ` · ${format(parseISO(task.dueDate), 'd MMM', { locale: pl })}`}
            {overdue && ' · ⚠ Przekroczony termin'}
          </Typography>
        </Box>
        <Chip label={task.status === 'done' ? '✓' : task.status === 'in-progress' ? '→' : '○'}
          size="small" color={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'primary' : 'default'} />
      </Box>
      <Divider />
    </motion.div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { tasks } = useTaskContext();

  const total    = tasks.length;
  const todo     = tasks.filter(t => t.status === 'todo').length;
  const inProg   = tasks.filter(t => t.status === 'in-progress').length;
  const done     = tasks.filter(t => t.status === 'done').length;
  const overdue  = tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'done').length;
  const recent   = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const donePct  = total ? Math.round((done / total) * 100) : 0;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Typography variant="h4" fontWeight={700} gutterBottom>Dashboard</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Cześć Dawid! Masz {todo} zadań do wykonania.
      </Typography>

      {/* Overall progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>Ogólny postęp</Typography>
            <Typography variant="body2" color="primary.main" fontWeight={700}>{donePct}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={donePct} sx={{ height: 10, borderRadius: 5 }} aria-label={`Postęp: ${donePct}% ukończonych zadań`} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {done} z {total} zadań ukończonych
          </Typography>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <motion.div variants={listContainer} initial="hidden" animate="visible">
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Wszystkie',    value: total,  color: '#6750A4', icon: <ListIcon />,        total: undefined },
            { label: 'Do zrobienia', value: todo,   color: '#d32f2f', icon: <HourglassIcon />,   total },
            { label: 'W toku',       value: inProg, color: '#0288d1', icon: <TaskAltIcon />,     total },
            { label: 'Ukończone',    value: done,   color: '#2e7d32', icon: <CheckCircleIcon />, total },
          ].map(s => (
            <Grid item xs={6} md={3} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>
      </motion.div>

   {/* Overdue alert */}
{overdue > 0 && (
  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
    <Card sx={{ mb: 3, bgcolor: '#991b1b', border: '1px solid', borderColor: '#7f1d1d' }}>
      <CardContent>
        <Typography variant="body1" fontWeight={700} sx={{ color: '#ffffff' }}>
          ⚠ {overdue} {overdue === 1 ? 'zadanie ma' : 'zadania mają'} przekroczony termin!
        </Typography>
        <Button size="small" onClick={() => navigate('/tasks')} sx={{ mt: 1, color: '#fecaca', borderColor: '#fecaca', '&:hover': { bgcolor: '#7f1d1d' } }}>
          Przejdź do zadań →
        </Button>
      </CardContent>
    </Card>
  </motion.div>
)}

      {/* Recent tasks */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Ostatnie zadania</Typography>
              <Button size="small" onClick={() => navigate('/tasks')}>Zobacz wszystkie</Button>
            </Box>
            {recent.length === 0
              ? <Typography color="text.secondary">Brak zadań — dodaj pierwsze!</Typography>
              : (
                <motion.div variants={listContainer} initial="hidden" animate="visible">
                  {recent.map(t => <RecentTaskRow key={t.id} task={t} />)}
                </motion.div>
              )
            }
          </CardContent>
        </Card>
      </Stack>

      {/* FAB */}
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
    </motion.div>
  );
}
