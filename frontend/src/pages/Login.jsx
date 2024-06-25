import { Button, Container, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Fondo from '../assets/Fondoinicio.png';
import '../css/Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {

    const navigate = useNavigate(); // Step 2

    const [formData, setFormData] = useState({
        rif_sucursal: '',
        cedula_encargado: ''
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    };
    
    const handleSubmit = (e) => {
    e.preventDefault();
    // Acceder a los datos almacenados en localStorage
        const datosAlmacenados = JSON.parse(localStorage.getItem('formDatabase'));

    if (datosAlmacenados) {
        const match = datosAlmacenados.find(item => item.rif_sucursal === formData.rif_sucursal && item.cedula_encargado === formData.cedula_encargado);
        if (match) {
            console.log("Los datos ingresados coinciden con los datos almacenados.");

            const nombreEncargado = match.nombre_encargado;
            console.log("Nombre del Encargado:", nombreEncargado);
            navigate('/Home');
        } else {
            alert("Los datos ingresados no coinciden con nuestros registros.");
        }
    }
        
    };
    return (
        <div>
            <img src={Fondo} alt="Fondo" className='fondo' />

            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative'}}>
                
                <img src={Logo} alt="Logo" className='logo' />
                
                <p>M&M al servicio del planeta</p>
                <Box component="form" sx={{
                    display: 'flex',
                    flexDirection: 'column', 
                    bgcolor: '#41B06E',
                    padding: '20px',
                    borderRadius: '10px',
                    width: '400px',
                    alignItems: 'center',
                    justifyContent:'center',
                    margin: 'auto'}}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
        
                    <h1>WELCOME</h1>

                    <TextField label="RIF-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '100%', margin: '10px 0', borderRadius: '10px' }}
                        name="rif_sucursal"
                        value={formData.rif_sucursal}
                        onChange={handleChange}
                    />
        
                    <TextField label="CEDULA-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '100%', margin: '10px 0', borderRadius: '10px' }}
                        name="cedula_encargado"
                        value={formData.cedula_encargado}
                        onChange={handleChange}
                    />
                        <Button variant="contained" sx={{
                            margin: '10px 0',
                            color: '#000000',
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#41B06E',
                                color: '#FFFFFF'
                            }
                        }}
                            type="submit"
                        >
                            Ingresar
                        </Button>

                    <Link to="/Register" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{
                            margin: '10px 0',
                            color: '#000000',
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#41B06E',
                                color: '#FFFFFF'}}}>
                            Registrarse
                        </Button>
                    </Link>
                </Box>
            </Container>
        </div>    
    )
}