import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Inicio from '../pages/Inicio'



export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<Inicio />} />
        </Routes>
    )
}
