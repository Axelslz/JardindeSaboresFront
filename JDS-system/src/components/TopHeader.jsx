import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; 

const defaultBgImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

const TopHeader = ({ title, subtitle, bgImage = defaultBgImage }) => {
  const { user } = useAuth();
  const today = new Date();
  const dateString = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeString = today.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box 
      sx={{
        position: 'relative',
        height: '90px', 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // px ajustado: Más padding a la izquierda en móviles (xs y sm) para dejar libre el espacio del botón hamburguesa
        px: { xs: 2, md: 4 }, 
        pl: { xs: 8, md: 4 }, 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* Capa oscura semitransparente */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}
      />

      {/* Título y Subtítulo (Izquierda) */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          sx={{ 
            mb: 0, 
            // Tamaños de fuente dinámicos
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#e0e0e0',
            // Subtítulo más pequeño en móviles
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {/* Fecha, Hora y Usuario (Derecha) */}
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', gap: { xs: 1, md: 2 }, alignItems: 'center' }}>
        
        {/* Píldora de Fecha y Hora (OCULTA EN MÓVILES) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, // Solo se muestra en pantallas medianas o grandes
          alignItems: 'center', gap: 1, 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(10px)',
          padding: '6px 12px', 
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <CalendarIcon fontSize="small" />
          <Box>
            <Typography variant="caption" display="block" fontWeight="bold" lineHeight={1}>
              {dateString}
            </Typography>
            <Typography variant="caption" display="block" lineHeight={1}>
              {timeString}
            </Typography>
          </Box>
        </Box>

        {/* Píldora de Usuario */}
        <Box sx={{ 
          display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          // Padding más compacto en móviles
          padding: { xs: '4px 8px 4px 4px', sm: '4px 12px 4px 4px' }, 
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Avatar 
            sx={{ 
              width: { xs: 28, sm: 32 }, 
              height: { xs: 28, sm: 32 }, 
              bgcolor: '#e0e0e0', 
              color: '#333', 
              fontWeight: 'bold',
              fontSize: { xs: '0.8rem', sm: '1rem' }
            }}
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          
          <Box>
            <Typography variant="body2" fontWeight="bold" lineHeight={1.2} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {user?.username || 'Administrador'}
            </Typography>
            {/* Ocultamos el rol (Encargado/Admin) en pantallas extra pequeñas para no estirar la píldora */}
            <Typography variant="caption" color="gray" lineHeight={1} sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.65rem' }}>
              {user?.role || 'Encargado'}
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default TopHeader;