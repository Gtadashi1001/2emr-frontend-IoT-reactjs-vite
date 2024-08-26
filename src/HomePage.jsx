
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); // Hook do React Router para navegação programática

  const handleLogout = () => {
    // Remove o token do localStorage e redireciona para a página de login
    localStorage.removeItem('token');
    navigate('/login'); // Redireciona para a página de login
  };

  const goToSensores = () => {
    // Navega para a página de Sensores
    navigate('/sensores'); // Redireciona para a página de sensores
  };

  return (
    <div>
      <h1>Bem-vindo à Home Page</h1>
      <p>Você está logado!</p>

      {/* Botão para a página de Sensores */}
      <button onClick={goToSensores}>Visualizar Dados dos Sensores</button>

      {/* Botão de Logout */}
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
    </div>
  );
};

export default HomePage;