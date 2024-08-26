import { useEffect, useState } from 'react'; // Importa React e os hooks useEffect e useState
import Chart from 'chart.js/auto'; // Importa o Chart.js para criação de gráficos

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [humidityChartInstance, setHumidityChartInstance] = useState(null); // Instância do gráfico de umidade
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial
  const [token, setToken] = useState(''); // Estado para armazenar o token JWT

  // Função para obter o token JWT
  const getToken = () => {
    // Aqui você pode buscar o token do localStorage, cookies, ou outro lugar onde foi armazenado após o login
    const storedToken = localStorage.getItem('token'); 
    setToken(storedToken); // Atualiza o estado com o token obtido
  };

  // Função para enviar os dados do sensor para o backend
  const sendSensorData = async () => {
    const dadosSensor = {
      sensor_id: 1,
      temperatura: Math.random() * 50, // Gerando temperatura aleatória
      umidade: Math.random() * 100 // Gerando umidade aleatória
    };
    try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT ao cabeçalho se a rota estiver protegida
            },
            body: JSON.stringify(dadosSensor) // Converte os dados do sensor para JSON
        });

        if (!response.ok) {
          throw new Error('Erro ao enviar dados do sensor: ' + response.statusText);
        }
  
    } catch (error) {
        console.error('Erro ao enviar dados do sensor:', error); // Exibe erros no console
    }
  };

  // Busca inicial de dados do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            'Authorization': `Bearer ${token}`, // Adiciona o token JWT ao cabeçalho
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data); // Atualiza o estado com os dados obtidos
        setIsLoading(false); // Marca o carregamento como concluído
      } catch (error) {
        console.error('Erro ao buscar dados:', error); // Exibe erros no console
      }
    };

    if (token) {
      fetchData(); // Chama fetchData somente se o token existir
    }
  }, [token]); // Executa sempre que o token muda

  // Obtenção do token após montar o componente
  useEffect(() => {
    getToken(); // Obtém o token assim que o componente é montado
  }, []); // Executa apenas uma vez após a montagem do componente

  // Atualização periódica dos dados a cada 10 segundos
  useEffect(() => {
    const updateChartData = async () => {
      try {
        await sendSensorData(); // Envia os dados do sensor a cada 10 segundos

        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            'Authorization': `Bearer ${token}`, // Adiciona o token JWT ao cabeçalho
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data); // Atualiza o estado com os novos dados
      } catch (error) {
        console.error('Erro ao buscar ou atualizar dados:', error); // Exibe erros no console
      }
    };

    if (token) {
      const interval = setInterval(updateChartData, 10000); // Define um intervalo de 10 segundos para atualizar os dados
      return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }
  }, [token]); // Executa sempre que o token muda

  // Renderização dos gráficos
  useEffect(() => {
    if (!isLoading) { // Renderiza gráficos somente após o carregamento inicial
      if (tempChartInstance) {
        tempChartInstance.destroy(); // Destrói o gráfico existente antes de criar um novo
      }
      if (humidityChartInstance) {
        humidityChartInstance.destroy(); // Destrói o gráfico existente antes de criar um novo
      }

      const tempCtx = document.getElementById('temp-chart'); // Obtém o contexto do canvas do gráfico de temperatura
      const humidityCtx = document.getElementById('humidity-chart'); // Obtém o contexto do canvas do gráfico de umidade

      // Cria novo gráfico de temperatura
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'line', // Tipo do gráfico
        data: {
          labels: sensorData.map(entry => {
            const timestamp = new Date(entry.timestamp);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); // Formata data e hora
          }),
          datasets: [
            {
              label: 'Temperatura',
              data: sensorData.map(entry => entry.temperatura), // Dados de temperatura
              borderColor: 'rgb(227 15 89)', // Cor da linha
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true // Inicia o eixo y a partir de zero
            }
          }
        }
      });

      // Cria novo gráfico de umidade
      const newHumidityChartInstance = new Chart(humidityCtx, {
        type: 'line', // Tipo do gráfico
        data: {
          labels: sensorData.map(entry => {
            const timestamp = new Date(entry.timestamp);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); // Formata data e hora
          }),
          datasets: [
            {
              label: 'Umidade',
              data: sensorData.map(entry => entry.umidade), // Dados de umidade
              borderColor: 'rgb(54, 162, 235)', // Cor da linha
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true // Inicia o eixo y a partir de zero
            }
          }
        }
      });

      setTempChartInstance(newTempChartInstance); // Armazena nova instância do gráfico de temperatura
      setHumidityChartInstance(newHumidityChartInstance); // Armazena nova instância do gráfico de umidade
    }
  }, [sensorData, isLoading]); // Executa sempre que sensorData ou isLoading muda

  return (
    <div>
      <canvas id="temp-chart" width="600" height="200"></canvas> {/* Canvas para gráfico de temperatura */}
      <canvas id="humidity-chart" width="600" height="200"></canvas> {/* Canvas para gráfico de umidade */}
    </div>
  );
};

export default SensorDataChart; // Exporta o componente para uso em outras partes da aplicação