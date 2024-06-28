import { Button, Container, Box, TextField } from '@mui/material';
import Fondo from '../assets/Fondoinicio.png';
import Logo from '../assets/Logo.png';
import '../css/Register.css';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Configuracion() {


    const [formData, setFormData] = useState({
        rif_sucursal: '',
        nombre_sucursal: '',
        ciudad_sucursal: '',
        nombre_encargado: '',
        cedula_encargado: '',
        telefono_encargado: '',
        direccion_encargado: '',
        sueldo_encargado: 0,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    
    return (
        <div>
            <Navbar />
            <h1>Configuracion</h1>
        </div>
    )
}

export default Configuracion;