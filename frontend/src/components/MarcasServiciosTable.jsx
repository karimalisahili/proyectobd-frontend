import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import '../css/estadisticas.css';
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

const columns = [
  {
    width: 200,
    label: 'Orden de Servicio',
    dataKey: 'TipoServicio',
  },
  {
    width: 200,
    label: 'Marca',
    dataKey: 'Marca',
  },
  {
    width: 100,
    label: 'Cantidad',
    dataKey: 'Cantidad',
    numeric: true,
  },
];

const MarcasServiciosTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${SERVERNAME}/estadisticas_marcas_servicio`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.dataKey}
                align={column.numeric ? 'right' : 'left'}
                style={{ width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.dataKey} align={column.numeric ? 'right' : 'left'}>
                  {row[column.dataKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MarcasServiciosTable;
