import { useState } from 'react';
import { PauseIcon, PlayIcon } from '@heroicons/react/solid'; // Usando os ícones do Heroicons
import './BotaoPausarReiniciarServico.css'; // Importando o CSS

const BotaoPausarReiniciarServico = () => {
  const [isPaused, setIsPaused] = useState(false); // Estado para controlar se o serviço está pausado ou não

  const toggleService = async () => {
    const nextStatus = !isPaused; // Determina o próximo estado antes de atualizar

    try {
      const response = await fetch('http://localhost:3000/pausar-servico', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Inclua o token JWT
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus ? 'pausar' : 'reiniciar' }), // Usa o próximo estado para definir o status
      });

      if (!response.ok) {
        throw new Error('Erro ao pausar/reiniciar o serviço: ' + response.statusText);
      }

      const data = await response.json();
      console.log(data.message); // Mensagem de sucesso ou erro

      setIsPaused(nextStatus); // Atualiza o estado apenas após a requisição ser bem-sucedida

    } catch (error) {
      console.error('Erro ao pausar/reiniciar o serviço:', error);
    }
  };

  return (
    <button
      onClick={toggleService}
      className={`botao-pausar-reiniciar ${isPaused ? 'paused' : 'running'}`}
    >
      {isPaused ? (
        <>
          <PlayIcon className="icon inline-block" />
          Reiniciar Serviço
        </>
      ) : (
        <>
          <PauseIcon className="icon inline-block" />
          Pausar Serviço
        </>
      )}
    </button>
  );
};

export default BotaoPausarReiniciarServico;