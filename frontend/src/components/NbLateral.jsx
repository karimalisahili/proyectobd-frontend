import { Button, Box } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lists from './Lists';
import ListService from '../components/ListServicios';
import InventarioLista from './InventarioLista';
import ListaTienda from './ListaTienda';
import '../css/NbLateral.css';
import { useAuth } from '../router/AuthContext';

function NbLateral({ title1, title2, title3, title4, padre, listType }) {
    const [showLists, setShowLists] = useState(false);
    const { authData } = useAuth(); // Accede a los datos de autenticación
    const [selectedOption, setSelectedOption] = useState('');

    const buttons = [
        { title: title1, raiz: padre },
        { title: title2, raiz: padre },
        { title: title3, raiz: padre },
        { title: title4, raiz: padre },
    ];

    const [listsProps, setlistsProps] = useState({ opcion: '', raiz: '' });

    const handlelists = (option) => {
        setlistsProps(option);
        setShowLists(true);
        setSelectedOption(option.opcion); // Actualiza el estado con la opción seleccionada
    };

    return (
        <Box>
            <div className="navbarlat">
             {buttons.map((button, index) => (
                 button.title && (
<Button
    key={index}
    onClick={() => handlelists({ opcion: button.title, raiz: button.raiz })}
    className="btnlat"
    sx={{
        color: 'black',
        marginBottom: '20px',
        padding: '0',
        fontWeight: 'bolder',
        fontSize: '15px',
        display: 'block',
        zIndex: '1000',
        backgroundColor: selectedOption === button.title ? 'transparent' : 'transparent', // Fondo transparente siempre
        borderBottom: selectedOption === button.title ? '7px solid green' : 'none', // Línea verde oscuro si está seleccionado
        '&:hover': {
            backgroundColor: 'transparent', // Fondo transparente en hover
            opacity: 0.8, // Opcional: efecto de opacidad al pasar el mouse
        },
    }}
>
    {button.title}
                         </Button>
)))}
            </div>
            {showLists && (listType === 'list' ? <Lists {...listsProps} authData={authData} /> :
                listType === 'listService' ? <ListService {...listsProps} authData={authData} /> :
                listType === 'InventarioLista' ? <InventarioLista {...listsProps} authData={authData} /> :
                listType === 'listaTienda' ? <ListaTienda {...listsProps} authData={authData} /> :
                null
            )}
        </Box>
    );
}

NbLateral.propTypes = {
    title1: PropTypes.string,
    title2: PropTypes.string,
    title3: PropTypes.string,
    title4: PropTypes.string,
    padre: PropTypes.string,
    listType: PropTypes.string,
};

export default NbLateral;