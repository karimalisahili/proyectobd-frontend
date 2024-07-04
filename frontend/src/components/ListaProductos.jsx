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


const SERVERNAME = import.meta.env.VITE_SERVERNAME;

function useForm(initialState) {
  // Inicializa el estado del formulario con el estado inicial proporcionado
  const [formData, setFormData] = useState(initialState);

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    // Extrae el nombre y el valor del campo que disparó el evento
    const { name, value } = e.target;
    // Actualiza el estado del formulario con el nuevo valor para el campo especificado
    setFormData(prevState => ({
      ...prevState, // Copia el estado anterior del formulario
      [name]: value // Actualiza el valor del campo especificado
    }));
  };
}

// Define una función asíncrona llamada sendData
async function sendData(endpoint, formData, method) {
  console.log(formData, method, endpoint)
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers your request needs
    },
    body: JSON.stringify(formData), // Convert the data to JSON format
  });

  // Check if the response is OK and the content type is JSON
  if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
    return response.json();
  } else {
    // Handle non-JSON responses or errors
    const text = await response.text(); // Read response as text to avoid JSON parse error
    throw new Error(`Failed to fetch JSON. Status: ${response.status}, Body: ${text}`);
  }
}

// Define un componente funcional FormBox que acepta props, incluyendo children y onSubmit
const FormBox = ({ children, onSubmit, ...props  }) => (
  // Retorna un componente Box actuando como un formulario
  <Box component="form" sx={commonStyles} noValidate autoComplete="off" onSubmit={onSubmit} {...props}>
    {/*Dentro del Box, muestra un encabezado con un mensaje*/}
    <h3>Ingrese los Siguientes Datos</h3>
    {/*Renderiza cualquier hijo pasado al FormBox (usualmente campos de formulario)*/}
      {children}
  </Box>
);


// Define un componente funcional InputField que acepta varias props para configurar el campo
const InputField = ({ label, type, name, min, valor, cambio }) => (
  // Retorna un componente TextField con varias props configuradas
  <TextField
    label={label} // Establece la etiqueta del campo
    type={type} // Establece el tipo de input (ej. text, number)
    name={name} // Establece el nombre del campo, importante para identificarlo al enviar el formulario
    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} // Estilos personalizados
    InputProps={min ? { inputProps: { min } } : {}} // Propiedad condicional para establecer el valor mínimo si se proporciona
    value={valor} // Vincula el valor del campo a la variable 'valor'
    onChange={cambio} // Maneja el evento de cambio para actualizar el estado con el nuevo valor del campo
  />
);

function Compras({ data = null, isEditing = false }) {
  const initialValues = {
    CodProd: data?.CodProd || ''
  };

  const [formData, handleChange] = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
  const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  
  const endpoint = `${SERVERNAME}/productos_tienda`;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    await sendData(endpoint, formData, method);
    alert('Operación realizada correctamente');
  } catch (error) {
    console.error('Error en la operación', error);
    if (error.message.includes('404')) {
      alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
    } else {
      alert('Error en la operación. Por favor, intente nuevamente.');
    }
  }
  };
  
  const handleDelete = async () => {
  const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este producto?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  const endpoint = `${SERVERNAME}/productos_tienda`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData, 'DELETE');
    alert('Producto eliminado correctamente');
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el producto', error);
    alert('Error al eliminar el producto. Por favor, intente nuevamente.');
  }
};

  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <FormBox onSubmit={handleSubmit}> 
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el nombre del empleado */}
          <InputField label="CÓDIGO-PRODUCTO" type='number' name='CodProd' min={0}
            valor={formData.CodProd} cambio={handleChange}/>
          {/* InputField para el salario del empleado */}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Button type='submit'  variant="contained" sx={{
        margin: '5px 20px',
        color: '#000000',
        bgcolor: '#FFFFFF',
        '&:hover': {
            bgcolor: '#41B06E',
            color: '#FFFFFF'
          }
        }}
        >
        {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
      </Button>
      {isEditing && (
  <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
    Eliminar
  </Button>
)}
      </Box>
    </FormBox>
  );
}






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