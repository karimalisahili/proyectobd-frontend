import { Button, Container, Box, TextField} from '@mui/material';
import Logo from '../assets/Logo.png';
import '../css/Login.css';

export default function Login() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', 
      }}>
      <img src={Logo} alt="Logo" className='logo' />
      <p>M&M al servicio del planeta</p>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column', 
          bgcolor: '#41B06E',
          padding: '20px',
          borderRadius: '10px',
          width: '400px',
          alignItems: 'center',
          justifyContent:'center',
          margin: 'auto',
          }}
        noValidate
        autoComplete="off">
        
        <h1>WELCOME</h1>

        <TextField  label="RIF-SUCURSAL"
          sx={{
            bgcolor: '#FFFFFF',
            width: '100%',
            margin: '10px 0',
            borderRadius: '10px',
          }}/>
        
        <TextField  label="CEDULA DEL ENCARGADO"
          sx={{
            bgcolor: '#FFFFFF',
            width: '100%',
            margin: '10px 0',
            borderRadius: '10px',
          }} />
        
        <Button variant="contained" sx={{
          margin: '10px 0',
          color: '#000000',
          width:'25%',
          bgcolor: '#FFFFFF',
          '&:hover': {
            bgcolor: '#41B06E',
            color: '#FFFFFF',
          }
        }
        }>
          Ingresar
        </Button>
      </Box>
    </Container>
  )
}