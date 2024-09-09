//import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SensorDataChart from './SensorDataChart.jsx';
import BotaoLimparDados from './BotaoLimparDados';
import BotaoPausarReiniciarServico from './BotaoPausarReiniciarServico'; // Importe o novo botão
import HomePage from './HomePage';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

import './App.css';

function App() {
  const isAuthenticated = () => {
    // Verifica se o token está presente no localStorage
    return !!localStorage.getItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Se não estiver logado, redireciona para login */}
          <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/sensores" element={isAuthenticated() ? (
            <>
              <h1>Dados do Sensor</h1>
              <SensorDataChart />
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <BotaoLimparDados />
                <BotaoPausarReiniciarServico /> {/* Novo botão */}
              </div>
            </>
          ) : <Navigate to="/login" />} />

          {/* Páginas de Login e Registro */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;