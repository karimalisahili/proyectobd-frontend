import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, MenuItem ,Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';



const style = {
    py: 0,
    width: '80%',
    borderColor: 'divider',
    backgroundColor: 'Transparent',
    color: 'black',
  };

const SERVERNAME = import.meta.env.VITE_SERVERNAME;

function ListServicios({opcion, raiz}){
    
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState('');
    const [tipoDePago, setTipoDePago] = useState('');
    const [detallesPago, setDetallesPago] = useState({
        tipoEfectivo: '',
        referencia: '',
        numeroTelefono: '',
        numeroTarjeta: '',
        tipoTarjeta: '',
        banco: ''
    });

    const handleTipoDePagoChange = (event) => {
        setTipoDePago(event.target.value);
    };
      
    const handleDetallePagoChange = (event) => {
        setDetallesPago({ ...detallesPago, [event.target.name]: event.target.value });
    };

    function ListaDeServicios(){
        return(
            <Box component="form" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#41B06E',
                borderRadius: '10px',
                width: '700px',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
                border: '2px solid #ffffff',
                boxShadow: 24,
                p: 4,
              }}
                noValidate
            autoComplete="off"> 
              <h3>Ingrese los Siguientes Datos</h3>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="DESCRIPCION" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='Descripcion'/>
                    </Box>  
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="CEDULA-COORDINADOR" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='cedula_coordinador'/>
                    </Box>
                </Box>
                <Button type='submit' variant="contained" sx={{
                                  margin: '5px 0',
                                  color: '#000000',
                                  bgcolor: '#FFFFFF',
                                  '&:hover': {
                                      bgcolor: '#41B06E',
                                      color: '#FFFFFF'}}}>
                                  Agregar {opcion}
                </Button>
            </Box>
        )
    }

    function Reservas(){
        return(
            <Box component="form" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#41B06E',
                borderRadius: '10px',
                width: '700px',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
                border: '2px solid #ffffff',
                boxShadow: 24,
                p: 4,
              }}
                noValidate
            autoComplete="off"> 
              <h3>Ingrese los Siguientes Datos</h3>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="FECHA-DE-RESERVA" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='date'
                        name='Fecha_de_reserva'/>
                    </Box>  
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="ABONO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='ABONO'/>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField label="CODIGO_VEHICULO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        type='text'
                        name='CODIGO_VEHICULO'/>
                    </Box>
                </Box>
                <Button type='submit' variant="contained" sx={{
                                  margin: '5px 0',
                                  color: '#000000',
                                  bgcolor: '#FFFFFF',
                                  '&:hover': {
                                      bgcolor: '#41B06E',
                                      color: '#FFFFFF'}}}>
                                  Agregar {opcion}
                </Button>
            </Box>
        )
    }

    function Pagos() {
        return (
          <Box component="form" sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#41B06E',
            borderRadius: '10px',
            width: '700px',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            border: '2px solid #ffffff',
            boxShadow: 24,
            p: 4,
          }}
            noValidate
            autoComplete="off">
            <h3>Ingrese los Siguientes Datos</h3>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextField label="FECHA-DE-PAGO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='date'
                  name='Fecha_de_pago' />
                  <TextField
                    select
                    label="Tipo de Pago"
                    value={tipoDePago}
                    onChange={handleTipoDePagoChange}
                    sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                    >
                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                        <MenuItem value="PagoMovil">Pago Móvil</MenuItem>
                        <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                    </TextField>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextField label="MONTO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='text'
                  name='Monto' />
                  <TextField label="CEDULA-CLIENTE" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                  type='text'
                  name='cedula_cliente' />
              </Box>
                {tipoDePago === 'Efectivo' && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        select
                        label="Tipo Efectivo"
                        name="tipoEfectivo"
                        value={detallesPago.tipoEfectivo}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        >
                            <MenuItem value="Bolivares">Bolívares</MenuItem>
                            <MenuItem value="Divisas">Divisas</MenuItem>
                        </TextField>
                    </Box>
                )}

                {tipoDePago === 'PagoMovil' && (
                    <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        label="Referencia"
                        name="referencia"
                        value={detallesPago.referencia}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                        <TextField
                        label="Número de Teléfono"
                        name="numeroTelefono"
                        value={detallesPago.numeroTelefono}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                    </Box>
                    </>
                )}

                {tipoDePago === 'Tarjeta' && (
                    <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        label="Número de Tarjeta"
                        name="numeroTarjeta"
                        value={detallesPago.numeroTarjeta}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                        <TextField
                        select
                        label="Tipo de Tarjeta"
                        name="tipoTarjeta"
                        value={detallesPago.tipoTarjeta}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        >
                            <MenuItem value="Debito">Débito</MenuItem>
                            <MenuItem value="Credito">Crédito</MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <TextField
                        label="Banco"
                        name="banco"
                        value={detallesPago.banco}
                        onChange={handleDetallePagoChange}
                        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                        />
                    </Box>
                    </>
                )}
            </Box>
            <Button type='submit' variant="contained" sx={{
              margin: '5px 0',
              color: '#000000',
              bgcolor: '#FFFFFF',
              '&:hover': {
                bgcolor: '#41B06E',
                color: '#FFFFFF'
              }
            }}>
              Agregar {opcion}
            </Button>
          </Box>
        )
    }

    const handleOpen = (type) => {
        setFormType(type);
        setOpen(true);
    };

    const renderForm = () => {
        switch (formType) {
          case 'Listas de Servicios':
            return <ListaDeServicios />;
          case 'Reservas':
            return <Reservas />;
           case 'Pagos':
            return <Pagos />;
          default:
            return <div> fallo </div>;
        }
      };
console.log(opcion)
    return (
        <Box>
            <div className="vertical_line"></div>
            <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <List sx={{ ...style, maxHeight: '250px', overflowY: 'auto' }}>
                        <ListItem>
                            <ListItemText />
                        </ListItem>
                    </List>
                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, mt: 3 }} onClick={() => handleOpen(opcion)}>
                        Agregar {opcion}
                    </Button>
                    <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        {renderForm()}
                    </Modal>
                </Box>
            </Box>
            <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '34%', height: 'auto' }}>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <div className="circle"><img src="./src/assets/Servicio Carros.jpg" alt="" style={{width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        overflow: 'hidden'}}/></div>
                    <h2></h2>
                </Box>
                <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <List sx={style}>
                        <ListItem>
                            <ListItemText />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText/>
                        </ListItem>
                    </List>
                    { (opcion === 'Listas de Servicios' || opcion === 'Reservas' || opcion === 'Pagos') && (
                        <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }}>
                            Modificar
                        </Button>
                    )};
                    { opcion === 'Facturas' && (
                        <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }}>
                         Imprimir Factura
                        </Button>
                    )}
                    
                </Box>   
            </Box>
        </Box>
    );
}

ListServicios.propTypes = {
    opcion: PropTypes.string.isRequired,
    raiz: PropTypes.string.isRequired,
};

export default ListServicios;