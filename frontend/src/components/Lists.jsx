// Importación de componentes de Material UI, PropTypes y hooks de React.
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React,{ useState, useEffect } from 'react';

// Definición de la variable SERVERNAME que obtiene el valor de la variable de entorno VITE_SERVERNAME.
// Este valor se utiliza para configurar el nombre del servidor en la aplicación.
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

// Obtención de la información del usuario almacenada en localStorage y conversión de esta de JSON a objeto.
// Esto permite manejar la información del usuario de manera más sencilla en la aplicación.
const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);

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
async function sendData(url, data) {
  // Realiza una solicitud HTTP POST usando fetch
  const response = await fetch(url, {
    method: 'POST', // Especifica el método HTTP POST
    headers: {
      'Content-Type': 'application/json', // Establece el tipo de contenido de la solicitud a JSON
    },
    body: JSON.stringify(data), // Convierte el objeto de datos a una cadena JSON para el cuerpo de la solicitud
  });
  // Verifica si el estado de la respuesta no es exitoso (ok)
  if (!response.ok) {
    const errorData = await response.json(); // Intenta obtener los detalles del error de la respuesta JSON
    // Lanza un error con el mensaje obtenido de la respuesta o un mensaje de error predeterminado
    throw new Error(errorData.message || 'Error en la solicitud de registro');
  }
  // Si la respuesta es exitosa, devuelve el cuerpo de la respuesta como JSON
  return response.json();
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
function Personal() {
  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
  const [formData, handleChange] = useForm({
    Nombre: '',
    Salario: '',
    Cedula: '',
    Telefono: '',
    Direccion: '',
    RIFSuc: user.RIFSuc, // RIFSuc se inicializa con un valor proveniente de un objeto user, presumiblemente del contexto del usuario
  });

  // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    // Desestructura formData para obtener los valores de los campos del formulario
    const { Nombre, Salario, Cedula, Telefono, Direccion, RIFSuc } = formData;
    try {
      // Intenta enviar los datos del formulario al servidor utilizando una función sendData y espera por la respuesta
      const data = await sendData(`${SERVERNAME}/trabajadores`, formData);
      alert('Agregado correctamente'); // Muestra una alerta indicando que el empleado fue agregado correctamente
    } catch (error) {
      console.error('Error al agregar el empleado', error); // Registra en consola el error si la solicitud falla
      alert('Error al agregar el empleado. Por favor, intente nuevamente.'); // Muestra una alerta de error
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
          <InputField label="NOMBRE-EMPLEADO" type='text' name='Nombre'
            valor={formData.Nombre} cambio={handleChange}
          />
          {/* InputField para el salario del empleado */}
          <InputField label="SUELDO-EMPLEADO" type='number' name='Salario' min={1}
            valor={formData.Salario} cambio={handleChange}
          />
        </Box>
      </Box>
      {/* Repite la estructura anterior para otros campos del formulario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="CEDULA-EMPLEADO" type='text' name='Cedula'
            valor={formData.Cedula} cambio={handleChange}
          />
          <InputField label="TELEFONO-EMPLEADO" type='text' name='Telefono'
            valor={formData.Telefono} cambio={handleChange}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="DIRECCION-EMPLEADO" type='text' name='Direccion'
            valor={formData.Direccion} cambio={handleChange}
          />
        </Box>
      </Box>
      {/* Botón para enviar el formulario con estilos personalizados */}
      <Button type='submit' variant="contained" sx={{
        margin: '5px 0',
        color: '#000000',
        bgcolor: '#FFFFFF',
        '&:hover': {
            bgcolor: '#41B06E',
            color: '#FFFFFF'}}}>
        Agregar Personal
      </Button>
    </FormBox>
  );
}

// Define un componente funcional llamado Cliente
function Cliente() {
  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para CIResponsable y NombreResponsable
  const [formData, handleChange] = useForm({
    CIResponsable: '',
    NombreResponsable: '',
  });

  // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    // Desestructura formData para obtener los valores de los campos del formulario
    const { CIResponsable, NombreResponsable } = formData;
    try {
      // Intenta enviar los datos del formulario al servidor utilizando una función sendData y espera por la respuesta
      const data = await sendData(`${SERVERNAME}/responsables`, formData);
      alert('Agregado correctamente'); // Muestra una alerta indicando que el cliente fue agregado correctamente
    } catch (error) {
      console.error('Error al agregar el cliente', error); // Registra en consola el error si la solicitud falla
      alert('Error al agregar el cliente. Por favor, intente nuevamente.'); // Muestra una alerta de error
    }
  };

  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <FormBox onSubmit={handleSubmit}>
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para la cédula del cliente */}
          <InputField label="CEDULA-CLIENTE" type='text' name='CIResponsable'
            valor={formData.CIResponsable} cambio={handleChange}
          />
          {/* InputField para el nombre del cliente */}
          <InputField label="NOMBRE-CLIENTE" type='text' name='NombreResponsable'
            valor={formData.NombreResponsable} cambio={handleChange}
          />
        </Box>
      </Box>
      {/* Botón para enviar el formulario con estilos personalizados */}
      <Button type='submit' variant="contained" sx={{
        margin: '5px 0',
        color: '#000000',
        bgcolor: '#FFFFFF',
        '&:hover': {
          bgcolor: '#41B06E',
          color: '#FFFFFF'
        }
      }}>
        Agregar Cliente
      </Button>
    </FormBox>
  );
}

// Define un componente funcional llamado Vehiculo
function Vehiculo() {
  // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
  const [formData, handleChange] = useForm({
    ciResp: '', // Cédula de identidad del responsable
    CodVehiculo: '', // Código del vehículo
    Placa: '', // Placa del vehículo
    TipoAceite: '', // Tipo de aceite del vehículo
    FechaAdq: new Date().toISOString(), // Fecha de adquisición del vehículo, inicializada al momento actual
    CodMarca: '', // Código de la marca del vehículo
    NumModelo: '', // Número de modelo del vehículo
  });

  // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    // Desestructura formData para obtener los valores de los campos del formulario
    const { ciResp, CodVehiculo, Placa, TipoAceite, FechaAdq, CodMarca, NumModelo } = formData;
    try {
      // Intenta enviar los datos del formulario al servidor utilizando una función sendData y espera por la respuesta
      const data = await sendData(`${SERVERNAME}/vehiculos`, formData);
      alert('Agregado correctamente'); // Muestra una alerta indicando que el vehículo fue agregado correctamente
    } catch (error) {
      console.error('Error al agregar el vehiculo', error); // Registra en consola el error si la solicitud falla
      alert('Error al agregar el vehiculo. Por favor, intente nuevamente.'); // Muestra una alerta de error
    }
  }

  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <FormBox onSubmit={handleSubmit}>
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para la cédula del responsable */}
          <InputField label="CEDULA-CLIENTE" type='text' name='ciResp' 
            valor={formData.ciResp} cambio={handleChange}
          />
          {/* InputField para el código del vehículo */}
          <InputField label="COD-VEHICULO" type='text' name='CodVehiculo'
            valor={formData.CodVehiculo} cambio={handleChange}
          />
        </Box>
      </Box>
      {/* Repite la estructura anterior para otros campos del formulario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="PLACA-VEHICULO" type='text' name='Placa'
            valor={formData.Placa} cambio={handleChange}
          />
          <InputField label="TIPO-ACEITE" type='text' name='TipoAceite'
            valor={formData.TipoAceite} cambio={handleChange}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="COD-MARCA" type='text' name='CodMarca'
            valor={formData.CodMarca} cambio={handleChange}
          />
          <InputField label="No-MODELO" type='text' name='NumModelo'
            valor={formData.NumModelo} cambio={handleChange}
          />
        </Box>
      </Box>
      {/* Botón para enviar el formulario con estilos personalizados */}
      <Button type='submit' variant="contained" sx={{
        margin: '5px 0',
        color: '#000000',
        bgcolor: '#FFFFFF',
        '&:hover': {
          bgcolor: '#41B06E',
          color: '#FFFFFF'
        }
      }}>
        Agregar Vehiculo
      </Button>
    </FormBox>
  );
}

// Define un estilo base para la lista y lo extiende con propiedades específicas para controlar su altura máxima y el desbordamiento vertical
const listStyle = { ...style, maxHeight: '250px', overflowY: 'auto' };

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
  // Estado para controlar la visibilidad del modal
  const [open, setOpen] = useState(false);
  // Estado para determinar el tipo de formulario a mostrar en el modal
  const [formType, setFormType] = useState('');

  // Estados para almacenar los datos seleccionados de empleados, clientes y vehículos
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);

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
    obtenerDatos('TRABAJADORES', setEmpleadosSeleccionados);
    obtenerDatos('RESPONSABLES', setClientesSeleccionados);
    obtenerDatos('VEHICULOS', setVehiculosSeleccionados);
  }, []);

  // Función para manejar la apertura del modal y establecer el tipo de formulario
  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
  };

  const closeModal = () => {
  setOpen(false);
};
  // Función para renderizar el formulario correspondiente en el modal
  const renderForm = () => {
    switch (formType) {
      case 'Personal':
        return <Personal />;
      case 'Cliente':
        return <Cliente />;
      case 'Vehiculo':
        return <Vehiculo />;
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
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
          {mostrarLista(opcion, empleadosSeleccionados, clientesSeleccionados, vehiculosSeleccionados, manejarSeleccionEnLists)}
          {/* Botón para abrir el modal y agregar un nuevo elemento basado en la opción seleccionada */}
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt: 3 }} onClick={() => handleOpen(opcion)}>
            Agregar {opcion}
          </Button>
          {/* Modal que se muestra u oculta basado en el estado 'open' */}
          <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {/* Renderiza el formulario correspondiente dentro del modal */}
            {renderForm()}
          </Modal>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
        {seleccionEnLists ? (
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <div className="circle"></div>
            <h2>{ seleccionEnLists.Nombre || '' }</h2>
            <h2>{seleccionEnLists.Cedula || ''}</h2>
            <h2>{seleccionEnLists.NombreResponsable || ''}</h2>
            <h2>{seleccionEnLists.CIResponsable || ''}</h2>
        </Box>
                      ) : (
      <Typography>No se ha seleccionado ningún empleado</Typography>
    )}
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          {/* Lista estática, posiblemente para mostrar detalles o información adicional */}
            <List sx={style}>
    {seleccionEnLists && Object.entries(seleccionEnLists).map(([key, value]) => (
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
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }}>
            Modificar
          </Button>
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

export default Lists;