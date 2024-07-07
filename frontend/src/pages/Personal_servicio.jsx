import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../css/estadisticas.css';  // Importa el archivo CSS
import Button from '@mui/material/Button';

function Personal_servicio() {
    const [anio, setAnio] = useState('');
    const [mes, setMes] = useState('');
    const [empleadoMasServicios, setEmpleadoMasServicios] = useState(null);
    const [empleadoMenosServicios, setEmpleadoMenosServicios] = useState(null);
    const [noResultados, setNoResultados] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNoResultados(false);
        setError('');
        setEmpleadoMasServicios(null);
        setEmpleadoMenosServicios(null);

        // Validar campos vacíos
        if (!anio || !mes) {
            setError('Por favor, complete ambos campos de búsqueda.');
            return;
        }

        try {
            const responseMas = await axios.get(`http://localhost:3002/estadisticas_empleados_mas_servicios/${anio}/${mes}`);
            const responseMenos = await axios.get(`http://localhost:3002/estadisticas_empleados_menos_servicios/${anio}/${mes}`);

            if (responseMas.data.length === 0 && responseMenos.data.length === 0) {
                setNoResultados(true);
            } else {
                setNoResultados(false);
                setEmpleadoMasServicios(responseMas.data[0]);
                setEmpleadoMenosServicios(responseMenos.data[0]);
            }
        } catch (error) {
            console.error('Error al obtener los datos', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h1 className="header">Personal que realiza más/menos servicios por mes.</h1>
            <div className="container-empleado-g">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Año:</label>
                        <input type="text" value={anio} onChange={(e) => setAnio(e.target.value)} />
                    </div>
                    <div>
                        <label>Mes:</label>
                        <input type="text" value={mes} onChange={(e) => setMes(e.target.value)} />
                    </div>
                    <Button type="submit" variant="contained">Buscar</Button>
                </form>

                {error && (
                    <div>
                        <h2 style={{ color: 'red' }}>{error}</h2>
                    </div>
                )}

                {noResultados && (
                    <div>
                        <h2 >No se encontraron resultados</h2>
                    </div>
                )}

                <div className="container-answers">
                    {empleadoMasServicios && (
                        <div className="container-answers-1">
                            <h2 style={{ fontSize: '25px' }}>Empleado con más servicios</h2>
                            <p>Cédula: {empleadoMasServicios.CIEmpleado}</p>
                            <p>Nombre: {empleadoMasServicios.NombreEmpleado}</p>
                            <p>Cantidad de Servicios: {empleadoMasServicios.cantidad}</p>
                        </div>
                    )}

                    {empleadoMenosServicios && (
                        <div className="container-answers-2">
                            <h2 style={{ fontSize: '25px' }}>Empleado con menos servicios</h2>
                            <p>Cédula: {empleadoMenosServicios.CIEmpleado}</p>
                            <p>Nombre: {empleadoMenosServicios.NombreEmpleado}</p>
                            <p>Cantidad de Servicios: {empleadoMenosServicios.Cantidad}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Personal_servicio;