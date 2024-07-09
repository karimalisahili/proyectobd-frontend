
import { Box, Button, List, ListItem, ListItemText, Modal, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Stepper, Step, StepLabel, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import React,{ useState, useEffect } from 'react';



const steps = ['Seccion de Pago', 'Factura Preliminar'];
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);

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
  const listStyle = { ...style, maxHeight: '320px', overflowY: 'auto', marginTop: '20px'};

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
  const resetForm = () => setFormData(initialState);

  return [formData, handleChange, resetForm];
}

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

function Ventas() {
  const initialValues = {
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

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const initialValuesFacturas = {
    Fecha: null,
    Monto: 0,
    Descuento: 0,
    CodPago: 0,
    CIResponsable: ''
  };



  const [formData, handleChange, resetForm] = useForm(initialValues);

  const [formDataFactura, handleChange2, resetForm2] = useForm2(initialValuesFacturas);
  const [facturaEmitida, setFacturaEmitida] = useState(false);

  const handleSubmitFactura = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
    if (!isConfirmed) {
      return; // Si el usuario no confirma, detiene la función aquí
    }
    
    formDataFactura.Fecha = new Date().toISOString().split('T')[0];
    formDataFactura.Monto = total;
    formDataFactura.Descuento = Descuento.Descuento;
    formDataFactura.CodPago = localStorage.getItem('codigoPago');

    const endpoint = `${SERVERNAME}/facturas_tiendas`;
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
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [Descuento, setDescuento] = useState([]);
  const [Pagos, setPagos] = useState([]);
  const [Clientes, setClientes] = useState([]);



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
    obtenerDatos('productos', setProductoSeleccionado);
    obtenerDatos(`facturas_tiendas_descuento/${formDataFactura.CIResponsable}`, setDescuento);
    obtenerDatos(`pagos`, setPagos);
    obtenerDatos(`responsables`, setClientes);
  }, [formDataFactura.CIResponsable]);


  if (Pagos && Pagos.length > 0) {
    // Suponiendo que quieres guardar el código de pago del primer elemento de la lista
    const codigoPago = Pagos[Pagos.length - 1].CodPago; // Ajusta el índice según sea necesario
    localStorage.setItem('codigoPago', Number(codigoPago) + 1);
  } else if (Pagos && Pagos.length == 0) {
    localStorage.setItem('codigoPago', 1);
  }

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

  const subtotal = selectedProducts.reduce((acc, product) => acc + product.total, 0);

// Paso 2 y 3: Verificar si `descuento` tiene datos y calcular el total con descuento
let total = 0;
if (Descuento) {
  // Asegurarse de que Descuento no es undefined y tiene al menos un elemento
  const montoDescuento = (subtotal * Descuento.Descuento) / 100;
  total = subtotal - montoDescuento;

} else {
  // Si no hay descuento, el total es el subtotal
  total = subtotal;
  }
  formDataFactura.Monto = total;
  return (
    <Box>
      <div className="vertical_line"></div>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '30%', height: 'auto' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 className='h1Tienda'>Productos Disponibles</h1>
          {/* Renderiza la lista de productos disponibles */}
          <List sx={listStyle}>
            {productoSeleccionado.map((product, index) => (
              <ListItem key={index} button onClick={() => handleSelectProduct(product)}  sx={{    '&:hover': {
      backgroundColor: '#41B06E'
    },}}>
                <ListItemText primary={product.NombreP} />
                {product.Descripcion}
              </ListItem>
            ))}
          </List>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Ingrese la cantidad</DialogTitle>
            <DialogContent>
              <TextField autoFocus margin="dense" id="quantity" label="Cantidad" type="number" fullWidth variant="standard" value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleConfirmQuantity}>Confirmar</Button>
            </DialogActions>
          </Dialog>
          <TextField select label="Cédula Cliente" name='CIResponsable' sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formDataFactura.CIResponsable} onChange={handleChange2}>
                          {Clientes.map((cliente, index) => (
                            <MenuItem key={index} value={cliente.CIResponsable}>
                              {cliente.CIResponsable}
                            </MenuItem>
                          ))}
                        </TextField>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '30%', height: 'auto', alignItems:'center', display:'flex', flexDirection:'column'}}>
        <h1 className='h1Tienda'>Productos Seleccionados</h1>
        {/* Renderiza la lista de productos seleccionados */}
        <List sx={listStyle}>
          {selectedProducts.map((product, index) => (
            <ListItem key={index}>
             <ListItemText primary={product.NombreP} secondary={product.Descripcion} />
             {`Cantidad: ${product.quantity}, Total: $${product.total}`}
            </ListItem>
          ))}
        </List>
        <ListItem sx={listStyle}>
          <ListItemText primary="SubTotal" />
          ${selectedProducts.reduce((acc, product) => acc + product.total, 0)}  
        </ListItem>
            {Descuento && (
  <ListItem sx={listStyle}>
    <ListItemText primary="Descuento" />
    ${Descuento.Descuento}
          </ListItem>
)}
          <ListItem sx={listStyle}>
            <ListItemText primary="Total" />
            ${total}
          </ListItem>
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4',my:3, mx:3, '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => handleOpen2()}>
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
                        <TextField label="Monto" type='number' name='Monto' min={0} sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} value={formData.Monto = total} onChange={handleChange} disabled ></TextField>
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
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <TableContainer component={Paper}>
                      <h1 style={{color:'black'}}>M&M</h1>
                      <p className='p_factura'>RIF: {user.RIFSuc}</p>
                      <p className='p_factura'>Fecha:  {new Date().toISOString().split('T')[0]}</p>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell align="right">Precio</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedProducts.map((product, index) => (  
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {product.Descripcion}
                              </TableCell>
                              <TableCell align="right">{product.quantity}</TableCell>
                              <TableCell align="right">{product.Precio}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">${total }</TableCell>
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
                  {activeStep === steps.length - 1 ? (
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
    </Box>
  </Box>
);
}

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`${SERVERNAME}/facturas_tiendas`);
        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

  const handleSelectFactura = (nroFactura) => {
    setSelectedFactura(nroFactura);
  };

  const [openModal, setOpenModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

const handleOpenModal = () => setOpenModal(true);
const handleCloseModal = () => setOpenModal(false);

// Función para renderizar los detalles de la factura seleccionada
const renderFacturaDetails = () => {
  const factura = facturas.find(f => f.CodF === selectedFactura);
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
                     <TableContainer component={Paper} sx={{ width:'600px', alignContent:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                      <h1 style={{ color: 'black', marginBottom: '0' }}>M&M</h1>
                      <h3 style={{alignSelf:'center'}}>M&M al servicio del planeta</h3>
                      <p className='p_factura'>RIF: {user.RIFSuc}</p>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Nro. Factura</TableCell>
                            <TableCell align="center">Fecha Emision</TableCell>
                            <TableCell align="center">Monto</TableCell>
                            <TableCell align="center">Descuento</TableCell>
              <TableCell align="center">Cod. Pago</TableCell>
              <TableCell align="center">CI. Cliente</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={factura.nroFactura}>
                              <TableCell align="center">
                                {factura.CodF}
                              </TableCell>
                              <TableCell align="center">{factura.Fecha}</TableCell>
                              <TableCell align="center">{factura.Monto}</TableCell>
                              <TableCell align="center">{factura.Descuento}</TableCell>
                              <TableCell align="center">{factura.CodPago}</TableCell>
                              <TableCell align="center">{factura.CIResponsable}</TableCell>
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
                
    <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'auto',}} >
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
      {facturas.map((factura) => {
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
                backgroundColor: '#8DECB4 !important' // Cambia el color de fondo al pasar el mouse
              },
              ...(isSelected && {
                backgroundColor: '#41B06E !important', // Color verde más oscuro al seleccionar
              }),
            }}
          >
            <TableCell padding="checkbox">
              <Checkbox checked={isSelected} sx={{
    color: '#41B06E', // Color cuando el checkbox no está seleccionado
    '&.Mui-checked': {
      color: '#8DECB4', // Color cuando el checkbox está seleccionado
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
      })}
    </TableBody>
  </Table>
</TableContainer>
    </Box>
  );
}

function ListaTienda({ opcion }) {
  const renderfunction = (funcion) => {
    switch (funcion) {
      case 'Ventas de Productos':
        return <Ventas />;
      case 'Facturas':
        return <Facturas />;
      default:
        return <div> fallo </div>;
    }
  };
  return (
    <Box>
      {renderfunction(opcion)}
    </Box>
  );
}
  
ListaTienda.propTypes = {
  opcion: PropTypes.string,
  raiz: PropTypes.string
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

  export default ListaTienda;
   