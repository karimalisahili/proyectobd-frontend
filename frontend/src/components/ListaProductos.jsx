import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Modal, Typography } from '@mui/material';
import FormularioProductoTienda from './FormularioProductoTienda';
import PropTypes from 'prop-types';

// Productos ficticios iniciales
const productosFicticiosIniciales = [
  { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del Producto 1', precio: '10.00', ecologico: 'Si', codLinea: 'A1', existencia: '100', imagen: 'https://via.placeholder.com/150' },
  { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del Producto 2', precio: '20.00', ecologico: 'No', codLinea: 'A2', existencia: '200', imagen: 'https://via.placeholder.com/150' },
  { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del Producto 3', precio: '30.00', ecologico: 'Si', codLinea: 'A3', existencia: '300', imagen: 'https://via.placeholder.com/150' },
  { id: 4, nombre: 'Producto 4', descripcion: 'Descripción del Producto 4', precio: '40.00', ecologico: 'No', codLinea: 'A4', existencia: '400', imagen: 'https://via.placeholder.com/150' },
];

// Estilos para el componente Box.
const style = {
  py: 0,
  width: '80%',
  borderColor: 'divider',
  backgroundColor: 'Transparent',
  color: 'black',
};

const ListaProductos = () => {
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState(productosFicticiosIniciales);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setProductoSeleccionado(null);
  };

  const agregarProducto = (nuevoProducto) => {
    setProductos([...productos, { ...nuevoProducto, id: productos.length + 1 }]);
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }}>
            {productos.map((producto) => (
              <ListItem button key={producto.id} onClick={() => setProductoSeleccionado(producto)}>
                <ListItemText primary={producto.nombre} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt: 3 }} onClick={handleOpen}>
            Agregar Producto
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <FormularioProductoTienda onSubmit={agregarProducto} />
          </Modal>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
        {productoSeleccionado ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{productoSeleccionado.nombre}</Typography>
            <Typography>Descripción: {productoSeleccionado.descripcion}</Typography>
            <Typography>Precio: ${productoSeleccionado.precio}</Typography>
            <Typography>Ecológico: {productoSeleccionado.ecologico}</Typography>
            <Typography>Código de Línea: {productoSeleccionado.codLinea}</Typography>
            <Typography>Existencia: {productoSeleccionado.existencia}</Typography>
            {productoSeleccionado.imagen && (
              <Box component="img" src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} sx={{ marginTop: '10px', maxHeight: '150px' }} />
            )}
          </Box>
        ) : (
          <Typography>No se ha seleccionado ningún producto</Typography>
        )}
      </Box>
    </Box>
  );
}

ListaProductos.propTypes = {};

export default ListaProductos;