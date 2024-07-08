
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, MenuItem ,Typography, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper, Checkbox, Step, StepLabel, Stepper } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const style = {
    py: 0,
    width: '80%',
    borderColor: 'divider',
    backgroundColor: 'Transparent',
    color: 'black',
  };
  const listStyle = { ...style, maxHeight: '320px', overflowY: 'auto' };

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


const SERVERNAME = import.meta.env.VITE_SERVERNAME;

// Obtención de la información del usuario almacenada en localStorage y conversión de esta de JSON a objeto.
// Esto permite manejar la información del usuario de manera más sencilla en la aplicación.
const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);


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
  if (response.status == 200) {
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

function ListaDeServicios({ data = null, isEditing = false }){

  const initialValues = {
    CodigoServ: data?.CodigoServ || '',
    Descripcion: data?.Descripcion || '',
    CI_Coord: data?.CI_Coord || ''
  };

  const [formData, handleChange] = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = `${SERVERNAME}/servicios`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      console.log(formData)
      await sendData(endpoint, formData, method);
      alert('Operación realizada correctamente');
      window.location.reload();
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
  const endpoint = `${SERVERNAME}/servicios`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};
  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  
      const [Trabajadores, setTrabajadores] = useState([]);

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
    obtenerDatos(`trabajadores/${user.RIFSuc}`, setTrabajadores);    
  }, []);
  return (
    <FormBox onSubmit={handleSubmit}> 
      {/* Box para agrupar los campos de entrada con estilo de flexbox */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Box para agrupar dos campos de entrada horizontalmente */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {/* InputField para el nombre del empleado */}
          <InputField label="DESCRIPCION" type='text'
                  name='Descripcion'
                  valor = {formData.Descripcion}
                  cambio = {handleChange}/>
          {/* InputField para el salario del empleado */}
          <TextField select label="COORDINADOR"
                  type='text'
                  name='CI_Coord' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CI_Coord} onChange={handleChange}>
                {Trabajadores.map((trabajador, index) => (
                  <MenuItem key={index} value={trabajador.Cedula}>
                    {trabajador.Nombre}
                  </MenuItem>
                ))}
              </TextField> 
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
        {isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}
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

function Actividades({ data = null, isEditing = false }){
  const initialValues = {
    CodServicio: data?.CodServicio || '',
    NroActividad: data?.NroActividad || '',
    Descripcion: data?.Descripcion || '',
    Monto: data?.Monto || '',
    AntelacionReserva: data?.AntelacionReserva || '',
    rifSucursal: user.RIFSuc,
    capacidad: data?.capacidad || ''
  };

  const [formData, handleChange] = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = `${SERVERNAME}/actividades`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await sendData(endpoint, formData, method);
      alert('Operación realizada correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error en la operación', error);
      if (error.message.includes('404')) {
        alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
      } else {
        alert('Error en la operación. Por favor, intente nuevamente.');
      }
    }
  }

  const handleDelete = async () => {
  const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  const endpoint = `${SERVERNAME}/actividades`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};

  const [Servicios, setServicios] = useState([]);

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
    obtenerDatos(`servicios`, setServicios);    
  }, []);
  return(
    <FormBox onSubmit={handleSubmit}> 
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
           <TextField select label="SERVICIO" 
          type='text'
          name='CodServicio' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CodServicio} onChange={handleChange}>
                {Servicios.map((servicio, index) => (
                  <MenuItem key={index} value={servicio.CodigoServ}>
                    {servicio.Descripcion}
                  </MenuItem>
                ))}
              </TextField> 
          <InputField label="DESCRIPCION" 
          type='text'
          name='Descripcion'
          valor = {formData.Descripcion}
          cambio = {handleChange}
          sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
        </Box>  
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="MONTO"
          type='text'
          name='Monto'
          valor = {formData.Monto}
          cambio = {handleChange}
          sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
          <InputField label="ANTELACION-RESERVA"
          type='text'
          name='AntelacionReserva'
          valor = {formData.AntelacionReserva}
          cambio = {handleChange}
          sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="CAPACIDAD"
          type='text'
          name='capacidad'
          valor = {formData.capacidad}
          cambio = {handleChange}
          sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
        </Box>
      </Box>
      <Button type='submit'  variant="contained" sx={{
        margin: '5px 20px',
        color: '#000000',
        bgcolor: '#FFFFFF',
        '&:hover': {
          bgcolor: '#41B06E',
          color: '#FFFFFF'
        }
      }}>
        {isEditing ? 'Actualizar Actividad' : 'Agregar Actividad'}
      </Button>
      {isEditing && (
        <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
          Eliminar
        </Button>
      )}
    </FormBox>
  );
}

function Reservas({ data = null, isEditing = false }){
  
  const initialValues = {
    NroR: data?.NroR || '',
    FechaR: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
    Abono: data?.Abono || '',
    CodVehiculo: data?.CodVehiculo || ''
  };

  const [Pagos, setPagos] = useState([]);
  const [formData, handleChange] = useForm(initialValues);

     const handleSubmitPagos = async (e) => {
    e.preventDefault();
  const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  
  const endpoint = `${SERVERNAME}/pagos`;
  const method = 'POST';

  try {
  await sendData(endpoint, formData, method);
  alert('Operación realizada correctamente');
} catch (error) {
  console.error('Error en la operación', error);
  // Assuming error is an object with a message property
  if (error.message.includes('500')) {
    alert('Error interno del servidor. Por favor, intente nuevamente más tarde.');
  } else if (error.message.includes('404')) {
    alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
  } else {
    alert('Error en la operación. Por favor, intente nuevamente.');
  }
}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = `${SERVERNAME}/reservas`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await sendData(endpoint, formData, method);
      alert('Operación realizada correctamente');
      window.location.reload();
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
  const endpoint = `${SERVERNAME}/reservas`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};

  return(
          <FormBox onSubmit={handleSubmit}> 
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                      <InputField label="ABONO" 
                      type='text'
                      name='Abono'
                      valor = {formData.Abono}
                      cambio = {handleChange}
                      sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                      <InputField label="CODIGO_VEHICULO"
                      type='text'
                      name='CodVehiculo'
                      valor = {formData.CodVehiculo}
                      cambio = {handleChange}
                      sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                  </Box>
              </Box>
              <Button type='submit'  variant="contained" sx={{
                margin: '5px 20px',
                color: '#000000',
                bgcolor: '#FFFFFF',
                '&:hover': {
                  bgcolor: '#41B06E',
                  color: '#FFFFFF'
                }
              }}>
                {isEditing ? 'Actualizar Reserva' : 'Agregar Reserva'}
              </Button>
              {isEditing && (
                <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                  Eliminar
                </Button>
              )}
          </FormBox>
      );
}




  function Pagos({ data = null , isEditing = false}) {
      
      const [infoEspecifica, setInfoEspecifica] = useState(null);
      
        // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
        const initialValues = {
            Fecha: data?.Fecha || '',
            Monto: data?.Monto || '',
            TipoPago: data?.TipoPago || '',
            TipoEfectivo:data?.TipoEfectivo || '',
            Referencia:data?.Referencia || '',
            NroTelf:data?.NroTelf || '',
            TipoTarjeta:data?.TipoTarjeta || '',
            Banco:data?.Banco || '',
            NumTarjeta:data?.NumTarjeta || '',
            NumFacturaServicio:data?.NumFacturaServicio || '',
            NumR:data?.NumR || ''
        };

        const [formData, handleChange] = useForm(initialValues);

        const handleTipoDePagoChange = (event) => {
          handleChange(event); // Actualiza formData con el tipo de pago seleccionado
          const tipoPago = event.target.value;
          switch (tipoPago) {
            case 'E':
              setInfoEspecifica(<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <InputField
                select
                label="Tipo Efectivo"
                name="TipoEfectivo"
                valor = {formData.TipoEfectivo}
                cambio = {handleChange}
                sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                >
                    <MenuItem value="B">Bolívares</MenuItem>
                    <MenuItem value="D">Divisas</MenuItem>
                </InputField>
            </Box>);
              break;
            case 'P':
              setInfoEspecifica(<>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <InputField
                    label="Referencia"
                    name="Referencia"
                    valor = {formData.Referencia}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    />
                    <TextField
                    label="Número de Teléfono"
                    name="NroTelf"
                    valor = {formData.NroTelf}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    />
                </Box>
                </>);
              break;
            case 'T':
              setInfoEspecifica(<>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <TextField
                    label="Número de Tarjeta"
                    name="NumTarjeta"
                    valor = {formData.NumTarjeta}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    />
                    <TextField
                    select
                    label="Tipo de Tarjeta"
                    name="TipoTarjeta"
                    valor = {formData.TipoTarjeta}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    >
                        <MenuItem value="Debito">Débito</MenuItem>
                        <MenuItem value="Credito">Crédito</MenuItem>
                    </TextField>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <TextField
                    label="Banco"
                    name="Banco"
                    valor = {formData.Banco}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    />
                </Box>
                </>);
              break;
            default:
              setInfoEspecifica(null);
          }
        };

        

        const handleSubmit = async (e) => {
          e.preventDefault();
          
          const endpoint = `${SERVERNAME}/reservas`;
          const method = isEditing ? 'PUT' : 'POST';
      
          try {
            await sendData(endpoint, formData, method);
            alert('Operación realizada correctamente');
            window.location.reload();
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
  const endpoint = `${SERVERNAME}/reservas`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};
        

        return (
          <FormBox onSubmit={handleSubmit}>
                <Box component="form" sx={{
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
          }}>
            <h3>Ingrese los Siguientes Datos</h3>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextField label="FECHA-DE-PAGO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='date'
                  name='Fecha' 
                  valor = {formData.Fecha}
                  cambio = {handleChange}/>
                  <TextField
                    select
                    label="Tipo de Pago"
                    name="TipoPago"
                    valor={formData.TipoPago}
                    onChange={handleTipoDePagoChange}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    >
                        <MenuItem value="E">Efectivo</MenuItem>
                        <MenuItem value="P">Pago Móvil</MenuItem>
                        <MenuItem value="T">Tarjeta</MenuItem>
                    </TextField>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextField label="MONTO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='text'
                  name='Monto' 
                  valor = {formData.Monto}
                  cambio = {handleChange}/>
              </Box>
              {infoEspecifica}
            </Box>
            <Button type='submit'  variant="contained" sx={{
                margin: '5px 20px',
                color: '#000000',
                bgcolor: '#FFFFFF',
                '&:hover': {
                  bgcolor: '#41B06E',
                  color: '#FFFFFF'
                }
              }}>
                {isEditing ? '' : 'Agregar Pagos'}
              </Button>
              {isEditing && (
                <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                  Eliminar
                </Button>
              )}
          </Box>
          </FormBox>
          
        )
    }

    function Autorizados({data = null, isEditing = false}){
      const initialValues = {
        CIAutorizado: data?.CIAutorizado || '',
        NombreAutorizado: data?.NombreAutorizado || '',
      }

      const [formData, handleChange] = useForm(initialValues);

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = `${SERVERNAME}/autorizados`;
        const method = isEditing ? 'PUT' : 'POST';
    
        try {
          await sendData(endpoint, formData, method);
          alert('Operación realizada correctamente');
          window.location.reload();
        } catch (error) {
          console.error('Error en la operación', error);
          if (error.message.includes('404')) {
            alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
          } else {
            alert('Error en la operación. Por favor, intente nuevamente.');
          }
        }
      }

      const handleDelete = async () => {
  const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  const endpoint = `${SERVERNAME}/reservas`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};

      return(
        <FormBox onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <InputField label="CI-AUTORIZADO"
            type='text'
            name='CIAutorizado'
            valor = {formData.CIAutorizado}
            cambio = {handleChange}/>
            <InputField label="NOMBRE AUTORIZADO"
            type='text'
            name='NombreAutorizado'
            valor = {formData.NombreAutorizado}
            cambio = {handleChange}/>
          </Box>
        </Box>
        <Button type='submit'  variant="contained" sx={{
          margin: '5px 20px',
          color: '#000000',
          bgcolor: '#FFFFFF',
          '&:hover': {
            bgcolor: '#41B06E',
            color: '#FFFFFF'
          }
        }}>
          {isEditing ? 'Actualizar Autorizado' : 'Agregar Autorizado'}
        </Button>
        {isEditing && (
                <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                  Eliminar
                </Button>
              )}
      </FormBox>
      );

    }

    function OrdenesServicios({ data = null, isEditing = false}) {

      const initialValues = {
        Nro: data?.Nro || '',
        FechaHoraE: data?.FechaHoraE || '',
        FechaHoraSEstimada: data?.FechaHoraS || '',
        CIAutorizado: data?.CIAutorizado || '',
        CodVehiculo: data?.CodVehiculo || '',
        CIEmpleado: data?.CIEmpleado || ''
      }

      const [formData, handleChange] = useForm(initialValues);

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = `${SERVERNAME}/ordenes_servicios`;
        const method = isEditing ? 'PUT' : 'POST';
    
        try {
          await sendData(endpoint, formData, method);
          alert('Operación realizada correctamente');
          window.location.reload();
        } catch (error) {
          console.error('Error en la operación', error);
          if (error.message.includes('404')) {
            alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
          } else {
            alert('Error en la operación. Por favor, intente nuevamente.');
          }
        }
      }

      const handleDelete = async () => {
  const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  const endpoint = `${SERVERNAME}/ordenes_servicios`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};

        
      const [Trabajadores, setTrabajadores] = useState([]);
      const [Vehiculos, setVehiculos] = useState([]);
      const [Autorizados, setAutorizados] = useState([]);

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
    obtenerDatos(`trabajadores/${user.RIFSuc}`, setTrabajadores);
    obtenerDatos(`vehiculos`, setVehiculos);
    obtenerDatos(`autorizados`, setAutorizados);
  }, []);
      return(
        <FormBox onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <InputField label="FECHA-HORA-ENTRADA"
              type='text'
              name='FechaHoraE'
              valor = {formData.FechaHoraE}
              cambio = {handleChange}/>
              <InputField label="FECHA-HORA-SALIDA-ESTIMADA"
              type='text'
              name='FechaHoraSEstimada'
              valor = {formData.FechaHoraSEstimada}
              cambio = {handleChange}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
               <TextField select label="CI-AUTORIZADO"
              type='text'
              name='CIAutorizado'
 sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CIAutorizado} onChange={handleChange}>
                {Autorizados.map((autorizado, index) => (
                  <MenuItem key={index} value={autorizado.CIAutorizado}>
                    {autorizado.NombreAutorizado}
                  </MenuItem>
                ))}
              </TextField> 
              <TextField select label="PLACA-VEHICULO"
                  type='number'
              name='CodVehiculo' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CodVehiculo} onChange={handleChange}>
                {Vehiculos.map((vehiculo, index) => (
                  <MenuItem key={index} value={vehiculo.CodVehiculo}>
                    {vehiculo.Placa}
                  </MenuItem>
                ))}
              </TextField> 
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}> 
              <TextField select label="COORDINADOR"
                  type='text'
                  name='CIEmpleado'
 sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.CIEmpleado} onChange={handleChange}>
                {Trabajadores.map((trabajador, index) => (
                  <MenuItem key={index} value={trabajador.Cedula}>
                    {trabajador.Nombre}
                  </MenuItem>
                ))}
              </TextField> 
            </Box>
          </Box>
          <Button type='submit'  variant="contained" sx={{
            margin: '5px 20px',
            color: '#000000',
            bgcolor: '#FFFFFF',
            '&:hover': {
              bgcolor: '#41B06E',
              color: '#FFFFFF'
            }
          }}>
            {isEditing ? 'Actualizar Orden de Servicio' : 'Agregar Orden de Servicio'}
          </Button>
          {isEditing && (
                <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                  Eliminar
                </Button>
              )}
        </FormBox>
      );

    }

    function Contrataciones({data = null, isEditing = false}){

      const initialValues = {
        CodServicio: data?.CodServicio || '',
        NroActividad: data?.NroActividad || '',
        NroOrenServ: data?.NroOrenServ || '',
        CodProductoServ: data?.CodProductoServ || '',
        CantProd: data?.CantProd || '',
        Precio: data?.Precio || '',
      }

      const [formData, handleChange] = useForm(initialValues);

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = `${SERVERNAME}/contratan_act_ordens_prod_serv`;
        const method = isEditing ? 'PUT' : 'POST';
    
        try {
          await sendData(endpoint, formData, method);
          alert('Operación realizada correctamente');
          window.location.reload();
        } catch (error) {
          console.error('Error en la operación', error);
          if (error.message.includes('404')) {
            alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
          } else {
            alert('Error en la operación. Por favor, intente nuevamente.');
          }
        }
      }

      const handleDelete = async () => {
  const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
  if (!isConfirmed) {
    return; // Si el usuario no confirma, detiene la función aquí
  }
  const endpoint = `${SERVERNAME}/contratan_act_ordens_prod_serv`; // Asumiendo que Cedula es el identificador único
  try {
    await sendData(endpoint, formData.CodigoServ, 'DELETE');
    alert('Empleado eliminado correctamente');
    window.location.reload();
    // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
  } catch (error) {
    console.error('Error al eliminar el empleado', error);
    alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
  }
};

return(
        <FormBox onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <InputField label="CODIGO-SERVICIO"
              type='number'
              name='CodServicio'
              valor = {formData.CodServicio}
              cambio = {handleChange}/>
              <InputField label="CODIGO-ACTIVIDAD"
              type='number'
              name='NroActividad'
              valor = {formData.NroActividad}
              cambio = {handleChange}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <InputField label="NRO-ORDEN-SERVICIO"
              type='number'
              name='NroOrenServ'
              valor = {formData.NroOrenServ}
              cambio = {handleChange}/>
              <InputField label="CODIGO-PRODUCTO"
              type='number'
              name='CodProductoServ'
              valor = {formData.CodProductoServ}
              cambio = {handleChange}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}> 
              <InputField label="CANTIDAD-PRODUCTO"
              type='number'
              name='CantProd'
              valor = {formData.CantProd}
              cambio = {handleChange}/>
            </Box>
          </Box>

          <Button type='submit'  variant="contained" sx={{
            margin: '5px 20px',
            color: '#000000',
            bgcolor: '#FFFFFF',
            '&:hover': {
              bgcolor: '#41B06E',
              color: '#FFFFFF'
            }
          }}>
            {isEditing ? 'Actualizar Contrataciones' : 'Agregar Contrataciones'}
          </Button>
          {isEditing && (
                <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                  Eliminar
                </Button>
              )}
        </FormBox>
      );

    }
    
const steps = ['Seleccion de Orden de Servicio', 'Seccion de Pago', 'Factura Preliminar'];
    
function useForm2(initialState) {
  // Inicializa el estado del formulario con el estado inicial proporcionado
  const [formData, setFormData] = useState(initialState);

  // Función para manejar los cambios en los campos del formulario
  const handleChange2 = (e) => {
    // Extrae el nombre y el valor del campo que disparó el evento
    const { name, value } = e.target;
    // Actualiza el estado del formulario con el nuevo valor para el campo especificado
    setFormData(prevState => ({
      ...prevState, // Copia el estado anterior del formulario
      [name]: value // Actualiza el valor del campo especificado
    }));
  };

  // Devuelve el estado actual del formulario y la función handleChange
  const resetForm = () => setFormData(initialState);

  return [formData, handleChange2, resetForm];
}

    function Ventas() {
  

  



  

  


  
  return (
    <Box>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '30%', height: 'auto' }}>
         
    </Box>
  </Box>
);
}

function Facturas({ data = null }) {
      
  const initialValuesPagos = {
    Fecha: new Date().toISOString().split('T')[0],
    Monto: 0,
    TipoPago: '',
    TipoEfectivo: null,
    Referencia: null,
    NroTelf: null,
    TipoTarjeta: null,
    Banco: null,
    NumTarjeta: null,
    NumFacturaServicio: null,
    NumR: null
  };

      const initialValues = {
        CodF: data?.CodF || '',
        CodOrd: data?.CodOrd || '',
        Fecha: data?.Fecha || '',
        Monto: data?.Monto || '',
        Descuento: data?.Descuento || '',
  }
  
    const initialValuesFacturas = {
    CodOrd: 0,
    Fecha: null,
    Monto: 0,
    Descuento: 0,
  };

  const [formDataPagos, handleChangePagos, resetForm] = useForm(initialValuesPagos);

  const [formDataFactura, handleChange2, resetForm2] = useForm2(initialValuesFacturas);
      
  const [facturaEmitida, setFacturaEmitida] = useState(false);
  const [formData, handleChange] = useForm(initialValues);

    const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  
  const handleSubmitFactura = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    
    
    formDataFactura.Fecha = new Date().toISOString().split('T')[0];
    formDataFactura.Monto = montoFinal
    formDataFactura.Descuento = Descuento[0].Descuento;

    console.log(formDataFactura);

    const endpoint = `${SERVERNAME}/facturas_servicios`;
    const method = 'POST';

    try {
      await sendData(endpoint, formDataFactura, method);
      alert('Operación realizada correctamente');
      setFacturaEmitida(true);
    } catch (error) {
      console.error('Error en la operación', error);
      // Assuming error is an object with a message property
      if (error.message.includes('500')) {
        alert('Error interno del servidor. Por favor, intente nuevamente más tarde.');
      } else if (error.message.includes('404')) {
        alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
      } else {
        alert('Error en la operación. Por favor, intente nuevamente.');
      }
    }

  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
  
    const endpoint = `${SERVERNAME}/pagos`;
    const method = 'POST';

    try {
      await sendData(endpoint, formData, method);
      alert('Operación realizada correctamente');
    } catch (error) {
      console.error('Error en la operación', error);
      // Assuming error is an object with a message property
      if (error.message.includes('500')) {
        alert('Error interno del servidor. Por favor, intente nuevamente más tarde.');
      } else if (error.message.includes('404')) {
        alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
      } else {
        alert('Error en la operación. Por favor, intente nuevamente.');
      }
    }
  };
  // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
  // Estado para controlar la visibilidad del modal
  const [open2, setOpen2] = useState(false);
  const [Descuento, setDescuento] = useState(0);
  const [Pagos, setPagos] = useState([]);
  const [Productos, setProductos] = useState([]);
  const [ordenServicio, setOrdenServicio] = useState([]);
  const [datosOrdenServicio, setDatosOrdenServicio] = useState([]);
  const [Servicios, setServicios] = useState([]);
  const [Actividades, setActividades] = useState([]);
  const [Clientes, setClientes] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
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
    obtenerDatos(`pagos`, setPagos);
    obtenerDatos('ordenes_servicios', setOrdenServicio);
    obtenerDatos(`datosDescuento/${formDataFactura.CodOrd}`, setDescuento);
    obtenerDatos(`datosProductos/${formDataFactura.CodOrd}`, setProductos);
    obtenerDatos(`datosOrdenServicio/${formDataFactura.CodOrd}`, setDatosOrdenServicio);
    obtenerDatos(`datosServicios/${formDataFactura.CodOrd}`, setServicios);
    obtenerDatos(`datosActividades/${formDataFactura.CodOrd}`, setActividades);
    obtenerDatos(`datoMontoTotal/${formDataFactura.CodOrd}`, setSubtotal);
  }, [formDataFactura.CodOrd]);

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
    obtenerDatos(`pagos`, setPagos);
    obtenerDatos('ordenes_servicios', setOrdenServicio);
    obtenerDatos(`responsables`, setClientes);
  }, []);

  const handleOpen2 = () => {
    setOpen2(true);
    resetForm();
    setActiveStep(0)
  };

  const closeModal = () => {
    setOpen2(false);
    window.location.reload();
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [quantity, setQuantity] = useState('');

  const handleSelectProduct = (product) => {
    setOpenDialog(true);
    setCurrentProduct(product);
     
  };
    
  // Estado inicial para la lista de productos seleccionados
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Función para manejar el clic en un producto
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setQuantity('');
  };

  const handleConfirmQuantity = () => {
    const total = currentProduct.Precio * quantity; // Calcula el total
    setSelectedProducts(prevSelectedProducts => [
      ...prevSelectedProducts,
      { ...currentProduct, quantity: quantity, total: total } // Guarda el total junto con el producto y la cantidad
    ]);
    handleCloseDialog();
      };
      
      const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
    
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
let sub=0;
  if (subtotal) {
     sub = subtotal[0].TotalPagar;
  }
// Paso 2 y 3: Verificar si `descuento` tiene datos y calcular el total con descuento

// Paso 2: Verificar si `Descuento` tiene datos y calcular el total con descuento
let montoFinal = 0;
if (Descuento.length >= 0) {
  // Asumiendo que todos los elementos en Descuento aplican el mismo porcentaje y usamos el primero
  const montoDescuento = (sub * Descuento[0].Descuento) / 100;
  montoFinal = sub - montoDescuento;
} else {
  // Si no hay descuento, el monto final es el total de subtotal
  montoFinal = sub;
}

  formDataFactura.Monto = montoFinal;

  
      useEffect(() => {
        const fetchFacturas = async () => {
          try {
          const response = await fetch(`${SERVERNAME}/facturas_servicios`);
          const data = await response.json();
          setFacturas(data);
        } catch (error) {
          console.error('Error fetching facturas:', error);
        }
    };

    fetchFacturas();
      }, []);
  
  console.log(facturas);

    const handleSelectFactura = (nroFactura) => {
      setSelectedFactura(nroFactura);
    };

  const [openModal, setOpenModal] = useState(false);
  // const [closeModal, setCloseModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  
  // Función para renderizar los detalles de la factura seleccionada
  const renderFacturaDetails = () => {
    const factura= Array.isArray(facturas) ? facturas.find(f => f.CodF === selectedFactura) : null;
    if (!factura) return <p>No se encontró la factura</p>;

  return (
    <Box sx={{  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  width: '100vw', // Ancho de la vista completa
  height: '100vh', // Altura de la vista completa
  flexDirection: 'column',
  top: 0, // Alineado al top de la pantalla
  left: 0, // Alineado al lado izquierdo de la pantalla
  overflowY: 'auto', // Permite desplazamiento vertical si el contenido es más alto que la pantalla
  zIndex: 1000, }}>
                  <TableContainer component={Paper} sx={{ width:'500px', alignContent:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                      <h1 style={{ color: 'black', marginBottom: '0' }}>M&M</h1>
                      <h3 style={{alignSelf:'center'}}>M&M al servicio del planeta</h3>
                      <p className='p_factura'>RIF: {user.RIFSuc}</p>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="Center">Nro. Factura</TableCell>
                            <TableCell align="Center">Fecha Emision</TableCell>
                            <TableCell align="Center">Monto</TableCell>
                            <TableCell align="Center">Descuento</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={factura.nroFactura}>
                              <TableCell align="Center">
                                {factura.CodF}
                              </TableCell>
                              <TableCell align="Center">{factura.Fecha}</TableCell>
                              <TableCell align="Center">{factura.Monto}</TableCell>
                              <TableCell align="Center">{factura.Descuento}</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
      </TableContainer>
      
      <Button variant="contained" onClick={handleCloseModal} sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#41B06E' } }}>
        Cerrar
      </Button>
                  </Box>
  );
  };

  
  return (
    <Box sx={{ position: 'absolute', width: '80%', marginLeft: '15rem', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
       <Button variant="contained" sx={{ backgroundColor: '#8DECB4', mx:3, '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => handleOpen2()}>
            Emitir Factura
          </Button>
          <Modal open={open2} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column', }} mt={5}>
              <Stepper activeStep={activeStep} sx={{'.MuiStepLabel-label': { color: 'white' }, marginBottom:'10px'}}>
                {steps.map((label) => {
                  return (
                    <Step key={label} >
                      <StepLabel sx={{ '.MuiStepLabel-label': { color: 'white', '&.Mui-active': { color: 'white' }, '&.Mui-completed': { color: 'white' } }, '.MuiStepIcon-root': { '&.Mui-completed': { color: '#8DECB4' }, '&.Mui-active': { color: '#41B06E' } } }}>
                        {label}           
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1, color:'#FFFFFF', fontSize:'30px'}}>
                    Factura Creada Correctamente
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#41B06E' } }} onClick={closeModal}>
                        Salir 
                    </Button>
                  </Box>
                </React.Fragment>
              ) : (
              <React.Fragment>
                {activeStep === 0 && (
                  <FormBox > 
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField type='number' label="NRO-ORD-SERV" name='CodOrd' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formDataFactura.CodOrd} onChange={handleChange2}/>
                      </Box>     
                    </Box>
                  </FormBox>
                )}
                {activeStep === 2 && (
                     <FormBox onSubmit={handleSubmit} > 
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField select label='Tipo-Pago' type='text' name='TipoPago' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.TipoPago} onChange={handleChange}>
                          <MenuItem value="E">Efectivo</MenuItem>
                          <MenuItem value="P">Pago Móvil</MenuItem>
                          <MenuItem value="T">Tarjeta</MenuItem>
                        </TextField>        
                      </Box>
                      {formData.TipoPago === "E" && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                          <TextField select label="Tipo-Efectivo" name='TipoEfectivo'sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.TipoEfectivo} onChange={handleChange}>
                            <MenuItem value="D">Divisa</MenuItem>
                            <MenuItem value="B">Bolivares</MenuItem>
                          </TextField>
                        </Box>
                      )}
                      {formData.TipoPago === "P" && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                          <InputField label="Nro_Telefono" type='text' name='NroTelf'valor={formData.NroTelf} cambio={handleChange} />
                          <InputField label="Nro-Reference" type='number' name='Referencia' valor={formData.Referencia} cambio={handleChange}/>
                        </Box>
                      )}
                      {formData.TipoPago === "T" && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                          <TextField select label="Tipo_Tarjeta" type='text' name='TipoTarjeta' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.TipoTarjeta} onChange={handleChange}>
                            <MenuItem value="Debito">Debito</MenuItem>
                            <MenuItem value="Credito">Credito</MenuItem>
                          </TextField>
                          <InputField label="Numero_Tarjeta" type='text' name='NumTarjeta'valor={formData.NumTarjeta} cambio={handleChange} />
                          <InputField label="Banco" type='text' name='Banco'valor={formData.Banco} cambio={handleChange} />
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="Monto" type='number' name='Monto' min={0} sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.Monto = montoFinal} onChange={handleChange} disabled ></TextField>
                        <TextField select label="Cédula Cliente" name='CIResponsable' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formDataFactura.CIResponsable} onChange={handleChange2}>
                          {Clientes.map((cliente, index) => (
                            <MenuItem key={index} value={cliente.CIResponsable}>
                              {cliente.CIResponsable}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                      <Button type='submit' variant="contained" sx={{margin: '5px 0', color: '#000000', bgcolor: '#FFFFFF', '&:hover': {bgcolor: '#41B06E',color: '#FFFFFF'}}}>
                      Registrar Pago
                      </Button>
                    </Box>
                  </FormBox>
                )}
                {activeStep === 1 && (
                  <Box sx={{maxHeight:500, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', overflow:'auto' }}>
                    <TableContainer  component={Paper} sx={{paddingTop:45, width:'500px', alignContent:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                      <h1 style={{ color: 'black', marginBottom: '0' }}>M&M</h1>
                      <h3 style={{alignSelf:'center'}}>M&M al servicio del planeta</h3>
                      <p className='p_factura'>RIF: {user.RIFSuc}</p>
                      <p className='p_factura'>Fecha:  {new Date().toISOString().split('T')[0]}</p>
                      <Table aria-label="simple table" sx={{ display:'flex', justifyContent:'center'}}>
                        <TableBody>
                          {datosOrdenServicio &&  (
                            <div >
                          <TableRow sx={{display:'flex', justifyContent:'center'}}>
                            <TableCell align="center" style={{ verticalAlign: 'middle' }}>Orden de Servicio:</TableCell>
                            <TableCell align="center">{formDataFactura.CodOrd}</TableCell>
                          </TableRow>
                          <TableRow sx={{display:'flex', justifyContent:'center'}}>
                            <TableCell>Codigo de Vehiculo:</TableCell>
                            <TableCell align="center">{datosOrdenServicio[0].CODIGODEVEHICULO}</TableCell>
                          </TableRow>
                          <TableRow sx={{display:'flex', justifyContent:'center'}}>
                            <TableCell>Nombre de Cliente:</TableCell>
                            <TableCell align="center">{datosOrdenServicio[0].NombreResponsable}</TableCell>
                          </TableRow>
                          <TableRow sx={{display:'flex', justifyContent:'center'}}>
                            <TableCell>Cedula Responsable:</TableCell>
                            <TableCell align="center">{datosOrdenServicio[0].CIResponsable}</TableCell>
                          </TableRow>
                          </div>
                          )}
                          <div style={{display:'flex', justifyContent:'center'}}>
                            <h2>Servicios</h2>
                          </div>
                          <TableRow sx={{display:'flex', justifyContent:'center'}}>
      <TableCell align='center'>Cod Serv</TableCell>
      <TableCell align="center">Descr</TableCell>
    </TableRow>
  {Array.isArray(Servicios) && Servicios.map((servicio, index) => (
    <TableRow key={index} sx={{display:'flex', justifyContent:'center'}}>
      <TableCell sx={{mx:3}} align='center'>{servicio.COD}</TableCell>
      <TableCell sx={{mx:1}} align="center">{servicio.DESCRIPCION}</TableCell>
    </TableRow>
  ))}
                          <div style={{display:'flex', justifyContent:'center'}}>
                            <h2>Actividades</h2>
                          </div>
    <TableRow>
      <TableCell align="center">Cod Serv</TableCell>
      <TableCell align="center">Nro Act</TableCell>
      <TableCell align="center">Descr</TableCell>
      <TableCell align="center">Monto</TableCell>
    </TableRow>
                      {Array.isArray(Actividades) && Actividades.map((actividad, index) => (
    <TableRow key={index} >
      <TableCell align="center">{actividad.COD}</TableCell>
      <TableCell align="center">{actividad.CODACTIVIDAD}</TableCell>
      <TableCell align="center">{actividad.DESCRIPCION}</TableCell>
      <TableCell align="center">${actividad.MONTO}</TableCell>
    </TableRow>
  ))
                          }
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h2>Productos</h2>
                          </div>
                           <TableRow sx={{display:'flex', justifyContent:'center'}}>
      <TableCell>Producto</TableCell>
                          </TableRow>
                                             {Array.isArray(Productos) && Productos.map((producto, index) => (
    <TableRow key={index} sx={{display:'flex', justifyContent:'center'}}>
      <TableCell>{producto.Productos}</TableCell>
    </TableRow>
  ))
                          }
                          
                                             <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h2>Productos</h2>
                          </div>       
                          <TableRow sx={{display:'flex', justifyContent:'center'}}>
                            <TableCell align='center'>Subtotal</TableCell>
                            <TableCell align='center'>Descuento</TableCell>
                            <TableCell align='center'>Total</TableCell>
                          </TableRow>
                          <TableRow sx={{ display: 'flex', justifyContent: 'center' }}>
                            
  {subtotal && (
                              <TableCell sx={{ mx:2}} align='center'>${subtotal[0].TotalPagar}</TableCell>
  )}
  {Descuento && (
    <TableCell sx={{ mx:2}}   align='center'>%{Descuento[0].Descuento}</TableCell>
  )}
                            <TableCell sx={{ mx:2}}  align='center'>${montoFinal}</TableCell>
                            
                            </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button disabled={activeStep === 0} onClick={handleBack} variant="contained" sx={{ backgroundColor: '#8DECB4',my:3, mx:3, '&:hover': { backgroundColor: '#41B06E'  } }}>
                    Regresar
                  </Button>
                  {activeStep === steps.length - 2 ? (
                    facturaEmitida ? (
                      <Button type="button" onClick={handleNext} variant="contained" sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#76C2AF',  } }}>
                        Finalizar
                      </Button>
                    ) : (
                      <Button type="submit" onClick={handleSubmitFactura} variant="contained" sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#41B06E',  } }}>
                        Emitir Factura
                      </Button>
                    )
                  ) : (
                  <Button type="button" onClick={handleNext} variant="contained" sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#76C2AF',  } }}>
                    Siguiente
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Modal>
       <h1 className='h1Factura'>Lista de Facturas</h1>
      {selectedFactura && (
       <Button variant="contained"  onClick={handleOpenModal}  sx={{ backgroundColor: '#8DECB4', marginBottom:3, '&:hover': { backgroundColor: '#41B06E' } }}>
        Ver Detalles de la Factura
      </Button>
    )}
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        {renderFacturaDetails()}
      </Box>
    </Modal>
                
    <TableContainer component={Paper} style={{ maxHeight: '250px', overflowY: 'auto'}} >
  <Table aria-label="simple table" stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        <TableCell>Nro</TableCell>
        <TableCell align="right">Fecha</TableCell>
        <TableCell align="right">Monto</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {
  Array.isArray(facturas) &&
    facturas.map(factura => {
      const isSelected = selectedFactura === factura.CodF;
      return (
        <TableRow
          key={factura.nroFactura}
          hover
          onClick={() => handleSelectFactura(factura.CodF)}
          role="checkbox"
          aria-checked={isSelected}
          selected={isSelected}
          sx={{
            '&:hover': {
              backgroundColor: '#8DECB4 !important' // Changes background color on hover
            },
            ...(isSelected && {
              backgroundColor: '#41B06E !important', // Darker green color when selected
            }),
          }}
        >
          <TableCell padding="checkbox">
            <Checkbox checked={isSelected} sx={{
              color: '#41B06E', // Color when the checkbox is not selected
              '&.Mui-checked': {
                color: '#8DECB4', // Color when the checkbox is selected
              },
            }}/>
          </TableCell>
          <TableCell component="th" scope="row">
            {factura.CodF}
          </TableCell>
          <TableCell align="right">{factura.Fecha}</TableCell>
          <TableCell align="right">{factura.Monto}</TableCell>
        </TableRow>
      );
    })
}
    </TableBody>
  </Table>
</TableContainer>
    </Box>
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

  if (!Array.isArray(items)) {
    console.error('renderList was called with items that are not an array:', items);
    return null; // Or return a placeholder component indicating the error or empty state
  }

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

function mostrarLista(opcion, listaServiciosSeleccionados, reservasSeleccionados, actividadesSeleccionadas, autorizadosSeleccionados, ordenesServiciosSeleccionados, contratacionesSeleccionados,pagosSeleccionados, facturasSeleccionados, onSeleccionado) {
  // Utiliza una estructura switch para manejar las diferentes opciones
  switch (opcion) {
    case 'Listas de Servicios':
      // Renderiza y retorna una lista de servicios seleccionados
      return renderList(listaServiciosSeleccionados, 'Descripcion', 'CodigoServ', onSeleccionado);

    case 'Reservas':
      // Renderiza y retorna una lista de reservas seleccionadas
      return renderList(reservasSeleccionados, 'CodVehiculo', 'Abono', onSeleccionado);

    case 'Actividades':
      // Renderiza y retorna una lista de actividades seleccionadas
      return renderList(actividadesSeleccionadas, 'NroActividad', 'Descripcion', onSeleccionado);

    case 'Autorizados':
      return renderList(autorizadosSeleccionados, 'CIAutorizado', 'NombreAutorizado', onSeleccionado)
    case 'Ordenes de Servicios':
      // Renderiza y retorna una lista de pagos seleccionados
      return renderList(ordenesServiciosSeleccionados, 'Nro', 'CIAutorizado', onSeleccionado);
    case 'Contrataciones':
      return renderList(contratacionesSeleccionados, 'NroOrenServ','Precio', onSeleccionado )
    
    case 'Pagos':
      return renderList(pagosSeleccionados, 'Fecha', 'Monto')
    case 'Facturas':
      // Renderiza y retorna una lista de facturas seleccionadas
      return renderList(facturasSeleccionados, 'CodF', 'Fecha', onSeleccionado);
    default:
      // Retorna un párrafo indicando que se debe seleccionar una opción si ninguna coincide
      return <p>Seleccione una opción</p>;
  }
}




function ListServicios({ opcion }) {
    
  const [open, setOpen] = useState(false);
  // Estado para determinar el tipo de formulario a mostrar en el modal
  const [formType, setFormType] = useState('');
  const [open2, setOpen2] = useState(false);

    const [listaServiciosSeleccionados, setListaServiciosSeleccionados] = useState([]);
    const [reservasSeleccionados, setReservasSeleccionados] = useState([]);
    const [pagosSeleccionados, setPagosSeleccionados] = useState([]);
    const [facturasSeleccionados, setFacturasSeleccionados] = useState([]);
    const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
    const [ordenesServiciosSeleccionados, setOrdenesServiciosSeleccionados] = useState([]);
    const [autorizadosSeleccionados, setAutorizadosSeleccionados] = useState([]);
    const [contratacionesSeleccionados,setContratacionesSeleccionados] = useState([]);

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
    obtenerDatos('SERVICIOS', setListaServiciosSeleccionados);
    obtenerDatos('ACTIVIDADES', setActividadesSeleccionadas);
    obtenerDatos('RESERVAS', setReservasSeleccionados);
    obtenerDatos('AUTORIZADOS', setAutorizadosSeleccionados);
    obtenerDatos('ORDENES_SERVICIOS', setOrdenesServiciosSeleccionados);
    obtenerDatos('CONTRATAN_ACT_ORDENS_PROD_SERV', setContratacionesSeleccionados)
    obtenerDatos('PAGOS', setPagosSeleccionados);
    obtenerDatos('FACTURAS_SERVICIOS', setFacturasSeleccionados); //REVISAR: endpoint de facturaservicio no existe ES FACTURAS_SERVICIOS
    
  }, []);

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

const renderForm = (info, editar) => {
  switch (formType) {
    case 'Listas de Servicios':
      return <ListaDeServicios data={info} isEditing={editar}/>;
    case 'Actividades':
      return <Actividades data={info} isEditing={editar}/>;
    case 'Reservas':
      return <Reservas data={info} isEditing={editar}/>;
    case 'Autorizados':
      return <Autorizados data={info} isEditing={editar}/>;
    case 'Ordenes de Servicios':
      return <OrdenesServicios data={info} isEditing={editar}/>;
    case 'Contrataciones':
      return <Contrataciones data={info} isEditing={editar}/>
    case 'Pagos':
      return <Pagos data={info} isEditing={editar}/>;
    case 'Facturas':
      return <Ventas data ={info} isEditing={editar}/>;
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

const renderContenido = () => {
  if (seleccionEnLists && opcion === 'Listas de Servicios') {
    return (
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h2 className='h2Libreta'>SERVICIOS</h2>
      </Box>
    );
  } else if(seleccionEnLists && opcion === 'Actividades'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h2 className='h2Libreta'>ACTIVIDADES</h2>
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Reservas'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h2 className='h2Libreta'>RESERVAS</h2>
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Autorizados'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h2 className='h2Libreta'>AUTORIZADOS</h2>
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Ordenes de Servicios'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h2 className='h2Libreta'>ORDENES DE SERVICIOS</h2>
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Contrataciones'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h2 className='h2Libreta'>CONTRATACIONES</h2>
      </Box>
    )
  }else{
    return (
      <Typography textAlign={'center'}>No se ha seleccionado ningún {opcion}</Typography>
    );
  }
};


  return (
    <Box>
    <div className="vertical_line"></div>
    <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '30%', height: 'auto' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className='h1Libreta'>Lista de {opcion}</h1>
        {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
        {mostrarLista(opcion, listaServiciosSeleccionados, reservasSeleccionados, actividadesSeleccionadas, autorizadosSeleccionados, ordenesServiciosSeleccionados, contratacionesSeleccionados,pagosSeleccionados, facturasSeleccionados, manejarSeleccionEnLists)}
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
      {renderContenido()}
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          {/* Lista estática, posiblemente para mostrar detalles o información adicional */}
          <List sx={style}>
           {seleccionEnLists && Object.entries(seleccionEnLists).map(([key, value]) => (
  <React.Fragment key={key}>
    <ListItem>
                 <ListItemText primary={`${key}:`} />
                 {`${value || 'No disponible'}`} 
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

function Teteo({ opcion }) {
  
  console.log(opcion);
  const renderfunction = (funcion) => {

    if (funcion == 'Facturas') {
      return <Facturas/>
    } else {
      return <ListServicios opcion={opcion}/>
    }
    }
return (
  <Box>
    {renderfunction(opcion)}
  </Box>

  )
}

Teteo.propTypes = {
  opcion: PropTypes.string
};

ListServicios.propTypes = {
    opcion: PropTypes.string
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

ListaDeServicios.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Actividades.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Reservas.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Autorizados.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool
}

OrdenesServicios.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Contrataciones.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Pagos.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Facturas.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}


export default Teteo;

