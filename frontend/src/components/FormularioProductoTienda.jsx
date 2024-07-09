import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';

// Hook personalizado para manejar formularios
const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return [formData, handleChange];
};

// Estilos comunes para los modales.
const commonStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: '#41B06E',
  borderRadius: '10px',
  width: '700px',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  border: '2px solid #ffffff',
  boxShadow: 24,
  p: 4,
};

// Formulario para agregar productos
const FormularioProductoTienda = ({ onSubmit }) => {
  const [formData, handleChange] = useForm({
    codProducto: '',
    nombre: '',
    descripcion: '',
    precio: '',
    ecologico: '',
    codLinea: '',
    existencia: '',
    imagen: ''
  });

  console.log(formData);



  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" sx={commonStyles} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <h3>Ingrese los Siguientes Datos</h3>
      <TextField label="Código de Producto" name="codProducto" value={formData.codProducto} onChange={handleChange} sx={{ margin: '10px' }} fullWidth />
      <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} sx={{ margin: '10px' }} fullWidth />
      <TextField label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} sx={{ margin: '10px' }} fullWidth />
      <TextField label="Precio" name="precio" value={formData.precio} onChange={handleChange} type="number" sx={{ margin: '10px' }} fullWidth />
      <TextField
        select
        label="Ecológico"
        name="ecologico"
        value={formData.ecologico}
        onChange={handleChange}
        sx={{ margin: '10px' }}
        fullWidth
      >
        <MenuItem value="Si">Sí</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </TextField>
      <TextField label="Código de Línea" name="codLinea" value={formData.codLinea} onChange={handleChange} sx={{ margin: '10px' }} fullWidth />
      <TextField label="Existencia" name="existencia" value={formData.existencia} onChange={handleChange} type="number" sx={{ margin: '10px' }} fullWidth />
      <TextField label="URL de Imagen" name="imagen" value={formData.imagen} onChange={handleChange} sx={{ margin: '10px' }} fullWidth />
      <Button type="submit" variant="contained" sx={{ margin: '5px 0', color: '#000000', bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#41B06E', color: '#FFFFFF' } }}>
        Agregar Producto
      </Button>
    </Box>
  );
};

FormularioProductoTienda.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FormularioProductoTienda;
