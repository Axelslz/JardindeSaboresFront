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
  Menu as MenuIcon // Importamos el icono de hamburguesa
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png'; 

const sidebarBg = '#FAF7F2';
const activeGreenColor = '#4A7c59'; 
const textDarkColor = '#333333';
const drawerWidth = 260;

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); 
  
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [mobileOpen, setMobileOpen] = useState(false);

  const allMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['admin'] },   
    { text: 'Nueva Orden', icon: <PointOfSaleIcon />, path: '/pos', roles: ['admin', 'empleado'] }, 
    { text: 'Órdenes', icon: <ReceiptIcon />, path: '/orders', roles: ['admin', 'empleado'] },
    { text: 'Inventario', icon: <InventoryIcon />, path: '/inventory', roles: ['admin', 'empleado'] }, 
  ];
  
  const userRole = user?.role || 'empleado';
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  if (!user) return null;

  // Función para abrir/cerrar el menú en móvil
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Guardamos todo el contenido del menú en una variable para no repetir código
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Box>
        {/* Logo */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <Box component="img" src={logoImg} alt="Logo" sx={{ height: '100px', width: 'auto' }} />
        </Box>

        {/* Menú de enlaces */}
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path} 
                  selected={isActive}
                  onClick={() => setMobileOpen(false)} // Cierra el menú en móvil al hacer clic
                  sx={{ 
                    borderRadius: '8px',
                    '&.Mui-selected': { 
                      bgcolor: activeGreenColor, 
                      color: '#fff',
                      '&:hover': { bgcolor: activeGreenColor }
                    } 
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#fff' : '#888', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Parte inferior: Resumen del día y Botón de Cerrar Sesión */}
      <Box sx={{ px: 3, pb: 3 }}>
        
        {/* Tarjeta de Resumen del día */}
        <Box sx={{ bgcolor: '#F0EBE1', p: 2, borderRadius: '12px', mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: textDarkColor }}>
            Resumen del día
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Ventas</Typography>
            <Typography variant="body2" fontWeight="bold">$18,450</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Órdenes</Typography>
            <Typography variant="body2" fontWeight="bold">75</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Clientes</Typography>
            <Typography variant="body2" fontWeight="bold">53</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Botón Salir */}
        <ListItemButton onClick={logout} sx={{ borderRadius: '8px', color: '#D32F2F', p: 1 }}>
          <ListItemIcon sx={{ minWidth: '35px', color: '#D32F2F' }}><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 1. Botón de Hamburguesa (Solo visible en dispositivos móviles) */}
      <IconButton
        color="inherit"
        aria-label="abrir menú"
        onClick={handleDrawerToggle}
        sx={{
          display: { md: 'none' }, // Se oculta en PC (tamaño 'md' en adelante)
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200, // Para que flote por encima de todo
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': { bgcolor: '#fff' }
        }}
      >
        <MenuIcon sx={{ color: activeGreenColor }} />
      </IconButton>

      {/* Contenedor principal de los Drawers */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* 2. Drawer Temporal (Aparece y desaparece en Móviles) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejora el rendimiento al abrir en móviles
          }}
          sx={{
            display: { xs: 'block', md: 'none' }, // Solo se usa en móviles
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              bgcolor: sidebarBg, 
              color: textDarkColor 
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* 3. Drawer Permanente (Fijo en PC) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' }, // Solo se usa en PC
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              bgcolor: sidebarBg, 
              color: textDarkColor, 
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