import React, { useState, useEffect } from 'react';

const PhaseEditor = ({ phases, onSave }) => {
  const [editedPhases, setEditedPhases] = useState({});
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (phases && phases.length > 0) {
      const initialPhases = {};
      phases.forEach(phase => {
        initialPhases[phase.index] = phase.duration;
      });
      setEditedPhases(initialPhases);
      updateTotalTime(initialPhases);
    }
  }, [phases]);

  const updateTotalTime = (phasesObj) => {
    const total = Object.values(phasesObj).reduce((sum, dur) => sum + dur, 0);
    setTotalTime(total);
  };

  const handleChange = (phaseIndex, value) => {
    const newDuration = Math.max(5, Math.min(120, parseInt(value) || 5));
    const newPhases = { ...editedPhases, [phaseIndex]: newDuration };
    setEditedPhases(newPhases);
    updateTotalTime(newPhases);
  };

  const handleReset = () => {
    const resetPhases = {};
    phases.forEach(phase => {
      resetPhases[phase.index] = phase.duration;
    });
    setEditedPhases(resetPhases);
    updateTotalTime(resetPhases);
  };

  const getPhaseDescription = (state) => {
    // Упрощаем описание
    if (state.includes('G') || state.includes('g')) {
      return 'Зеленый сигнал';
    } else if (state.includes('y')) {
      return 'Желтый сигнал';
    } else {
      return 'Красный сигнал';
    }
  };

  if (!phases || phases.length === 0) {
    return (
      <div className="phase-editor">
        <p>Нет данных о фазах светофора</p>
      </div>
    );
  }

  return (
    <div className="phase-editor">
      <div className="editor-header">
        <h3>Редактор фаз светофора</h3>
        <div className="total-time">
          <span>Общее время цикла: </span>
          <strong>{totalTime} сек</strong>
        </div>
      </div>

      <div className="phases-grid">
        {phases.map((phase) => (
          <div key={phase.index} className="phase-card">
            <div className="phase-header">
              <div className="phase-number">Фаза {phase.index}</div>
              <div className="phase-state">{phase.state.slice(0, 4)}...</div>
            </div>
            
            <div className="phase-description">
              {getPhaseDescription(phase.state)}
            </div>
            
            <div className="phase-control">
              <label>
                Длительность (сек):
                <div className="duration-control">
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={editedPhases[phase.index] || ''}
                    onChange={(e) => handleChange(phase.index, e.target.value)}
                    className="duration-input"
                  />
                  <span className="original-duration">
                    было: {phase.duration}
                  </span>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="editor-actions">
        <button onClick={handleReset} className="btn-reset">
          Сбросить
        </button>
        <button onClick={() => onSave(editedPhases)} className="btn-save">
          Сравнить с базовой конфигурацией
        </button>
      </div>

      <style jsx>{`
        .phase-editor {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .editor-header h3 {
          color: white;
          font-size: 1.25rem;
        }
        
        .total-time {
          background: rgba(59, 130, 246, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          color: #3b82f6;
          font-weight: 600;
        }
        
        .phases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .phase-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #475569;
          border-radius: 0.5rem;
          padding: 1rem;
          transition: all 0.3s ease;
        }
        
        .phase-card:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        
        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .phase-number {
          font-weight: 600;
          color: white;
          font-size: 1.1rem;
        }
        
        .phase-state {
          font-family: monospace;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }
        
        .phase-description {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        
        .phase-control label {
          display: block;
          color: #cbd5e1;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .duration-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .duration-input {
          flex: 1;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid #475569;
          border-radius: 0.25rem;
          color: white;
          font-size: 1rem;
        }
        
        .duration-input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .original-duration {
          font-size: 0.875rem;
          color: #94a3b8;
          white-space: nowrap;
        }
        
        .editor-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .btn-reset, .btn-save {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-reset {
          background: #475569;
          color: white;
        }
        
        .btn-reset:hover {
          background: #4b5563;
        }
        
        .btn-save {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          flex: 1;
        }
        
        .btn-save:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default PhaseEditor;