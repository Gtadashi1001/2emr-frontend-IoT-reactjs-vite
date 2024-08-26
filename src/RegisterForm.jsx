import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso!', {
          position: "top-right"
        });

        // Redireciona para a tela de login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);

        setUsername('');
        setPassword('');
      } else {
        throw new Error(data.message || 'Erro no cadastro');
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`, {
        position: "top-right"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Criar Conta</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome de usuário"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Cadastrar
        </button>
        <p className="text-xs text-gray-600 mt-1">Já tem conta ? <a href="/login" className="text-blue-600">Entrar</a></p>
      </form>

      <ToastContainer />
    </div>
  );
};

export default RegisterForm;