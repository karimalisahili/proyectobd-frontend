import { AppBar, Box, Toolbar, Container, Button } from '@mui/material';
import { useState, useEffect,  } from 'react';
import { Link } from 'react-router-dom';
import NbLateral from './NbLateral';
import Logo from '../assets/Logo.png';
import '../css/Navbar.css';
import { useAuth } from '../router/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const SERVERNAME = import.meta.env.VITE_SERVERNAME;
const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { encargado } = useAuth();
      const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);

    const [opcionActiva, setOpcionActiva] = useState('');
   // useEffect para cargar datos de empleados, clientes y vehículos al montar el componente
   useEffect(() => {
    // Función asíncrona para obtener datos de un endpoint y actualizar el estado correspondiente
    const obtenerDatos = async (endpoint, setter) => {
      try {
        // Realiza la petición fetch al servidor y espera la respuesta
        const respuesta = await fetch(`${SERVERNAME}/${endpoint}`);
        // Convierte la respuesta a formato JSON
        const datos = await respuesta.json();
        // Actualiza el estado correspondiente con los datos obtenidos
        setter(datos);
      } catch (error) {
        // Captura y registra errores en la consola
        console.error(`Error al obtener datos de ${endpoint}:`, error);
      }
    };
      obtenerDatos(`trabajadores/${user.RIFSuc}`, setEmpleadosSeleccionados);
   }, []);
    
    const empleadoEncargado = empleadosSeleccionados.find(empleado => empleado.Cedula === user.Encargado);
    const [nbLateralProps, setNbLateralProps] = useState({ title1: '', title2: '', title3: '', title4: '', title5:'', title6:'', title7:'', padre:'', listType:''});
    const [shownbLateral, setShownbLateral] = useState(false);

    const [isConfigSelected, setIsConfigSelected] = useState(false);
     const shouldChangeBoxShadow = isConfigSelected || location.pathname === '/Home';
    

     const handleNbLateral = (titles, opcionId) => {
        setNbLateralProps(titles);
        
         setOpcionActiva(opcionId); // Actualiza la opción activa
         if (opcionId != 'configuracion') {
             setShownbLateral(true);
             
         } else {
             setIsConfigSelected(true);
        }
    };

      const handleLogout = () => {
        const confirmLogout = window.confirm("¿Está seguro de que quiere salir?");
        if (confirmLogout) {
            // Aquí puedes agregar lógica adicional para manejar el cierre de sesión, como limpiar el estado global o localStorage
            navigate('/'); // Redirige al usuario al login
            window.location.reload();
        }
    };

    return (
        <Box sx={{width:'100%'}}>
            <Box sx={{ bgcolor: '#41B06E', flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                    <Link to='/Home' style={{ textDecoration: 'none' }}><img src={Logo} alt="Logo" className="logo" /></Link>
                {location.pathname === '/Home' ? (
                    <h1 className='navh1'>BIENVENIDO {empleadoEncargado && empleadoEncargado.Nombre.toUpperCase()}</h1>
                ) : (
                    <h1 className='navh1'> {empleadoEncargado && empleadoEncargado.Nombre.toUpperCase()}</h1>
                )}
                </Box>
                <Button variant="outlined" onClick={handleLogout} sx={{ my: 'auto', mr:1, p: 1, color:'#FFFFFF', borderColor:'#FFFFFF', '&:hover': { borderColor:'#FFFFFF', backgroundColor: '#8DECB4'}}} endIcon={<LogoutIcon/>}>Cerrar Sesión</Button>
            </Box>
            <AppBar position="static" sx={{minWidth:'100%',
                width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'end',
                alignContent: 'end',
                bgcolor: '#8DECB4',
               boxShadow: shouldChangeBoxShadow ? '0px 3px 5px -3px rgba(0,0,0,0.75)' : '201px 3px 5px -3px rgba(0,0,0,0.75)'
            }}>
                <Container sx={{width:'100%', display: 'flex', justifyContent: 'end', alignItems:'end',  right: 0}}>
                    <Toolbar sx={{width:'100%', display: 'flex', justifyContent: 'end', alignItems:'end', alignContent:'end', boxSizing: 'border-box'}}>
                        <Box sx={{ width:'100%',flexGrow: 1, display: 'flex', justifyContent: 'end', alignItems:'end', alignContent:'end', right: 0,boxSizing: 'border-box',
                left:0}}>
                             <Button onClick={() => { handleNbLateral({ title1: 'Personal', title2: 'Cliente', title3: 'Vehiculo', title4: '', padre:'Libreta', listType:'list'}, 'libreta'); }} sx={{ my: 2, ml:4, color: 'white', display: 'block', borderBottom: opcionActiva === 'libreta' ? '6px solid green' : 'none' }}>
                                <Link   to="/Libreta" style={{ textDecoration: 'none', color: 'black' }}>
                                    <p className='PNav'> Libreta </p>
                                </Link>
                            </Button>
                             <Button onClick={() => { handleNbLateral({ title1: 'Marcas', title2: 'Tipos Vehiculos', title3: 'Modelos', title4: '', padre:'Marcas', listType:'MarcasLista'}, 'vehiculos');  }}sx={{ my: 2, ml:2, mr:0, color: 'white', display: 'block', borderBottom: opcionActiva === 'vehiculos' ? '6px solid green' : 'none' }}>
                                <Link   to="/Marcas" style={{ textDecoration: 'none', color: 'black', p:0, margin:0 }}>
                                    <p className='PNav'>Vehiculos </p>
                                </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({  title1: 'Listas de Servicios', title2: 'Actividades', title3: 'Reservas', title4: 'Autorizados',title5: 'Ordenes de Servicios', title6:'Contrataciones', title7:'Facturas', padre:'servicios', listType:'listService'}, 'servicios'); }} sx={{ my: 2, ml:4,color: 'white', display: 'block', borderBottom: opcionActiva === 'servicios' ? '6px solid green' : 'none' }}>
                                <Link to="/Servicios" style={{ textDecoration: 'none', color: 'black' }}><p className='PNav'> Servicios </p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Ventas de Productos', title2: 'Facturas', title3: '', title4: '', title5: '', title6:'', padre:'tienda', listType:'listaTienda'}, 'tienda'); }} sx={{ my: 2, ml:4,color: 'white', display: 'block', borderBottom: opcionActiva === 'tienda' ? '6px solid green' : 'none' }}>
                                <Link to="/Tienda" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'> Tienda </p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({title1: 'Proveedores', title2: 'Orden de Compra', title3: 'Facturas', title4: 'Pagos', title5:'',title6:'' ,padre:'proveedores', listType:'InventarioLista'}, 'proveedores'); }} sx={{ my: 2, ml:4,color: 'white', display: 'block', borderBottom: opcionActiva === 'proveedores' ? '6px solid green' : 'none' }}>
                                <Link to="/Proveedores" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'> Proveedores </p></Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: 'Productos', title2: 'Lineas', title3: 'Inventario', title4: '', title5:'', title6:'', padre:'inventario', listType:'InventarioLista'}, 'inventario'); }} sx={{ my: 2, ml:4,color: 'white', display: 'block', borderBottom: opcionActiva === 'inventario' ? '6px solid green' : 'none' }}>
                           
                                <Link to="/Inventario" style={{ textDecoration: 'none', color: 'black' }}> <p className='PNav'>Inventario</p> </Link>
                            </Button>
                            <Button onClick={() => { handleNbLateral({ title1: '', title2: '', title3: '', title4: '', padre:'', listType:''}, 'configuracion'); }} sx={{ my: 2, ml:4, color: 'white', display: 'block', borderBottom: opcionActiva === 'configuracion' ? '6px solid green' : 'none' }}>
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