import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  IconButton, Divider, Chip, Pagination,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem, Snackbar, Alert, Slide, useTheme
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
  TableRestaurant as TableIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Print as PrintIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/TopHeader';  
import api from '../services/api';  
import { createSaleService, clearActiveTableService } from '../services/saleService';

const activeGreen = '#4A7c59';
const lightGreen = '#e8f3ec';

const initialMesas = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Mesa ${i + 1}`,
  capacity: i % 3 === 0 ? '4-6 personas' : '2-4 personas',
  status: 'disponible'
}));

const serviciosData = [
  { id: 'adulto', name: 'Buffet Adulto', price: 220, desc: 'Desayuno buffet para adultos', icon: <PersonIcon /> },
  { id: 'nino', name: 'Buffet Niño', price: 120, desc: 'Desayuno buffet para niños (5-12 años)', icon: <ChildIcon /> },
  { id: 'carta', name: 'Desayunos a la Carta', price: null, desc: 'Elige tus platillos favoritos', icon: <MenuIcon /> },
];

const POS = () => {
  const navigate = useNavigate(); 
  const theme = useTheme();
  const isAdmin = true; 
  const [mesas, setMesas] = useState(() => {
    const saved = sessionStorage.getItem('pos_mesas');
    return saved ? JSON.parse(saved) : initialMesas;
  });

  const [ordersByTable, setOrdersByTable] = useState(() => {
    const saved = sessionStorage.getItem('pos_orders');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    sessionStorage.setItem('pos_mesas', JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    sessionStorage.setItem('pos_orders', JSON.stringify(ordersByTable));
  }, [ordersByTable]);

  const [selectedTable, setSelectedTable] = useState(1);
  const [selectedService, setSelectedService] = useState('adulto'); 
  
  const [buffetCounts, setBuffetCounts] = useState(() => {
    return ordersByTable[1]?.buffetCounts || { adulto: 0, nino: 0 };
  });
  const [cartaItems, setCartaItems] = useState(() => {
    return ordersByTable[1]?.cartaItems || [];
  });
  
  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableToEdit, setTableToEdit] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(mesas.length / itemsPerPage);
  const currentMesas = mesas.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const tableObj = mesas.find(m => m.id === selectedTable);
  const totalAdultos = buffetCounts.adulto * 220;
  const totalNinos = buffetCounts.nino * 120;
  const totalCarta = cartaItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const grandTotal = totalAdultos + totalNinos + totalCarta;

  const handlePageChange = (event, value) => setPage(value);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'disponible': return activeGreen;
      case 'ocupada': return '#E67E22';
      case 'reservada': return '#7F8C8D';
      default: return theme.palette.text.secondary;
    }
  };

  const getStatusBg = (status) => {
    if (theme.palette.mode === 'dark') {
      switch(status) {
        case 'disponible': return 'rgba(74, 124, 89, 0.2)';
        case 'ocupada': return 'rgba(230, 126, 34, 0.2)';
        case 'reservada': return 'rgba(127, 140, 141, 0.2)';
        default: return 'rgba(255,255,255,0.1)';
      }
    }
    switch(status) {
      case 'disponible': return '#e8f3ec';
      case 'ocupada': return '#fdf3e8';
      case 'reservada': return '#f2f4f4';
      default: return '#eee';
    }
  };

  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);
    if (ordersByTable[tableId]) {
      setBuffetCounts(ordersByTable[tableId].buffetCounts || { adulto: 0, nino: 0 });
      setCartaItems(ordersByTable[tableId].cartaItems || []);
    } else {
      setBuffetCounts({ adulto: 0, nino: 0 });
      setCartaItems([]);
    }
  };

  const handleQuantityChange = (type, delta, e) => {
    e.stopPropagation(); 
    setSelectedService(type); 
    setBuffetCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const removeCartaItem = (id) => {
    const updatedCarta = cartaItems.filter(i => i.id !== id);
    setCartaItems(updatedCarta);
    setOrdersByTable(prev => ({
      ...prev, [selectedTable]: { ...prev[selectedTable], cartaItems: updatedCarta }
    }));
  };

  const handleContinue = (overrideService) => {
    const serviceToCheck = overrideService || selectedService;

    setOrdersByTable(prev => ({
      ...prev,
      [selectedTable]: {
        buffetCounts: { ...buffetCounts },
        cartaItems: [...cartaItems],
        total: grandTotal
      }
    }));

    if (serviceToCheck === 'carta') {
      navigate('/pos/menu', { state: { table: tableObj } });
      return;
    }

    if (grandTotal === 0) {
      showSnackbar('Por favor agrega buffets o platillos a la carta antes de guardar.', 'warning');
      return;
    }

    setMesas(prev => prev.map(m => m.id === selectedTable ? { ...m, status: 'ocupada' } : m));
    showSnackbar(`Información guardada. ${tableObj.name} ahora está Ocupada.`);
  };

  const handleSaveAndPrintFinal = async () => {
    try {
      const finalSaleData = {
        folio: `F-${Math.floor(10000 + Math.random() * 90000)}`, 
        mesa: tableObj.name,
        atendio: 'Mesero General',
        articulos: [
          ...(buffetCounts.adulto > 0 ? [{ name: 'Buffet Adulto', quantity: buffetCounts.adulto, price: 220 }] : []),
          ...(buffetCounts.nino > 0 ? [{ name: 'Buffet Niño', quantity: buffetCounts.nino, price: 120 }] : []),
          ...cartaItems
        ],
        total: grandTotal,
        metodoPago: 'EFECTIVO', 
        fecha: new Date().toISOString()
      };

      await createSaleService(finalSaleData);

      window.print();

      try {
        await clearActiveTableService(tableObj.name);
      } catch (clearErr) {
         console.warn("No se pudo limpiar la mesa activa, tal vez no estaba registrada", clearErr);
      }

      setOrdersByTable(prev => {
        const copy = { ...prev };
        delete copy[selectedTable];
        return copy;
      });
      
      setMesas(prev => prev.map(m => m.id === selectedTable ? { ...m, status: 'disponible' } : m));
      setBuffetCounts({ adulto: 0, nino: 0 });
      setCartaItems([]);
      setOpenConfirm(false);
      showSnackbar('Venta guardada exitosamente y ticket impreso.');
      
    } catch (error) {
      console.error('Error al guardar e imprimir la venta:', error);
      showSnackbar('Ocurrió un error al registrar la venta en la base de datos.', 'error');
      setOpenConfirm(false);
    }
  };

  const handleCancelOrder = () => {
    setBuffetCounts({ adulto: 0, nino: 0 });
    setCartaItems([]);
    setOrdersByTable(prev => {
      const copy = { ...prev };
      delete copy[selectedTable];
      return copy;
    });
    setMesas(prev => prev.map(m => m.id === selectedTable ? { ...m, status: 'disponible' } : m));
    showSnackbar('Orden cancelada y mesa liberada.', 'info');
  };

  const handleOpenStatusMenu = (event, mesaId) => {
    if (!isAdmin) return; 
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
    setTableToEdit(mesaId);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
    setTableToEdit(null);
  };

  const handleForceStatusChange = (newStatus) => {
    setMesas(prev => prev.map(m => m.id === tableToEdit ? { ...m, status: newStatus } : m));
    handleCloseStatusMenu();
    showSnackbar(`Estatus actualizado a ${newStatus}.`, 'info');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-ticket, #printable-ticket * { visibility: visible; color: black !important; }
            #printable-ticket {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 300px;
              margin: 0 auto;
            }
          }
        `}
      </style>

      <TopHeader title="Nueva Orden" subtitle="Selecciona la mesa y el tipo de servicio" />
      <Box sx={{ flexGrow: 1, p: { xs: 2, lg: 3 }, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, overflowY: 'auto' }}>
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">1. Selecciona la mesa</Typography>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="small" sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: activeGreen, color: '#fff' } }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: activeGreen }} /><Typography variant="caption" color="text.secondary" fontWeight="medium">Disponible</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E67E22' }} /><Typography variant="caption" color="text.secondary" fontWeight="medium">Ocupada</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#7F8C8D' }} /><Typography variant="caption" color="text.secondary" fontWeight="medium">Reservada</Typography></Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
            {currentMesas.map((mesa) => {
              const isSelected = selectedTable === mesa.id;
              return (
                <Card 
                  key={mesa.id} elevation={0} onClick={() => handleSelectTable(mesa.id)}
                  sx={{ 
                    bgcolor: 'background.paper',
                    border: isSelected ? `2px solid ${activeGreen}` : `1px solid ${theme.palette.divider}`, 
                    borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', 
                    '&:hover': { borderColor: activeGreen, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } 
                  }}
                >
                  {isSelected && <CheckCircleIcon sx={{ position: 'absolute', top: 6, right: 6, color: activeGreen, fontSize: 18 }} />}
                  <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <TableIcon sx={{ color: getStatusColor(mesa.status), fontSize: 32, mb: 0.5 }} />
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">{mesa.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontSize: '0.7rem' }}>{mesa.capacity}</Typography>
                    
                    <Chip 
                      label={mesa.status.charAt(0).toUpperCase() + mesa.status.slice(1)} 
                      size="small" 
                      onClick={isAdmin ? (e) => handleOpenStatusMenu(e, mesa.id) : undefined}
                      sx={{ 
                        bgcolor: getStatusBg(mesa.status), 
                        color: getStatusColor(mesa.status), 
                        fontWeight: 'bold', fontSize: '0.6rem', height: '20px',
                        cursor: isAdmin ? 'pointer' : 'default',
                        '&:hover': isAdmin ? { filter: 'brightness(0.95)' } : {}
                      }} 
                    />
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 1.5 }}>2. Selecciona el tipo de buffet o servicio</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5, mb: 3 }}>
            {serviciosData.map((servicio) => {
              const isSelected = selectedService === servicio.id;
              return (
                <Card 
                  key={servicio.id} elevation={0} onClick={() => setSelectedService(servicio.id)}
                  sx={{ 
                    bgcolor: 'background.paper',
                    border: isSelected ? `2px solid ${activeGreen}` : `1px solid ${theme.palette.divider}`, 
                    borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', 
                    '&:hover': { borderColor: activeGreen, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } 
                  }}
                >
                  {isSelected && <CheckCircleIcon sx={{ position: 'absolute', top: 6, right: 6, color: activeGreen, fontSize: 18 }} />}
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, bgcolor: isSelected ? lightGreen : theme.palette.action.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? activeGreen : theme.palette.text.secondary }}>
                      {servicio.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary" lineHeight={1}>{servicio.name}</Typography>
                      {servicio.price ? (
                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mt: 0.5 }}>${servicio.price.toFixed(2)}</Typography>
                      ) : (
                        <Typography 
                          variant="body2" color="primary" 
                          onClick={(e) => { e.stopPropagation(); setSelectedService(servicio.id); handleContinue(servicio.id); }}
                          sx={{ mt: 0.5, cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                        >
                          Ver menú
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.2, lineHeight: 1.1, fontSize: '0.65rem' }}>{servicio.desc}</Typography>
                    </Box>
                    {servicio.id !== 'carta' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, zIndex: 2 }}>
                        <IconButton size="small" onClick={(e) => handleQuantityChange(servicio.id, -1, e)} sx={{ bgcolor: theme.palette.action.hover, width: 28, height: 28 }}>
                          <RemoveIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        </IconButton>
                        <Typography fontWeight="bold" color="text.primary" sx={{ minWidth: 18, textAlign: 'center' }}>{buffetCounts[servicio.id]}</Typography>
                        <IconButton size="small" onClick={(e) => handleQuantityChange(servicio.id, 1, e)} sx={{ bgcolor: lightGreen, color: activeGreen, width: 28, height: 28 }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', p: 1.5, borderRadius: '12px', border: `1px solid ${theme.palette.divider}`, mt: 'auto', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: 'text.secondary' }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                La orden es para: <Box component="span" fontWeight="bold" color="text.primary" sx={{ mx: 1 }}>{tableObj?.name}</Box> 
                • <Box component="span" fontWeight="bold" color="text.primary" sx={{ mx: 1 }}>
                  {grandTotal > 0 ? 'Pedido en proceso' : (selectedService === 'carta' ? 'A la carta' : 'Selecciona cantidades')}
                </Box>
              </Typography>
            </Box>
            <Button 
              variant="contained" endIcon={<ArrowForwardIcon />} size="small"
              onClick={() => handleContinue()}
              sx={{ bgcolor: activeGreen, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', px: 3, '&:hover': { bgcolor: '#386144' } }}
            >
              Guardar pedido en mesa
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '320px' }, flexShrink: 0 }}>
          <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>Resumen de la orden</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">Mesa seleccionada</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, mb: 2 }}>
                <TableIcon sx={{ color: activeGreen, fontSize: 26 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color={activeGreen} lineHeight={1.1}>{tableObj?.name || 'Ninguna'}</Typography>
                  <Typography variant="caption" color="text.secondary">{tableObj?.capacity}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {(buffetCounts.adulto > 0 || buffetCounts.nino > 0) && (
                <>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">Buffets</Typography>
                  {buffetCounts.adulto > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: theme.palette.action.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.text.secondary }}><PersonIcon /></Box>
                        <Box>
                          <Typography variant="body2" fontWeight="bold" color="text.primary">Buffet Adulto</Typography>
                          <Typography variant="caption" color="text.secondary">{buffetCounts.adulto} persona(s)</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">${totalAdultos.toFixed(2)}</Typography>
                        <IconButton size="small" sx={{ color: '#d32f2f', p: 0.5, ml: 1 }} onClick={() => setBuffetCounts(prev => ({...prev, adulto: 0}))}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                  )}

                  {buffetCounts.nino > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: theme.palette.action.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.text.secondary }}><ChildIcon /></Box>
                        <Box>
                          <Typography variant="body2" fontWeight="bold" color="text.primary">Buffet Niño</Typography>
                          <Typography variant="caption" color="text.secondary">{buffetCounts.nino} persona(s)</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">${totalNinos.toFixed(2)}</Typography>
                        <IconButton size="small" sx={{ color: '#d32f2f', p: 0.5, ml: 1 }} onClick={() => setBuffetCounts(prev => ({...prev, nino: 0}))}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                  )}
                </>
              )}

              {cartaItems.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">Platillos a la carta</Typography>
                  {cartaItems.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">{item.quantity}x {item.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">${(item.price * item.quantity).toFixed(2)}</Typography>
                        <IconButton size="small" onClick={() => removeCartaItem(item.id)} sx={{ color: '#d32f2f', p: 0.5, ml: 1 }}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                  ))}
                </>
              )}

              {grandTotal === 0 && <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>No hay artículos en la orden.</Typography>}

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">Subtotal</Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">{grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : '$0.00'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">Total</Typography>
                <Typography variant="subtitle1" fontWeight="bold" color={activeGreen}>{grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : '$0.00'}</Typography>
              </Box>
            </CardContent>
            
            <Box sx={{ p: 2.5, pt: 0, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                fullWidth variant="contained" startIcon={<PrintIcon />}
                onClick={() => {
                  if (grandTotal === 0) { showSnackbar('Agrega platillos antes de guardar e imprimir el ticket final.', 'warning'); return; }
                  setOpenConfirm(true);
                }}
                sx={{ bgcolor: activeGreen, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1.2, '&:hover': { bgcolor: '#386144' } }}
              >
                Guardar e Imprimir Ticket
              </Button>
              <Button 
                fullWidth variant="outlined" startIcon={<CloseIcon />} size="small" onClick={handleCancelOrder}
                sx={{ color: 'text.secondary', borderColor: theme.palette.divider, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1, '&:hover': { bgcolor: theme.palette.action.hover, borderColor: 'text.primary' } }}
              >
                Cancelar orden y limpiar
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseStatusMenu}
        PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem onClick={() => handleForceStatusChange('disponible')} sx={{ fontSize: '0.9rem', fontWeight: 'medium', color: activeGreen }}>Marcar como Disponible</MenuItem>
        <MenuItem onClick={() => handleForceStatusChange('ocupada')} sx={{ fontSize: '0.9rem', fontWeight: 'medium', color: '#E67E22' }}>Marcar como Ocupada</MenuItem>
        <MenuItem onClick={() => handleForceStatusChange('reservada')} sx={{ fontSize: '0.9rem', fontWeight: 'medium', color: '#7F8C8D' }}>Marcar como Reservada</MenuItem>
      </Menu>

      <Dialog 
        open={openConfirm} onClose={() => setOpenConfirm(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pb: 1 }}>¿Estás seguro de guardar e imprimir?</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Se registrará la venta final de la <strong>{tableObj?.name}</strong> por un total de <strong>${grandTotal.toFixed(2)}</strong> y se imprimirá el ticket de consumo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={() => setOpenConfirm(false)} sx={{ color: 'text.secondary', borderColor: theme.palette.divider, borderRadius: '8px', px: 3, textTransform: 'none', fontWeight: 'bold' }}>No</Button>
          <Button variant="contained" onClick={handleSaveAndPrintFinal} sx={{ bgcolor: activeGreen, borderRadius: '8px', px: 3, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#386144' } }}>Sí, Guardar e Imprimir</Button>
        </DialogActions>
      </Dialog>

      {/* --- TICKET DE IMPRESIÓN --- */}
      <Box id="printable-ticket" sx={{ display: 'none', '@media print': { display: 'block' } }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>TU RESTAURANTE</Typography>
          <Typography variant="body2" color="text.secondary">{new Date().toLocaleString()}</Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>Mesa: {tableObj?.name}</Typography>
          <Typography variant="body2">Mesero: Mesero General</Typography>
        </Box>
        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
        {buffetCounts.adulto > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{buffetCounts.adulto}x Buffet Adulto</Typography>
            <Typography variant="body2">${totalAdultos.toFixed(2)}</Typography>
          </Box>
        )}
        {buffetCounts.nino > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{buffetCounts.nino}x Buffet Niño</Typography>
            <Typography variant="body2">${totalNinos.toFixed(2)}</Typography>
          </Box>
        )}
        {cartaItems.map(item => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{item.quantity}x {item.name}</Typography>
            <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">TOTAL</Typography>
          <Typography variant="h6" fontWeight="bold">${grandTotal.toFixed(2)}</Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default POS;