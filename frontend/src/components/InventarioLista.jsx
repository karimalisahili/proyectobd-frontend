// Importación de componentes de Material UI, PropTypes y hooks de React.
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography, MenuItem, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';

// Definición de la variable SERVERNAME que obtiene el valor de la variable de entorno VITE_SERVERNAME.
// Este valor se utiliza para configurar el NombreP del servidor en la aplicación.
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

// Obtención de la información del usuario almacenada en localStorage y conversión de esta de JSON a objeto.
// Esto permite manejar la información del usuario de manera más sencilla en la aplicación.
const userJson = localStorage.getItem('user');
const user = userJson;

// Estilos para el componente Box. Se configura el padding vertical, ancho, color de borde,
// color de fondo y color de texto. Estos estilos se aplican a un componente Box de Material UI.
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



// Hook personalizado para manejar formularios
function useForm(initialState) {
  // Inicializa el estado del formulario con el estado inicial proporcionado
  const [formData, setFormData] = useState(initialState);

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    // Extrae el NombreP y el valor del campo que disparó el evento
    const { name, value } = e.target;
    // Actualiza el estado del formulario con el nuevo valor para el campo especificado
    setFormData(prevState => ({
      ...prevState, // Copia el estado anterior del formulario
      [name]: value // Actualiza el valor del campo especificado
    }));
  };

  // Devuelve el estado actual del formulario y la función handleChange
  return [formData, handleChange];
}

// Define una función asíncrona llamada sendData
async function sendData(endpoint, formData, method) {
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers your request needs
    },
    body: JSON.stringify(formData), // Convert the data to JSON format
  });

  // Check if the response is OK and the content type is JSON
  if (response.status == 200) {

    const estoyenproductos = SERVERNAME+'/productos'

    if(endpoint === estoyenproductos){
      const {CodProd, TipoPro} = formData;

      if (TipoPro === 'Tienda') {
        // Endpoint for 'Tienda' products
        const tiendaEndpoint = `${SERVERNAME}/productos_tienda`;
        // Perform the POST request
        const tiendaResponse = await fetch(tiendaEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ CodProd }),
        });

        if (tiendaResponse.status === 500) {
          throw new Error('Error al crear producto de tienda');
        }
        console.log('Producto de tienda creado con éxito');
      } else if (TipoPro === 'Servicio') {
        // Endpoint for 'Servicio' products
        const servicioEndpoint = `${SERVERNAME}/productos_servicios`;
        // Perform the POST request
        const servicioResponse = await fetch(servicioEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ CodProd }),
        });

        if (servicioResponse.status === 500) {
          throw new Error('Error al crear producto de servicio');
        }
        console.log('Producto de servicio creado con éxito');
      }
    }
    //window.location.reload();
    return response.json();
  } else {
    // Handle non-JSON responses or errors
    const text = await response.text(); // Read response as text to avoid JSON parse error
    throw new Error(`Failed to fetch JSON. Status: ${response.status}, Body: ${text}`);
  }
}

// Define un componente funcional FormBox que acepta props, incluyendo children y onSubmit
const FormBox = ({ children, onSubmit, ...props }) => (
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
    name={name} // Establece el NombreP del campo, importante para identificarlo al enviar el formulario
    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} // Estilos personalizados
    InputProps={min ? { inputProps: { min } } : {}} // Propiedad condicional para establecer el valor mínimo si se proporciona
    value={valor} // Vincula el valor del campo a la variable 'valor'
    onChange={cambio} // Maneja el evento de cambio para actualizar el estado con el nuevo valor del campo
  />
);

// Define un componente funcional llamado Personal
function Productos({ data = null, isEditing = false }) {

  const initialValues = {
    CodProd: data?.CodProd || '',
    NombreP: data?.NombreP || '',
    Descripcion: data?.Descripcion || '',
    Precio: data?.Precio || '',
    Ecologico: data?.Ecologico || '',
    Fabricante: data?.Fabricante || '',
    Maximo: data?.Maximo || '',
    Minimo: data?.Minimo || '',
    TipoPro: data?.TipoPro || '',
    CodLinea: data?.CodLinea || '',
  };

  const [formData, handleChange] = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    const endpoint = `${SERVERNAME}/productos`;
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
    const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    const endpoint = `${SERVERNAME}/productos`; // Asumiendo que CodProd es el identificador único
    try {
      await sendData(endpoint, formData, 'DELETE');
      alert('Empleado eliminado correctamente');
      // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
    } catch (error) {
      console.error('Error al eliminar el empleado', error);
      alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
    }
  };

  const [lineasSeleccionados, setlineasSeleccionados] = useState([]);

  // useEffect para cargar datos de empleados, lineas y vehículos al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener datos de un endpoint y actualizar el estado correspondiente
    const obtenerDatos = async (endpoint, setter) => {
      try {
        console.log(`${SERVERNAME}/${endpoint}`)
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
    obtenerDatos('lineas', setlineasSeleccionados);
  }, []);


  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <FormBox onSubmit={handleSubmit}>
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el NombreP del empleado */}
          <InputField label="Nombre-Producto" type='text' name='NombreP'
            valor={formData.NombreP} cambio={handleChange} />
          {/* InputField para el Precio del empleado */}
          <InputField label="Precio" type='number' name='Precio' min={1} valor={formData.Precio} cambio={handleChange} />
          <InputField label="Codigo-Producto" type='text' name='CodProd'
            valor={formData.CodProd} cambio={handleChange} />
        </Box>
      </Box>
      {/* Repite la estructura anterior para otros campos del formulario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}> 
          <TextField select label="¿Es Ecologico?" type='text' name="Ecologico" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.Ecologico} onChange={handleChange}>
              <MenuItem value="S">Si</MenuItem>
              <MenuItem value="N">No</MenuItem>
          </TextField>
          <TextField select label="Tipo Producto" type='text' name="TipoPro" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.TipoPro} onChange={handleChange}>
              <MenuItem value="Tienda">Tienda</MenuItem>
              <MenuItem value="Servicio">Servicio</MenuItem>
          </TextField>
           <TextField select label="Linea" type='number' name='CodLinea' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CodLinea} onChange={handleChange}>
                {lineasSeleccionados.map((linea, index) => (
                  <MenuItem key={index} value={linea.CodLineas}>
                    {linea.Descripcion}
                  </MenuItem>
                ))}
              </TextField>  
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="Descripcion" type='text' name='Descripcion'
            valor={formData.Descripcion} cambio={handleChange} />
          <InputField label="Fabricante" type='text' name='Fabricante'
            valor={formData.Fabricante} cambio={handleChange} />      
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>    
            <InputField label="Minimo" type='number' name='Minimo'
            valor={formData.Minimo} cambio={handleChange} />
          <InputField label="Maximo" type='number' name='Maximo'
            valor={formData.Maximo} cambio={handleChange} />      
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button type='submit' variant="contained" sx={{
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

// Define un componente funcional llamado linea
function Lineas({ data = null, isEditing = false }) {
  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para CodLineas y Descripcion
  const initialValues = {
    CodLineas: data?.CodLineas || '',
    Descripcion: data?.Descripcion || '',
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Puedes usar 'error', 'warning', 'info', 'success'
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenSnackbar(false);
};

  const [formData, handleChange] = useForm(initialValues);

  // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = `${SERVERNAME}/lineas`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await sendData(endpoint, formData, method);
       setSnackbarMessage('Línea Creada Exitosamente');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    } catch (error) {
      console.error('Error en la operación', error);
      if (error.message.includes('404')) {
        setSnackbarMessage('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Error en la operación. Por favor, intente nuevamente.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
      }
    }
  };



  const handleDelete = async () => {
    const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    const endpoint = `${SERVERNAME}/lineas`; // Asumiendo que CodProd es el identificador único
    try {
      await sendData(endpoint, formData, 'DELETE');
      alert('Empleado eliminado correctamente');
      // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
    } catch (error) {
      console.error('Error al eliminar el empleado', error);
      alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
    }
  };

  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <>
    <FormBox onSubmit={handleSubmit}>
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para la cédula del linea */}
          {/* InputField para el NombreP del linea */}
          <InputField label="Descripcion-linea" type='text' name='Descripcion' valor={formData.Descripcion} cambio={handleChange} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button type='submit' variant="contained" sx={{
          margin: '5px 0',
          color: '#000000',
          bgcolor: '#FFFFFF',
          '&:hover': {
            bgcolor: '#41B06E',
            color: '#FFFFFF'
          }
        }}>
          {isEditing ? 'Actualizar linea' : 'Agregar linea'}
        </Button>
        {isEditing && (
          <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
            Eliminar
          </Button>
        )}
      </Box>
      </FormBox>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  sx={{ bgcolor: '#41B06E',}}
  action={
    <React.Fragment>
      <Button color="secondary" size="medium" onClick={handleCloseSnackbar}>
        CERRAR
      </Button>
    </React.Fragment>
  }
/>
      </>
  );
}

// Define un componente funcional llamado Vehiculo
function Inventario({ data = null, isEditing = false }) {
  //RIFSuc,p.CodProd, p.NombreP, i.Existencia
  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para los campos del formulario
  const initialValues = {
    CodProd: data?.CodProd || '',
    NombreP: data?.NombreP || '',
    Existencia: data?.Existencia || '',

  };

  const [formData, handleChange] = useForm(initialValues);

  // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    const endpoint = `${SERVERNAME}/vehiculos`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await sendData(endpoint, formData, method);
      
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
    const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    const endpoint = `${SERVERNAME}/vehiculos`; // Asumiendo que CodProd es el identificador único
    try {
      await sendData(endpoint, formData, 'DELETE');
      alert('Empleado eliminado correctamente');
      // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
    } catch (error) {
      console.error('Error al eliminar el empleado', error);
      alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
    }
  };

  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <FormBox onSubmit={handleSubmit}>
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para la cédula del responsable */}
          <InputField label="CodProd-linea" type='text' name='Existencia'
            valor={formData.Existencia} cambio={handleChange} />
        </Box>
      </Box>
      {/* Repite la estructura anterior para otros campos del formulario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="CodProd-Inventario" type='text' name='CodProd'
            valor={formData.CodProd} cambio={handleChange} />
          <InputField label="TIPO-ACEITE" type='text' name='NombreP'
            valor={formData.NombreP} cambio={handleChange} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button type='submit' variant="contained" sx={{
          margin: '5px 0',
          color: '#000000',
          bgcolor: '#FFFFFF',
          '&:hover': {
            bgcolor: '#41B06E',
            color: '#FFFFFF'
          }
        }}>
          {isEditing ? 'Actualizar Inventario' : 'Agregar Inventario'}
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



// Define una función para renderizar una lista de elementos
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
function mostrarLista(opcion, empleadosSeleccionados, lineasSeleccionados, vehiculosSeleccionados, onSeleccionado) {
  // Utiliza una estructura switch para manejar las diferentes opciones
  switch (opcion) {
    case 'Productos':
      // Renderiza y retorna una lista de empleados seleccionados
      return renderList(empleadosSeleccionados, 'NombreP', 'CodProd', onSeleccionado);
    case 'Lineas':
      // Renderiza y retorna una lista de lineas seleccionados
      return renderList(lineasSeleccionados, 'Descripcion', 'CodLineas', onSeleccionado);
    case 'Inventario':
      // Renderiza y retorna una lista de vehículos seleccionados
      return renderList(vehiculosSeleccionados, 'CodProd', 'NombreP', onSeleccionado);
    default:
      // Retorna un párrafo indicando que se debe seleccionar una opción si ninguna coincide
      return <p>Seleccione una opción</p>;
  }
}



// Define el componente Lists que recibe una prop 'opcion'
function InventarioLista({ opcion }) {

  // Estado para controlar la visibilidad del modal
  const [open, setOpen] = useState(false);
  // Estado para determinar el tipo de formulario a mostrar en el modal
  const [formType, setFormType] = useState('');
  const [open2, setOpen2] = useState(false);

  // Estados para almacenar los datos seleccionados de empleados, lineas y vehículos
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [lineasSeleccionados, setlineasSeleccionados] = useState([]);
  const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);

  // useEffect para cargar datos de empleados, lineas y vehículos al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener datos de un endpoint y actualizar el estado correspondiente
    const obtenerDatos = async (endpoint, setter) => {
      try {
        console.log(`${SERVERNAME}/${endpoint}`)
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
    obtenerDatos(`productos`, setEmpleadosSeleccionados);
    obtenerDatos('lineas', setlineasSeleccionados);
    obtenerDatos(`inventario_view/${user.RIFSuc}`, setVehiculosSeleccionados);
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
      case 'Productos':
        return <Productos data={info} isEditing={editar} />;
      case 'Lineas':
        return <Lineas data={info} isEditing={editar} />;
      case 'Inventario':
        return <Inventario data={info} isEditing={editar} />;
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


  // Renderiza el componente
  return (
    <Box>

      <div className="vertical_line"></div>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '30%', height: 'auto' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 className='h1Libreta'>Lista de {opcion}</h1>
          {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
          {mostrarLista(opcion, empleadosSeleccionados, lineasSeleccionados, vehiculosSeleccionados, manejarSeleccionEnLists)}
          {/* Botón para abrir el modal y agregar un nuevo elemento basado en la opción seleccionada */}
          {opcion !== 'Inventario' && (
            <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, my: 3 }} onClick={() => handleOpen(opcion)}>
              Agregar {opcion}
            </Button>
          )}
          {/* Modal que se muestra u oculta basado en el estado 'open' */}
          <Modal open={open} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            {/* Renderiza el formulario correspondiente dentro del modal */}
            {renderForm(null, false)}
          </Modal>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
        {seleccionEnLists ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="circle">
              <PersonIcon sx={{ fontSize: 150 }} />
            </div>
            <h2 className='h2Libreta'>{seleccionEnLists.NombreP || ''}</h2>
            <h2 className='h2Libreta'>{seleccionEnLists.CodProd || ''}</h2>
            <h2 className='h2Libreta'>{seleccionEnLists.Descripcion || ''}</h2>
            <h2 className='h2Libreta'>{seleccionEnLists.CodLineas || ''}</h2>
          </Box>
        ) : (
          <Typography textAlign={'center'}>No se ha seleccionado ningún {opcion}</Typography>
        )}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Lista estática, posiblemente para mostrar detalles o información adicional */}
          <List sx={style}>
            {seleccionEnLists && Object.entries(seleccionEnLists).slice(Object.entries(seleccionEnLists).findIndex(entry => entry[0] === 'Descripcion' || entry[0] === 'Descripcion')).map(([key, value]) => (
              <React.Fragment key={key}>
                <ListItem>
                  <ListItemText primary={`${key}: `} />
                  {value || 'No disponible'}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
          {/* Botón para modificar, aún no implementado completamente */}
          {opcion !== 'Inventario' && (
            <Button variant="contained" sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => handleOpen2(opcion)}>
              Modificar
            </Button>
          )
          }

          <Modal open={open2} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            {/* Renderiza el formulario correspondiente dentro del modal */}
            {renderForm(seleccionEnLists, true)}
          </Modal>
        </Box>
      </Box>
    </Box>
  );
}

// Define las propiedades esperadas para el componente Lists
InventarioLista.propTypes = {
  opcion: PropTypes.string.isRequired, // 'opcion' debe ser una cadena de texto y es requerida
  raiz: PropTypes.string.isRequired, // 'raiz' debe ser una cadena de texto y es requerida
};

// Define las propiedades esperadas para el componente FormBox
FormBox.propTypes = {
  children: PropTypes.node.isRequired, // 'children' puede ser cualquier elemento React y es requerido
  onSubmit: PropTypes.func, // 'onSubmit' debe ser una función, pero no es requerida
};

// Define las propiedades esperadas para el componente InputField
InputField.propTypes = {
  label: PropTypes.string.isRequired, // 'label' debe ser una cadena de texto y es requerida
  type: PropTypes.string.isRequired, // 'type' debe ser una cadena de texto y es requerida
  name: PropTypes.string.isRequired, // 'name' debe ser una cadena de texto y es requerida
  min: PropTypes.number, // 'min' debe ser un número, pero no es requerido
  cambio: PropTypes.func, // 'cambio' debe ser una función, pero no es requerida
  valor: PropTypes.string, // 'valor' debe ser una cadena de texto, pero no es requerida
};

Productos.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Lineas.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Inventario.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

export default InventarioLista;