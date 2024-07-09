import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import NbLateral from '../components/NbLateral';
import '../css/Libreta.css';


function Libreta() {


    return (
        
        <Box >
            <NbLateral />
            <Navbar />
        </Box>
    )
}

export default Libreta;