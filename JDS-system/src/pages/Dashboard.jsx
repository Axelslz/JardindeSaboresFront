import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Avatar, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, Button, Chip
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { 
  Person, ChildCare, LocalCafe, AttachMoney, 
  ArrowUpward, CalendarToday, AccessTime, 
  AddCircleOutline, Receipt, RestaurantMenu, 
  BarChart as ChartIcon, People, Settings,
  TableRestaurant, Groups
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const kpiData = [
  { id: 1, title: 'Paquetes Adulto', value: '38', subtitle: 'Órdenes hoy', trend: '+ 12% vs ayer', icon: <Person />, color: '#4CAF50', bg: '#E8F5E9' },
  { id: 2, title: 'Paquetes Niño', value: '15', subtitle: 'Órdenes hoy', trend: '+ 8% vs ayer', icon: <ChildCare />, color: '#FF9800', bg: '#FFF3E0' },
  { id: 3, title: 'Desayunos a la Carta', value: '22', subtitle: 'Órdenes hoy', trend: '+ 15% vs ayer', icon: <LocalCafe />, color: '#2196F3', bg: '#E3F2FD' },
  { id: 4, title: 'Ventas del Día', value: '$18,450', subtitle: 'Ingresos totales', trend: '+ 18% vs ayer', icon: <AttachMoney />, color: '#9C27B0', bg: '#F3E5F5' },
];

const barData = [
  { name: 'Paquetes Adulto', value: 10800, color: '#4CAF50' },
  { name: 'Paquetes Niño', value: 2700, color: '#FF9800' },
  { name: 'A la Carta', value: 4950, color: '#2196F3' },
];

const topProducts = [
  { id: 1, name: 'Buffet Adulto', orders: 38, image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=100&auto=format&fit=crop' },
  { id: 2, name: 'Buffet Niño', orders: 15, image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=100&auto=format&fit=crop' },
  { id: 3, name: 'Chilaquiles', orders: 12, image: 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=100&auto=format&fit=crop' },
  { id: 4, name: 'Hot Cakes', orders: 9, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=100&auto=format&fit=crop' },
  { id: 5, name: 'Omelette', orders: 7, image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=100&auto=format&fit=crop' },
];

const recentOrders = [
  { time: '08:45 AM', table: 'Mesa 5', type: 'Adulto', typeColor: '#4CAF50', desc: 'Buffet Adulto', total: '$280.00' },
  { time: '08:40 AM', table: 'Mesa 8', type: 'Carta', typeColor: '#2196F3', desc: 'Chilaquiles + Café', total: '$180.00' },
  { time: '08:36 AM', table: 'Mesa 2', type: 'Niño', typeColor: '#FF9800', desc: 'Buffet Niño', total: '$120.00' },
  { time: '08:30 AM', table: 'Mesa 7', type: 'Adulto', typeColor: '#4CAF50', desc: 'Buffet Adulto', total: '$280.00' },
  { time: '08:28 AM', table: 'Mesa 3', type: 'Carta', typeColor: '#2196F3', desc: 'Hot Cakes + Jugo', total: '$150.00' },
];

const quickActions = [
  { label: 'Nueva Orden', icon: <AddCircleOutline fontSize="small" />, color: '#4CAF50', bg: '#E8F5E9' },
  { label: 'Cobrar / Facturar', icon: <Receipt fontSize="small" />, color: '#FF9800', bg: '#FFF3E0' },
  { label: 'Menú', icon: <RestaurantMenu fontSize="small" />, color: '#2196F3', bg: '#E3F2FD' },
  { label: 'Reportes', icon: <ChartIcon fontSize="small" />, color: '#9C27B0', bg: '#F3E5F5' },
  { label: 'Clientes', icon: <People fontSize="small" />, color: '#795548', bg: '#EFEBE9' },
  { label: 'Configuración', icon: <Settings fontSize="small" />, color: '#607D8B', bg: '#ECEFF1' },
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const cardStyle = { borderRadius: '16px', border: '1px solid #E0E0E0', boxShadow: 'none' };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#FAF7F2', minHeight: '100vh', fontFamily: '"Inter", "Roboto", sans-serif' }}>
      
      <Box sx={{ 
        position: 'relative', width: '100%', height: '160px', borderRadius: '16px', overflow: 'hidden', mb: 3,
        backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />
        
        <Box sx={{ position: 'relative', height: '100%', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>¡Buenos días!</Typography>
              <Typography variant="h4" fontWeight="800" color="white" mb={1}>Bienvenido a Jardín de Sabores</Typography>
              <Box sx={{ display: 'flex', gap: 3, color: 'white', alignItems: 'center', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">{format(currentTime, "dd 'de' MMMM, yyyy", { locale: es })}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">{format(currentTime, "hh:mm a")}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h4" fontWeight="bold" color="white" sx={{ fontFamily: 'serif' }}>Jardín</Typography>
              <Typography variant="subtitle2" color="white" sx={{ letterSpacing: 2 }}>de Sabores</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 2. KPIs TOP ROW */}
      <Grid container spacing={3} mb={3}>
        {kpiData.map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.id}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ bgcolor: kpi.bg, color: kpi.color, width: 56, height: 56 }}>
                  {kpi.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{kpi.title}</Typography>
                  <Typography variant="h4" fontWeight="900" sx={{ my: 0.5, color: '#333' }}>{kpi.value}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{kpi.subtitle}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: kpi.color, gap: 0.5, mt: 0.5 }}>
                    <ArrowUpward sx={{ fontSize: 14 }} />
                    <Typography variant="caption" fontWeight="bold">{kpi.trend}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 3. MIDDLE ROW: CHARTS & TOP PRODUCTS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ ...cardStyle, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#333">Ventas por Categoría (Hoy)</Typography>
                <FormControl size="small">
                  <Select value="hoy" sx={{ borderRadius: '8px', height: 32, fontSize: '0.875rem' }}>
                    <MenuItem value="hoy">Hoy</MenuItem>
                    <MenuItem value="semana">Semana</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} formatter={(value) => `$${value}`} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="top" formatter={(val) => `$${val.toLocaleString()}`} style={{ fontSize: '12px', fontWeight: 'bold', fill: '#333' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ ...cardStyle, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#333">Productos más vendidos</Typography>
                <FormControl size="small">
                  <Select value="hoy" sx={{ borderRadius: '8px', height: 32, fontSize: '0.875rem' }}>
                    <MenuItem value="hoy">Hoy</MenuItem>
                    <MenuItem value="mes">Mes</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {topProducts.map((prod, index) => (
                  <Box key={prod.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {/* Medalla Simple */}
                      <Avatar sx={{ width: 24, height: 24, bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>
                        {index + 1}
                      </Avatar>
                      <Avatar src={prod.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="#333">{prod.name}</Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="subtitle2" fontWeight="bold" color="#333">{prod.orders}</Typography>
                      <Typography variant="caption" color="text.secondary">órdenes</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 4. BOTTOM ROW: TABLES & ACTIONS */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ pb: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="#333" mb={2}>Últimas órdenes</Typography>
            </CardContent>
            <TableContainer sx={{ flexGrow: 1 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F9F9F9' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#666', fontWeight: 'bold', borderBottom: 'none' }}>Hora</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 'bold', borderBottom: 'none' }}>Mesa</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 'bold', borderBottom: 'none' }}>Tipo</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 'bold', borderBottom: 'none' }}>Descripción</TableCell>
                    <TableCell align="right" sx={{ color: '#666', fontWeight: 'bold', borderBottom: 'none' }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((row, index) => (
                    <TableRow key={index} sx={{ '& td': { borderBottom: '1px solid #F0F0F0' } }}>
                      <TableCell sx={{ color: '#555' }}>{row.time}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>{row.table}</TableCell>
                      <TableCell>
                        <Chip label={row.type} size="small" sx={{ bgcolor: row.typeColor, color: '#fff', fontWeight: 'bold', borderRadius: '4px', height: 20, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell sx={{ color: '#555' }}>{row.desc}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: '#333' }}>{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ ...cardStyle, height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="#333" mb={3}>Estado del restaurante</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <TableRestaurant sx={{ color: '#4CAF50' }} />
                    <Typography variant="body1" color="#555" fontWeight="medium">Mesas ocupadas</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="#4CAF50">12</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <TableRestaurant sx={{ color: '#FF9800' }} />
                    <Typography variant="body1" color="#555" fontWeight="medium">Mesas libres</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="#FF9800">8</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Groups sx={{ color: '#795548' }} />
                    <Typography variant="body1" color="#555" fontWeight="medium">Clientes hoy</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="#795548">53</Typography>
                </Box>
              </Box>

              <Box sx={{ 
                position: 'absolute', bottom: -20, right: -20, opacity: 0.1, 
                transform: 'rotate(-10deg)', pointerEvents: 'none' 
              }}>
                <TableRestaurant sx={{ fontSize: 150 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ ...cardStyle, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="#333" mb={2}>Acciones rápidas</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {quickActions.map((action, idx) => (
                  <Button 
                    key={idx}
                    fullWidth
                    variant="contained"
                    startIcon={action.icon}
                    sx={{ 
                      bgcolor: action.bg, color: action.color, justifyContent: 'flex-start',
                      boxShadow: 'none', borderRadius: '8px', fontWeight: 'bold', py: 1,
                      textTransform: 'none', '&:hover': { bgcolor: action.bg, filter: 'brightness(0.95)', boxShadow: 'none' }
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
}