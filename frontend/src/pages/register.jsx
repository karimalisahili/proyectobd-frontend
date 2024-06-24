import { Button, Container, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Fondo from '../assets/Fondoinicio.png';
import Logo from '../assets/Logo.png';
import '../css/Register.css';

export default function Register() {
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
                    autoComplete="off">
        
                    <h3>Ingrese los Siguientes Datos</h3>

                     <Box sx={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="RIF-SUCURSAL"  sx={{bgcolor: '#FFFFFF', width: '30%',margin: '10px',borderRadius: '10px'}} />
                            <TextField  label="NOMBRE-SUCURSAL"  sx={{bgcolor: '#FFFFFF', width: '30%',margin: '10px',borderRadius: '10px'}} />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="CIUDAD-SUCURSAL" sx={{bgcolor: '#FFFFFF', width: '30%',margin: '10px',borderRadius: '10px'}} />
                            <TextField label="NOMBRE-ENCARGADO" sx={{bgcolor: '#FFFFFF', width: '30%', margin: '10px',borderRadius: '10px'}} />
                        </Box>

                         <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="CEDULA-ENCARGADO" sx={{bgcolor: '#FFFFFF', width: '30%',margin: '10px',borderRadius: '10px'}} />
                            <TextField label="TELEFONO-ENCARGADO" sx={{bgcolor: '#FFFFFF', width: '30%', margin: '10px',borderRadius: '10px'}} />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="DIRECCION-ENCARGADO" sx={{bgcolor: '#FFFFFF', width: '30%',margin: '10px',borderRadius: '10px'}} />
                            <TextField label="SUELDO-ENCARGADO" type="number"
                                InputProps={{
                                    inputProps: {
                                        min: 1}
                                } } sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}/>
                        </Box>
                    </Box>
                    <Link to="/" style={{textDecoration: 'none'}}>
                        <Button variant="contained" sx={{
                            margin: '5px 0',
                            color: '#000000',
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#41B06E',
                                color: '#FFFFFF'}}}>
                            Registrar
                        </Button>
                    </Link>
                </Box>
            </Container>
        </div>    
    )
}