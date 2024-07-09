import { Button, Container, Box, TextField, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Fondo from '../assets/Fondoinicio.png';
import '../css/Login.css';
import React,{ useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../router/AuthContext';

const SERVERNAME = import.meta.env.VITE_SERVERNAME;

export default function Login() {
    
    const { login } = useAuth();

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

      const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Puedes usar 'error', 'warning', 'info', 'success'
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenSnackbar(false);
    };
    

 const handleLogin = async (event) => {
    event.preventDefault();
    const { rif_sucursal, cedula_encargado } = formData;
    try {
        const user = await login(rif_sucursal, cedula_encargado, `${SERVERNAME}/sucursal`);
        if (user) {
            setOpenSnackbar(true);
            setSnackbarMessage('Inicio de sesión exitoso');
            setSnackbarSeverity('success');
            setTimeout(() => {
                navigate('/Home');
        }, 1000);
        } else {
            setSnackbarMessage('Inicio de sesión fallido');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
         setSnackbarMessage('Error en la operación. Por favor, intente nuevamente.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    }
};
        
    return (
        <div>
            <img src={Fondo} alt="Fondo" className='fondo' />
                  <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  sx={{ bgcolor: '#41B06E',}}
  action={
    <React.Fragment>
      <Button color="secondary" size="medium" onClick={handleCloseSnackbar}>
        CERRAR
      </Button>
    </React.Fragment>
  }
/>

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
        
                    <h1>Ingrese sus Credenciales</h1>

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