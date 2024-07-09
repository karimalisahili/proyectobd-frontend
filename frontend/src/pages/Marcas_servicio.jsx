import MarcasServiciosTable from '../components/MarcasServiciosTable';
import '../css/estadisticas.css';  // Importa el archivo CSS

function Marcas_servicio() {
    return (
        <div>
            <h1 className="header">Marca de vehículos que más atendemos por tipo de servicio</h1>
            <div className="container">
                <MarcasServiciosTable />
            </div>
        </div>
    );
}

export default Marcas_servicio;
