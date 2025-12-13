import React from 'react';

const TrafficIntersection = ({ trafficData, currentPhase, simulationStats }) => {
  if (!trafficData?.phases) return null;

  const getPhaseState = () => {
    const phase = trafficData.phases.find(p => p.index === currentPhase);
    if (!phase) return {};
    
    // Берем только первые 4 символа для упрощения
    const state = phase.state.slice(0, 4);
    return {
      north: state[0] || 'r',
      south: state[1] || 'r',
      east: state[2] || 'r',
      west: state[3] || 'r'
    };
  };

  const currentState = getPhaseState();

  const getColor = (state) => {
    switch(state) {
      case 'G': case 'g': return '#10b981'; // green
      case 'y': return '#f59e0b'; // yellow
      case 'r': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div className="intersection-container">
      <div className="intersection-visualization">
        <div className="intersection">
          {/* Дороги */}
          <div className="road horizontal"></div>
          <div className="road vertical"></div>
          
          {/* Светофоры и полосы */}
          <div className="lane north">
            <div 
              className="traffic-light" 
              style={{ backgroundColor: getColor(currentState.north) }}
            ></div>
            <div className="lane-label">Север</div>
          </div>
          
          <div className="lane south">
            <div 
              className="traffic-light" 
              style={{ backgroundColor: getColor(currentState.south) }}
            ></div>
            <div className="lane-label">Юг</div>
          </div>
          
          <div className="lane east">
            <div 
              className="traffic-light" 
              style={{ backgroundColor: getColor(currentState.east) }}
            ></div>
            <div className="lane-label">Восток</div>
          </div>
          
          <div className="lane west">
            <div 
              className="traffic-light" 
              style={{ backgroundColor: getColor(currentState.west) }}
            ></div>
            <div className="lane-label">Запад</div>
          </div>
        </div>
      </div>

      {simulationStats && (
        <div className="intersection-stats">
          <div className="stat">
            <div className="stat-label">Средняя очередь:</div>
            <div className="stat-value">{simulationStats.avg_queue.toFixed(1)} авто</div>
          </div>
          <div className="stat">
            <div className="stat-label">Время ожидания:</div>
            <div className="stat-value">{simulationStats.avg_waiting_time.toFixed(1)} сек</div>
          </div>
          <div className="stat">
            <div className="stat-label">Текущая фаза:</div>
            <div className="stat-value">{currentPhase}</div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .intersection-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .intersection-visualization {
          position: relative;
          width: 100%;
          height: 300px;
          background: #1a202c;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .intersection {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .road {
          position: absolute;
          background: #4a5568;
        }
        
        .road.horizontal {
          top: 50%;
          left: 0;
          right: 0;
          height: 40px;
          transform: translateY(-50%);
        }
        
        .road.vertical {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 40px;
          transform: translateX(-50%);
        }
        
        .lane {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .lane.north {
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .lane.south {
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .lane.east {
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .lane.west {
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .traffic-light {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px currentColor;
        }
        
        .lane-label {
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .intersection-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }
        
        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TrafficIntersection;