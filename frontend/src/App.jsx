import './css/App.css'
import AppRouter from './router/AppRouter'
import { AuthProvider } from '../src/router/AuthContext';

function App() {

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
