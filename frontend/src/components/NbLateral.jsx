import { AppBar, Box, Toolbar, Container, Button} from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../css/NbLateral.css';

function NbLateral({ title1, title2, title3, title4}) {

    return (
        <div className="navbarlat">
            <Button className="btnlat" sx={{ color: 'white', display: 'block' }}>{title1}</Button>
            <Button className="btnlat" sx={{ color: 'white', display: 'block' }}>{title2}</Button>
            <Button className="btnlat" sx={{ color: 'white', display: 'block' }}>{title3}</Button>
            <Button className="btnlat" sx={{ color: 'white', display: 'block' }}>{title4}</Button>
        </div>
    );
}

NbLateral.propTypes = {
    title1: PropTypes.string,
    title2: PropTypes.string,
    title3: PropTypes.string,
    title4: PropTypes.string,
};

export default NbLateral;