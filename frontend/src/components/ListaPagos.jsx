import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const pagosFicticiosIniciales = [
  { id: 1, descripcion: 'Pago 1', monto: '100.00', fecha: '2024-01-01' },
  { id: 2, descripcion: 'Pago 2', monto: '200.00', fecha: '2024-02-01' },
  { id: 3, descripcion: 'Pago 3', monto: '300.00', fecha: '2024-03-01' },
  { id: 4, descripcion: 'Pago 4', monto: '400.00', fecha: '2024-04-01' },
];

const ListaPagos = () => {
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  return (
    <Box>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <List sx={{ maxHeight: '250px', overflowY: 'auto' }}>
          {pagosFicticiosIniciales.map((pago) => (
            <ListItem button key={pago.id} onClick={() => setPagoSeleccionado(pago)}>
              <ListItemText primary={pago.descripcion} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
        {pagoSeleccionado ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{pagoSeleccionado.descripcion}</Typography>
            <Typography>Monto: ${pagoSeleccionado.monto}</Typography>
            <Typography>Fecha: {pagoSeleccionado.fecha}</Typography>
          </Box>
        ) : (
          <Typography>No se ha seleccionado ningún pago</Typography>
        )}
      </Box>
    </Box>
  );
}

ListaPagos.propTypes = {};

export default ListaPagos;
