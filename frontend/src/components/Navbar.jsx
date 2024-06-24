import { AppBar, Box, Toolbar, Container, Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import NbLateral from './NbLateral';
import Logo from '../assets/Logo.png';
import '../css/Navbar.css';

function Navbar() {
    const [nbLateralProps, setNbLateralProps] = useState({ title1: '', title2: '', title3: '', title4: '' });

    const handleNbLateral = (titles) => {
        setNbLateralProps(titles);
    };

    return (
        <Box>
            <Box sx={{ bgcolor: '#41B06E', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Link to='/Home' style={{ textDecoration: 'none' }}><img src={Logo} alt="Logo" className="logo" /></Link>
                <h1 className='navh1'>WELCOME</h1>
            </Box>
            <AppBar position="static" sx={{
                bgcolor: '#8DECB4',
                boxShadow: 'none',
                borderBottom: '1px solid #FFFFFF',
            }}>
                <Container>
                    <Toolbar>
                        <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
                            <Button onClick={() => { handleNbLateral({ title1: 'Personal', title2: 'Cliente', title3: 'Vehiculo', title4: ''});  }}sx={{ my: 2, mx: 4, color: 'white', display: 'block' }}>
                                <Link   to="/Libreta" style={{ textDecoration: 'none', color: 'black' }}>
                                    <p className='PNav'> Libreta </p>
                                </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Listas de Servicios', title2: 'Reservas', title3: 'Pagos', title4: 'Facturas' }); }} sx={{ my: 2, mx: 5, color: 'white', display: 'block' }}>
                                <Link to="/Servicios" style={{ textDecoration: 'none', color: 'black' }}><p className='PNav'> Servicios </p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Compras', title2: 'Pagos', title3: 'Facturas', title4: '' }); }} sx={{ my: 2, mx: 5, color: 'white', display: 'block' }}>
                                <Link to="/Tienda" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'> Tienda </p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Proveedores', title2: 'Orden de Compra', title3: 'Facturas', title4: 'Pagos' }); }} sx={{ my: 2, mx: 5, color: 'white', display: 'block' }}>
                                <Link to="/Proveedores" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'> Proveedores </p></Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Productos', title2: 'Ajustes', title3: 'Vehiculo', title4: '' }); }} sx={{ my: 2, mx: 5, color: 'white', display: 'block' }}>
                                <Link to="/Inventario" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'>Inventario</p> </Link>
                            </Button>
                            <Button sx={{ my: 2, mx: 5, color: 'white', display: 'block' }}>
                                <Link to="/Descuentos" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'>Descuentos</p> </Link>
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <NbLateral {...nbLateralProps} />
        </Box>
    );
}

export default Navbar;