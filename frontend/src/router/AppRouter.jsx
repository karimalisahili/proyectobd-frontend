
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Libreta from '../pages/Libreta'
import Servicios from '../pages/Servicios'
import Tienda from '../pages/Tienda'
import Proveedores from '../pages/Proveedores'
import Inventario from '../pages/Inventario'
import Configuracion from '../pages/Configuracion'
import Register from '../pages/register'
import Marcas from '../pages/Marcas'
import Marcas_servicio from '../pages/Marcas_servicio'
import Personal_servicio from '../pages/Personal_servicio'

export default function AppRouter() {
    return (
        <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Libreta" element={<Libreta />} />
                <Route path="/Servicios" element={<Servicios />} />
                <Route path="/Tienda" element={<Tienda />} />
                <Route path="/Proveedores" element={<Proveedores />} />
                <Route path="/Inventario" element={<Inventario />} />
                <Route path="/Configuracion" element={<Configuracion />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Marcas" element={<Marcas/>} />
                <Route path="/Marcas_servicio" element={<Marcas_servicio/>}/>
                <Route path="/Personal_servicio" element={<Personal_servicio/>}/>
        </Routes>
    )
}
