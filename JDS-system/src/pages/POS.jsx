import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  IconButton, Divider, Chip, Pagination
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  DeleteOutline as DeleteIcon,
  PersonOutline as PersonIcon,
  ChildCare as ChildIcon,
  RestaurantMenu as MenuIcon,
  InfoOutlined as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  TableRestaurant as TableIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/TopHeader';  

const activeGreen = '#4A7c59';
const lightGreen = '#e8f3ec';
const bgLight = '#FFFFFF';
const cardBg = '#FAF7F2';
const textDark = '#333333';

const mesasData = [
  { id: 1, name: 'Mesa 1', capacity: '2-4 personas', status: 'disponible' },
  { id: 2, name: 'Mesa 2', capacity: '2-4 personas', status: 'ocupada' },
  { id: 3, name: 'Mesa 3', capacity: '2-4 personas', status: 'disponible' },
  { id: 4, name: 'Mesa 4', capacity: '4-6 personas', status: 'ocupada' },
  { id: 5, name: 'Mesa 5', capacity: '2-4 personas', status: 'disponible' },
  { id: 6, name: 'Mesa 6', capacity: '4-6 personas', status: 'disponible' },
  { id: 7, name: 'Mesa 7', capacity: '2-4 personas', status: 'reservada' },
  { id: 8, name: 'Mesa 8', capacity: '4-6 personas', status: 'disponible' },
  { id: 9, name: 'Mesa 9', capacity: '4-6 personas', status: 'ocupada' },
  { id: 10, name: 'Mesa 10', capacity: '2-4 personas', status: 'disponible' },
  { id: 11, name: 'Mesa 11', capacity: '2-4 personas', status: 'disponible' },
  { id: 12, name: 'Mesa 12', capacity: '4-6 personas', status: 'reservada' },
  { id: 13, name: 'Mesa 13', capacity: '2-4 personas', status: 'disponible' },
  { id: 14, name: 'Mesa 14', capacity: '4-6 personas', status: 'disponible' },
  { id: 15, name: 'Mesa 15', capacity: '2-4 personas', status: 'ocupada' },
];

const serviciosData = [
  { id: 'adulto', name: 'Buffet Adulto', price: 220, desc: 'Desayuno buffet para adultos', icon: <PersonIcon /> },
  { id: 'nino', name: 'Buffet Niño', price: 120, desc: 'Desayuno buffet para niños (5-12 años)', icon: <ChildIcon /> },
  { id: 'carta', name: 'Desayunos a la Carta', price: null, desc: 'Elige tus platillos favoritos', icon: <MenuIcon /> },
];

const POS = () => {
  const navigate = useNavigate(); // <-- Habilitar navegación
  const [selectedTable, setSelectedTable] = useState(8);
  const [selectedService, setSelectedService] = useState('adulto');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(mesasData.length / itemsPerPage);

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMesas = mesasData.slice(indexOfFirstItem, indexOfLastItem);

  const tableObj = mesasData.find(m => m.id === selectedTable);
  const serviceObj = serviciosData.find(s => s.id === selectedService);

  const handlePageChange = (event, value) => setPage(value);

  const getStatusColor = (status) => {
    switch(status) {
      case 'disponible': return activeGreen;
      case 'ocupada': return '#E67E22';
      case 'reservada': return '#7F8C8D';
      default: return '#ccc';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'disponible': return '#e8f3ec';
      case 'ocupada': return '#fdf3e8';
      case 'reservada': return '#f2f4f4';
      default: return '#eee';
    }
  };

  const handleContinue = () => {
    if (selectedService === 'carta') {
      // Navegamos a la vista del menú enviando la mesa que seleccionamos
      navigate('/pos/menu', { state: { table: tableObj } });
    } else {
      // Lógica futura para el buffet
      console.log('Continuar con buffet para', tableObj.name);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: bgLight, overflow: 'hidden' }}>
      <TopHeader title="Nueva Orden" subtitle="Selecciona la mesa y el tipo de buffet" />
      <Box sx={{ flexGrow: 1, p: { xs: 2, lg: 3 }, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, overflowY: 'auto' }}>
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* HEADER DE MESAS */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight="bold" color={textDark}>1. Selecciona la mesa</Typography>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="small" sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: activeGreen, color: '#fff' } }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: activeGreen }} /><Typography variant="caption" color="text.secondary" fontWeight="medium">Disponible</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E67E22' }} /><Typography variant="caption" color="text.secondary" fontWeight="medium">Ocupada</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#7F8C8D' }} /><Typography variant="caption" color="text.secondary" fontWeight="medium">Reservada</Typography></Box>
            </Box>
          </Box>

          {/* GRID MESAS */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
            {currentMesas.map((mesa) => {
              const isSelected = selectedTable === mesa.id;
              return (
                <Card 
                  key={mesa.id} elevation={0} onClick={() => setSelectedTable(mesa.id)}
                  sx={{ border: isSelected ? `2px solid ${activeGreen}` : '1px solid #E0E0E0', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', '&:hover': { borderColor: activeGreen, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}
                >
                  {isSelected && <CheckCircleIcon sx={{ position: 'absolute', top: 6, right: 6, color: activeGreen, fontSize: 18 }} />}
                  <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <TableIcon sx={{ color: getStatusColor(mesa.status), fontSize: 32, mb: 0.5 }} />
                    <Typography variant="subtitle2" fontWeight="bold">{mesa.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontSize: '0.7rem' }}>{mesa.capacity}</Typography>
                    <Chip label={mesa.status.charAt(0).toUpperCase() + mesa.status.slice(1)} size="small" sx={{ bgcolor: getStatusBg(mesa.status), color: getStatusColor(mesa.status), fontWeight: 'bold', fontSize: '0.6rem', height: '20px' }} />
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Typography variant="h6" fontWeight="bold" color={textDark} sx={{ mb: 1.5 }}>2. Selecciona el tipo de buffet o servicio</Typography>

          {/* GRID SERVICIOS */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5, mb: 3 }}>
            {serviciosData.map((servicio) => {
              const isSelected = selectedService === servicio.id;
              return (
                <Card 
                  key={servicio.id} elevation={0} onClick={() => setSelectedService(servicio.id)}
                  sx={{ border: isSelected ? `2px solid ${activeGreen}` : '1px solid #E0E0E0', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', '&:hover': { borderColor: activeGreen, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}
                >
                  {isSelected && <CheckCircleIcon sx={{ position: 'absolute', top: 6, right: 6, color: activeGreen, fontSize: 18 }} />}
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, bgcolor: isSelected ? lightGreen : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? activeGreen : '#777' }}>
                      {servicio.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color={textDark} lineHeight={1}>{servicio.name}</Typography>
                      {servicio.price ? (
                        <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>${servicio.price.toFixed(2)}</Typography>
                      ) : (
                        <Typography 
                          variant="body2" color="primary" 
                          onClick={(e) => { e.stopPropagation(); setSelectedService(servicio.id); handleContinue(); }} // Click directo en "Ver Menú"
                          sx={{ mt: 0.5, cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                        >
                          Ver menú
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.2, lineHeight: 1.1, fontSize: '0.65rem' }}>{servicio.desc}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: bgLight, p: 1.5, borderRadius: '12px', border: '1px solid #E0E0E0', mt: 'auto', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: '#666' }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                La orden es para: 
                <Box component="span" fontWeight="bold" color={textDark} sx={{ mx: 1 }}>{tableObj?.name}</Box> 
                • <Box component="span" fontWeight="bold" color={textDark} sx={{ mx: 1 }}>{serviceObj?.name}</Box>
              </Typography>
            </Box>
            <Button 
              variant="contained" endIcon={<ArrowForwardIcon />} size="small"
              onClick={handleContinue}
              sx={{ bgcolor: activeGreen, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', px: 3, '&:hover': { bgcolor: '#386144' } }}
            >
              Continuar a pedido
            </Button>
          </Box>

        </Box>

        {/* SIDEBAR DERECHO */}
        <Box sx={{ width: { xs: '100%', lg: '320px' }, flexShrink: 0 }}>
          <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E0E0E0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={textDark} sx={{ mb: 2 }}>Resumen de la orden</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">Mesa seleccionada</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, mb: 2 }}>
                <TableIcon sx={{ color: activeGreen, fontSize: 26 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color={activeGreen} lineHeight={1.1}>{tableObj?.name || 'Ninguna'}</Typography>
                  <Typography variant="caption" color="text.secondary">{tableObj?.capacity}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" color="text.secondary" fontWeight="bold">Tipo de servicio</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    {serviceObj?.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color={textDark}>{serviceObj?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">1 persona</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight="bold" color={textDark}>{serviceObj?.price ? `$${serviceObj.price.toFixed(2)}` : '--'}</Typography>
                  <IconButton size="small" sx={{ color: '#999', mt: 0, p: 0.5 }}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">Subtotal</Typography>
                <Typography variant="body2" fontWeight="bold" color={textDark}>{serviceObj?.price ? `$${serviceObj.price.toFixed(2)}` : '$0.00'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color={textDark}>Total</Typography>
                <Typography variant="subtitle1" fontWeight="bold" color={activeGreen}>{serviceObj?.price ? `$${serviceObj.price.toFixed(2)}` : '$0.00'}</Typography>
              </Box>

              <Box sx={{ bgcolor: cardBg, p: 2, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <MenuIcon sx={{ color: '#8d7b68', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="#5a4c3e">El buffet incluye:</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Fruta de temporada', 'Platillos calientes', 'Panadería', 'Bebidas'].map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: activeGreen, fontSize: 14 }} />
                      <Typography variant="caption" color="text.secondary">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ p: 2.5, pt: 0, mt: 'auto' }}>
              <Button 
                fullWidth variant="outlined" startIcon={<CloseIcon />} size="small"
                sx={{ color: '#666', borderColor: '#D0D0D0', textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1, '&:hover': { bgcolor: '#F5F5F5', borderColor: '#999' } }}
              >
                Cancelar orden
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default POS;