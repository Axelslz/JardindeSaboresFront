import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogActions, 
  Button, TextField, Grid, InputAdornment, Typography, MenuItem, 
  Box, useTheme, alpha, Grow
} from '@mui/material';
import { 
  LocalBar, Fastfood, Liquor, SportsBar, Coffee, Category, Inventory,
  Sell, InfoOutlined
} from '@mui/icons-material';

const goldColor = '#D4AF37'; 

const CATEGORIAS_BAR = [
  { name: 'Cervezas', icon: <SportsBar fontSize="small" sx={{ mr: 1.5, color: goldColor }}/> },
  { name: 'Licores', icon: <Liquor fontSize="small" sx={{ mr: 1.5, color: goldColor }}/> },
  { name: 'Coctelería', icon: <LocalBar fontSize="small" sx={{ mr: 1.5, color: goldColor }}/> },
  { name: 'Refrescos y Aguas', icon: <Coffee fontSize="small" sx={{ mr: 1.5, color: goldColor }}/> },
  { name: 'Botanas', icon: <Fastfood fontSize="small" sx={{ mr: 1.5, color: goldColor }}/> },
  { name: 'Otros', icon: <Category fontSize="small" sx={{ mr: 1.5, color: goldColor }}/> }
];

const Transition = function(props) {
  return <Grow {...props} />;
};

export default function ProductForm({ open, handleClose, onSave, initialData }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const defaultState = {
    name: '',
    barcode: '',
    category: 'Cervezas', 
    stock: '',
    cost: '', 
    priceRetail: '',
    priceHalf: '' 
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        name: initialData.name || '',
        barcode: initialData.barcode || '',
        category: initialData.category || 'Cervezas',
        stock: initialData.stock !== undefined && initialData.stock !== null ? initialData.stock : '',
        cost: initialData.cost !== undefined && initialData.cost !== null ? initialData.cost : '',
        priceRetail: initialData.priceRetail || '',
        priceHalf: initialData.priceHalf || ''
      }); 
    } else {
      setFormData(defaultState);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productToSend = {
      ...formData,
      name: formData.name.trim(),
      barcode: formData.barcode ? formData.barcode.trim() : '',
      stock: formData.stock === '' ? 0 : parseFloat(formData.stock) || 0,
      cost: formData.cost === '' ? 0 : parseFloat(formData.cost) || 0, 
      priceRetail: parseFloat(formData.priceRetail) || 0,
      priceHalf: parseFloat(formData.priceHalf) || 0,
      category: formData.category
    };
    onSave(productToSend);
    handleClose();
  };

  const categoryLower = formData.category ? formData.category.toLowerCase() : '';
  const isFoodOrSnack = categoryLower === 'botanas' || categoryLower === 'alimentos' || categoryLower === 'comida';
  
  const totalInversion = (parseFloat(formData.stock) || 0) * (parseFloat(formData.cost) || 0);

  const sectionStyle = {
    p: 3, 
    borderRadius: 3, 
    bgcolor: isDark ? alpha('#fff', 0.03) : alpha('#000', 0.02),
    border: `1px solid ${isDark ? alpha('#fff', 0.1) : alpha('#000', 0.1)}`,
    mb: 3
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth 
      TransitionComponent={Transition}
      PaperProps={{ 
        sx: { 
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: theme.palette.background.paper,
          backgroundImage: 'none',
          maxHeight: '90vh'
        } 
      }}
    >
      <Box sx={{ 
        bgcolor: isDark ? '#111' : '#fff', 
        color: isDark ? '#fff' : '#111', 
        px: 4, 
        py: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        borderBottom: `4px solid ${goldColor}` 
      }}>
        <Box sx={{ p: 1, bgcolor: alpha(goldColor, 0.15), borderRadius: 2, display: 'flex' }}>
          <LocalBar fontSize="medium" sx={{ color: goldColor }} />
        </Box>
        <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: 0.5 }}>
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DialogContent 
          sx={{ 
            p: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDark ? alpha('#fff', 0.15) : alpha('#000', 0.15),
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isDark ? alpha('#fff', 0.3) : alpha('#000', 0.3),
            }
          }}
        >
          <Box sx={{ p: 4 }}>
            {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
            <Box sx={sectionStyle}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlined fontSize="small" /> INFORMACIÓN GENERAL
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    select 
                    label="Categoría" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    variant="outlined" 
                  >
                    {CATEGORIAS_BAR.map((cat) => (
                      <MenuItem key={cat.name} value={cat.name} sx={{ py: 1.5, fontWeight: 500 }}>
                        {cat.icon} {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Código de Barras (Opcional)" 
                    name="barcode" 
                    value={formData.barcode} 
                    onChange={handleChange} 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Escanea aquí..." 
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    autoFocus 
                    label="Nombre de Bebida o Platillo" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    variant="outlined" 
                    placeholder="Ej. Corona 355ml o Nachos" 
                    InputProps={{ sx: { fontSize: '1.1rem', fontWeight: 500 } }} 
                  />
                </Grid>
              </Grid>
            </Box>

            {!isFoodOrSnack && (
              <Box sx={sectionStyle}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory fontSize="small" /> INVERSIÓN Y STOCK (OPCIONAL)
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                        label="Costo de Inversión (Pza)"
                        name="cost"
                        type="number"
                        value={formData.cost}
                        onChange={handleChange}
                        fullWidth
                        placeholder="0.00"
                        inputProps={{ min: 0, step: "any" }} 
                        InputProps={{ 
                          startAdornment: <InputAdornment position="start"><Typography fontWeight="bold" color="text.secondary">$</Typography></InputAdornment>,
                          sx: { fontSize: '1.1rem', fontWeight: 600 } 
                        }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                        label="Stock Inicial (Pzs)"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        fullWidth
                        placeholder="0"
                        inputProps={{ min: 0, step: "any" }} 
                        InputProps={{ sx: { fontSize: '1.1rem', fontWeight: 600 } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ 
                      bgcolor: alpha(goldColor, 0.08), 
                      p: 2.5, 
                      borderRadius: 2, 
                      border: `1px dashed ${goldColor}`, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="700">
                        INVERSIÓN TOTAL EN LOTE:
                      </Typography>
                      <Typography variant="h6" sx={{ color: goldColor, fontWeight: '900' }}>
                        ${totalInversion.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* SECCIÓN 3: PRECIO AL PÚBLICO */}
            <Box sx={{ ...sectionStyle, mb: 0 }}>
              <Typography variant="subtitle2" sx={{ color: goldColor, fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sell fontSize="small" /> PRECIO DE VENTA AL PÚBLICO
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={isFoodOrSnack ? 6 : 12}>
                  <TextField
                    label={isFoodOrSnack ? "Precio Orden Completa" : "Precio Venta (Pza)"}
                    name="priceRetail"
                    type="number"
                    value={formData.priceRetail}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="0.00"
                    inputProps={{ min: 0, step: "any" }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography variant="h6" color="text.primary" fontWeight="bold">$</Typography></InputAdornment>,
                      sx: { fontWeight: '800', fontSize: '1.4rem' }
                    }}
                  />
                </Grid>

                {isFoodOrSnack && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Precio Media Orden (Opc.)"
                      name="priceHalf"
                      type="number"
                      value={formData.priceHalf}
                      onChange={handleChange}
                      fullWidth
                      placeholder="0.00"
                      inputProps={{ min: 0, step: "any" }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography variant="h6" color="text.secondary" fontWeight="bold">$</Typography></InputAdornment>,
                        sx: { fontWeight: '600', fontSize: '1.2rem' }
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>

          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 4, py: 3, bgcolor: theme.palette.background.default, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleClose} 
            variant="text" 
            sx={{ color: 'text.secondary', fontWeight: 'bold', px: 3 }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              borderRadius: 2, 
              fontWeight: '800', 
              px: 4, 
              py: 1.2, 
              bgcolor: goldColor, 
              color: '#111', 
              boxShadow: `0px 4px 15px ${alpha(goldColor, 0.3)}`,
              '&:hover': { 
                bgcolor: '#B8860B',
                transform: 'translateY(-2px)',
                boxShadow: `0px 6px 20px ${alpha(goldColor, 0.4)}`
              } 
            }}
          >
            GUARDAR PRODUCTO
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}