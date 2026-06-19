import { AnimatePresence, motion } from 'framer-motion';
import { Alert, Box } from '@mui/material';
import { toastVariants } from '../../animations/variants';
import type { ToastMessage } from '../../hooks/useToast';

interface Props { toasts: ToastMessage[]; onClose: (id: string) => void; }

export function ToastStack({ toasts, onClose }: Props) {
  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <motion.div key={t.id} layout variants={toastVariants} initial="initial" animate="animate" exit="exit">
            <Alert severity={t.severity} onClose={() => onClose(t.id)} sx={{ minWidth: 280, maxWidth: 380, boxShadow: 4 }}>
              {t.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
