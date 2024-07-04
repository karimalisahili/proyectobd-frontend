import { Button, Container, Box, TextField } from '@mui/material';
import Fondo from '../assets/Fondoinicio.png';
import Logo from '../assets/Logo.png';
import '../css/Register.css';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

const SERVERNAME = import.meta.env.VITE_SERVERNAME;

export default function Register() {

     const navigate = useNavigate(); 

const [formData, setFormData] = useState({
        rif_sucursal: '',
        nombre_sucursal: '',
        ciudad_sucursal: '',
        nombre_encargado: '',
        cedula_encargado: '',
        telefono_encargado: '',
        direccion_encargado: '',
        sueldo_encargado: 0,
    });

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
            nombre_sucursal: NombreSuc,
            ciudad_sucursal: Ciudad,
            nombre_encargado: Nombre,
            cedula_encargado: Cedula,
            telefono_encargado: Telefono,
            direccion_encargado: Direccion,
            sueldo_encargado: Salario
          } = formData;
        
        
        try {
            const response = await fetch(`${SERVERNAME}/sucursal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RIFSuc,
                    NombreSuc,
                    Ciudad
                }),
            });

            const data = await response.json(); // Parsea la respuesta como JSON
            if (!response.ok) {
                throw new Error(data.message || 'Error en la solicitud de registro');
            }

                    // Si llegamos aquí, la primera solicitud fue exitosa
        console.log("Respuesta de sucursal:", data); // Paso 1

            const responseEncargado = await fetch(`${SERVERNAME}/trabajadores`, {
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

            const dataEncargado = await responseEncargado.json(); // Parsea la respuesta como JSON
            if (!responseEncargado.ok) {
                throw new Error(dataEncargado.message || 'Error en la solicitud de registro');
            }

            const responsePutSucursal = await fetch(`${SERVERNAME}/sucursal`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RIFSuc,
                    NombreSuc,
                    Ciudad,
                    Encargado: Cedula
                }),
            });
            navigate('/');
            
        } catch (error) {
            console.error('Error al registrar la sucursal', error);
            alert('Error al registrar la sucursal. Por favor, intente nuevamente.');
        }
    }
    
    return (
        <div>
            <img src={Fondo} alt="Fondo" className='fondo' />

            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative'
            }}>
                
                <img src={Logo} alt="Logo" className='logo' />
                
                <p>M&M al servicio del planeta</p>
                <Box component="form" sx={{
                    display: 'flex',
                    flexDirection: 'column', 
                    bgcolor: '#41B06E',
                    padding: '5px',
                    borderRadius: '10px',
                    width: '700px',
                    alignItems: 'center',
                    justifyContent:'center',
                    margin: 'auto'}}
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
                            <TextField label="NOMBRE-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='nombre_encargado'
                                value={formData.nombre_encargado}  
                                onChange={handleChange}
                            />
                        </Box>

                         <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="CEDULA-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='cedula_encargado'
                                value={formData.cedula_encargado}
                                onChange={handleChange}
                            />
                            <TextField label="TELEFONO-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='telefono_encargado'
                                value={formData.telefono_encargado}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="DIRECCION-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='text'
                                name='direccion_encargado'
                                value={formData.direccion_encargado}
                                onChange={handleChange}
                            />
                            <TextField label="SUELDO-ENCARGADO" type="number"
                                InputProps={{
                                    inputProps: {
                                        min: 1}
                                }} sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                name='sueldo_encargado'
                                value={formData.sueldo_encargado}
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
                            Registrar
                        </Button>
                </Box>
            </Container>
        </div>    
    )
}