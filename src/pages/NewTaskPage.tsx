import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { TaskForm, TaskFormData } from '../components/forms/TaskForm';

interface Props {
  onAdd:       (data: TaskFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function NewTaskPage({ onAdd, isSubmitting }: Props) {
  const navigate = useNavigate();

  const handleSubmit = async (data: TaskFormData) => {
    await onAdd(data);
    navigate('/tasks');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/tasks')}
            isSubmitting={isSubmitting}
            title="Nowe zadanie"
          />
        </Paper>
      </Box>
    </motion.div>
  );
}
