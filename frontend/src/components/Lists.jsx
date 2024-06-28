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

const datosDePrueba = [
  {
    nombrePadre: 'Libreta',
    hijos: [
      {
        nombreHijo: 'Personal',
        datos: [
          { primary: '', secondary: '', d1: '', d2: '', d3: '', t1: 'Cedula', t2: 'Telefono', t3: 'Sueldo'},
        ],
      },
      { 
        nombreHijo: 'Cliente',
        datos: [
          { primary: '', secondary: '', d1: '', d2: '', d3: '', t1: '', t2: '', t3: '',},
        ],
      },
      { 
        nombreHijo: 'Vehiculo',
        datos: [
          { primary: '', secondary:'', d1:'', d2:'', d3:'', t1: 'Responsable', t2: 'Cod Marca', t3: 'No Modelo'}
        ],
      },
    ]
  },
];



const SERVERNAME = import.meta.env.VITE_SERVERNAME;

function Lists({ opcion, raiz }) {
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);

  const [formData, setFormData] = useState({
        rif_sucursal: '',
        nombre_empleado: '',
        cedula_empleado: '',
        telefono_empleado: '',
        direccion_empleado: '',
        sueldo_empleado: 0,
    });

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

console.log(empleadosSeleccionados) 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

  const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Desestructurar formData para obtener los datos del formulario
        const {
            rif_sucursal: RIFSuc,
            nombre_empleado: Nombre,
            cedula_empleado: Cedula,
            telefono_empleado: Telefono,
            direccion_empleado: Direccion,
            sueldo_empleado: Salario
          } = formData;
        
        
        try {
        
            const responseEmpleado = await fetch(`${SERVERNAME}/trabajadores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cedula,
                    Nombre,
                    Direccion,
                    Salario,
                    Telefono,
                    RIFSuc
                }),
            });

            const dataEmpleado = await responseEmpleado.json(); // Parsea la respuesta como JSON
            if (!responseEmpleado.ok) {
                throw new Error(dataEmpleado.message || 'Error en la solicitud de registro');
            }

            alert('Agregafo correctamente');
        } catch (error) {
            console.error('Error al agregar el empleado', error);
            alert('Error al agregar el empleado. Por favor, intente nuevamente.');
        }
    }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

const manejarClicEnEmpleado = (empleado) => {
  setEmpleadoSeleccionado(empleado);
};

  const padreRaiz = useMemo(() => datosDePrueba.find(padre => padre.nombrePadre === raiz), [raiz]);
  const hijoOpcion = useMemo(() => padreRaiz ? padreRaiz.hijos.find(hijo => hijo.nombreHijo === opcion) : null, [opcion, padreRaiz]);

  const modificarEmpleado = () => {
    // Simulación de modificar empleado
    alert("Modificar empleado no está implementado.");
  };

  return (
    <Box>
      <div className="vertical_line"></div>
      <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }}>
              {empleadosSeleccionados.map((empleado, index) => (
            <ListItem key={index} button onClick={() => manejarClicEnEmpleado(empleado)}>
              <ListItemText primary={empleado.Nombre} secondary={`ID: ${empleado.Cedula}`} />
            </ListItem>
          ))}
          </List>
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt:3 }} onClick={handleOpen}>
            Agregar Empleado
          </Button>
          <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
              justifyContent:'center',
              margin: 'auto',
              border: '2px solid #ffffff',
              boxShadow: 24,
              p: 4,}}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
        
                    <h3>Ingrese los Siguientes Datos</h3>

                     <Box sx={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="RIF-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='rif_sucursal'
                                value={formData.rif_sucursal}
                                onChange={handleChange}
                            />

                            <TextField label="NOMBRE-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='nombre_empleado'
                                value={formData.nombre_empleado}  
                                onChange={handleChange}
                            />

                        </Box>

                         <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="CEDULA-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='cedula_empleado'
                                value={formData.cedula_empleado}
                                onChange={handleChange}
                            />
                            <TextField label="TELEFONO-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='telefono_empleado'
                                value={formData.telefono_empleado}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="DIRECCION-EMPLEADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='direccion_empleado'
                                value={formData.direccion_empleado}
                                onChange={handleChange}
                            />
                            <TextField label="SUELDO-EMPLEADO" type="number"
                                InputProps={{
                                    inputProps: {
                                        min: 1}
                                }} sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                name='sueldo_empleado'
                                value={formData.sueldo_empleado}
                                onChange={handleChange}
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
                            Agregar
                        </Button>
                </Box>
      </Modal>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '34%', height: 'auto' }}>
      {empleadoSeleccionado ? (
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <div className="circle"></div>
          <h2>{empleadoSeleccionado.Nombre || ''}</h2>
          <h2>{empleadoSeleccionado.Cedula || ''}</h2>
        </Box>
            ) : (
      <Typography>No se ha seleccionado ningún empleado</Typography>
    )}
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <List sx={style}>
            <ListItem>
              <ListItemText primary={empleadosSeleccionados.t1} />
              { empleadosSeleccionados.d1}
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={empleadosSeleccionados.t2} />
              { empleadosSeleccionados.d2}
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={empleadosSeleccionados.t3} />
              { empleadosSeleccionados.d3}
            </ListItem>
          </List>
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }} onClick={modificarEmpleado}>
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