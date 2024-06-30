import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';

export default function Tabla({ rows, onSelect }) {
  // Estado para rastrear la fila seleccionada
  const [selected, setSelected] = useState(null);

  // Función para manejar la selección de una fila
  const handleSelect = (nroDesc) => {
    setSelected(selected === nroDesc ? null : nroDesc);

    if (onSelect) {
      onSelect(nroDesc); // Llamar a la función de callback con nroDesc
    }
  };

  // Función para determinar si la fila está seleccionada
  const isSelected = (nroDesc) => selected === nroDesc;

  return (
    <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            <TableCell>Nro</TableCell>
            <TableCell align="right">Limite Inferior</TableCell>
            <TableCell align="right">Limite Superior</TableCell>
            <TableCell align="right">Porcentaje Descuento (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isItemSelected = isSelected(row.nroDesc);
            return (
              <TableRow
                key={row.nroDesc}
                hover
                onClick={() => handleSelect(row.nroDesc)}
                role="checkbox"
                aria-checked={isItemSelected}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={isItemSelected} />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.nroDesc}
                </TableCell>
                <TableCell align="right">{row.limiteInfe}</TableCell>
                <TableCell align="right">{row.limiteSup}</TableCell>
                <TableCell align="right">{(row.porcentajeDesc * 100).toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}