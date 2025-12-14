import React, { useState, useEffect } from 'react';
import TrafficIntersection from './components/TrafficIntersection/TrafficIntersection';
import PhaseEditor from './components/PhaseEditor/PhaseEditor';
import ComparisonView from './components/ComparisonView/ComparisonView';
import './App.css';

function App() {
  const [selectedLight, setSelectedLight] = useState(null);
  const [trafficLights, setTrafficLights] = useState([]);
  const [phases, setPhases] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(true);

  // Загружаем список светофоров
  useEffect(() => {
    fetchTrafficLights();
  }, []);

  const fetchTrafficLights = async () => {
    try {
      const response = await fetch('http://localhost:8000/traffic-lights');
      const data = await response.json();
      setTrafficLights(data.traffic_lights);
      if (data.traffic_lights.length > 0) {
        handleSelectTrafficLight(data.traffic_lights[0].id);
      }
    } catch (error) {
      console.error('Error fetching traffic lights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrafficLight = async (tlId) => {
    setSelectedLight(tlId);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/traffic-lights/${tlId}`);
      const data = await response.json();
      setPhases(data.phases);
      setCurrentPhase(0);
    } catch (error) {
      console.error('Error fetching traffic light:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhases = async (userPhases) => {
    if (!selectedLight) return;
    
    try {
      const response = await fetch(`http://localhost:8000/traffic-lights/${selectedLight}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phases: userPhases }),
      });
      const data = await response.json();
      setComparisonResult(data);
      
      // Анимация фаз
      if (data.custom?.timeline?.phase) {
        animatePhases(data.custom.timeline.phase);
      }
    } catch (error) {
      console.error('Error comparing phases:', error);
    }
  };

  const animatePhases = (phaseTimeline) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < phaseTimeline.length) {
        setCurrentPhase(phaseTimeline[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚦</h1>
        <p>Оптимизация транспортных потоков на перекрестках</p>
      </header>

      <main className="main">
        <div className="sidebar">
          <h3>Выбор светофора</h3>
          <div className="traffic-lights-list">
            {trafficLights.map((tl) => (
              <button
                key={tl.id}
                className={`traffic-light-btn ${selectedLight === tl.id ? 'active' : ''}`}
                onClick={() => handleSelectTrafficLight(tl.id)}
              >
                <span className="tl-id">{tl.id}</span>
                <span className="tl-phases">{tl.phases_count} фаз</span>
              </button>
            ))}
          </div>
          
          {comparisonResult && (
            <div className="summary-card">
              <h3>Результаты сравнения</h3>
              <div className="improvement">
                <div className="improvement-item">
                  <span>Очереди:</span>
                  <span className={`value ${comparisonResult.comparison.avg_queue.percent < 0 ? 'positive' : 'negative'}`}>
                    {comparisonResult.comparison.avg_queue.percent.toFixed(1)}%
                  </span>
                </div>
                <div className="improvement-item">
                  <span>Время ожидания:</span>
                  <span className={`value ${comparisonResult.comparison.avg_waiting_time.percent < 0 ? 'positive' : 'negative'}`}>
                    {comparisonResult.comparison.avg_waiting_time.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="summary-text">{comparisonResult.summary.text}</p>
            </div>
          )}
        </div>

        <div className="content">
          {selectedLight && phases.length > 0 && (
            <>
              <div className="intersection-section">
                <h2>Перекресток {selectedLight}</h2>
                <TrafficIntersection
                  trafficData={{ phases }}
                  currentPhase={currentPhase}
                  simulationStats={comparisonResult?.custom}
                />
              </div>

              <div className="editor-section">
                <PhaseEditor
                  phases={phases}
                  onSave={handleSavePhases}
                />
              </div>

              {comparisonResult && (
                <div className="comparison-section">
                  <ComparisonView comparisonData={comparisonResult} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Traffic Light Simulator • Данные обновляются в реальном времени</p>
        <br></br>
        <p>

      <strong>Ядерные грибы | Inai.kg | 2025</strong>
      <br />
      Asel - Design / UX  
      <br />
      Yana — Pitch /  Design  
      <br />
      Otabek — Backend / SUMO / Simulation  
      <br />
      Sanjar — Product Manager / Strategist
      <br />
      Bekmyrza —  Design / Frontend 
    </p>
      </footer>
    </div>
  );
}

export default App;




  

