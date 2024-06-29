import { Button, Typography, Grid, Divider, Container, TextField, Box } from '@mui/material';
import Fondo from '../assets/Fondoinicio.png';
import Logo from '../assets/Logo.png';
import '../css/Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const SERVERNAME = import.meta.env.VITE_SERVERNAME;

function Configuracion() {

    // Recuperar la cadena JSON almacenada en localStorage con la clave 'user'
    const userJson = localStorage.getItem('user');

    // Parsear la cadena JSON para convertirla en un objeto JavaScript
    const user = JSON.parse(userJson);


    const [formData, setFormData] = useState({
        rif_sucursal: user.RIFSuc || '',
        nombre_sucursal: user.NombreSuc || '',
        ciudad_sucursal: user.Ciudad || '',
        cedula_encargado: user.Encargado || '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const updateSucursal = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const url = `${SERVERNAME}/sucursal`; // Asegúrate de que SERVERNAME esté definido correctamente
        // Desestructurar formData para obtener los datos del formulario
        const {
            rif_sucursal: RIFSuc,
            nombre_sucursal: NombreSuc,
            ciudad_sucursal: Ciudad,
            cedula_encargado: Cedula,
        } = formData;

        try {
            const response = await fetch(url, {
                method: 'PUT', // Método HTTP
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RIFSuc,
                    NombreSuc,
                    Ciudad,
                    Encargado: Cedula
                }), // Convertir los datos del formulario a una cadena JSON
            });

            console.log(response);
            if (!response.ok) {
                throw new Error('Error al actualizar la sucursal');
            }
            const result = await response.json(); // Esperar la respuesta del servidor
            console.log('Sucursal actualizada con éxito:', result);


            // Borrar el usuario actual de localStorage
            localStorage.removeItem('user');

            // Guardar el nuevo usuario actualizado en localStorage
            // Asegúrate de ajustar los datos según lo que desees almacenar
            localStorage.setItem('user', JSON.stringify({
                RIFSuc: formData.rif_sucursal,
                NombreSuc: formData.nombre_sucursal,
                Ciudad: formData.ciudad_sucursal,
                Encargado: formData.cedula_encargado,
            }));

            // Verificar si se guardó correctamente
            console.log('Nuevo usuario en localStorage:', localStorage.getItem('user'));

        } catch (error) {
            alert('Error al actualizar la sucursal');
            console.error('Error al actualizar la sucursal:', error);
        }

    };

    return (
        <div>
            <Navbar />

            <Grid container spacing={3} style={{ minHeight: '100vh' }}>
                <Grid item xs style={{ flexDirection: 'column', marginTop: '0px' }}>

                    <Typography variant="h4" marginBottom={2} style={{ color: 'black', textAlign: 'center' }}>Sucursal</Typography>


                    <Box component="form" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#41B06E',
                        padding: '5px',
                        borderRadius: '10px',
                        width: '700px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 'auto'
                    }}
                        noValidate
                        autoComplete="off"
                        onSubmit={updateSucursal}

                    >

                        <h3>Ingrese los Siguientes Datos</h3>

                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                <TextField label="RIF-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='rif_sucursal'
                                    value={formData.rif_sucursal}
                                    onChange={handleChange}
                                />
                                <TextField label="NOMBRE-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='nombre_sucursal'
                                    value={formData.nombre_sucursal}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                <TextField label="CIUDAD-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='ciudad_sucursal'
                                    value={formData.ciudad_sucursal}
                                    onChange={handleChange}
                                />
                                <TextField label="CEDULA-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='cedula_encargado'
                                    value={formData.cedula_encargado}
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
                                color: '#FFFFFF'
                            }
                        }}>
                            Guardar
                        </Button>
                    </Box>
                </Grid>
                <Grid item style={{ width: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', height: '100%' }} />
                </Grid>
                <Grid item xs style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', marginTop: '0px' }}>
                    <Typography variant="h4" style={{ color: 'black' }}>Descuentos</Typography>
                </Grid>
            </Grid>

        </div>
    )
}

export default Configuracion;