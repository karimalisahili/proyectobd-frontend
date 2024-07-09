// Importación de componentes de Material UI, PropTypes y hooks de React.
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography, MenuItem , Snackbar} from '@mui/material';
import PropTypes from 'prop-types';
import React,{ useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';

// Definición de la variable SERVERNAME que obtiene el valor de la variable de entorno VITE_SERVERNAME.
// Este valor se utiliza para configurar el nombre del servidor en la aplicación.
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

 const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : {};

// Obtención de la información del usuario almacenada en localStorage y conversión de esta de JSON a objeto.
// Esto permite manejar la información del usuario de manera más sencilla en la aplicación.

// Estilos para el componente Box. Se configura el padding vertical, ancho, color de borde,
// color de fondo y color de texto. Estos estilos se aplican a un componente Box de Material UI.
const style = {
  py: 0,
  width: '80%',
  borderColor: 'divider',
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
    // Extrae el nombre y el valor del campo que disparó el evento
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

function Formulario({ data, isEditing, endpointUrl, initialValues, children }) {
  const [formData, handleChange] = useForm(initialValues);
   const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Puedes usar 'error', 'warning', 'info', 'success'
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenSnackbar(false);
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
    if (!isConfirmed) {
      return;
    }
    const method = isEditing ? 'PUT' : 'POST';
    try {
      await sendData(endpointUrl, formData, method);
       setOpenSnackbar(true);
            setSnackbarMessage('Inicio de sesión exitoso');
      setSnackbarSeverity('success');
      setTimeout(() => {
                window.location.reload();
        }, 3000);
    } catch (error) {
      console.error('Error en la operación', error);
      setSnackbarMessage('Error en la operación. Por favor, intente nuevamente.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este elemento?');
    if (!isConfirmed) {
      return;
    }
    try {
      await sendData(endpointUrl, formData, 'DELETE');
      alert('Elemento eliminado correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar el elemento', error);
      alert('Error al eliminar el elemento. Por favor, intente nuevamente.');
    }
  };

  return (
        <>
    <FormBox onSubmit={handleSubmit}>
      {children({ formData, handleChange })}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button type='submit' variant="contained" sx={{ margin: '5px 20px', color: '#000000', bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#41B06E', color: '#FFFFFF' } }}>
          {isEditing ? 'Actualizar' : 'Agregar'}
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

// Define un componente funcional llamado Personal
function Personal({ data = null, isEditing = false }) {
  const initialValues = {
    Cedula: data?.Cedula || '',
    Nombre: data?.Nombre || '',
    Direccion: data?.Direccion || '',
    Salario: data?.Salario || '',
    Telefono: data?.Telefono || '',
    RIFSuc: user.RIFSuc, // Asumiendo que user está disponible en el contexto
  };

  const endpoint = `${SERVERNAME}/trabajadores`;

  
  return (
    <Formulario data={data} isEditing={isEditing} endpointUrl={endpoint} initialValues={initialValues}>
      {({ formData, handleChange }) => (
        <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el nombre del empleado */}
          <InputField label="NOMBRE-EMPLEADO" type='text' name='Nombre'
            valor={formData.Nombre} cambio={handleChange}/>
          {/* InputField para el salario del empleado */}
          <InputField label="SUELDO-EMPLEADO" type='number' name='Salario' min={1} valor={formData.Salario} cambio={handleChange}/>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="CEDULA-EMPLEADO" type='text' name='Cedula'
            valor={formData.Cedula} cambio={handleChange}/>
          <InputField label="TELEFONO-EMPLEADO" type='text' name='Telefono'
            valor={formData.Telefono} cambio={handleChange}/>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="DIRECCION-EMPLEADO" type='text' name='Direccion'
            valor={formData.Direccion} cambio={handleChange}/>
        </Box>
          </Box>
          </>
 )}
    </Formulario>
  );
}

// Define un componente funcional llamado Cliente
function Cliente({ data = null, isEditing = false }) {
  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para CIResponsable y NombreResponsable
  const initialValues = {
    CIResponsable: data?.CIResponsable || '',
    NombreResponsable: data?.NombreResponsable || '',
  };
  const endpoint = `${SERVERNAME}/responsables`;

  
  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <Formulario data={data} isEditing={isEditing} endpointUrl={endpoint} initialValues={initialValues}>
      {({ formData, handleChange }) => (
        <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para la cédula del cliente */}
          <InputField label="CEDULA-CLIENTE" type='text' name='CIResponsable'
            valor={formData.CIResponsable} cambio={handleChange}/>
          {/* InputField para el nombre del cliente */}
          <InputField label="NOMBRE-CLIENTE" type='text' name='NombreResponsable' valor={formData.NombreResponsable} cambio={handleChange}/>
        </Box>
      </Box>
          </>
 )}
    </Formulario>
  );
}

// Define un componente funcional llamado Vehiculo
function Vehiculo({ data = null, isEditing = false }) {

  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para los campos del formulario
  const initialValues = {
    Placa: data?.Placa || '',
    TipoAceite: data?.TipoAceite || '',
    FechaAdq:  new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
    ciResp: data?.ciResp || '',
    CodMarca: data?.CodMarca || '',
    NumModelo: data?.NumModelo || '',
    
  };
  const endpoint = `${SERVERNAME}/vehiculos`;

  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [modelosVehiculos, setModelosVehiculos] = useState([]);
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
    obtenerDatos('RESPONSABLES', setClientesSeleccionados);
    obtenerDatos('modelosvehiculos', setModelosVehiculos);
  }, []);

  return (
  <Formulario data={data} isEditing={isEditing} endpointUrl={endpoint} initialValues={initialValues}>
      {({ formData, handleChange }) => (
        <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para la cédula del responsable */}
          <TextField select label="CEDULA-CLIENTE" name='ciResp' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.ciResp} onChange={handleChange}>
            {clientesSeleccionados.map((cliente, index) => (
              <MenuItem key={index} value={cliente.CIResponsable}>
                {cliente.NombreResponsable}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="No-MODELO" type='number' name='NumModelo' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.NumModelo} onChange={handleChange}>
            {modelosVehiculos.map((modelo, index) => (
              <MenuItem key={index} value={modelo.CodConsec}>
                {modelo.CodConsec}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      {/* Repite la estructura anterior para otros campos del formulario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="PLACA-VEHICULO" type='text' name='Placa'
            valor={formData.Placa} cambio={handleChange}/>
          <InputField label="TIPO-ACEITE" type='text' name='TipoAceite'
            valor={formData.TipoAceite} cambio={handleChange}/>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <TextField select label="COD-MARCA" type='number' name='CodMarca' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CodMarca} onChange={handleChange}>
            {modelosVehiculos.map((modelo, index) => (
              <MenuItem key={index} value={modelo.CodMarcaV}>
                {modelo.CodMarcaV}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
          </>
 )}
    </Formulario>
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
        <>
        <ListItem key={index} button onClick={() => manejarClicSeleccionado(item)} sx={{    '&:hover': {
      backgroundColor: '#41B06E',
    },}}>
          {/* ListItemText muestra el texto principal y secundario basado en las claves proporcionadas */}
          <ListItemText primary={item[textKey]} />
            {/* Muestra el valor secundario directamente sin un componente específico */}
            {item[secondaryKey]}
        </ListItem>
          <Divider />
          </>
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



// Define el componente Lists que recibe una prop 'opcion'
function Lists({ opcion }) {

   const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : {};
  // Estado para controlar la visibilidad del modal
  const [open, setOpen] = useState(false);
  // Estado para determinar el tipo de formulario a mostrar en el modal
  const [formType, setFormType] = useState('');
  const [open2, setOpen2] = useState(false);

  // Estados para almacenar los datos seleccionados de empleados, clientes y vehículos
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);

  // useEffect para cargar datos de empleados, clientes y vehículos al montar el componente
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
    obtenerDatos(`trabajadores/${user.RIFSuc}`, setEmpleadosSeleccionados);
    obtenerDatos('RESPONSABLES', setClientesSeleccionados);
    obtenerDatos('VEHICULOS', setVehiculosSeleccionados);
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

//llevarme esto a tienda a adaptar 
  // Función para renderizar el formulario correspondiente en el modal
  const renderForm = (info, editar) => {
    switch (formType) {
      case 'Personal':
        return<Personal data={info} isEditing={editar} />
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

  
  // Renderiza el componente
  return (
    <Box>
      <div className="vertical_line"></div>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '30%', height: 'auto' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <h1 className='h1Libreta'>Lista de {opcion}</h1>
          {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
          {mostrarLista(opcion, empleadosSeleccionados, clientesSeleccionados, vehiculosSeleccionados, manejarSeleccionEnLists)}
          {/* Botón para abrir el modal y agregar un nuevo elemento basado en la opción seleccionada */}
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, my: 3 }} onClick={() => handleOpen(opcion)}>
            Agregar {opcion}
          </Button>
          {/* Modal que se muestra u oculta basado en el estado 'open' */}
          <Modal open={open} onClose={closeModal}aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            {/* Renderiza el formulario correspondiente dentro del modal */}
            {renderForm(null, false)}
          </Modal>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '30%', height: 'auto' }}>
        {seleccionEnLists ? (
          <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <div className="circle">
                <PersonIcon sx={{ fontSize: 150 }} />
            </div>
            <h2 className='h2Libreta'>{ seleccionEnLists.Nombre || '' }</h2>
            <h2 className='h2Libreta'>{seleccionEnLists.Cedula || ''}</h2>
            <h2 className='h2Libreta'>{seleccionEnLists.NombreResponsable || ''}</h2>
            <h2 className='h2Libreta'>{seleccionEnLists.CIResponsable || ''}</h2>
          </Box>
        ) : (
            <Typography textAlign={'center'}>No se ha seleccionado ningún {opcion}</Typography>
        )}
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          {/* Lista estática, posiblemente para mostrar detalles o información adicional */}
          <List sx={style}>
            {seleccionEnLists && Object.entries(seleccionEnLists).map(([key, value]) => (
  <React.Fragment key={key}>
    <ListItem>
                  <ListItemText primary={`${key}: `} />
                  {`${value || 'No disponible'}`}
    </ListItem>
    <Divider component="li" />
  </React.Fragment>
))}
          </List>
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4',my:3, mx:3, '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => handleOpen2(opcion)}>
            Modificar
          </Button>
          <Modal open={open2} onClose={closeModal}aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            {/* Renderiza el formulario correspondiente dentro del modal */}
            {renderForm(seleccionEnLists, true)}
          </Modal>
        </Box>
      </Box>
    </Box>
  );
}

// Define las propiedades esperadas para el componente Lists
Lists.propTypes = {
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

Personal.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Cliente.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Vehiculo.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

export default Lists;   