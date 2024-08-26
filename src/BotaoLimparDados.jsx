import { useState } from 'react';
import './BotaoLimparDados.css';

const BotaoLimparDados = () => {
  const [exibirModal, setExibirModal] = useState(false);
  const [exibirMensagem, setExibirMensagem] = useState(false);

  const handleLimparDados = () => {
    setExibirModal(true);
  };

  const handleConfirmarLimparDados = async () => {
    try {
      const response = await fetch('http://localhost:3000/limpar-dados', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicione o token JWT se necessário
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir os dados.');
      }

      setExibirModal(false);
      setExibirMensagem(true);

      setTimeout(() => {
        setExibirMensagem(false);
        // Recarregar os dados após 3 segundos
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Erro ao limpar os dados:', error);
      setExibirModal(false); // Fechar o modal em caso de erro
    }
  };

  const handleCloseModal = () => {
    setExibirModal(false);
  };

  return (
    <>
      <button className="botao-limpar" onClick={handleLimparDados}>Limpar Dados</button>
      {exibirModal && (
        <div className="modal">
          <div className="modal-conteudo">
            <h2>Confirmação</h2>
            <p>Tem certeza que deseja excluir todos os dados?</p>
            <div className="modal-botoes">
              <button onClick={handleConfirmarLimparDados}>Sim</button>
              <button onClick={handleCloseModal}>Não</button>
            </div>
          </div>
        </div>
      )}
      {exibirMensagem && (
        <div className="mensagem-sucesso">Dados excluídos com sucesso.</div>
      )}
    </>
  );
};

export default BotaoLimparDados;