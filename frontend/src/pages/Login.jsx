import { Button, Container, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Fondo from '../assets/Fondoinicio.png';
import '../css/Login.css';

export default function Login() {
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
                    autoComplete="off">
        
                    <h1>WELCOME</h1>

                    <TextField  label="RIF-SUCURSAL" sx={{
                        bgcolor: '#FFFFFF',
                        width: '100%',
                        margin: '10px 0',
                        borderRadius: '10px'}}/>
        
                    <TextField  label="Contraseña" sx={{
                        bgcolor: '#FFFFFF',
                        width: '100%',
                        margin: '10px 0',
                        borderRadius: '10px'}} />
        
                    <Link to="/Home" style={{textDecoration: 'none'}}>
                        <Button variant="contained" sx={{
                            margin: '10px 0',
                            color: '#000000',
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#41B06E',
                                color: '#FFFFFF'}}}>
                            Ingresar
                        </Button>
                    </Link>

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