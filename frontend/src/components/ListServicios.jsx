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

function ListServicios(){
    const [servicioSeleccionado, setServicioSeleccionados] = useState([]);

    const [formData, setFormData] = useState({
        codigo_servicio: '',
        descripcion: '',
        ci_coordinador: '',
    })

    useEffect(() => {
        const obtenerDatosServicios = async () => {
            try{
                const respuesta = await fetch(`${SERVERNAME}/SERVICIOS`);
                const datosServicios = await respuesta.json();
                setServicioSeleccionados(datosServicios);
            }catch(error){
                console.error('Error al obtener los servicios', error);
            }
        };

        obtenerDatosServicios();
    }, []);

    console.log(servicioSeleccionado)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDEfault();


        const{
            codigo_servicio: CodigoServ,
            descripcion: Descripcion,
            ci_coordinador: CI_Coord,
        } = formData;

        try{
            const responseServicio = await fetch(`${SERVERNAME}/SERVICIOS`, {
                method : 'POST',
                headers :{
                    'Content-Type': 'applocation/json',
                },
                body: JSON.stringify({
                    CodigoServ,
                    Descripcion,
                    CI_Coord
                }),
            });

            const dataServicio = await responseServicio.json();
            if (!responseServicio.ok){
                throw new Error(dataServicio.message || 'Error en la solicitud de registro');
            }

            alert('Agregado Correctamente')
        }catch(error){
            console.error('Error al agregar el servicio', error);
            alert('Error al agregar el servicio. Por favor, intente nuevamente');
        }   
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen( false);



    const manejarClicServicio = (servicio) => {
        setServicioSeleccionados(servicio);
    }

    return (
        <Box>
            <div className='vertical_line'></div>
            <Box sx={{ 
                position: 'absolute', 
                ml: '15%', 
                width: '35%', 
                top: '50%', 
                height: 'auto'}}>
                    <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }}>
                            {servicioSeleccionado.map((servicio, index) => (
                                <ListItem key={index} button onClick={() => manejarClicServicio(servicio)}>
                                    <ListItemText primary ={servicio.CodigoServ} secondary={`CI: ${servicio.CI_Coord}`}/>
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="contained" sx={{ backgroundColor:'#8DECB4','&:hover':{ backgroundColor : '#41B06E'}, mt:3 }} onclick={handleOpen}>
                            Agregar Servicio
                        </Button>
                        <Modal open ={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describeby="modal-modal-description"
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
                                <TextField label="Codigo_Servicio" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='Codigo_Servicio'
                                value={formData.codigo_servicio}
                                onChange={handleChange}
                                />

                                <TextField label="Descripcion" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='Descripcion'
                                value={formData.descripcion}  
                                onChange={handleChange}
                                />

                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                <TextField label="CI_Coordinador" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='CI_Coordinador'
                                value={formData.ci_coordinador}
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
            {servicioSeleccionado ? (
            <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <div className="circle"></div>
            <h2>{servicioSeleccionado.descripcion || ''}</h2>
            <h2>{servicioSeleccionado.CI_Coord|| ''}</h2>
            </Box>
            ) : (
                <Typography>No se ha seleccionado ningún empleado</Typography>
            )}
            <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <List sx={style}>
                    <ListItem>
                        <ListItemText primary={servicioSeleccionado.t1} />
                        {servicioSeleccionado.d1}
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText primary={servicioSeleccionado.    t2} />
                        { servicioSeleccionado.d2}
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText primary={servicioSeleccionado.t3} />
                        { servicioSeleccionado.d3}
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

export default ListServicios;