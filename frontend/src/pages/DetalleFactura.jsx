import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import NbLateral from '../components/NbLateral';
import '../css/Libreta.css';

const SERVERNAME = import.meta.env.VITE_SERVERNAME;

function DetalleFactura() {
    const [productos, setProductos] = useState([]);
    const { NumFact } = useParams(); // Obtiene el número de factura de los parámetros de la URL

    console.log(productos);

    useEffect(() => {
        // Aquí deberías reemplazar la URL por la dirección de tu API que devuelve los productos de la factura
        fetch(`${SERVERNAME}/detallefactura/${NumFact}`)
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error al obtener los productos:', error));
    }, [NumFact]);

    return (
        <Box>
            <Navbar />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Código del Producto</TableCell>
                            <TableCell align="right">Nombre</TableCell>
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell align="right">Precio</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((row) => (
                            <TableRow
                                key={row.CodProd}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.CodProd}
                                </TableCell>
                                <TableCell align="right">{row.NombreP}</TableCell>
                                <TableCell align="right">{row.CantProd}</TableCell>
                                <TableCell align="right">{row.Precio}</TableCell>
                                <TableCell align="right">{row.Total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default DetalleFactura;