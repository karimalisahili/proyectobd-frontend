import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import NbLateral from '../components/NbLateral';
import ListaProductos from '../components/ListaProductos';
import ListaPagos from '../components/ListaPagos';
import ListaFacturas from '../components/ListaFacturas';
import { Box, Button } from '@mui/material';

const Tienda = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('Compras');

  const renderLista = () => {
    switch (opcionSeleccionada) {
      case 'Compras':
        return <ListaProductos />;
      case 'Pagos':
        return <ListaPagos />;
      case 'Facturas':
        return <ListaFacturas />;
      default:
        return <ListaProductos />;
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '200px', backgroundColor: '#8DECB4', padding: '10px' }}>
          <Button 
            onClick={() => setOpcionSeleccionada('Compras')} 
            sx={{ color: 'white', display: 'block', marginBottom: '10px' }}
          >
            Compras
          </Button>
          <Button 
            onClick={() => setOpcionSeleccionada('Pagos')} 
            sx={{ color: 'white', display: 'block', marginBottom: '10px' }}
          >
            Pagos
          </Button>
          <Button 
            onClick={() => setOpcionSeleccionada('Facturas')} 
            sx={{ color: 'white', display: 'block', marginBottom: '10px' }}
          >
            Facturas
          </Button>
        </Box>
        <Box sx={{ flex: 1, padding: '20px' }}>
          {renderLista()}
        </Box>
      </Box>
    </div>
  );
}

export default Tienda;
