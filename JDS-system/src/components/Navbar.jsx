import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Divider, Typography, IconButton
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon, 
  Inventory as InventoryIcon, 
  PointOfSale as PointOfSaleIcon, 
  Logout as LogoutIcon,
  ReceiptLong as ReceiptIcon,
  Menu as MenuIcon,
  History as HistoryIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext'; 
import logoImg from '../assets/logo.png'; 

const activeGreenColor = '#4A7c59'; 
const drawerWidth = 260;

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode(); 
  const [mobileOpen, setMobileOpen] = useState(false);

  const allMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['admin'] },   
    { text: 'Nueva Orden', icon: <PointOfSaleIcon />, path: '/pos', roles: ['admin', 'empleado'] }, 
    { text: 'Historial', icon: <HistoryIcon />, path: '/history', roles: ['admin'] }, 
  ];
  
  const userRole = user?.role || 'empleado';
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  if (!user) return null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Box>
        {/* Contenedor del logo con ajustes responsivos garantizados */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <Box 
            component="img" 
            src={logoImg} 
            alt="Logo" 
            sx={{ 
              height: 'auto', 
              maxHeight: '100px', 
              width: '100%', 
              maxWidth: '180px', 
              objectFit: 'contain' 
            }} 
          />
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path} 
                  selected={isActive}
                  onClick={() => setMobileOpen(false)} 
                  sx={{ 
                    borderRadius: '8px',
                    '&.Mui-selected': { 
                      bgcolor: activeGreenColor, 
                      color: '#fff',
                      '&:hover': { bgcolor: activeGreenColor }
                    } 
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#fff' : 'text.secondary', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: '12px', mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
            Resumen del día
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Ventas</Typography>
            <Typography variant="body2" fontWeight="bold" color="text.primary">$18,450</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Órdenes</Typography>
            <Typography variant="body2" fontWeight="bold" color="text.primary">75</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Clientes</Typography>
            <Typography variant="body2" fontWeight="bold" color="text.primary">53</Typography>
          </Box>
        </Box>

        <ListItemButton onClick={toggleTheme} sx={{ borderRadius: '8px', mb: 1 }}>
          <ListItemIcon sx={{ minWidth: '35px', color: 'text.primary' }}>
            {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </ListItemIcon>
          <ListItemText 
            primary={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'} 
            primaryTypographyProps={{ fontWeight: 'medium', fontSize: '0.9rem', color: 'text.primary' }} 
          />
        </ListItemButton>

        <Divider sx={{ mb: 2 }} />

        <ListItemButton onClick={logout} sx={{ borderRadius: '8px', color: '#D32F2F', p: 1 }}>
          <ListItemIcon sx={{ minWidth: '35px', color: '#D32F2F' }}><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="abrir menú"
        onClick={handleDrawerToggle}
        sx={{
          display: { md: 'none' }, 
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200, 
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <MenuIcon sx={{ color: activeGreenColor }} />
      </IconButton>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              bgcolor: 'background.paper', 
              color: 'text.primary' 
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              bgcolor: 'background.paper', 
              color: 'text.primary', 
              borderRight: 'none', 
              boxShadow: '2px 0 10px rgba(0,0,0,0.05)' 
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;