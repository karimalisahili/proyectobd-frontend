// Importación de componentes de Material UI, PropTypes y hooks de React.
import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Definición de la variable SERVERNAME que obtiene el valor de la variable de entorno VITE_SERVERNAME.
// Este valor se utiliza para configurar el Nombre del servidor en la aplicación.
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

// Obtención de la información del usuario almacenada en localStorage y conversión de esta de JSON a objeto.
// Esto permite manejar la información del usuario de manera más sencilla en la aplicación.
const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);

// Estilos para el componente Box. Se configura el padding vertical, ancho, color de borde,
// color de fondo y color de texto. Estos estilos se aplican a un componente Box de Material UI.
const style = {
    py: 0,
    width: '80%',
    borderColor: 'divider',
    backgroundColor: 'Transparent',
    color: 'black',
};

// Estilos comunes para los modales. Incluye la posición, alineación, color de fondo, bordes,
// sombra, padding, y otros estilos para asegurar una apariencia consistente y centrada de los modales.
// Estos estilos se aplican a los componentes Modal de Material UI.
const commonStyles = {
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
};

// Define un estilo base para la lista y lo extiende con propiedades específicas para controlar su altura máxima y el desbordamiento vertical
const listStyle = { ...style, maxHeight: '320px', overflowY: 'auto' };

// Hook personalizado para manejar formularios
function useForm(initialState) {
    // Inicializa el estado del formulario con el estado inicial proporcionado
    const [formData, setFormData] = useState(initialState);

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        // Extrae el Nombre y el valor del campo que disparó el evento
        const { name, value } = e.target;
        // Actualiza el estado del formulario con el nuevo valor para el campo especificado
        setFormData(prevState => ({
            ...prevState, // Copia el estado anterior del formulario
            [name]: value // Actualiza el valor del campo especificado
        }));
    };

    // Devuelve el estado actual del formulario y la función handleChange
    return [formData, handleChange];
}

// Define una función asíncrona llamada sendData
async function sendData(endpoint, formData, method) {
    console.log(formData, method, endpoint)
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // Add any other headers your request needs
        },
        body: JSON.stringify(formData), // Convert the data to JSON format
    });

    // Check if the response is OK and the content type is JSON
    if (response.status == 200) {
        window.location.reload();
        return response.json();
    } else {
        // Handle non-JSON responses or errors
        const text = await response.text(); // Read response as text to avoid JSON parse error
        throw new Error(`Failed to fetch JSON. Status: ${response.status}, Body: ${text}`);
    }
}

// Define un componente funcional FormBox que acepta props, incluyendo children y onSubmit
const FormBox = ({ children, onSubmit, ...props }) => (
    // Retorna un componente Box actuando como un formulario
    <Box component="form" sx={commonStyles} noValidate autoComplete="off" onSubmit={onSubmit} {...props}>
        {/*Dentro del Box, muestra un encabezado con un mensaje*/}
        <h3>Ingrese los Siguientes Datos</h3>
        {/*Renderiza cualquier hijo pasado al FormBox (usualmente campos de formulario)*/}
        {children}
    </Box>
);

// Define un componente funcional InputField que acepta varias props para configurar el campo
const InputField = ({ label, type, name, min, valor, cambio }) => (
    // Retorna un componente TextField con varias props configuradas
    <TextField
        label={label} // Establece la etiqueta del campo
        type={type} // Establece el tipo de input (ej. text, number)
        name={name} // Establece el Nombre del campo, importante para identificarlo al enviar el formulario
        sx={{ bgcolor: '#FFFFFF', width: '30%', margin: '10px', borderRadius: '10px' }} // Estilos personalizados
        InputProps={min ? { inputProps: { min } } : {}} // Propiedad condicional para establecer el valor mínimo si se proporciona
        value={valor} // Vincula el valor del campo a la variable 'valor'
        onChange={cambio} // Maneja el evento de cambio para actualizar el estado con el nuevo valor del campo
    />
);

// Define un componente funcional llamado Personal
function Marcas({ data = null, isEditing = false }) {
    /*
        CodMarcaVeh INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        Nombre VARCHAR(50) NOT NULL UNIQUE
    */
    const initialValues = {
        CodMarcaVeh: data?.CodMarcaVeh || '',
        Nombre: data?.Nombre || '',
    };

    const [formData, handleChange] = useForm(initialValues);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isConfirmed = window.confirm('¿Está seguro de que desea realizar esta acción?');
        if (!isConfirmed) {
            return; // Si el usuario no confirma, detiene la función aquí
        }
        const endpoint = `${SERVERNAME}/marcas_vehiculos`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await sendData(endpoint, formData, method);
            alert('Operación realizada correctamente');
        } catch (error) {
            console.error('Error en la operación', error);
            if (error.message.includes('404')) {
                alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
            } else {
                alert('Error en la operación. Por favor, intente nuevamente.');
            }
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
        if (!isConfirmed) {
            return; // Si el usuario no confirma, detiene la función aquí
        }
        const endpoint = `${SERVERNAME}/marcas_vehiculos`; // Asumiendo que CodMarcaVeh es el identificador único
        try {
            await sendData(endpoint, formData, 'DELETE');
            alert('Empleado eliminado correctamente');
            // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
        } catch (error) {
            console.error('Error al eliminar el empleado', error);
            alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
        }
    };

    // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
    return (
        <FormBox onSubmit={handleSubmit}>
            {/* Box para agrupar los campos de entrada con estilo de flexbox */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                {/* Box para agrupar dos campos de entrada horizontalmente */}
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    {/* InputField para el Nombre del empleado */}
                    <InputField label="Nombre-Marca" type='text' name='Nombre'
                        valor={formData.Nombre} cambio={handleChange} />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button type='submit' variant="contained" sx={{
                    margin: '5px 20px',
                    color: '#000000',
                    bgcolor: '#FFFFFF',
                    '&:hover': {
                        bgcolor: '#41B06E',
                        color: '#FFFFFF'
                    }
                }}
                >
                    {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                </Button>
                {isEditing && (
                    <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                        Eliminar
                    </Button>
                )}
            </Box>
        </FormBox>
    );
}

// Define un componente funcional llamado linea
function Modelos({ data = null, isEditing = false }) {

    // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para CodLineas y Descripcion
    const initialValues = {
        CodMarcaV: data?.CodMarcaV || '',
        CodConsec: data?.CodConsec || '',
        Descripcion: data?.Descripcion || '',
        CantPuestos: data?.CantPuestos || '',
        Peso: data?.Peso || '',
        TipoAceite: data?.TipoAceite || '',
        AceiteCaja: data?.AceiteCaja || '',
        TipoRefri: data?.TipoRefri || '',
        Octanaje: data?.Octanaje || '',
        TipoMant: data?.TipoMant || '',
        TiempoUsoMant: data?.TiempoUsoMant || '',
        KilometrajeMant: data?.KilometrajeMant || '',
        CodTipoV: data?.CodTipoV || '',
    };

    const [formData, handleChange] = useForm(initialValues);

    // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = `${SERVERNAME}/modelosvehiculos`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await sendData(endpoint, formData, method);
            alert('Operación realizada correctamente');
        } catch (error) {
            console.error('Error en la operación', error);
            if (error.message.includes('404')) {
                alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
            } else {
                alert('Error en la operación. Por favor, intente nuevamente.');
            }
        }
    };



    const handleDelete = async () => {
        const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
        if (!isConfirmed) {
            return; // Si el usuario no confirma, detiene la función aquí
        }
        const endpoint = `${SERVERNAME}/modelosvehiculos`; // Asumiendo que CodMarcaVeh es el identificador único
        try {
            await sendData(endpoint, formData, 'DELETE');
            alert('Empleado eliminado correctamente');
            // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
        } catch (error) {
            console.error('Error al eliminar el empleado', error);
            alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
        }
    };

    /*
  CREATE TABLE MODELOS_VEHICULOS (
      CodMarcaV INT NOT NULL,
      CodConsec INT NOT NULL IDENTITY(1,1),
      Descripcion VARCHAR(50) NOT NULL,
      CantPuestos INT NOT NULL,
      Peso DECIMAL(10, 2) NOT NULL,
      TipoAceite VARCHAR(25) NOT NULL,
      AceiteCaja VARCHAR(25) NOT NULL,
      TipoRefri VARCHAR(25) NOT NULL,
      Octanaje INT NOT NULL CHECK (Octanaje IN (91, 95)),
      TipoMant VARCHAR(30) NOT NULL,
      TiempoUsoMant INT NOT NULL,
      KilometrajeMant DECIMAL(10, 2) NOT NULL,
      CodTipoV INT NOT NULL,
      PRIMARY KEY (CodMarcaV, CodConsec),
      FOREIGN KEY (CodTipoV) REFERENCES TIPOS_VEHICULOS(CodTipoV) ON UPDATE CASCADE ON DELETE NO ACTION,
      FOREIGN KEY (CodMarcaV) REFERENCES MARCAS_VEHICULOS(CodMarcaVeh) ON UPDATE CASCADE ON DELETE NO ACTION
  );
    */
    // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
    return (
        <FormBox onSubmit={handleSubmit}>
            {/* Box para agrupar los campos de entrada con estilo de flexbox */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                {/* Box para agrupar dos campos de entrada horizontalmente */}
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <InputField label="CodMarcaV" type='number' name='CodMarcaV' valor={formData.CodMarcaV} cambio={handleChange} />
                    <InputField label="Descripcion-Modelo" type='text' name='Descripcion' valor={formData.Descripcion} cambio={handleChange} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <InputField label="CantPuestos" type='number' name='CantPuestos' valor={formData.CantPuestos} cambio={handleChange} />
                    <InputField label="Peso" type='number' name='Peso' valor={formData.Peso} cambio={handleChange} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <InputField label="TipoAceite" type='text' name='TipoAceite' valor={formData.TipoAceite} cambio={handleChange} />
                    <InputField label="AceiteCaja" type='text' name='AceiteCaja' valor={formData.AceiteCaja} cambio={handleChange} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <InputField label="TipoRefri" type='text' name='TipoRefri' valor={formData.TipoRefri} cambio={handleChange} />
                    <select name="Octanaje" value={formData.Octanaje} onChange={handleChange} style={{ backgroundColor: 'white', color: 'black', borderRadius: '8px' }}>
                        <option value="91">Seleccione Octanaje</option>
                        <option value="91">91</option>
                        <option value="95">95</option>
                    </select>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <InputField label="TipoMant" type='text' name='TipoMant' valor={formData.TipoMant} cambio={handleChange} />
                    <InputField label="TiempoUsoMant" type='number' name='TiempoUsoMant' valor={formData.TiempoUsoMant} cambio={handleChange} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <InputField label="KilometrajeMant" type='text' name='KilometrajeMant' valor={formData.KilometrajeMant} cambio={handleChange} />
                    <InputField label="CodTipoV" type='text' name='CodTipoV' valor={formData.CodTipoV} cambio={handleChange} />
                </Box>


            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button type='submit' variant="contained" sx={{
                    margin: '5px 0',
                    color: '#000000',
                    bgcolor: '#FFFFFF',
                    '&:hover': {
                        bgcolor: '#41B06E',
                        color: '#FFFFFF'
                    }
                }}>
                    {isEditing ? 'Actualizar Modelo Vehiculo' : 'Agregar Modelo Vehiculo'}
                </Button>
                {isEditing && (
                    <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                        Eliminar
                    </Button>
                )}
            </Box>
        </FormBox>
    );
}

// Define un componente funcional llamado Vehiculo
function Tipos_Vehiculos({ data = null, isEditing = false }) {

    // Utiliza un hook personalizado useForm para manejar el estado del formulario, inicializando con valores predeterminados para los campos del formulario
    const initialValues = {
        CodTipoV: data?.CodTipoV || '',
        Descripcion: data?.Descripcion || '',

    };

    const [formData, handleChange] = useForm(initialValues);

    // Define una función asíncrona handleSubmit para manejar el evento de envío del formulario

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const endpoint = `${SERVERNAME}/tiposvehiculos`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await sendData(endpoint, formData, method);
            alert('Operación realizada correctamente');
        } catch (error) {
            console.error('Error en la operación', error);
            if (error.message.includes('404')) {
                alert('Recurso no encontrado. Por favor, verifique los datos e intente nuevamente.');
            } else {
                alert('Error en la operación. Por favor, intente nuevamente.');
            }
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
        if (!isConfirmed) {
            return; // Si el usuario no confirma, detiene la función aquí
        }
        const endpoint = `${SERVERNAME}/tiposvehiculos`; // Asumiendo que CodTipoV es el identificador único
        try {
            await sendData(endpoint, formData, 'DELETE');
            alert('Empleado eliminado correctamente');
            // Aquí podrías redirigir al usuario o actualizar el estado para reflejar que el empleado fue eliminado
        } catch (error) {
            console.error('Error al eliminar el empleado', error);
            alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
        }
    };

    // Renderiza el componente FormBox pasando handleSubmit como prop para manejar el envío del formulario
    return (
        <FormBox onSubmit={handleSubmit}>
            {/* Box para agrupar los campos de entrada con estilo de flexbox */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            </Box>
            {/* Repite la estructura anterior para otros campos del formulario */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <InputField label="Descripcion" type='text' name='Descripcion'
                        valor={formData.Descripcion} cambio={handleChange} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button type='submit' variant="contained" sx={{
                    margin: '5px 0',
                    color: '#000000',
                    bgcolor: '#FFFFFF',
                    '&:hover': {
                        bgcolor: '#41B06E',
                        color: '#FFFFFF'
                    }
                }}>
                    {isEditing ? 'Actualizar Tipo Vehiculo' : 'Agregar Tipo Vehiculo'}
                </Button>
                {isEditing && (
                    <Button variant="contained" color='error' onClick={handleDelete} sx={{ '&:hover': { backgroundColor: '#8b0000 ' } }}>
                        Eliminar
                    </Button>
                )}
            </Box>
        </FormBox>
    );
}



// Define una función para renderizar una lista de elementos
function renderList(items, textKey, secondaryKey, onSeleccionado) {

    const [Seleccionado, setSeleccionado] = useState(null);
  
    const manejarClicSeleccionado = (seleccion) => {
      setSeleccionado(seleccion);
      onSeleccionado(seleccion);
    };
    // Retorna un componente List de Material-UI con un estilo personalizado
    return (
      <List sx={listStyle}>
        {/* Mapea cada elemento del array 'items' a un componente ListItem */}
        {items.map((item, index) => (
          // Cada ListItem tiene una key única basada en su índice para optimizar el renderizado
          <ListItem key={index} button onClick={() => manejarClicSeleccionado(item)}>
            {/* ListItemText muestra el texto principal y secundario basado en las claves proporcionadas */}
            <ListItemText primary={item[textKey]} />
            {/* Muestra el valor secundario directamente sin un componente específico */}
            {item[secondaryKey]}


          </ListItem>
        ))}
      </List>
    );
}

// Define una función para mostrar una lista basada en la opción seleccionada
function mostrarLista(opcion, empleadosSeleccionados, lineasSeleccionados, vehiculosSeleccionados, onSeleccionado) {
    // Utiliza una estructura switch para manejar las diferentes opciones
    switch (opcion) {
        case 'Marcas':
            // Renderiza y retorna una lista de empleados seleccionados
            return renderList(empleadosSeleccionados, 'CodMarcaVeh', 'Nombre', onSeleccionado);
        case 'Modelos':
            // Renderiza y retorna una lista de lineas seleccionados
            return renderList(lineasSeleccionados, 'CodMarcaV', 'Descripcion', onSeleccionado);
        case 'Tipos Vehiculos':
            // Renderiza y retorna una lista de vehículos seleccionados
            return renderList(vehiculosSeleccionados, 'CodTipoV', 'Descripcion', onSeleccionado);
        default:
            // Retorna un párrafo indicando que se debe seleccionar una opción si ninguna coincide
            return <p>Seleccione una opción</p>;
    }
}

// Define el componente Lists que recibe una prop 'opcion'
function MarcasListas({ opcion }) {

    // Estado para controlar la visibilidad del modal
    const [open, setOpen] = useState(false);
    // Estado para determinar el tipo de formulario a mostrar en el modal
    const [formType, setFormType] = useState('');
    const [open2, setOpen2] = useState(false);

    // Estados para almacenar los datos seleccionados de empleados, lineas y vehículos
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
    const [lineasSeleccionados, setlineasSeleccionados] = useState([]);
    const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);

    // useEffect para cargar datos de empleados, lineas y vehículos al montar el componente
    useEffect(() => {
        // Función asíncrona para obtener datos de un endpoint y actualizar el estado correspondiente
        const obtenerDatos = async (endpoint, setter) => {
            try {
                console.log(`${SERVERNAME}/${endpoint}`)
                // Realiza la petición fetch al servidor y espera la respuesta
                const respuesta = await fetch(`${SERVERNAME}/${endpoint}`);
                // Convierte la respuesta a formato JSON
                const datos = await respuesta.json();
                // Actualiza el estado correspondiente con los datos obtenidos
                setter(datos);
            } catch (error) {
                // Captura y registra errores en la consola
                console.error(`Error al obtener datos de ${endpoint}:`, error);
            }
        };


        // Llama a obtenerDatos para cada tipo de dato necesario
        obtenerDatos(`marcas_vehiculos`, setEmpleadosSeleccionados);
        obtenerDatos('modelosvehiculos', setlineasSeleccionados);
        obtenerDatos(`tiposvehiculos`, setVehiculosSeleccionados);
    }, []);

    // Función para manejar la apertura del modal y establecer el tipo de formulario
    const handleOpen = (type) => {
        setFormType(type);
        setOpen(true);
    };

    const handleOpen2 = (type) => {
        setFormType(type);
        setOpen2(true);
    };

    const closeModal = () => {
        setOpen(false);
        setOpen2(false);
    };
    // Función para renderizar el formulario correspondiente en el modal
    const renderForm = (info, editar) => {
        switch (formType) {
            case 'Marcas':
                return <Marcas data={info} isEditing={editar} />;
            case 'Modelos':
                return <Modelos data={info} isEditing={editar} />;
            case 'Tipos Vehiculos':
                return <Tipos_Vehiculos data={info} isEditing={editar} />;
            default:
                return <div> fallo </div>;
        }
    };

    const [seleccionEnLists, setSeleccionEnLists] = useState(null);

    

    // Función para manejar la selección desde renderList
    const manejarSeleccionEnLists = (seleccion) => {
        setSeleccionEnLists(seleccion);
        // Aquí puedes hacer algo más con la selección en el componente Lists
    };


    // Renderiza el componente
    return (
        <Box>
            <div className="vertical_line"></div>
            <Box sx={{ position: 'absolute', ml: '15%', width: '35%', top: '50%', height: 'auto' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Llama a mostrarLista para renderizar la lista de elementos seleccionados basada en la opción */}
                    {mostrarLista(opcion, empleadosSeleccionados, lineasSeleccionados, vehiculosSeleccionados, manejarSeleccionEnLists)}
                    {/* Botón para abrir el modal y agregar un nuevo elemento basado en la opción seleccionada */}

                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', '&:hover': { backgroundColor: '#41B06E' }, my: 3 }} onClick={() => handleOpen(opcion)}>
                        Agregar {opcion}
                    </Button>

                    {/* Modal que se muestra u oculta basado en el estado 'open' */}
                    <Modal open={open} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        {/* Renderiza el formulario correspondiente dentro del modal */}
                        {renderForm(null, false)}
                    </Modal>
                </Box>
            </Box>
            <Box sx={{ position: 'absolute', ml: '50%', width: '50%', top: '35%', height: 'auto' }}>
                {seleccionEnLists ? (
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="circle">
                            <DirectionsCarIcon sx={{ fontSize: 150 }} />
                        </div>
                        <h2>{seleccionEnLists.Nombre || ''}</h2>
                        <h2>{seleccionEnLists.CodProd || ''}</h2>
                        <h2>{seleccionEnLists.Descripcion || ''}</h2>
                        <h2>{seleccionEnLists.CodLineas || ''}</h2>
                    </Box>
                ) : (
                    <Typography>No se ha seleccionado ningún elemento</Typography>
                )}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Lista estática, posiblemente para mostrar detalles o información adicional */}
                    <List sx={style}>
                        {seleccionEnLists && Object.entries(seleccionEnLists).slice(Object.entries(seleccionEnLists).findIndex(entry => entry[0] === 'Descripcion' || entry[0] === 'Descripcion')).map(([key, value]) => (
                            <React.Fragment key={key}>
                                <ListItem>
                                    <ListItemText primary={`${key}: `} />
                                    {value || 'No disponible'}
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                    {/* Botón para modificar, aún no implementado completamente */}

                    <Button variant="contained" sx={{ backgroundColor: '#8DECB4', my: 3, mx: 3, '&:hover': { backgroundColor: '#41B06E' } }} onClick={() => handleOpen2(opcion)}>
                        Modificar
                    </Button>


                    <Modal open={open2} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        {/* Renderiza el formulario correspondiente dentro del modal */}
                        {renderForm(seleccionEnLists, true)}
                    </Modal>
                </Box>
            </Box>
        </Box>
    );
}

// Define las propiedades esperadas para el componente Lists
MarcasListas.propTypes = {
    opcion: PropTypes.string.isRequired, // 'opcion' debe ser una cadena de texto y es requerida
    raiz: PropTypes.string.isRequired, // 'raiz' debe ser una cadena de texto y es requerida
};

// Define las propiedades esperadas para el componente FormBox
FormBox.propTypes = {
    children: PropTypes.node.isRequired, // 'children' puede ser cualquier elemento React y es requerido
    onSubmit: PropTypes.func, // 'onSubmit' debe ser una función, pero no es requerida
};

// Define las propiedades esperadas para el componente InputField
InputField.propTypes = {
    label: PropTypes.string.isRequired, // 'label' debe ser una cadena de texto y es requerida
    type: PropTypes.string.isRequired, // 'type' debe ser una cadena de texto y es requerida
    name: PropTypes.string.isRequired, // 'name' debe ser una cadena de texto y es requerida
    min: PropTypes.number, // 'min' debe ser un número, pero no es requerido
    cambio: PropTypes.func, // 'cambio' debe ser una función, pero no es requerida
    valor: PropTypes.string, // 'valor' debe ser una cadena de texto, pero no es requerida
};

Marcas.propTypes = {
    data: PropTypes.object,
    isEditing: PropTypes.bool,
}

Modelos.propTypes = {
    data: PropTypes.object,
    isEditing: PropTypes.bool,
}

Tipos_Vehiculos.propTypes = {
    data: PropTypes.object,
    isEditing: PropTypes.bool,
}

export default MarcasListas;