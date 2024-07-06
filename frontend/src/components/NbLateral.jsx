import { Button, Box} from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lists from './Lists';
import ListService from '../components/ListServicios';
import '../css/NbLateral.css';
import { useAuth } from '../router/AuthContext';
import InventarioLista from './InventarioLista';
import ProveedoresLista from './ProveedoresLista';
import ListaTienda from './ListaTienda';
import MarcasLista from './MarcasListas';

function NbLateral({ title1, title2, title3, title4, title5,title6, padre, listType}) {

    const [showLists, setShowLists] = useState(false);
    const { authData } = useAuth(); // Accede a los datos de autenticación

    const buttons = [
        { title: title1, raiz: padre },
        { title: title2, raiz: padre },
        { title: title3, raiz: padre },
        { title: title4, raiz: padre },
        { title: title5, raiz: padre},
        { title: title6, raiz: padre}
    ];

    const [listsProps, setlistsProps] = useState({ opcion: '', raiz: '' });

    const handlelists = (option) => {
        setlistsProps(option);
        setShowLists(true);
    };

    return (
        <Box >
            <div className="navbarlat">

                {buttons.map((button, index) => (
                    <Button
                        key={index}
                        onClick={() => handlelists({ opcion: button.title, raiz: button.raiz })}
                        className="btnlat"
                        sx={{ color: 'white', display: 'block', zIndex:'1000'}}
                    >
                        {button.title}
                    </Button>
                ))}
            </div>
            {showLists && (listType === 'list' ? <Lists {...listsProps} authData={authData} /> :
                listType === 'listService' ? <ListService {...listsProps} authData={authData} /> :
                listType === 'InventarioLista' ? <InventarioLista {...listsProps} authData={authData} /> :
                listType === 'listaTienda' ? <ListaTienda {...listsProps} authData={authData} /> :
                listType === 'ProveedoreLista' ? <ProveedoresLista {...listsProps} authData={authData} /> :
                listType === 'MarcasLista' ? <MarcasLista {...listsProps} authData={authData} /> :
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
    title5: PropTypes.string,
    title6:PropTypes.string,
    padre: PropTypes.string,
    listType: PropTypes.string,
};

export default NbLateral;