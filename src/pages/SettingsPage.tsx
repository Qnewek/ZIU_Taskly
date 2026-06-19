import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Paper, Typography, TextField, Button, Avatar, Stack,
  Divider, Switch, FormControlLabel, Alert, Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { useTaskContext } from '../context/TaskContext';

const profileSchema = z.object({
  name:  z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  email: z.string().email('Nieprawidłowy adres e-mail'),
});
type ProfileData = z.infer<typeof profileSchema>;

interface Props { onShowToast: (msg: string, sev: 'success' | 'error') => void; }

export function SettingsPage({ onShowToast }: Props) {
  const { tasks } = useTaskContext();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'Dawid', email: 'student@atar.edu.pl' },
  });

  const onSubmit = async (data: ProfileData) => {
    await new Promise(r => setTimeout(r, 800));
    console.log('Profile saved:', data);
    onShowToast('Profil zapisany pomyślnie!', 'success');
  };

  const done   = tasks.filter(t => t.status === 'done').length;
  const total  = tasks.length;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Typography variant="h4" fontWeight={700} gutterBottom>Ustawienia</Typography>

      <Stack spacing={3} sx={{ maxWidth: 600 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}>D</Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>Dawid</Typography>
              <Typography variant="body2" color="text.secondary">student@atar.edu.pl</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Chip label={`${total} zadań`} size="small" />
                <Chip label={`${done} ukończonych`} size="small" color="success" />
              </Stack>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Dane osobowe</Typography>
            <Stack spacing={2}>
              <TextField
                {...register('name')}
                label="Imię i nazwisko"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ 'aria-required': 'true' }}
              />
              <TextField
                {...register('email')}
                label="Adres e-mail"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                inputProps={{ 'aria-required': 'true' }}
              />
              <Box>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />}
                  disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? 'Zapisywanie…' : 'Zapisz dane'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Powiadomienia</Typography>
          <Stack spacing={1}>
            <FormControlLabel control={<Switch defaultChecked />} label="Powiadomienia e-mail" />
            <FormControlLabel control={<Switch />}                label="Powiadomienia push" />
            <FormControlLabel control={<Switch defaultChecked />} label="Przypomnienia o terminach" />
          </Stack>
        </Paper>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.light' }}>
          <Typography variant="subtitle1" fontWeight={600} color="error" gutterBottom>Strefa niebezpieczna</Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>Ta operacja jest nieodwracalna.</Alert>
          <Button variant="outlined" color="error">Usuń konto</Button>
        </Paper>
      </Stack>
    </motion.div>
  );
}
