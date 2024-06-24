import { Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import React, { useState } from 'react';

const style = {
  py: 0,
  width: '80%',
  borderColor: 'divider',
  backgroundColor: 'Transparent',
  color: 'black',
};

const datosDePrueba = [
  { primary: "Elemento 1", secondary: "Detalle 1", cedula:"30293326", telefono:"123456", sueldo:"1000$" },
    { primary: "Elemento 2", secondary: "Detalle 2", cedula: "15778991", telefono: "654321", sueldo: "2000$" },
    { primary: "Elemento 3", secondary: "Detalle 3", cedula: "12345678", telefono: "987654", sueldo: "3000$" },
    { primary: "Elemento 4", secondary: "Detalle 4", cedula: "87654321", telefono: "456789", sueldo: "4000$" },
    { primary: "Elemento 5", secondary: "Detalle 5", cedula: "98765432", telefono: "789456", sueldo: "5000$" },
    { primary: "Elemento 6", secondary: "Detalle 6", cedula: "23456789", telefono: "654987", sueldo: "6000$" },
    { primary: "Elemento 7", secondary: "Detalle 7", cedula: "34567890", telefono: "987654", sueldo: "7000$" },
    { primary: "Elemento 8", secondary: "Detalle 8", cedula: "45678901", telefono: "654987", sueldo: "8000$" },
    { primary: "Elemento 9", secondary: "Detalle 9", cedula: "56789012", telefono: "987654", sueldo: "9000$" },
    { primary: "Elemento 10", secondary: "Detalle 10", cedula: "67890123", telefono: "654987", sueldo: "10000$" },
    { primary: "Elemento 11", secondary: "Detalle 11", cedula: "78901234", telefono: "987654", sueldo: "11000$" },
    { primary: "Elemento 12", secondary: "Detalle 12", cedula: "89012345", telefono: "654987", sueldo: "12000$" },
    { primary: "Elemento 13", secondary: "Detalle 13", cedula: "90123456", telefono: "987654", sueldo: "13000$" },
    { primary: "Elemento 14", secondary: "Detalle 14", cedula: "01234567", telefono: "654987", sueldo: "14000$" },
    { primary: "Elemento 15", secondary: "Detalle 15", cedula: "12345678", telefono: "987654", sueldo: "15000$" },
];

function Lists() {
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({});

    const manejarClicEnEmpleado = (dato) => {
        setEmpleadoSeleccionado(dato);
    };

    return (
        <Box>
                        <div className="vertical_line"></div>
        <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }}>
                        {datosDePrueba.map((dato, index) => (
                            <React.Fragment key={index}>
                                <ListItem onClick={() => manejarClicEnEmpleado(dato)}>
                                    <ListItemText primary={dato.primary} secondary={dato.secondary} />
                                    {dato.cedula}
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
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

export default Lists;