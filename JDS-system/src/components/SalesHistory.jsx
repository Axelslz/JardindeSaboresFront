import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, 
  Box, Typography, DialogActions, TextField, TableContainer, Chip, 
  Paper, Dialog, DialogTitle, DialogContent, useTheme 
} from '@mui/material';
import { Visibility, Print } from '@mui/icons-material'; 
import { generateTicketHTML } from '../utils/printTicket'; 
import { getSalesHistoryService } from '../services/saleService';

export default function SalesHistory() {
  const theme = useTheme();
  const [sales, setSales] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [ticketHTML, setTicketHTML] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await getSalesHistoryService();
        setSales(data);
      } catch (error) {
        console.error("Error al cargar el historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleOpenPreview = async (sale, splitIndex = null) => {
    setIsPreviewOpen(true);
    setTicketHTML('');

    const itemsList = sale.SaleItems || sale.items || sale.cart || [];
    const ticketNumStr = sale.ticketNumber ? sale.ticketNumber.toString() : '';
    
    let ways = 1;
    if (sale.splitWays > 1) {
      ways = sale.splitWays;
    } else if (ticketNumStr === 'DIVIDIDO') {
      ways = 2;
    } else if (ticketNumStr.startsWith('DIV-')) {
      ways = parseInt(ticketNumStr.split('-')[1]) || 2;
    }

    const isSplitNumber = splitIndex !== null;
    const ticketTotal = isSplitNumber ? (parseFloat(sale.total) / ways) : parseFloat(sale.total);
    const rawTip = sale.tip ? parseFloat(sale.tip) : 0;
    const ticketTip = isSplitNumber ? (rawTip / ways) : rawTip;
    const grandTotal = ticketTotal + ticketTip;

    const realAmountPaid = isSplitNumber 
      ? (sale.amountPaid ? (parseFloat(sale.amountPaid) / ways) : grandTotal)
      : (sale.amountPaid !== undefined && sale.amountPaid !== null ? parseFloat(sale.amountPaid) : grandTotal);

    const realChange = isSplitNumber
      ? (sale.change ? (parseFloat(sale.change) / ways) : 0)
      : (sale.change !== undefined && sale.change !== null ? parseFloat(sale.change) : 0);

    const saleData = {
      id: sale.id,
      ticketNumber: isSplitNumber ? `${sale.ticketNumber || 'DIV'}-${splitIndex}` : sale.ticketNumber,
      date: sale.createdAt || sale.date,
      paymentMethod: sale.paymentMethod,
      seller: sale.seller,
      total: ticketTotal,
      tip: ticketTip, 
      amountPaid: realAmountPaid, 
      change: realChange,
      splitWays: ways, 
      splitAmount: isSplitNumber ? grandTotal : (sale.splitAmount || grandTotal), 
      items: itemsList.map(item => ({
        name: item.productName || item.name,
        quantity: item.quantity,
        price: isSplitNumber ? (parseFloat(item.price) / ways) : parseFloat(item.price)
      }))
    };

    const customerInfo = {
      name: sale.customerName,
      address: isSplitNumber ? `Cuenta Dividida - Ticket ${splitIndex} de ${ways}` : sale.customerAddress,
      phone: sale.customerPhone
    };

    try {
      const html = await generateTicketHTML(saleData, customerInfo);
      setTicketHTML(html);
    } catch (error) {
      console.error("Error al generar la vista previa del ticket:", error);
      setTicketHTML('<div style="padding: 20px; text-align: center;">Error al generar el ticket.</div>');
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTicketHTML('');
  };

  const handlePrintTicket = () => {
    if (!ticketHTML) return;
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
      printWindow.document.write(ticketHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const filteredSales = sales?.filter((sale) => {
    const folio = sale.ticketNumber ? sale.ticketNumber.toString().toLowerCase() : `f-${sale.id}`.toLowerCase();
    const tableName = (sale.mesa || sale.tableName || 'Mostrador').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return folio.includes(searchLower) || tableName.includes(searchLower);
  }) || [];

  return (
    <Box sx={{ p: 4, height: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
        Historial de Ventas
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <TextField
          fullWidth
          size="small"
          label="Buscar por folio o mesa..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Folio</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Mesa</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Artículos</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>Cargando ventas...</TableCell></TableRow>
            ) : (!sales || sales.length === 0) ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No hay ventas registradas actualmente.</TableCell></TableRow>
            ) : filteredSales.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No se encontraron coincidencias</TableCell></TableRow>
            ) : (
              filteredSales.map((sale) => {
                const itemsList = sale.SaleItems || sale.items || sale.cart || [];
                const folioAMostrar = sale.ticketNumber ? sale.ticketNumber : `F-${sale.id}`;
                const ticketNumStr = sale.ticketNumber ? sale.ticketNumber.toString() : '';
                
                const isSplit = sale.splitWays > 1 || ticketNumStr === 'DIVIDIDO' || ticketNumStr.startsWith('DIV-');
                
                let ways = 1;
                if (sale.splitWays > 1) {
                  ways = sale.splitWays;
                } else if (ticketNumStr === 'DIVIDIDO') {
                  ways = 2;
                } else if (ticketNumStr.startsWith('DIV-')) {
                  ways = parseInt(ticketNumStr.split('-')[1]) || 2;
                }

                return (
                  <TableRow key={sale.id} hover>
                    <TableCell sx={{ color: 'text.primary' }}>#{folioAMostrar}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          {sale.mesa || sale.tableName || 'Mostrador'}
                        </Typography>
                        {isSplit && (
                          <Chip 
                            label="Dividida" 
                            size="small" 
                            color="error" 
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {new Date(sale.createdAt || sale.date).toLocaleString('es-MX')}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="body2" sx={{ mr: 0.5, color: 'text.primary' }}>
                          {itemsList.length} art. {isSplit && `(en ${ways} partes)`}
                        </Typography>
                        {itemsList.length > 0 && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {!isSplit ? (
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleOpenPreview(sale)}
                                title="Ver ticket completo"
                                sx={{ 
                                  p: '2px 5px', 
                                  border: `1px solid ${theme.palette.primary.main}`, 
                                  borderRadius: '4px'
                                }}
                              >
                                <Visibility sx={{ fontSize: '0.85rem' }} />
                              </IconButton>
                            ) : (
                              Array.from({ length: ways }).map((_, idx) => (
                                <IconButton 
                                  key={idx}
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleOpenPreview(sale, idx + 1)}
                                  title={`Ver Ticket Parte ${idx + 1}`}
                                  sx={{ 
                                    p: '2px 5px', 
                                    border: `1px solid ${theme.palette.primary.main}`, 
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                  }}
                                >
                                  <Visibility sx={{ fontSize: '0.85rem' }} />
                                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
                                    {idx + 1}
                                  </Typography>
                                </IconButton>
                              ))
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      ${(parseFloat(sale.total) + (sale.tip ? parseFloat(sale.tip) : 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={isPreviewOpen} 
        onClose={handleClosePreview} 
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pb: 1, color: 'text.primary' }}>
          Reimpresión de Ticket
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '450px', backgroundColor: theme.palette.background.default }}>
          {ticketHTML ? (
            <iframe
              srcDoc={ticketHTML}
              style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }}
              title="Vista previa del ticket"
            />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="text.secondary">Generando ticket...</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
          <Button onClick={handleClosePreview} variant="outlined" color="inherit" sx={{ flex: 1 }}>
            Cerrar
          </Button>
          <Button 
            onClick={handlePrintTicket} 
            variant="contained" 
            color="primary" 
            startIcon={<Print />}
            disabled={!ticketHTML}
            sx={{ flex: 1 }}
          >
            Imprimir Copia
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}