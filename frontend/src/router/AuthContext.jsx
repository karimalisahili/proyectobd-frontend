import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  // Add children to props validation
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [encargado, setEncargado] = useState('');

  const value = {
    encargado,
    setEncargado,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};