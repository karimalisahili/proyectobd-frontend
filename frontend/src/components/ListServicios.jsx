import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, MenuItem ,Typography } from '@mui/material';
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

function ListaDeServicios({ data = null, isEditing = false }){

  const initialValues = {
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
          <InputField  label="CEDULA-COORDINADOR"
                  type='text'
                  name='CI_Coord'
                  valor = {formData.CI_Coord}
                  cambio = {handleChange}/>
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
      <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
        Eliminar
      </Button>
      </Box>
    </FormBox>
  );
}

function Actividades({ data = null, isEditing = false }){
  const initialValues = {
    CodServicio: data?.CodServicio || '',
    Descripcion: data?.Descripcion || '',
    Monto: data?.Monto || '',
    AntelacionReserva: data?.AntelacionReserva || '',
    rifSucursal: data?.rifSucursal || '',
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

  return(
    <FormBox onSubmit={handleSubmit}> 
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <InputField label="CODIGO-SERVICIO" 
          type='text'
          name='CodServicio'
          valor = {formData.CodServicio}
          cambio = {handleChange}
          sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
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
          <InputField label="RIF-SUCURSAL"
          type='text'
          name='rifSucursal'
          valor = {formData.rifSucursal}
          cambio = {handleChange}
          sx={{ bgcolor: '#FFFFFF', width : '30%', margin: '10px', borderRadius: '10px' }}/>
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
    </FormBox>
  );
}

function Reservas({ data = null, isEditing = false }){
  
  const initialValues = {
    FechaR: data?.FechaR || new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
    Abono: data?.Abono || '',
    CodVehiculo: data?.CodVehiculo || ''
  };

  const [formData, handleChange] = useForm(initialValues);

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

  return(
          <FormBox onSubmit={handleSubmit}> 
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                      <InputField label="FECHA-DE-RESERVA" 
                      type='text'
                      name='FechaR'
                      valor = {formData.FechaR}
                      cambio = {handleChange}
                      sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                  </Box>  
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                      <InputField label="ABONO" 
                      type='text'
                      name='Abono'
                      valor = {formData.Abono}
                      cambio = {handleChange}
                      sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
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
          </FormBox>
      );
}




  function Pagos({ data = null, isEditing = false }) {
      
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
                {isEditing ? 'Actualizar Pagos' : 'Agregar Pagos'}
              </Button>
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
      </FormBox>
      );

    }

    function OrdenesServicios({ data = null, isEditing = false}) {

      const initialValues = {
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

      return(
        <FormBox onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <InputField label="FECHA-HORA-E"
              type='text'
              name='FechaHoraE'
              valor = {formData.FechaHoraE}
              cambio = {handleChange}/>
              <InputField label="FECHA-SALIDA-ESTIMADA"
              type='text'
              name='FechaHoraSEstimada'
              valor = {formData.FechaHoraSEstimada}
              cambio = {handleChange}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <InputField label="CI-AUTORIZADO"
              type='text'
              name='CIAutorizado'
              valor = {formData.CIAutorizado}
              cambio = {handleChange}/>
              <InputField label="CODIGO-VEHICULO"
              type='number'
              name='CodVehiculo'
              valor = {formData.CodVehiculo}
              cambio = {handleChange}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}> 
              <InputField label="CI-EMPLEADO"
              type='text'
              name='CIEmpleado'
              valor = {formData.CIEmpleado}
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
            {isEditing ? 'Actualizar Orden de Servicio' : 'Agregar Orden de Servicio'}
          </Button>
        </FormBox>
      );

    }

    function Facturas({ data = null }) {
      // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
      const initialValues = {
          Fecha: data?.Fecha || '',
          Monto: data?.Monto || '',
          Descuento: data?.Descuento || '',
      };
  
      const [formData, handleChange] = useForm(initialValues);
  
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = `${SERVERNAME}/FACTURAS_SERVICIOS`;
        const method =  'POST';
    
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
  
      return(
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
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <TextField label="FECHA" 
                    type='date'
                    name='Fecha'
                    valor = {formData.Fecha}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                </Box>  
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <TextField label="MONTO" 
                    type='text'
                    name='Monto'
                    valor = {formData.Monto}
                    cambio = {handleChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <TextField label="DESCUENTO"
                    type='text'
                    name='Descuento'
                    valor = {formData.Descuento}
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
              Agregar Factura
            </Button>
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

function mostrarLista(opcion, listaServiciosSeleccionados, reservasSeleccionados, actividadesSeleccionadas, autorizadosSeleccionados, ordenesServiciosSeleccionados, pagosSeleccionados, facturasSeleccionados, onSeleccionado) {
  // Utiliza una estructura switch para manejar las diferentes opciones
  switch (opcion) {
    case 'Listas de Servicios':
      // Renderiza y retorna una lista de servicios seleccionados
      return renderList(listaServiciosSeleccionados, 'Descripcion', 'CodigoServ', onSeleccionado);

    case 'Reservas':
      // Renderiza y retorna una lista de reservas seleccionadas
      return renderList(reservasSeleccionados, 'FechaR', 'Abono', onSeleccionado);

    case 'Actividades':
      // Renderiza y retorna una lista de actividades seleccionadas
      return renderList(actividadesSeleccionadas, 'NroActividad', 'Descripcion', onSeleccionado);

    case 'Autorizados':
      return renderList(autorizadosSeleccionados, 'CIAutorizado', 'NombreAutorizado', onSeleccionado)
    case 'Ordenes de Servicios':
      // Renderiza y retorna una lista de pagos seleccionados
      return renderList(ordenesServiciosSeleccionados, 'Nro', 'CIAutorizado', onSeleccionado);
    
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




function ListServicios({opcion}){
    
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
    case 'Pagos':
      return <Pagos data={info} isEditing={editar}/>;
    case 'Facturas':
      return <Facturas data ={info} />;
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
        SERVICIOS
      </Box>
    );
  } else if(seleccionEnLists && opcion === 'Actividades'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        ACTIVIDADES
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Reservas'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        RESERVAS
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Autorizados'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        AUTORIZADOS
      </Box>
    )
  }else if(seleccionEnLists && opcion === 'Ordenes de Servicios'){
    return(
      <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        ORDENES DE SERVICIOS
      </Box>
    )
  }else{
    return (
      <Typography>No se ha seleccionado ningún Servicio</Typography>
    );
  }
};


  return (
    <Box>
    <div className="vertical_line"></div>
    <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
        {mostrarLista(opcion, listaServiciosSeleccionados, reservasSeleccionados, actividadesSeleccionadas, autorizadosSeleccionados, ordenesServiciosSeleccionados,pagosSeleccionados, facturasSeleccionados, manejarSeleccionEnLists)}
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

ListServicios.propTypes = {
    opcion: PropTypes.string.isRequired,
    raiz: PropTypes.string.isRequired,
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

Pagos.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}

Facturas.propTypes={
  data: PropTypes.object,
  isEditing: PropTypes.bool,
}


export default ListServicios;

