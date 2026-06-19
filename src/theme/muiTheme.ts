import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary:    { main: '#6750A4', light: '#9A82DB', dark: '#4B3880', contrastText: '#FFFFFF' },
    secondary:  { main: '#625B71', contrastText: '#FFFFFF' },
    success:    { main: '#2E7D32' },
    warning:    { main: '#E65100' },
    error:      { main: '#B71C1C' },
    background: { default: '#F6F2FF', paper: '#FFFFFF' },
    text:       { primary: '#1C1B1F', secondary: '#49454F' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4:     { fontWeight: 700, letterSpacing: '-0.02em' },
    h5:     { fontWeight: 600 },
    h6:     { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 24, paddingLeft: 24, paddingRight: 24, minHeight: 44 } },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 6px rgba(0,0,0,0.08)', borderRadius: 16 } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiFab:  { styleOverrides: { root: { borderRadius: 16 } } },
  },
});
