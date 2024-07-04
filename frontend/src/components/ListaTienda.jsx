
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React,{ useState, useEffect } from 'react';



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

function Pagos({ data = null, isEditing = false }) {
  const initialValues = {
    Fecha: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
    Monto: data?.Monto || '',
    TipoPago: data?.TipoPago || '',
    TipoEfectivo: data?.TipoEfectivo || '',
    Referencia: data?.Referencia || '',
    NroTelf: data?.NroTelf || '',
    TipoTarjeta: data?.TipoTarjeta || '',
    Banco: data?.Banco || '',
    NumTarjeta: data?.NumTarjeta || '',
    NumFacturaServicio: data?.NumFacturaServicio || '',
    NumR: data?.NumR || ''
  };

  const [formData, handleChange] = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
  const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  
  const endpoint = `${SERVERNAME}/pagos`;
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
  const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este pago?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  const endpoint = `${SERVERNAME}/pagos`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData, 'DELETE');
    alert('Pago eliminado correctamente');
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el pago', error);
    alert('Error al eliminar el pago. Por favor, intente nuevamente.');
  }
};

  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  return (
    <FormBox onSubmit={handleSubmit}> 
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el Monto del  pago */}
          <InputField label="Monto" type='number' name='Monto' min={0}
            valor={formData.Monto} cambio={handleChange}/>
          {/* InputField para el tipo de pago*/}
          <InputField label="Tipo-Pago" type='text' name='TipoPago'
            valor={formData.TipoPago} cambio={handleChange}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el tipo de Efectivo del  pago */}
          <InputField label="Tipo-Efectivo" type='text' name='TipoEfectivo'
            valor={formData.TipoEfectivo} cambio={handleChange}/>
          {/* InputField para Referencia de pago*/}
          <InputField label="Nro-Reference" type='number' name='Referencia'
            valor={formData.Referencia} cambio={handleChange}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el Nro de telefono*/}
          <InputField label="Nro_Telefono" type='text' name='NroTelf'
            valor={formData.NroTelf} cambio={handleChange}/>
          {/* InputField para Referencia de pago*/}
          <InputField label="Tipo_Tarjeta" type='text' name='TipoTarjeta'
            valor={formData.TipoTarjeta} cambio={handleChange}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el Banco*/}
          <InputField label="Banco" type='text' name='Banco'
            valor={formData.Banco} cambio={handleChange}/>
          {/* InputField para NumTarjeta de pago*/}
          <InputField label="Numero_Tarjeta" type='text' name='NumTarjeta'
            valor={formData.NumTarjeta} cambio={handleChange}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para NumFacturaServicio del pago*/}
          <InputField label="Numero_Factura_Servicio" type='number' name='NumFacturaServicio'
            valor={formData.NumFacturaServicio} cambio={handleChange}/>
          {/* InputField para NumTarjeta de pago*/}
          <InputField label="Numero_Reserva" type='number' name='NumR'
            valor={formData.NumR} cambio={handleChange}/>
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


//Facturas



function FacturaTienda({ data = null, isEditing = false }) {
    const initialValues = {
      Fecha: data?.Fecha,
      Monto: data?.Monto || '',
      Descuento: data?.Descuento || '',
      CodPago: data?.CodPago || ''
    };
  
    const [formData, handleChange] = useForm(initialValues);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    
    const endpoint = `${SERVERNAME}/pagos`;
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
    const isConfirmed = window.confirm('¿Está seguro de que desea eliminar esta Factura?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    const endpoint = `${SERVERNAME}/facturastiendas`; // Asumiendo que Cedula es el identificador único
    try {
      await sendData(endpoint, formData, 'DELETE');
      alert('Factura eliminada correctamente');
      // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
    } catch (error) {
      console.error('Error al eliminar la Factura', error);
      alert('Error al eliminar la factura. Por favor, intente nuevamente.');
    }
  };
  
    // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
    return (
      <FormBox onSubmit={handleSubmit}> 
        {/* Box para agrupar los campos de entrada con estilo de flexbox */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          {/* Box para agrupar dos campos de entrada horizontalmente */}
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {/* InputField para el Monto del  pago */}
            <InputField label="Monto" type='number' name='Monto' min={0}
              valor={formData.Monto} cambio={handleChange}/>
            {/* InputField para el tipo de pago*/}
            <InputField label="Tipo-Pago" type='text' name='TipoPago'
              valor={formData.TipoPago} cambio={handleChange}/>
          </Box>
  
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {/* InputField para el tipo de Efectivo del  pago */}
            <InputField label="Tipo-Efectivo" type='text' name='TipoEfectivo'
              valor={formData.TipoEfectivo} cambio={handleChange}/>
            {/* InputField para Referencia de pago*/}
            <InputField label="Nro-Reference" type='number' name='Referencia'
              valor={formData.Referencia} cambio={handleChange}/>
          </Box>
  
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {/* InputField para el Nro de telefono*/}
            <InputField label="Nro_Telefono" type='text' name='NroTelf'
              valor={formData.NroTelf} cambio={handleChange}/>
            {/* InputField para Referencia de pago*/}
            <InputField label="Tipo_Tarjeta" type='text' name='TipoTarjeta'
              valor={formData.TipoTarjeta} cambio={handleChange}/>
          </Box>
  
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {/* InputField para el Banco*/}
            <InputField label="Banco" type='text' name='Banco'
              valor={formData.Banco} cambio={handleChange}/>
            {/* InputField para NumTarjeta de pago*/}
            <InputField label="Numero_Tarjeta" type='text' name='NumTarjeta'
              valor={formData.NumTarjeta} cambio={handleChange}/>
          </Box>
  
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {/* InputField para NumFacturaServicio del pago*/}
            <InputField label="Numero_Factura_Servicio" type='number' name='NumFacturaServicio'
              valor={formData.NumFacturaServicio} cambio={handleChange}/>
            {/* InputField para NumTarjeta de pago*/}
            <InputField label="Numero_Reserva" type='number' name='NumR'
              valor={formData.NumR} cambio={handleChange}/>
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

  // Pagos

  
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



  // Tienda


  
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
  function mostrarLista(opcion, compraSeleccionada, pagoSeleccionado, facturaSeleccionada, onSeleccionado) {
    // Utiliza una estructura switch para manejar las diferentes opciones
    switch (opcion) {
      case 'Compras':
        // Renderiza y retorna una lista de empleados seleccionados
        return renderList(compraSeleccionada, 'Nombre', 'Cedula', onSeleccionado);
      case 'Pagos':
        // Renderiza y retorna una lista de clientes seleccionados
        return renderList(pagoSeleccionado, 'NombreResponsable', 'CIResponsable', onSeleccionado);
      case 'Facturas':
        // Renderiza y retorna una lista de vehículos seleccionados
        return renderList(facturaSeleccionada, 'Placa', 'CodVehiculo', onSeleccionado);
      default:
        // Retorna un párrafo indicando que se debe seleccionar una opción si ninguna coincide
        return <p>Seleccione una opción</p>;
    }
  }

  function ListaTienda({opcion}) {
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
    obtenerDatos('PRODUCTOS_TIENDA', setProductoSeleccionado);
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
      case 'Compras':
        return <Compras data={info} isEditing={editar}/>;
      case 'Pagos':
        return <Pagos data={info} isEditing={editar}/>;
      case 'Facturas':
        return <FacturaTienda data={info} isEditing={editar}/>;
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
        <Box>
        <div className="vertical_line"></div>
        <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
            {mostrarLista(opcion,compraSeleccionada , pagoSeleccionado, facturaSeleccionada, manejarSeleccionEnLists)}
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
        <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
          {seleccionEnLists ? (
            <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
              <div className="circle">
                  <PersonIcon sx={{ fontSize: 150 }} />
              </div>
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
              {seleccionEnLists && Object.entries(seleccionEnLists).slice(Object.entries(seleccionEnLists).findIndex(entry => entry[0] === 'NombreResponsable' || entry[0] === 'Direccion')).map(([key,value])=> (
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

  ListaTienda.propTypes = {
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
  
  Compras.propTypes = {
    data: PropTypes.object,
    isEditing: PropTypes.bool,
  }
  
  Pagos.propTypes = {
    data: PropTypes.object,
    isEditing: PropTypes.bool,
  }
  
  FacturaTienda.propTypes = {
    data: PropTypes.object,
    isEditing: PropTypes.bool,
  }

  export default ListaTienda;
  