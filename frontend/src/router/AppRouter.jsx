
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
import ProtectedRoute from './ProtectedRoute'
import Marcas_servicio from '../pages/Marcas_servicio'
import Personal_servicio from '../pages/Personal_servicio'
import DetalleFactura from '../pages/DetalleFactura'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/Libreta" element={<ProtectedRoute><Libreta /></ProtectedRoute>} />
            <Route path="/Servicios" element={<ProtectedRoute><Servicios /></ProtectedRoute>} />
            <Route path="/Tienda" element={<ProtectedRoute><Tienda /></ProtectedRoute>} />
            <Route path="/Proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
            <Route path="/Inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
            <Route path="/Configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Marcas" element={<ProtectedRoute><Marcas /></ProtectedRoute>} />
            <Route path="/Marcas_servicio" element={<ProtectedRoute><Marcas_servicio/></ProtectedRoute>} />
            <Route path="/Personal_servicio" element={<ProtectedRoute><Personal_servicio/></ProtectedRoute>} />
            <Route path="/DetalleFactura/:NumFact" element={<ProtectedRoute><DetalleFactura/></ProtectedRoute>} />

        </Routes>
    )
}
