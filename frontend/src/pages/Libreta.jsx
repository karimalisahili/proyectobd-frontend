import Navbar from '../components/Navbar';
import NbLateral from '../components/NbLateral';
import SearchBar from '../components/SearchBar';
import { Box, Button, List, ListItem, ListItemText, Divider} from '@mui/material';
import '../css/Libreta.css';

const style = {
  py: 0,
  width: '80%',
  borderColor: 'divider',
  backgroundColor: 'Transparent',
  color: 'black',
};

function Libreta() {
    return (
        
        <Box >
            <div className="vertical_line"></div>
            <NbLateral />
            <Navbar />
            <SearchBar />
            <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <List sx={style}>
                        <ListItem onClick={()=>{console.log('sexo')}}>
                            <ListItemText primary="Nombre" secondary="Tipo Empleado" />
                                Cedula
                        </ListItem>
                        <Divider component="li" />
                    </List>
                    </Box>
            </Box>
            <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '34%', height: 'auto' }}>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <div className="circle"></div>
                    <p>nombre</p>
                    <p>Cargo</p>
                </Box>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <List sx={style}>
                        <ListItem>
                            <ListItemText primary="Cedula"/>
                            30293326
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="Telefono" />
                                04244557224
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="Sueldo" />
                                300$
                            </ListItem>
                    </List>
                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => { }}>
                        Modificar
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Libreta;