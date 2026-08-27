import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, CardMedia, Button, 
  IconButton, TextField, InputAdornment, Breadcrumbs, Link, useTheme
} from '@mui/material';
import { 
  Search as SearchIcon, Add as AddIcon, 
  Remove as RemoveIcon, DeleteOutline as DeleteIcon, 
  ArrowBack as ArrowBackIcon, Close as CloseIcon, 
  TableRestaurant as TableIcon, ReceiptLong as ReceiptIcon, 
  Check as CheckIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import TopHeader from '../components/TopHeader';

const activeGreen = '#4A7c59';

const menuItems = [
  { id: 1, name: 'Chilaquiles Verdes', desc: 'Con pollo, crema, cebolla y queso fresco', price: 135, image: 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=400&auto=format&fit=crop', category: 'Chilaquiles' },
  { id: 2, name: 'Chilaquiles Rojos', desc: 'Con pollo, crema, cebolla y queso fresco', price: 135, image: 'https://images.unsplash.com/photo-1640719028782-4299b828a221?q=80&w=400&auto=format&fit=crop', category: 'Chilaquiles' },
  { id: 3, name: 'Huevos al Gusto', desc: 'Preparados al gusto con frijoles y tortillas', price: 120, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop', category: 'Huevos' },
  { id: 4, name: 'Omelette de Jamón y Queso', desc: 'Acompañado de frijoles y ensalada', price: 140, image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=400&auto=format&fit=crop', category: 'Omelette' },
  { id: 5, name: 'Hot Cakes', desc: 'Con mantequilla y miel', price: 110, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=400&auto=format&fit=crop', category: 'Hot Cakes' },
  { id: 6, name: 'Molletes', desc: 'Con frijoles, queso gratinado y pico de gallo', price: 115, image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=400&auto=format&fit=crop', category: 'Extras' },
  { id: 7, name: 'Machaca con Huevo', desc: 'Con frijoles y tortillas', price: 150, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop', category: 'Huevos' },
  { id: 8, name: 'Enfrijoladas', desc: 'Con pollo, crema, queso y cebolla', price: 130, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop', category: 'Extras' },
];

const MenuCarta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const tableObj = location.state?.table || { id: 1, name: 'Mesa 1', capacity: '2-4 personas' };
  const savedOrders = JSON.parse(sessionStorage.getItem('pos_orders') || '{}');
  const initialCart = savedOrders[tableObj.id]?.cartaItems || [];
  
  const [orderItems, setOrderItems] = useState(initialCart);

  const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleAddItem = (item) => {
    const existing = orderItems.find(i => i.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleGuardarYRegresar = () => {
    const currentOrders = JSON.parse(sessionStorage.getItem('pos_orders') || '{}');
    const tableOrder = currentOrders[tableObj.id] || { buffetCounts: { adulto: 0, nino: 0 } };
    
    tableOrder.cartaItems = orderItems;
    currentOrders[tableObj.id] = tableOrder;
    sessionStorage.setItem('pos_orders', JSON.stringify(currentOrders));

    const savedMesas = JSON.parse(sessionStorage.getItem('pos_mesas') || '[]');
    const updatedMesas = savedMesas.map(m => m.id === tableObj.id ? { ...m, status: 'ocupada' } : m);
    sessionStorage.setItem('pos_mesas', JSON.stringify(updatedMesas));

    navigate('/pos'); 
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: theme.palette.background.default, overflow: 'hidden' }}>
      <TopHeader title="Desayunos a la Carta" subtitle="Selecciona tus platillos favoritos" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, overflow: 'hidden' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, lg: 3 }, overflowY: 'auto' }}>
          
          <Breadcrumbs separator="›" sx={{ mb: 2, fontSize: '0.875rem' }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/pos')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 0.5, fontSize: 18 }} /> Regresar a POS
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <CheckIcon sx={{ mr: 0.5, fontSize: 18, color: activeGreen }} /> Platillos
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">Selecciona tus platillos</Typography>
              <Typography variant="body2" color="text.secondary">Agrega extras para la {tableObj.name}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                placeholder="Buscar platillo..." size="small"
                sx={{ bgcolor: theme.palette.background.paper, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            {menuItems.map((item) => (
              <Card key={item.id} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.paper }}>
                <CardMedia component="img" height="140" image={item.image} alt={item.name} />
                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" fontWeight="bold" lineHeight={1.2} mb={0.5} color="text.primary">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.desc}
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">${item.price.toFixed(2)}</Typography>
                    <Button 
                      variant="outlined" size="small" endIcon={<AddIcon fontSize="small" />}
                      onClick={() => handleAddItem(item)}
                      sx={{ borderRadius: '20px', textTransform: 'none', color: activeGreen, borderColor: activeGreen, '&:hover': { bgcolor: isDark ? 'rgba(74, 124, 89, 0.1)' : '#f0f7f2' } }}
                    >
                      Añadir
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '340px' }, flexShrink: 0, borderLeft: { lg: `1px solid ${theme.palette.divider}` }, bgcolor: theme.palette.background.paper, p: 3, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>Platillos agregados</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TableIcon sx={{ color: activeGreen, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color={activeGreen} lineHeight={1.1}>{tableObj.name}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, flexGrow: 1 }}>
            {orderItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>No has agregado platillos extra.</Typography>
            ) : (
              orderItems.map(item => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box component="img" src={item.image} sx={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" lineHeight={1.2} mb={0.5} color="text.primary">{item.name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${theme.palette.divider}`, borderRadius: '4px' }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ p: 0.2, color: 'text.primary' }}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography variant="body2" sx={{ px: 1, minWidth: 20, textAlign: 'center', color: 'text.primary' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ p: 0.2, color: 'text.primary' }}><AddIcon fontSize="small" /></IconButton>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary">${(item.price * item.quantity).toFixed(2)}</Typography>
                      <IconButton size="small" onClick={() => removeItem(item.id)} sx={{ color: 'error.main', p: 0.5 }}><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">Subtotal Carta</Typography>
              <Typography variant="h6" fontWeight="bold" color={activeGreen}>${subtotal.toFixed(2)}</Typography>
            </Box>

            <Button 
              fullWidth variant="contained" startIcon={<ArrowBackIcon />}
              onClick={handleGuardarYRegresar}
              sx={{ bgcolor: activeGreen, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1.5, mb: 1, '&:hover': { bgcolor: '#386144' } }}
            >
              Guardar y regresar al POS
            </Button>
            <Button 
              fullWidth variant="outlined" startIcon={<CloseIcon />}
              onClick={() => navigate('/pos')} 
              sx={{ color: 'text.secondary', borderColor: theme.palette.divider, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1, '&:hover': { bgcolor: theme.palette.action.hover, borderColor: 'text.primary' } }}
            >
              Descartar cambios
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuCarta;