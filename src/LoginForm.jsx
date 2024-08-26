import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'flowbite-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Login bem-sucedido!', { position: 'top-right' });
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast.error('Login falhou, por favor, tente novamente.', { position: 'top-right' });
      }
    } catch (error) {
      toast.error('Ocorreu um erro. Por favor, tente novamente.', { position: 'top-right' });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Entrar</h2>
          
          {/* Campo de Nome de Usuário */}
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de Usuário"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Botão de Enviar */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Entrar
          </Button>

          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Registre-se aqui
            </a>.
          </p>
        </form>
      </div>

      {/* ToastContainer para exibir notificações */}
      <ToastContainer />
    </>
  );
};

export default LoginForm;