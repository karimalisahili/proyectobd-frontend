import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';

const style = {
  py: 0,
  width: '80%',
  borderColor: 'divider',
  backgroundColor: 'Transparent',
  color: 'black',
};



const SERVERNAME = import.meta.env.VITE_SERVERNAME;

function Lists({ opcion}) {

  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState('');

  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
   const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);

  useEffect(() => {
  const obtenerDatosEmpleados = async () => {
    try {
      const respuesta = await fetch(`${SERVERNAME}/TRABAJADORES`);
      const datosEmpleados = await respuesta.json();
       setEmpleadosSeleccionados(datosEmpleados);
    } catch (error) {
      console.error('Error al obtener datos de empleados:', error);
    }
  };
  
  obtenerDatosEmpleados();
}, []);

  useEffect(() => {
  const obtenerDatosClientes = async () => {
    try {
      const respuesta = await fetch(`${SERVERNAME}/RESPONSABLES`);
      const datosClientes = await respuesta.json();
       setClientesSeleccionados(datosClientes);
    } catch (error) {
      console.error('Error al obtener datos de empleados:', error);
    }
  };
  
  obtenerDatosClientes();
  }, []);
  
    useEffect(() => {
  const obtenerDatosVehiculos = async () => {
    try {
      const respuesta = await fetch(`${SERVERNAME}/VEHICULOS`);
      const datosVehiculos = await respuesta.json();
       setVehiculosSeleccionados(datosVehiculos);
    } catch (error) {
      console.error('Error al obtener datos de empleados:', error);
    }
  };
  
  obtenerDatosVehiculos();
}, []);


  function Personal() {
    return (
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
        autoComplete="off"
      >
        
        <h3>Ingrese los Siguientes Datos</h3>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="RIF-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='rif_sucursal'
            />

            <TextField label="NOMBRE-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='nombre_empleado'
            />

          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="CEDULA-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='cedula_empleado'
            />
            <TextField label="TELEFONO-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='telefono_empleado'
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="DIRECCION-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='direccion_empleado'
            />
            <TextField label="SUELDO-EMPLEADO" type="number"
              InputProps={{
                inputProps: {
                  min: 1
                }
              }} sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              name='sueldo_empleado'
            />
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
    );
  }
  
  function Cliente() {
    return (
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
        autoComplete="off"
      >
        
        <h3>Ingrese los Siguientes Datos</h3>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="CEDULA-CLIENTE" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='rif_sucursal'
            />

            <TextField label="NOMBRE-CLIENTE" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='nombre_empleado'
            />

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
    );
  }
  
  function Vehiculo() {
    return (
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
        autoComplete="off"
      >
        
        <h3>Ingrese los Siguientes Datos</h3>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="CEDULA-CLIENTE" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='rif_sucursal'
            />

            <TextField label="COD-VEHICULO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='nombre_empleado'
            />

          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="PLACA-VEHICULO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='rif_sucursal'
            />

            <TextField label="TIPO-ACEITE" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='nombre_empleado'
            />

          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="FECHA-ADQUISISION" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='rif_sucursal'
            />

            <TextField label="COD-MARCA" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='nombre_empleado'
            />

          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <TextField label="No-MODELO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
              type='text'
              name='rif_sucursal'
            />

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
    );
  }

  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
  };

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

function mostrarLista() {
    switch (opcion) {
      case 'Personal':
        return (
          <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }} >
            {empleadosSeleccionados.map((empleado, index) => (
            <ListItem key={index}>
                <ListItemText primary={empleado.Nombre} />
                {empleado.Cedula}
            </ListItem>
            ))}
          </List>
        );
      case 'Cliente':
        return (
          <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }} >
            {clientesSeleccionados.map((cliente, index) => (
            <ListItem key={index}>
                <ListItemText primary={cliente.NombreResponsable} />
                {cliente.CIResponsable}
            </ListItem>
            ))}
          </List>
        );
      case 'Vehiculo':
        return (
          <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }} >
            {vehiculosSeleccionados.map((vehiculo, index) => (
            <ListItem key={index}>
                <ListItemText primary={vehiculo.Placa} />
                {vehiculo.CodVehiculo}
            </ListItem>
            ))}
          </List>
        );
      default:
        return <p>Seleccione una opción</p>;
    }
  }

  return (
    <Box>
      <div className="vertical_line"></div>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          {mostrarLista()}
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
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <div className="circle"></div>
          <h2></h2>
          <h2></h2>
        </Box>
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
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }}>
            Modificar
          </Button>
        </Box>
          
      </Box>
    </Box>
  );
}

Lists.propTypes = {
  opcion: PropTypes.string.isRequired,
  raiz: PropTypes.string.isRequired,
};

export default Lists;