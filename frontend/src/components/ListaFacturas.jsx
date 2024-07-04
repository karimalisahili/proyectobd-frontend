import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const facturasFicticiasIniciales = [
  { id: 1, descripcion: 'Factura 1', total: '1000.00', fecha: '2024-01-15' },
  { id: 2, descripcion: 'Factura 2', total: '2000.00', fecha: '2024-02-15' },
  { id: 3, descripcion: 'Factura 3', total: '3000.00', fecha: '2024-03-15' },
  { id: 4, descripcion: 'Factura 4', total: '4000.00', fecha: '2024-04-15' },
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















const ListaFacturas = () => {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);








  return (
    <Box>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <List sx={{ maxHeight: '250px', overflowY: 'auto' }}>
          {facturasFicticiasIniciales.map((factura) => (
            <ListItem button key={factura.id} onClick={() => setFacturaSeleccionada(factura)}>
              <ListItemText primary={factura.descripcion} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
        {facturaSeleccionada ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{facturaSeleccionada.descripcion}</Typography>
            <Typography>Total: ${facturaSeleccionada.total}</Typography>
            <Typography>Fecha: {facturaSeleccionada.fecha}</Typography>
          </Box>
        ) : (
          <Typography>No se ha seleccionado ninguna factura</Typography>
        )}
      </Box>
    </Box>
  );
}

ListaFacturas.propTypes = {};

export default ListaFacturas;
