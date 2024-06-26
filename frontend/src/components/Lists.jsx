import { Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';

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
          { primary: 'Juan Perez', secondary: 'Gerente', d1: '123456789', d2: '1234567890', d3: '1000', t1: 'Cedula', t2: 'Telefono', t3: 'Sueldo'},
          { primary: 'Maria Lopez', secondary: 'Secretaria', d1: '987654321', d2: '0987654321', d3: '800' , t1: 'Cedula', t2: 'Telefono', t3: 'Sueldo'},
          { primary: 'Pedro Ramirez', secondary: 'Chofer', d1: '456789123', d2: '4567891230', d3: '700' , t1: 'Cedula', t2: 'Telefono', t3: 'Sueldo'},
          { primary: 'Ana Rodriguez', secondary: 'Cajera', d1: '789123456', d2: '7891234560', d3: '900' , t1: 'Cedula', t2: 'Telefono', t3: 'Sueldo'},
        ],
      },
      { 
        nombreHijo: 'Cliente',
        datos: [
          { primary: 'Juan Perez', secondary: '123456789', d1: '', d2: '', d3: '', t1: '', t2: '', t3: '',},
        ],
      },
      { 
        nombreHijo: 'Vehiculo',
        datos: [
          { primary: '123', secondary:'a1b', d1:'123456', d2:'456', d3:'001', t1: 'Responsable', t2: 'Cod Marca', t3: 'No Modelo'}
        ],
      },
    ]
  },
];

function Lists({ opcion, raiz }) {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({});

  const manejarClicEnEmpleado = (dato) => {
    setEmpleadoSeleccionado(dato);
  };

  const padreRaiz = useMemo(() => datosDePrueba.find(padre => padre.nombrePadre === raiz), [raiz]);
  const hijoOpcion = useMemo(() => padreRaiz ? padreRaiz.hijos.find(hijo => hijo.nombreHijo === opcion) : null, [opcion, padreRaiz]);

  const agregarEmpleado = () => {
    // Simulación de agregar empleado
    alert("Agregar empleado no está implementado.");
  };

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
            {hijoOpcion && hijoOpcion.datos.map((dato, index) => (
              <ListItem key={index} onClick={() => manejarClicEnEmpleado(dato)} button>
                <ListItemText primary={dato.primary} secondary={dato.secondary} />
                {dato.d1}
              </ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt:3 }} onClick={agregarEmpleado}>
            Agregar Empleado
          </Button>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '34%', height: 'auto' }}>
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <div className="circle"></div>
          <h2>{empleadoSeleccionado.primary || ''}</h2>
          <h2>{empleadoSeleccionado.secondary || ''}</h2>
        </Box>
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <List sx={style}>
            <ListItem>
              <ListItemText primary={empleadoSeleccionado.t1} />
              { empleadoSeleccionado.d1}
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={empleadoSeleccionado.t2} />
              { empleadoSeleccionado.d2}
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={empleadoSeleccionado.t3} />
              { empleadoSeleccionado.d3}
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