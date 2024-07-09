import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const SERVERNAME = import.meta.env.VITE_SERVERNAME;

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  

  const navigate = useNavigate(); // Step 2

  const [user, setUser] = useState(null);
  const location = useLocation();

useEffect(() => {
  const storedUser = localStorage.getItem('user');
          if (storedUser) {
            navigate(location.pathname)
        }
  if (storedUser) {
    setUser(JSON.parse(storedUser)); 
  }
  }, [navigate, location.pathname]);
  

  

const login = (username, password, direccion) => {
  return fetch(direccion)
    .then(response => response.json())
    .then(data => {
      const user = data.find(user => user.RIFSuc === username && user.Encargado === password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Convertir el objeto a una cadena antes de almacenarlo
        setUser(user);
        return user;
      } else {
        throw new Error('Usuario o contraseña incorrectos');
      }
    });
};

  const logout = () => {
    localStorage.removeItem('user'); // Asegurarse de eliminar el usuario del almacenamiento local al cerrar sesión
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, location}}>{children}</AuthContext.Provider>;
};
