import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import NbLateral from '../components/NbLateral';
import SearchBar from '../components/SearchBar';
import Lists from '../components/Lists';
import '../css/Libreta.css';


function Libreta() {


    return (
        
        <Box >
            <NbLateral />
            <Navbar />
            <SearchBar />
        </Box>
    )
}

export default Libreta;