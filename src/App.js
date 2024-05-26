import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pagina1 from './paginas/pagina1';
import Pagina2 from './paginas/pagina2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pagina1 />} />
        <Route path="/pagina2" element={<Pagina2 />} />
      </Routes>
    </Router>
  );
}

export default App;