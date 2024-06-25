import { Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

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
                    { primary: 'Juan Perez', secondary: 'Gerente', cedula: '123456789', telefono: '1234567890', sueldo: '1000' },
                    { primary: 'Maria Lopez', secondary: 'Secretaria', cedula: '987654321', telefono: '0987654321', sueldo: '800' },
                    { primary: 'Pedro Ramirez', secondary: 'Chofer', cedula: '456789123', telefono: '4567891230', sueldo: '700' },
                    { primary: 'Ana Rodriguez', secondary: 'Cajera', cedula: '789123456', telefono: '7891234560', sueldo: '900' },
                ]
            },
            { 
                nombreHijo: 'Cliente',
                datos: [
                    { primary: 'Jose Perez', secondary: 'Cliente', cedula: '123456789', telefono: '1234567890', sueldo: '1000' },
                    { primary: 'Luis Lopez', secondary: 'Cliente', cedula: '987654321', telefono: '0987654321', sueldo: '800' },
                    { primary: 'Carlos Ramirez', secondary: 'Cliente', cedula: '456789123', telefono: '4567891230', sueldo: '700' },
                    { primary: 'Ana Rodriguez', secondary: 'Cliente', cedula: '789123456', telefono: '7891234560', sueldo: '900' },
                ]
            },
            { 
                nombreHijo: 'Vehiculo',
                datos: [
                    { primary: 'Toyota', secondary: 'Carro', cedula: '123456789', telefono: '1234567890', sueldo: '1000' },
                    { primary: 'Mazda', secondary: 'Carro', cedula: '987654321', telefono: '0987654321', sueldo: '800' },
                    { primary: 'Ford', secondary: 'Carro', cedula: '456789123', telefono: '4567891230', sueldo: '700' },
                    { primary: 'Chevrolet', secondary: 'Carro', cedula: '789123456', telefono: '7891234560', sueldo: '900' },
                ]
            },
        ]
    }
];


function Lists({opcion, raiz}) {
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({});

    const manejarClicEnEmpleado = (dato) => {
        setEmpleadoSeleccionado(dato);
    };

console.log("Raíz buscada:", raiz);
console.log("Datos de prueba:", datosDePrueba);
const padreRaiz = datosDePrueba.find(padre => padre.nombrePadre === raiz);
    console.log("Padre encontrado:", padreRaiz);
    
    console.log('Hijo buscado:', opcion);
    const hijoOpcion = padreRaiz ? padreRaiz.hijos.find(hijo => hijo.nombreHijo === opcion) : null;

    console.log("Hijo encontrado:", hijoOpcion);
    

    return (
        <Box>
                        <div className="vertical_line"></div>
        <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }}>
                        {hijoOpcion && hijoOpcion.datos.map((dato, index) => (
                            <ListItem key={index} onClick={() => manejarClicEnEmpleado(dato)}>
                                <ListItemText primary={dato.primary} secondary={dato.secondary} />
                                {dato.cedula}
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt:3 }} onClick={() => { }}>
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
                            <ListItemText primary="Cedula"/>
                            { empleadoSeleccionado.cedula}
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="Telefono" />
                            { empleadoSeleccionado.telefono}
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="Sueldo" />
                                { empleadoSeleccionado.sueldo}
                            </ListItem>
                    </List>
                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => { }}>
                        Modificar
                    </Button>
                </Box>
            </Box>
            </Box>
    )
}

Lists.propTypes = {
    opcion: PropTypes.string,
    raiz: PropTypes.string,
};

export default Lists;