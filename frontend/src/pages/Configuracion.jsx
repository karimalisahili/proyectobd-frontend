import { Button, Typography, Grid, Divider, Modal, TextField, Box } from '@mui/material';
import '../css/Register.css';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Tabla from '../components/TablaDescuento';

const SERVERNAME = import.meta.env.VITE_SERVERNAME;


function createData(nroDesc, limiteInfe, limiteSup, porcentajeDesc) {
    return { nroDesc, limiteInfe, limiteSup, porcentajeDesc };
}

function Configuracion() {

    // Recuperar la cadena JSON almacenada en localStorage con la clave 'RIFSuc:user'
    const userJson = localStorage.getItem('user');

    // Parsear la cadena JSON para convertirla en un objeto JavaScript
    const user = JSON.parse(userJson);


    // Dentro de tu componente, después de la declaración de estados existentes
    const [selectedDescuento, setSelectedDescuento] = useState(0);

    const [formData, setFormData] = useState({
        rif_sucursal: user.RIFSuc || '',
        nombre_sucursal: user.NombreSuc || '',
        ciudad_sucursal: user.Ciudad || '',
        cedula_encargado: user.Encargado || '',
    });

    // Inicializar rows como un estado
    const [rows, setRows] = useState([]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [discountFormData, setDiscountFormData] = useState({
        limiteInferior: 0, // Inicializado como entero
        limiteSuperior: 0, // Inicializado como entero
        porcentajeDescuento: 0.0 // Inicializado como real
    });

    const handleDiscountChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Convertir a entero o real según el campo
        if (name === 'limiteInferior' || name === 'limiteSuperior') {
            formattedValue = parseInt(value, 10);
        } else if (name === 'porcentajeDescuento') {
            formattedValue = parseFloat(value);
        }

        setDiscountFormData(prevState => ({
            ...prevState,
            [name]: formattedValue
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };




    const updateSucursal = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const url = `${SERVERNAME}/sucursal`; // Asegúrate de que SERVERNAME esté definido correctamente
        // Desestructurar formData para obtener los datos del formulario
        const {
            rif_sucursal: RIFSuc,
            nombre_sucursal: NombreSuc,
            ciudad_sucursal: Ciudad,
            cedula_encargado: Cedula,
        } = formData;

        try {
            const response = await fetch(url, {
                method: 'PUT', // Método HTTP
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RIFSuc,
                    NombreSuc,
                    Ciudad,
                    Encargado: Cedula
                }), // Convertir los datos del formulario a una cadena JSON
            });

            console.log(response);
            if (!response.ok) {
                throw new Error('Error al actualizar la sucursal');
            }
            const result = await response.json(); // Esperar la respuesta del servidor
            console.log('Sucursal actualizada con éxito:', result);


            // Borrar el usuario actual de localStorage
            localStorage.removeItem('user');

            // Guardar el nuevo usuario actualizado en localStorage
            // Asegúrate de ajustar los datos según lo que desees almacenar
            localStorage.setItem('user', JSON.stringify({
                RIFSuc: formData.rif_sucursal,
                NombreSuc: formData.nombre_sucursal,
                Ciudad: formData.ciudad_sucursal,
                Encargado: formData.cedula_encargado,
            }));

            // Verificar si se guardó correctamente
            console.log('Nuevo usuario en localStorage:', localStorage.getItem('user'));

        } catch (error) {
            alert('Error al actualizar la sucursal');
            console.error('Error al actualizar la sucursal:', error);
        }

    };

    const createDiscount = async (e) => {
        e.preventDefault();

        const url = `${SERVERNAME}/descuentos`;

        const {
            limiteInferior,
            limiteSuperior,
            porcentajeDescuento
        } = discountFormData;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RIFSuc: user.RIFSuc,
                    LimiteInfe: limiteInferior,
                    LimiteSup: limiteSuperior,
                    PorcentajeDesc: porcentajeDescuento,
                }),
            });

            console.log(response);
            // Asegúrate de esperar a que la respuesta esté completamente procesada
            if (response.status === 201) {

                handleClose(); // Cierra el modal o formulario de creación
                //reiniciar pagina
                window.location.reload();
            } else if (response.status === 500) {
                // Manejo específico de errores para el código de estado 500
                alert('Error interno del servidor al crear el descuento');
            }
        } catch (error) {
            alert('Error al crear el descuento');
            console.error('Error al crear el descuento:', error);
        }
    }

    useEffect(() => {
        const url = `${SERVERNAME}/descuentos/${user.RIFSuc}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Utilizar la función createData para mapear los datos recibidos
                const newRows = data.map(item => createData(
                    item.NroDesc, // id
                    item.LimiteInfe, // limiteInferior
                    item.LimiteSup, // limiteSuperior
                    item.PorcentajeDesc // porcentajeDescuento
                ));
                // Establecer el resultado en rows
                setRows(newRows);

            })
            .catch(error => console.error('Error al obtener los descuentos:', error));
    }, []);

    useEffect(() => {
        console.log("Descuento seleccionado:", selectedDescuento);
        // Aquí puedes realizar acciones que dependan del valor actualizado de selectedDescuento
    }, [selectedDescuento]); // Este efecto se ejecutará cada vez que selectedDescuento cambie

    const handleDescuentoSelect = (nroDesc) => {
        console.log("Número de descuento seleccionado:", nroDesc);
        setSelectedDescuento(nroDesc);
    };


    const deleteDiscount = async (e) => {
        e.preventDefault();
        // Mostrar el cuadro de diálogo de confirmación
        const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar este descuento?');

        // Si el usuario hace clic en "Cancelar", detener la ejecución de la función
        if (!isConfirmed) {
            return;
        }

        // Si el usuario hace clic en "Aceptar", continuar con la eliminación
        try {
            const response = await fetch(`${SERVERNAME}/descuentos`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RIFSuc: user.RIFSuc,
                    NroDesc: selectedDescuento
                }),
            });

            if (response.status === 200) {
                // Eliminar el descuento del estado local
                console.log(rows)
                setRows(currentRows => currentRows.filter(row => row.nroDesc !== selectedDescuento));
            } else {
                // Manejar otros códigos de estado según sea necesario
                alert('Error al eliminar el descuento');
            }
        } catch (error) {
            console.error('Error al eliminar el descuento:', error);
            alert('Error al eliminar el descuento');
        }
    };

    return (
        <div>
            <Navbar />

            <Grid container spacing={3} style={{ minHeight: '100vh' }}>
                <Grid item xs style={{ flexDirection: 'column', marginTop: '0px' }}>

                    <Typography variant="h4" marginBottom={2} style={{ color: 'black', textAlign: 'center' }}>Sucursal</Typography>


                    <Box component="form" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#41B06E',
                        padding: '5px',
                        borderRadius: '10px',
                        width: '700px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 'auto'
                    }}
                        noValidate
                        autoComplete="off"
                        onSubmit={updateSucursal}

                    >

                        <h3>Ingrese los Siguientes Datos</h3>

                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                <TextField label="RIF-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='rif_sucursal'
                                    value={formData.rif_sucursal}
                                    onChange={handleChange}
                                />
                                <TextField label="NOMBRE-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='nombre_sucursal'
                                    value={formData.nombre_sucursal}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                <TextField label="CIUDAD-SUCURSAL" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='ciudad_sucursal'
                                    value={formData.ciudad_sucursal}
                                    onChange={handleChange}
                                />
                                <TextField label="CEDULA-ENCARGADO" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                    type='text'
                                    name='cedula_encargado'
                                    value={formData.cedula_encargado}
                                    onChange={handleChange}
                                />
                            </Box>

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
                            Guardar
                        </Button>
                    </Box>
                </Grid>
                <Grid item style={{ width: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', height: '100%' }} />
                </Grid>
                <Grid item xs style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', marginTop: '0px', marginRight: '20px' }}>
                    <Typography variant="h4" style={{ color: 'black', textAlign: 'center' }}>Descuentos</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 3, mb: 3 }}>
                        <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' } }} onClick={handleOpen}>
                            Agregar
                        </Button>
                        <Button onClick={deleteDiscount} variant="contained" sx={{ backgroundColor: '#FF0000', '&:hover': { backgroundColor: '#CC0000' }, ml: 1 }}>
                            Eliminar
                        </Button>
                        <Button variant="contained" sx={{ ml: 1 }}>
                            Modificar
                        </Button>
                    </Box>
                    <Tabla rows={rows} onSelect={handleDescuentoSelect} />
                </Grid>
            </Grid>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
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
                    autoComplete="off"
                >

                    <h3>Ingrese los Siguientes Datos</h3>

                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="Limite Inferior" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='number'
                                name='limiteInferior'
                                onChange={handleDiscountChange}
                                value={discountFormData.limiteInferior}
                            />

                            <TextField label="Limite Superior" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='number'
                                name='limiteSuperior'
                                onChange={handleDiscountChange}
                                value={discountFormData.limiteSuperior}
                            />

                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TextField label="Porcentaje de Descuento" sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }}
                                type='number'
                                name='porcentajeDescuento'
                                onChange={handleDiscountChange}
                                inputProps={{ step: "0.01" }}
                                value={discountFormData.porcentajeDescuento}
                            />

                        </Box>


                    </Box>
                    <Button type='submit' variant="contained"
                        onClick={createDiscount}
                        sx={{
                            margin: '5px 0',
                            color: '#000000',
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#41B06E',
                                color: '#FFFFFF'
                            }
                        }}>
                        Agregar
                    </Button>
                </Box>
            </Modal>

        </div>
    )
}

export default Configuracion;