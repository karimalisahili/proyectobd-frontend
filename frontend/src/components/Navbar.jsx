import { AppBar, Box, Toolbar, Container, Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import NbLateral from './NbLateral';
import Logo from '../assets/Logo.png';
import '../css/Navbar.css';
import { useAuth } from '../router/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';


function Navbar() {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const navigate = useNavigate(); // Step 2
    const { encargado } = useAuth();
 
    const [nbLateralProps, setNbLateralProps] = useState({ title1: '', title2: '', title3: '', title4: '', title5:'', title6:'', padre:'', listType:''});
    const [shownbLateral, setShownbLateral] = useState(false);

    const handleNbLateral = (titles) => {
            setNbLateralProps(titles);
            setShownbLateral(true);
    };

      const handleLogout = () => {
        const confirmLogout = window.confirm("¿Está seguro de que quiere salir?");
        if (confirmLogout) {
            // Aquí puedes agregar lógica adicional para manejar el cierre de sesión, como limpiar el estado global o localStorage
            navigate('/'); // Redirige al usuario al login
        }
    };

    return (
        <Box>
            <Box sx={{ bgcolor: '#41B06E', flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Link to='/Home' style={{ textDecoration: 'none' }}><img src={Logo} alt="Logo" className="logo" /></Link>
                <h1 className='navh1'>BIENVENIDO {user.Encargado.toUpperCase()}</h1>
                <Button variant="outlined" onClick={handleLogout} sx={{ my: 7, mx: 3, p: 1, color:'#FFFFFF', borderColor:'#FFFFFF', '&:hover': { borderColor:'#FFFFFF', backgroundColor: '#8DECB4'}}} endIcon={<LogoutIcon/>}>Cerrar Sesión</Button>
            </Box>
            <AppBar position="static" sx={{
                bgcolor: '#8DECB4',
                boxShadow: 'none',
                borderBottom: '1px solid #FFFFFF',
            }}>
                <Container>
                    <Toolbar>
                        <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={() => { handleNbLateral({ title1: 'Marcas', title2: 'Tipos Vehiculos', title3: 'Modelos', title4: '', padre:'Marcas', listType:'MarcasLista'});  }}sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link   to="/Marcas" style={{ textDecoration: 'none', color: 'black' }}>
                                    <p className='PNav'>Vehiculos </p>
                                </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Personal', title2: 'Cliente', title3: 'Vehiculo', title4: '', padre:'Libreta', listType:'list'});  }}sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link   to="/Libreta" style={{ textDecoration: 'none', color: 'black' }}>
                                    <p className='PNav'> Libreta </p>
                                </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Listas de Servicios', title2: 'Actividades', title3: 'Reservas', title4: 'Autorizados',title5: 'Ordenes de Servicios', title6:'Facturas', padre:'servicios', listType:'listService'}); }} sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link to="/Servicios" style={{ textDecoration: 'none', color: 'black' }}><p className='PNav'> Servicios </p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Ventas de Productos', title2: 'Facturas', title3: '', title4: '', title5: '', title6:'', padre:'tienda', listType:'listaTienda'}); }} sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link to="/Tienda" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'> Tienda </p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Proveedores', title2:'REQUISICIONES DE COMPRAS',title3: 'ORDENES DE COMPRA', title4: 'Facturas', title5: '', title6:'' ,padre:'proveedores', listType:'ProveedoresLista'}); }} sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link to="/Proveedores" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'> Proveedores </p></Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Productos', title2: 'Lineas', title3: 'Inventario', title4: '', title5:'', title6:'', padre:'inventario', listType:'InventarioLista'}); }} sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link to="/Inventario" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'>Inventario</p> </Link>
                            </Button>
                            <Button sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link to="/Configuracion" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'>Configuracion</p> </Link>
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
             {shownbLateral && <NbLateral {...nbLateralProps} />}
        </Box>
    );
}

export default Navbar;