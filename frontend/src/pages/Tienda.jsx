import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import NbLateral from '../components/NbLateral';
import ListaProductos from '../components/ListaProductos';
import ListaPagos from '../components/ListaPagos';
import ListaFacturas from '../components/ListaFacturas';
import React,{ useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography } from '@mui/material';
const style = {
  py: 0,
  width: '80%',
  borderColor: 'divider',
  backgroundColor: 'Transparent',
  color: 'black',
};

// Estilos comunes para los modales. Incluye la posición, alineación, color de fondo, bordes,
// sombra, padding, y otros estilos para asegurar una apariencia consistente y centrada de los modales.
// Estos estilos se aplican a los componentes Modal de Material UI.
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

// Define un estilo base para la lista y lo extiende con propiedades específicas para controlar su altura máxima y el desbordamiento vertical
const listStyle = { ...style, maxHeight: '320px', overflowY: 'auto' };

function renderList(items, textKey, secondaryKey, onSeleccionado) {

  const [Seleccionado, setSeleccionado] = useState(null);

  const manejarClicSeleccionado = (seleccion) => {
    setSeleccionado(seleccion);
    onSeleccionado(seleccion);
};
  // Retorna un componente List de Material-UI con un estilo personalizado
  return (
    <List sx={listStyle}>
      {/* Mapea cada elemento del array 'items' a un componente ListItem */}
      {items.map((item, index) => (
        // Cada ListItem tiene una key única basada en su índice para optimizar el renderizado
        <ListItem key={index} button onClick={() => manejarClicSeleccionado(item)}>
          {/* ListItemText muestra el texto principal y secundario basado en las claves proporcionadas */}
          <ListItemText primary={item[textKey]} />
            {/* Muestra el valor secundario directamente sin un componente específico */}
            {item[secondaryKey]}
        </ListItem>
      ))}
    </List>
  );
}


// Define una función para mostrar una lista basada en la opción seleccionada
function mostrarLista(opcion, empleadosSeleccionados, clientesSeleccionados, vehiculosSeleccionados, onSeleccionado) {
  // Utiliza una estructura switch para manejar las diferentes opciones
  switch (opcion) {
    case 'Personal':
      // Renderiza y retorna una lista de empleados seleccionados
      return renderList(empleadosSeleccionados, 'Nombre', 'Cedula', onSeleccionado);
    case 'Cliente':
      // Renderiza y retorna una lista de clientes seleccionados
      return renderList(clientesSeleccionados, 'NombreResponsable', 'CIResponsable', onSeleccionado);
    case 'Vehiculo':
      // Renderiza y retorna una lista de vehículos seleccionados
      return renderList(vehiculosSeleccionados, 'Placa', 'CodVehiculo', onSeleccionado);
    default:
      // Retorna un párrafo indicando que se debe seleccionar una opción si ninguna coincide
      return <p>Seleccione una opción</p>;
  }
}


const Tienda = ({opcion}) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('Compras');
  console.log(opcion)
  // Estado para controlar la visibilidad del modal
  const [open, setOpen] = useState(false);
  // Estado para determinar el tipo de formulario a mostrar en el modal
  const [formType, setFormType] = useState('');
  const [open2, setOpen2] = useState(false);


  const [compraSeleccionada, setCompraSeleccionada] = useState([]);
  const [pagoSeleccionado, setPagoSeleccionado] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

   // useEffect para cargar datos de empleados, clientes y vehículos al montar el componente
   useEffect(() => {
    // Función asíncrona para obtener datos de un endpoint y actualizar el estado correspondiente
    const obtenerDatos = async (endpoint, setter) => {
      try {
        // Realiza la petición fetch al servidor y espera la respuesta
        const respuesta = await fetch(`${SERVERNAME}/${endpoint}`);
        // Convierte la respuesta a formato JSON
        const datos = await respuesta.json();
        // Actualiza el estado correspondiente con los datos obtenidos
        setter(datos);
      } catch (error) {
        // Captura y registra errores en la consola
        console.error(`Error al obtener datos de ${endpoint}:`, error);
      }
    };

    // Llama a obtenerDatos para cada tipo de dato necesario
    obtenerDatos('PAGOS', setPagoSeleccionado);
    obtenerDatos('PRODUCTOS', setCompraSeleccionada);
    obtenerDatos('FACTURAS_TIENDAS', setFacturaSeleccionada);
    obtenerDatos('PRODUCTOS_TIENDA', SetProductoSeleccionado);
  }, []);
  
  // Función para manejar la apertura del modal y establecer el tipo de formulario
  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
  };

  const handleOpen2 = (type) => {
    setFormType(type);
    setOpen2(true);
  };

  const closeModal = () => {
    setOpen(false);
    setOpen2(false);
};

  // Función para renderizar el formulario correspondiente en el modal
  const renderForm = (info, editar) => {
    switch (formType) {
      case 'Personal':
        return <Personal data={info} isEditing={editar}/>;
      case 'Cliente':
        return <Cliente data={info} isEditing={editar}/>;
      case 'Vehiculo':
        return <Vehiculo data={info} isEditing={editar}/>;
      default:
        return <div> fallo </div>;
    }
  };

  const [seleccionEnLists, setSeleccionEnLists] = useState(null);

  // Función para manejar la selección desde renderList
  const manejarSeleccionEnLists = (seleccion) => {
    setSeleccionEnLists(seleccion);
    // Aquí puedes hacer algo más con la selección en el componente Lists
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
          {renderList()}
        </Box>
      </Box>
    </div>
  );
}

Tienda.propTypes= {
  opcion: PropTypes.string, // 'opcion' debe ser una cadena de texto y es requerida
  raiz: PropTypes.string // 'raiz' debe ser una cadena de texto y es requerida
};

export default Tienda;
