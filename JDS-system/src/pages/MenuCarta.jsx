import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, CardMedia, Button, 
  IconButton, Divider, Chip, TextField, InputAdornment, Breadcrumbs, Link
} from '@mui/material';
import { 
  Search as SearchIcon,
  Tune as TuneIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
  InfoOutlined as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  TableRestaurant as TableIcon,
  ReceiptLong as ReceiptIcon,
  Check as CheckIcon,
  LocalCafe as CafeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import TopHeader from '../components/TopHeader';

const activeGreen = '#4A7c59';
const bgLight = '#FFFFFF';
const cardBg = '#FAF7F2';
const textDark = '#333333';

// Datos de prueba (Mock Data) basados en la imagen
const categorias = ['Todos', 'Huevos', 'Chilaquiles', 'Hot Cakes', 'Omelette', 'Bebidas', 'Extras'];

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
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [orderItems, setOrderItems] = useState([
    { ...menuItems[0], quantity: 1 }, 
    { id: 99, name: 'Café Americano', price: 35, quantity: 1, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop' }
  ]);

  // Recuperar la mesa seleccionada desde la navegación previa, o usar un default
  const tableObj = location.state?.table || { id: 8, name: 'Mesa 8', capacity: '4-6 personas' };

  const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: bgLight, overflow: 'hidden' }}>
      
      {/* HEADER */}
      <TopHeader 
        title="Desayunos a la Carta" 
        subtitle="Selecciona tus platillos favoritos" 
      />

      {/* CONTENEDOR PRINCIPAL */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, overflow: 'hidden' }}>
        
        {/* SECCIÓN IZQUIERDA: MENÚ */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, lg: 3 }, overflowY: 'auto' }}>
          
          {/* Breadcrumbs */}
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2, fontSize: '0.875rem' }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/pos')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 0.5, fontSize: 18 }} /> Nueva Orden
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <CheckIcon sx={{ mr: 0.5, fontSize: 18, color: activeGreen }} /> Desayunos a la Carta
            </Typography>
          </Breadcrumbs>

          {/* Título y Buscador */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color={textDark}>Selecciona tus platillos</Typography>
              <Typography variant="body2" color="text.secondary">Elige de nuestro menú a la carta</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                placeholder="Buscar platillo..."
                size="small"
                sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                }}
              />
              <Button 
                variant="outlined" 
                startIcon={<TuneIcon />}
                sx={{ borderRadius: '8px', color: textDark, borderColor: '#ccc', textTransform: 'none' }}
              >
                Categorías
              </Button>
            </Box>
          </Box>

          {/* Filtros de Categorías */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 } }}>
            {categorias.map(cat => (
              <Chip 
                key={cat}
                label={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{ 
                  bgcolor: activeCategory === cat ? activeGreen : '#F5F5F5',
                  color: activeCategory === cat ? '#fff' : textDark,
                  fontWeight: activeCategory === cat ? 'bold' : 'normal',
                  '&:hover': { bgcolor: activeCategory === cat ? activeGreen : '#E0E0E0' },
                  borderRadius: '8px',
                  px: 1
                }}
              />
            ))}
          </Box>

          {/* Grid de Platillos */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, 
            gap: 2, mb: 3 
          }}>
            {menuItems.filter(i => activeCategory === 'Todos' || i.category === activeCategory).map((item) => (
              <Card key={item.id} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="140" image={item.image} alt={item.name} />
                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" fontWeight="bold" lineHeight={1.2} mb={0.5}>{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.desc}
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color={textDark}>${item.price.toFixed(2)}</Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      endIcon={<AddIcon fontSize="small" />}
                      onClick={() => handleAddItem(item)}
                      sx={{ 
                        borderRadius: '20px', textTransform: 'none', color: activeGreen, borderColor: activeGreen,
                        '&:hover': { bgcolor: '#f0f7f2' }
                      }}
                    >
                      Añadir
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Banner de Información */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: cardBg, p: 2, borderRadius: '12px', mt: 'auto' }}>
            <InfoIcon sx={{ color: '#8d7b68' }} />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="#5a4c3e">Información</Typography>
              <Typography variant="caption" color="text.secondary">Todos nuestros platillos incluyen tortillas y salsa.</Typography>
            </Box>
          </Box>
        </Box>

        {/* SECCIÓN DERECHA: RESUMEN DE ORDEN */}
        <Box sx={{ width: { xs: '100%', lg: '340px' }, flexShrink: 0, borderLeft: { lg: '1px solid #E0E0E0' }, bgcolor: '#fff', p: 3, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <Typography variant="h6" fontWeight="bold" color={textDark} sx={{ mb: 3 }}>
            Resumen de la orden
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Mesa seleccionada</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TableIcon sx={{ color: activeGreen, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color={activeGreen} lineHeight={1.1}>{tableObj.name}</Typography>
                <Typography variant="caption" color="text.secondary">{tableObj.capacity}</Typography>
              </Box>
            </Box>
            <Button variant="outlined" size="small" sx={{ borderRadius: '8px', textTransform: 'none', color: '#555', borderColor: '#ccc' }} onClick={() => navigate('/pos')}>
              Cambiar mesa
            </Button>
          </Box>

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Tipo de servicio</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#e8f3ec', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeGreen }}>
                <ReceiptIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color={textDark}>Desayunos a la Carta</Typography>
                <Typography variant="caption" color="text.secondary">Menú individual</Typography>
              </Box>
            </Box>
            <Button variant="outlined" size="small" sx={{ borderRadius: '8px', textTransform: 'none', color: '#555', borderColor: '#ccc' }} onClick={() => navigate('/pos')}>
              Cambiar
            </Button>
          </Box>

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Platillos seleccionados ({orderItems.length})</Typography>
          
          {/* Lista de Items */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, flexGrow: 1 }}>
            {orderItems.map(item => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box component="img" src={item.image} sx={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" lineHeight={1.2} mb={0.5}>{item.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ p: 0.2 }}><RemoveIcon fontSize="small" /></IconButton>
                      <Typography variant="body2" sx={{ px: 1, minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ p: 0.2 }}><AddIcon fontSize="small" /></IconButton>
                    </Box>

                    <Typography variant="subtitle2" fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Typography>
                    <IconButton size="small" onClick={() => removeItem(item.id)} sx={{ color: '#999', p: 0.5 }}><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Totales */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" fontWeight="bold" color={textDark}>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Impuestos (16%)</Typography>
              <Typography variant="body2" fontWeight="bold" color={textDark}>${tax.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color={textDark}>Total</Typography>
              <Typography variant="h6" fontWeight="bold" color={activeGreen}>${total.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ bgcolor: cardBg, p: 2, borderRadius: '12px', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CafeIcon sx={{ color: '#8d7b68', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight="bold" color="#5a4c3e">Incluye:</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon sx={{ color: activeGreen, fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary">Café americano de cortesía</Typography>
              </Box>
            </Box>

            <Button 
              fullWidth variant="contained" endIcon={<ArrowForwardIcon />}
              sx={{ bgcolor: activeGreen, textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1.5, mb: 1, '&:hover': { bgcolor: '#386144' } }}
            >
              Continuar a pedido
            </Button>
            <Button 
              fullWidth variant="outlined" startIcon={<CloseIcon />}
              sx={{ color: '#666', borderColor: '#D0D0D0', textTransform: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1, '&:hover': { bgcolor: '#F5F5F5', borderColor: '#999' } }}
            >
              Cancelar orden
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuCarta;