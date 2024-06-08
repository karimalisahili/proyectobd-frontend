import { AppBar, Box, Toolbar, Menu, Container, Button} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';

function Navbar() {

    const [anchorElNav, setAnchorElNav] = useState(null);
  
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    return (      
        <AppBar position="static" sx={{
            bgcolor: '#41B06E',
            color: 'white',
            boxShadow: 'none',
            borderBottom: '1px solid #FFFFFF',}}>
            <Container>
                <Toolbar >
                    <img src={Logo} alt="Logo" className="logo" />
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Menu id="menu-appbar" anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',}}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}>
                        </Menu>
                    </Box>  
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, mx:3, color: 'white', display: 'block' }}>
                        <Link to="/Libreta" style={{ textDecoration: 'none', color: 'white' }}> Libreta </Link>
                    </Button>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, mx: 3, color: 'white', display: 'block' }}>
                        <Link to="/Servicios" style={{ textDecoration: 'none', color: 'white' }}> Servicios </Link>
                    </Button>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, mx: 3, color: 'white', display: 'block' }}>
                        <Link to="/Tienda" style={{ textDecoration: 'none', color: 'white' }}> Tienda </Link>
                    </Button>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, mx: 3, color: 'white', display: 'block' }}>
                        <Link to="/Proveedores" style={{ textDecoration: 'none', color: 'white' }}> Proveedores </Link>
                    </Button>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, mx: 3, color: 'white', display: 'block' }}>
                        <Link to="/Inventario" style={{ textDecoration: 'none', color: 'white' }}> Inventario </Link>
                    </Button>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, mx: 3, color: 'white', display: 'block' }}>
                        <Link to="/Descuentos" style={{ textDecoration: 'none', color: 'white' }}> Descuentos </Link>
                    </Button>
                </Box>
            </Toolbar>
        </Container>
      </AppBar>
    );
}
export default Navbar;