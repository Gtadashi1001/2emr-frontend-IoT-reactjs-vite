import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [humidityChartInstance, setHumidityChartInstance] = useState(null); // Instância do gráfico de umidade
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial
  const [token, setToken] = useState(''); // Estado para armazenar o token JWT
  const [isPaused, setIsPaused] = useState(false); // Estado para controlar se os serviços estão pausados

  // Função para obter o token JWT
  const getToken = () => {
    const storedToken = localStorage.getItem('token'); 
    setToken(storedToken);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Incluindo o token JWT diretamente do localStorage
        },
        body: JSON.stringify(dadosSensor)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Dados enviados com sucesso:', data);
      } else {
        if (data.message) {
          console.log('Erro do servidor:', data.message);
        } else {
          console.error('Erro ao enviar dados:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar dados do sensor:', error);
    }
  };

  // Busca inicial de dados do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            'Authorization': `Bearer ${token}`, // Adicionando o token JWT ao cabeçalho
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Obtenção do token após montar o componente
  useEffect(() => {
    getToken();
  }, []);

  // Atualização periódica dos dados a cada 10 segundos
  useEffect(() => {
    const updateChartData = async () => {
      try {
        if (!isPaused) {
          await sendSensorData();

          const response = await fetch('http://localhost:3000/dados-sensores', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Erro ao buscar dados: ' + response.statusText);
          }
          const data = await response.json();
          setSensorData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar ou atualizar dados:', error);
      }
    };

    if (token) {
      const interval = setInterval(updateChartData, 10000); // Intervalo de 10 segundos
      return () => clearInterval(interval); // Limpar intervalo ao desmontar o componente
    }
  }, [token, isPaused]); // Adicionando isPaused às dependências

  // Renderização dos gráficos
  useEffect(() => {
    if (!isLoading) {
      if (tempChartInstance) {
        tempChartInstance.destroy();
      }
      if (humidityChartInstance) {
        humidityChartInstance.destroy();
      }

      const tempCtx = document.getElementById('temp-chart');
      const humidityCtx = document.getElementById('humidity-chart');

      if (tempCtx && humidityCtx) {
        const newTempChartInstance = new Chart(tempCtx, {
          type: 'line',
          data: {
            labels: Array.isArray(sensorData) ? sensorData.map(entry => {
              const timestamp = new Date(entry.timestamp);
              timestamp.setHours(timestamp.getHours() - 3);
              return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            }) : [],
            datasets: [
              {
                label: 'Temperatura',
                data: Array.isArray(sensorData) ? sensorData.map(entry => entry.temperatura) : [],
                borderColor: 'rgb(227 15 89)',
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        const newHumidityChartInstance = new Chart(humidityCtx, {
          type: 'line',
          data: {
            labels: Array.isArray(sensorData) ? sensorData.map(entry => {
              const timestamp = new Date(entry.timestamp);
              timestamp.setHours(timestamp.getHours() - 3);
              return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            }) : [],
            datasets: [
              {
                label: 'Umidade',
                data: Array.isArray(sensorData) ? sensorData.map(entry => entry.umidade) : [],
                borderColor: 'rgb(54, 162, 235)',
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        setTempChartInstance(newTempChartInstance);
        setHumidityChartInstance(newHumidityChartInstance);
      }
    }
  }, [sensorData, isLoading]);
return (
    <div>
      <canvas id="temp-chart" width="600" height="200"></canvas>
      <canvas id="humidity-chart" width="600" height="200"></canvas>
    </div>
  );
};
export default SensorDataChart;