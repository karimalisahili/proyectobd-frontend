import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const facturasFicticiasIniciales = [
  { id: 1, descripcion: 'Factura 1', total: '1000.00', fecha: '2024-01-15' },
  { id: 2, descripcion: 'Factura 2', total: '2000.00', fecha: '2024-02-15' },
  { id: 3, descripcion: 'Factura 3', total: '3000.00', fecha: '2024-03-15' },
  { id: 4, descripcion: 'Factura 4', total: '4000.00', fecha: '2024-04-15' },
];

const ListaFacturas = () => {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  return (
    <Box>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <List sx={{ maxHeight: '250px', overflowY: 'auto' }}>
          {facturasFicticiasIniciales.map((factura) => (
            <ListItem button key={factura.id} onClick={() => setFacturaSeleccionada(factura)}>
              <ListItemText primary={factura.descripcion} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
        {facturaSeleccionada ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{facturaSeleccionada.descripcion}</Typography>
            <Typography>Total: ${facturaSeleccionada.total}</Typography>
            <Typography>Fecha: {facturaSeleccionada.fecha}</Typography>
          </Box>
        ) : (
          <Typography>No se ha seleccionado ninguna factura</Typography>
        )}
      </Box>
    </Box>
  );
}

ListaFacturas.propTypes = {};

export default ListaFacturas;
