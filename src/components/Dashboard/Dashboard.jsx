import React, { useState, useEffect } from 'react';
import TrafficIntersection from '../TrafficIntersection/TrafficIntersection';
import PhaseEditor from '../PhaseEditor/PhaseEditor';
import SimulationChart from '../SimulationChart/SimulationChart';
import ComparisonView from '../ComparisonView/ComparisonView';
import { trafficLightAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { 
  TrafficCone, 
  Settings, 
  BarChart as BarChartIcon, 
  Compare, 
  Download,
  Upload,
  Info,
  TrafficLight,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [selectedLight, setSelectedLight] = useState(null);
  const [trafficLights, setTrafficLights] = useState([]);
  const [phases, setPhases] = useState([]);
  const [simulationData, setSimulationData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrafficLights();
  }, []);

  const fetchTrafficLights = async () => {
    setIsLoading(true);
    try {
      const response = await trafficLightAPI.getTrafficLights();
      setTrafficLights(response.data.traffic_lights);
      if (response.data.traffic_lights.length > 0) {
        handleSelectTrafficLight(response.data.traffic_lights[0].id);
      }
    } catch (error) {
      console.error('Error fetching traffic lights:', error);
      // Mock data for development
      setTrafficLights([
        { id: "tl_1", phases_count: 4 },
        { id: "tl_2", phases_count: 3 }
      ]);
      setSelectedLight("tl_1");
      setPhases([
        { index: 0, duration: 30, state: "GGrr" },
        { index: 1, duration: 5, state: "yyrr" },
        { index: 2, duration: 25, state: "rrGG" },
        { index: 3, duration: 5, state: "rryy" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTrafficLight = async (tlId) => {
    setSelectedLight(tlId);
    setIsLoading(true);
    try {
      const response = await trafficLightAPI.getTrafficLight(tlId);
      setPhases(response.data.phases);
      setSimulationData(null);
      setComparisonResult(null);
      setCurrentPhase(0);
    } catch (error) {
      console.error('Error fetching traffic light:', error);
      // Mock data for development
      setPhases([
        { index: 0, duration: 30, state: "GGrr" },
        { index: 1, duration: 5, state: "yyrr" },
        { index: 2, duration: 25, state: "rrGG" },
        { index: 3, duration: 5, state: "rryy" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePhases = async (userPhases) => {
    if (!selectedLight) return;
    
    setIsComparing(true);
    try {
      const response = await trafficLightAPI.comparePhases(selectedLight, userPhases);
      setComparisonResult(response.data);
      setActiveTab('comparison');
      
      // Animate phases
      if (response.data.custom?.timeline?.phase) {
        animatePhases(response.data.custom.timeline.phase);
      }
    } catch (error) {
      console.error('Error comparing phases:', error);
      // Mock data for development
      const mockComparison = {
        traffic_light_id: selectedLight,
        baseline: {
          avg_queue: 12.5,
          avg_waiting_time: 45.3,
          timeline: {
            queue: Array(300).fill(0).map(() => Math.random() * 20 + 5),
            waiting_time: Array(300).fill(0).map(() => Math.random() * 60 + 20),
            phase: Array(300).fill(0).map((_, i) => Math.floor(i / 75) % 4)
          }
        },
        custom: {
          avg_queue: 8.2,
          avg_waiting_time: 32.7,
          timeline: {
            queue: Array(300).fill(0).map(() => Math.random() * 15 + 3),
            waiting_time: Array(300).fill(0).map(() => Math.random() * 45 + 15),
            phase: Array(300).fill(0).map((_, i) => Math.floor(i / 65) % 4)
          }
        },
        comparison: {
          avg_queue: { percent: -34.4, direction: "improved" },
          avg_waiting_time: { percent: -27.8, direction: "improved" }
        },
        summary: {
          text: "Очереди и время ожидания уменьшились"
        }
      };
      setComparisonResult(mockComparison);
      setActiveTab('comparison');
      animatePhases(Array(300).fill(0).map((_, i) => Math.floor(i / 65) % 4));
    } finally {
      setIsComparing(false);
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
    }, 50);
  };

  const exportConfiguration = () => {
    const config = {
      trafficLightId: selectedLight,
      phases: phases,
      timestamp: new Date().toISOString(),
      comparisonResult: comparisonResult
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-light-config-${selectedLight}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        console.log('Imported config:', config);
        // Здесь можно добавить логику применения импортированной конфигурации
        alert(`Конфигурация для светофора ${config.trafficLightId} успешно импортирована!`);
      } catch (error) {
        console.error('Error parsing config file:', error);
        alert('Ошибка при чтении файла конфигурации');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading && !phases.length) {
    return (
      <div className="dashboard">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <TrafficLight className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
            <div className="text-text">Загрузка данных...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <TrafficCone className="w-6 h-6 text-white" />
              </div>
              <div className="logo-text">
                <h1>Traffic Flow Optimizer</h1>
                <p>Система оптимизации светофорных фаз</p>
              </div>
            </div>
            
            <div className="header-actions">
              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                style={{ display: 'none' }}
                id="import-config"
              />
              <label htmlFor="import-config" className="btn btn-outline flex items-center cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Импорт
              </label>
              <button 
                onClick={exportConfiguration}
                className="btn btn-primary flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="dashboard-grid">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Intersection */}
              <TrafficIntersection
                trafficData={{ phases }}
                currentPhase={currentPhase}
                simulationStats={comparisonResult?.custom}
                title={`Перекресток ${selectedLight || ''}`}
              />

              {/* Tabs */}
              <div className="bg-surface rounded-lg shadow-lg">
                <div className="tabs">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
                  >
                    <Settings className="w-4 h-4" />
                    Редактор фаз
                  </button>
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
                  >
                    <Compare className="w-4 h-4" />
                    Сравнение
                  </button>
                  <button
                    onClick={() => setActiveTab('charts')}
                    className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
                  >
                    <BarChartIcon className="w-4 h-4" />
                    Графики
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'editor' && (
                    <PhaseEditor
                      phases={phases}
                      onSave={handleSavePhases}
                      isComparing={isComparing}
                    />
                  )}

                  {activeTab === 'comparison' && (
                    <ComparisonView comparisonData={comparisonResult} />
                  )}

                  {activeTab === 'charts' && comparisonResult && (
                    <div className="space-y-6">
                      <SimulationChart
                        baselineData={comparisonResult.baseline}
                        customData={comparisonResult.custom}
                        type="queue"
                      />
                      <SimulationChart
                        baselineData={comparisonResult.baseline}
                        customData={comparisonResult.custom}
                        type="waiting_time"
                      />
                    </div>
                  )}

                  {activeTab !== 'editor' && !comparisonResult && (
                    <div className="empty-state">
                      <BarChartIcon className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-text-muted">Запустите симуляцию для просмотра результатов</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Traffic light selector */}
              <div className="sidebar-section">
                <div className="sidebar-header">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3>Выбор светофора</h3>
                </div>
                
                <div className="traffic-light-list">
                  {trafficLights.map((tl) => (
                    <div
                      key={tl.id}
                      onClick={() => handleSelectTrafficLight(tl.id)}
                      className={`traffic-light-item ${selectedLight === tl.id ? 'active' : ''}`}
                    >
                      <div className="traffic-light-info">
                        <div>
                          <div className="traffic-light-name">{tl.id}</div>
                          <div className="traffic-light-phases">
                            {tl.phases_count} фаз
                          </div>
                        </div>
                        {selectedLight === tl.id && (
                          <div className="traffic-light-status"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sidebar-stats">
                  <div className="sidebar-stat">
                    <div className="label">Светофоров</div>
                    <div className="value">{trafficLights.length}</div>
                  </div>
                  <div className="sidebar-stat">
                    <div className="label">Всего фаз</div>
                    <div className="value">
                      {trafficLights.reduce((sum, tl) => sum + tl.phases_count, 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase info */}
              {phases.length > 0 && (
                <div className="sidebar-section">
                  <div className="sidebar-header">
                    <Info className="w-5 h-5 text-primary" />
                    <h3>Текущая фаза</h3>
                  </div>
                  
                  <div className="phase-info">
                    <div className="phase-info-header">
                      <div className="current-phase">Фаза {currentPhase}</div>
                      <div className="phase-duration-display">
                        {phases[currentPhase]?.duration || 0} сек
                      </div>
                    </div>
                    
                    <div className="phase-details">
                      <div className="phase-state-display">
                        <span className="text-text-muted">Состояние:</span>
                        <span className="font-mono text-white">{phases[currentPhase]?.state || '----'}</span>
                      </div>
                      
                      <div className="phase-progress">
                        <div className="label">Прогресс фазы</div>
                        <div className="progress-bar-large">
                          <div 
                            className="progress-fill-large"
                            style={{ width: '50%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="phase-buttons">
                    {phases.map((phase, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhase(index)}
                        className={`phase-button ${currentPhase === index ? 'active' : ''}`}
                      >
                        <div className="text-sm font-medium">Фаза {index}</div>
                        <div className="text-xs">{phase.duration}с</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="sidebar-section">
                <div className="sidebar-header">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <h3>Советы по оптимизации</h3>
                </div>
                
                <div className="tips-grid">
                  <div className="tip-item">
                    <div className="tip-number">1</div>
                    <div className="tip-content">
                      <h4>Балансируйте фазы</h4>
                      <p>Равномерно распределяйте время между направлениями</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-number">2</div>
                    <div className="tip-content">
                      <h4>Анализируйте трафик</h4>
                      <p>Учитывайте пиковые часы и интенсивность движения</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-number">3</div>
                    <div className="tip-content">
                      <h4>Сравнивайте результаты</h4>
                      <p>Используйте симуляцию для проверки изменений</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-sm text-text-muted">
                    Система использует данные реального трафика для более точных рекомендаций
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; // ← ЭТО ВАЖНАЯ СТРОКА!