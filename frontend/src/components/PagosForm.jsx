import React, { useState } from 'react';
import { TextField, MenuItem } from '@mui/material';

function PaymentForm() {
  const [paymentType, setPaymentType] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    tipoEfectivo: '',
    referencia: '',
    nroTelf: '',
    numTarjeta: '',
    tipoTarjeta: '',
    banco: ''
  });

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleDetailChange = (event) => {
    setPaymentDetails({ ...paymentDetails, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <TextField
        select
        label="Tipo de Pago"
        value={paymentType}
        onChange={handlePaymentTypeChange}
        fullWidth
      >
        <MenuItem value="E">Efectivo</MenuItem>
        <MenuItem value="P">Pago Móvil</MenuItem>
        <MenuItem value="T">Tarjeta</MenuItem>
      </TextField>

      {paymentType === 'E' && (
        <TextField
          select
          label="Tipo Efectivo"
          name="tipoEfectivo"
          value={paymentDetails.tipoEfectivo}
          onChange={handleDetailChange}
          fullWidth
        >
          <MenuItem value="B">Bolívares</MenuItem>
          <MenuItem value="D">Divisas</MenuItem>
        </TextField>
      )}

      {paymentType === 'P' && (
        <>
          <TextField
            label="Referencia"
            name="referencia"
            value={paymentDetails.referencia}
            onChange={handleDetailChange}
            fullWidth
          />
          <TextField
            label="Número de Teléfono"
            name="nroTelf"
            value={paymentDetails.nroTelf}
            onChange={handleDetailChange}
            fullWidth
          />
        </>
      )}

      {paymentType === 'T' && (
        <>
          <TextField
            label="Número de Tarjeta"
            name="numTarjeta"
            value={paymentDetails.numTarjeta}
            onChange={handleDetailChange}
            fullWidth
          />
          <TextField
            select
            label="Tipo de Tarjeta"
            name="tipoTarjeta"
            value={paymentDetails.tipoTarjeta}
            onChange={handleDetailChange}
            fullWidth
          >
            <MenuItem value="Debito">Débito</MenuItem>
            <MenuItem value="Credito">Crédito</MenuItem>
          </TextField>
          <TextField
            label="Banco"
            name="banco"
            value={paymentDetails.banco}
            onChange={handleDetailChange}
            fullWidth
          />
        </>
      )}
    </div>
  );
}

export default PaymentForm;