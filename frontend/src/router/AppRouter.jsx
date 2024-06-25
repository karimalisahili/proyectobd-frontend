
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Libreta from '../pages/Libreta'
import Servicios from '../pages/Servicios'
import Tienda from '../pages/Tienda'
import Proveedores from '../pages/Proveedores'
import Inventario from '../pages/Inventario'
import Descuentos from '../pages/Descuentos'
import Register from '../pages/register'

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
                <Route path="/Descuentos" element={<Descuentos />} />
                <Route path="/Register" element={<Register />} />
        </Routes>
    )
}
