import { Button, Container, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Fondo from '../assets/Fondoinicio.png';
import '../css/Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../router/AuthContext';

const SERVERNAME = import.meta.env.VITE_SERVERNAME;

export default function Login() {
    

    const { setEncargado } = useAuth();

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

    const handleLogin = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Desestructurar formData para obtener rif_sucursal y cedula_encargado
    const { rif_sucursal, cedula_encargado } = formData;

    try {
        const response = await fetch(`${SERVERNAME}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rif_sucursal,
                cedula_encargado,
            }),
        });

        const data = await response.json(); // Parsea la respuesta como JSON
        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud de inicio de sesión');
        }

        // Aquí puedes redirigir al usuario o hacer algo con los datos de la sesión
        // Por ejemplo, guardar el usuario en el almacenamiento local
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/Home');
        window.location.reload();
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert(error.message || 'Error al iniciar sesión');
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
                    onSubmit={handleLogin}
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