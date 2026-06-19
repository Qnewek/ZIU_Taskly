import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, BottomNavigation,
  BottomNavigationAction, useMediaQuery, useTheme, Avatar, Divider,
  Badge, Tooltip,
} from '@mui/material';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import TaskAltIcon       from '@mui/icons-material/TaskAlt';
import AddCircleIcon     from '@mui/icons-material/AddCircle';
import SettingsIcon      from '@mui/icons-material/Settings';
import MenuIcon          from '@mui/icons-material/Menu';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import { useTaskContext } from '../../context/TaskContext';

const DRAWER_W = 240;

const NAV = [
  { label: 'Dashboard',  path: '/',         icon: <DashboardIcon />  },
  { label: 'Zadania',    path: '/tasks',     icon: <TaskAltIcon />    },
  { label: 'Nowe',       path: '/tasks/new', icon: <AddCircleIcon />  },
  { label: 'Ustawienia', path: '/settings',  icon: <SettingsIcon />   },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const theme        = useTheme();
  const isMobile     = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const navigate     = useNavigate();
  const location     = useLocation();
  const { tasks }    = useTaskContext();
  const todoCount    = tasks.filter(t => t.status === 'todo').length;

  const activeIdx = NAV.findIndex(n => n.path === location.pathname);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ gap: 1 }}>
        <CheckCircleIcon color="primary" />
        <Typography variant="h6" fontWeight={700} color="primary">Taskly</Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {NAV.map((item, i) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); setOpen(false); }}
            sx={{ mx: 1, borderRadius: 2, mb: 0.5,
              '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiSvgIcon-root': { color: 'white' } },
            }}
            aria-label={item.label}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {i === 1
                ? <Badge badgeContent={todoCount} color="error" max={99}>{item.icon}</Badge>
                : item.icon
              }
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>D</Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>Dawid</Typography>
          <Typography variant="caption" color="text.secondary">student@atar.edu.pl</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isMobile && (
        <Drawer variant="permanent" sx={{ width: DRAWER_W, '& .MuiDrawer-paper': { width: DRAWER_W, boxSizing: 'border-box' } }}>
          {drawer}
        </Drawer>
      )}

      {isMobile && (
        <Drawer open={open} onClose={() => setOpen(false)} sx={{ '& .MuiDrawer-paper': { width: DRAWER_W } }}>
          {drawer}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {isMobile && (
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <Tooltip title="Menu">
                <IconButton edge="start" onClick={() => setOpen(true)} aria-label="Otwórz menu nawigacyjne">
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <CheckCircleIcon color="primary" sx={{ ml: 1, mr: 0.5 }} />
              <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexGrow: 1 }}>Taskly</Typography>
              <Badge badgeContent={todoCount} color="error" max={99}>
                <TaskAltIcon color="action" />
              </Badge>
            </Toolbar>
          </AppBar>
        )}

        {!isMobile && (
          <AppBar position="sticky" elevation={0} sx={{ ml: `${DRAWER_W}px`, width: `calc(100% - ${DRAWER_W}px)`, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                {NAV.find(n => n.path === location.pathname)?.label ?? 'Taskly'}
              </Typography>
              <Badge badgeContent={todoCount} color="error" max={99}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>D</Avatar>
              </Badge>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pb: { xs: 10, md: 3 } }}>
          {children}
        </Box>

        {isMobile && (
          <BottomNavigation
            value={activeIdx === -1 ? false : activeIdx}
            onChange={(_, i) => navigate(NAV[i].path)}
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid', borderColor: 'divider', zIndex: 100 }}
          >
            {NAV.map(item => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} aria-label={item.label} />
            ))}
          </BottomNavigation>
        )}
      </Box>
    </Box>
  );
}
