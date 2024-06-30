import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, MenuItem ,Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';



const style = {
    py: 0,
    width: '80%',
    borderColor: 'divider',
    backgroundColor: 'Transparent',
    color: 'black',
  };

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

function ListServicios({opcion}){
    
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState('');
    const [tipoDePago, setTipoDePago] = useState('');
    const [detallesPago, setDetallesPago] = useState({
        tipoEfectivo: '',
        referencia: '',
        numeroTelefono: '',
        numeroTarjeta: '',
        tipoTarjeta: '',
        banco: ''
    });

    const [listaServiciosSeleccionados, setListaServiciosSeleccionados] = useState([]);
    const [reservasSeleccionados, setReservasSeleccionados] = useState([]);
    const [pagosSeleccionados, setPagosSeleccionados] = useState([]);
    const [facturasSeleccionados, setFacturasSeleccionados] = useState([]);

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
    obtenerDatos('LISTAS DE SERVICIOS', setListaServiciosSeleccionados);
    obtenerDatos('RESERVAS', setReservasSeleccionados);
    obtenerDatos('PAGOS', setPagosSeleccionados);
    obtenerDatos('FACTURAS', setFacturasSeleccionados);
  }, []);

    const handleTipoDePagoChange = (event) => {
        setTipoDePago(event.target.value);
    };
      
    const handleDetallePagoChange = (event) => {
        setDetallesPago({ ...detallesPago, [event.target.name]: event.target.value });
    };

    function ListaDeServicios(){
        // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
       const [formData, handleChange] = useForm({
        Descripcion: '',
        cedula_coordinador: '',
        CodigoServ: ''
        });

        // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
        const handleSubmit = async (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
            // Desestructura formData para obtener los valores de los campos del formulario
            const { Descripcion, cedula_coordinador, CodigoServ} = formData;
            try {
            // Intenta enviar los datos del formulario al servidor utilizando una función sendData y espera por la respuesta
            const data = await sendData(`${SERVERNAME}/servicios`, formData);
            alert('Agregado correctamente'); // Muestra una alerta indicando que el empleado fue agregado correctamente
            } catch (error) {
                console.error('Error al agregar el servicio', error); // Registra en consola el error si la solicitud falla
                alert('Error al agregar el servicio. Por favor, intente nuevamente.'); // Muestra una alerta de error
            }
        };

        return(
            
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
              }}
                noValidate
            autoComplete="off"> 
              <h3>Ingrese los Siguientes Datos</h3>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="DESCRIPCION" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='Descripcion'/>
                    </Box>  
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="CEDULA-COORDINADOR" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='cedula_coordinador'/>
                    </Box>
                </Box>
                <Button type='submit' variant="contained" sx={{
                                  margin: '5px 0',
                                  color: '#000000',
                                  bgcolor: '#FFFFFF',
                                  '&:hover': {
                                      bgcolor: '#41B06E',
                                      color: '#FFFFFF'}}}>
                                  Agregar {opcion}
                </Button>
            </Box>
            
            
        )
    }

    function Reservas(){
        // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
        const [formData, handleChange] = useForm({
            NroR : '',
            FechaR : '',
            Abono : '',
            CodVehiculo : ''
        });

        // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
        const handleSubmit = async (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
            // Desestructura formData para obtener los valores de los campos del formulario
            const { NroR, FechaR, Abono, CodVehiculo } = formData;
            try {
                // Intenta enviar los datos del formulario al servidor utilizando una función sendData y espera por la respuesta
                const data = await sendData(`${SERVERNAME}/reservas`, formData);
                alert('Agregado correctamente'); // Muestra una alerta indicando que el cliente fue agregado correctamente
            } catch (error) {
                console.error('Error al agregar la reserva', error); // Registra en consola el error si la solicitud falla
                alert('Error al agregar la reserva. Por favor, intente nuevamente.'); // Muestra una alerta de error
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
              }}
                noValidate
            autoComplete="off"> 
              <h3>Ingrese los Siguientes Datos</h3>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="FECHA-DE-RESERVA" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='date'
                        name='Fecha_de_reserva'/>
                    </Box>  
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="ABONO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='ABONO'/>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="CODIGO_VEHICULO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='CODIGO_VEHICULO'/>
                    </Box>
                </Box>
                <Button type='submit' variant="contained" sx={{
                                  margin: '5px 0',
                                  color: '#000000',
                                  bgcolor: '#FFFFFF',
                                  '&:hover': {
                                      bgcolor: '#41B06E',
                                      color: '#FFFFFF'}}}>
                                  Agregar {opcion}
                </Button>
            </Box>
            </FormBox>
            
        )
    }

    function Pagos() {
        // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados
        const [formData, handleChange] = useForm({
            CodPago: '',
            Fecha: '',
            Monto:'',
            TipoPago: '',
            TipoEfectivo:'',
            Referencia:'',
            NroTelf:'',
            TipoTarjeta:'',
            Banco:'',
            NumTarjeta:'',
            NumFacturaServicio:'',
            NumR:''
        });

        // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
        const handleSubmit = async (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
            // Desestructura formData para obtener los valores de los campos del formulario
            const { CodPago, Fecha,Monto, TipoPago,TipoEfectivo,Referencia,NroTelf,TipoTarjeta, Banco,NumTarjeta,NumFacturaServicio, NumR } = formData;
            try {
                // Intenta enviar los datos del formulario al servidor utilizando una función sendData y espera por la respuesta
                const data = await sendData(`${SERVERNAME}/pagos`, formData);
                alert('Agregado correctamente'); // Muestra una alerta indicando que el cliente fue agregado correctamente
            } catch (error) {
                console.error('Error al agregar el pago', error); // Registra en consola el error si la solicitud falla
                alert('Error al agregar el pago. Por favor, intente nuevamente.'); // Muestra una alerta de error
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
          }}
            noValidate
            autoComplete="off">
            <h3>Ingrese los Siguientes Datos</h3>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextField label="FECHA-DE-PAGO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='date'
                  name='Fecha_de_pago' />
                  <TextField
                    select
                    label="Tipo de Pago"
                    value={tipoDePago}
                    onChange={handleTipoDePagoChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    >
                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                        <MenuItem value="PagoMovil">Pago Móvil</MenuItem>
                        <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                    </TextField>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextField label="MONTO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='text'
                  name='Monto' />
                  <TextField label="CEDULA-CLIENTE" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='text'
                  name='cedula_cliente' />
              </Box>
                {tipoDePago === 'Efectivo' && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        select
                        label="Tipo Efectivo"
                        name="tipoEfectivo"
                        value={detallesPago.tipoEfectivo}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        >
                            <MenuItem value="Bolivares">Bolívares</MenuItem>
                            <MenuItem value="Divisas">Divisas</MenuItem>
                        </TextField>
                    </Box>
                )}

                {tipoDePago === 'PagoMovil' && (
                    <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        label="Referencia"
                        name="referencia"
                        value={detallesPago.referencia}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                        <TextField
                        label="Número de Teléfono"
                        name="numeroTelefono"
                        value={detallesPago.numeroTelefono}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                    </Box>
                    </>
                )}

                {tipoDePago === 'Tarjeta' && (
                    <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        label="Número de Tarjeta"
                        name="numeroTarjeta"
                        value={detallesPago.numeroTarjeta}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                        <TextField
                        select
                        label="Tipo de Tarjeta"
                        name="tipoTarjeta"
                        value={detallesPago.tipoTarjeta}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        >
                            <MenuItem value="Debito">Débito</MenuItem>
                            <MenuItem value="Credito">Crédito</MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        label="Banco"
                        name="banco"
                        value={detallesPago.banco}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                    </Box>
                    </>
                )}
            </Box>
            <Button type='submit' variant="contained" sx={{
              margin: '5px 0',
              color: '#000000',
              bgcolor: '#FFFFFF',
              '&:hover': {
                bgcolor: '#41B06E',
                color: '#FFFFFF'
              }
            }}>
              Agregar {opcion}
            </Button>
          </Box>
          </FormBox>
          
        )
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
function mostrarLista(opcion, listaServiciosSeleccionados, reservasSeleccionados, pagosSeleccionados,facturasSeleccionados, onSeleccionado) {
    // Utiliza una estructura switch para manejar las diferentes opciones
    switch (opcion) {
      case 'Listas de Servicios':
        // Renderiza y retorna una lista de empleados seleccionados
        return renderList(listaServiciosSeleccionados, 'Descripcion', 'CodServ', onSeleccionado);
      case 'Reservas':
        // Renderiza y retorna una lista de clientes seleccionados
        return renderList(reservasSeleccionados, 'NroR', 'FechaR', onSeleccionado);
      case 'Pagos':
        // Renderiza y retorna una lista de vehículos seleccionados
        return renderList(pagosSeleccionados, 'Monto', 'TipoPago', onSeleccionado);
      case 'Facturas':
        return renderList(facturasSeleccionados, 'Monto', 'Fecha');
      default:
        // Retorna un párrafo indicando que se debe seleccionar una opción si ninguna coincide
        return <p>Seleccione una opción</p>;
    }
  }

    const handleOpen = (type) => {
        setFormType(type);
        setOpen(true);
    };

    const renderForm = () => {
        switch (formType) {
          case 'Listas de Servicios':
            return <ListaDeServicios />;
          case 'Reservas':
            return <Reservas />;
           case 'Pagos':
            return <Pagos />;
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
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    {mostrarLista(opcion, listaServiciosSeleccionados, reservasSeleccionados, pagosSeleccionados, facturasSeleccionados, manejarSeleccionEnLists)}
                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt: 3 }} onClick={() => handleOpen(opcion)}>
                        Agregar {opcion}
                    </Button>
                    <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        {renderForm()}
                    </Modal>
                </Box>
            </Box>
            <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '34%', height: 'auto' }}>
                { seleccionEnLists ? (
                    <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div className="circle"><img src="./src/assets/Servicio Carros.jpg" alt="" style={{width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        overflow: 'hidden'}}/></div>
                        <h2>{ seleccionEnLists.Descripcion || '' }</h2>
                    </Box> ) :(
                        <Typography>No se ha seleccionado ningún Servicio</Typography>
                )}
                
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <List sx={style}>
                        <ListItem>
                            <ListItemText />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText/>
                        </ListItem>
                    </List>
                    { (opcion === 'Listas de Servicios' || opcion === 'Reservas' || opcion === 'Pagos') && (
                        <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }}>
                            Modificar
                        </Button>
                    )};
                    { opcion === 'Facturas' && (
                        <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }}>
                         Imprimir Factura
                        </Button>
                    )}
                    
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

export default ListServicios;