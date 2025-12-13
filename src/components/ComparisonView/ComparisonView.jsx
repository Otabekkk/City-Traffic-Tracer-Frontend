import React from 'react';

const ComparisonView = ({ comparisonData }) => {
  if (!comparisonData) return null;

  const { baseline, custom, comparison, summary } = comparisonData;

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <h3>Результаты сравнения</h3>
        <div className={`summary-badge ${comparison.avg_queue.percent < 0 && comparison.avg_waiting_time.percent < 0 ? 'success' : 'warning'}`}>
          {summary.text}
        </div>
      </div>

      <div className="comparison-grid">
        <div className="metric-card">
          <h4>Средняя длина очереди</h4>
          <div className="metric-values">
            <div className="value-row">
              <span className="label">Базовая:</span>
              <span className="value">{baseline.avg_queue.toFixed(1)} авто</span>
            </div>
            <div className="value-row">
              <span className="label">Ваша:</span>
              <span className="value">{custom.avg_queue.toFixed(1)} авто</span>
            </div>
            <div className={`improvement ${comparison.avg_queue.percent < 0 ? 'positive' : 'negative'}`}>
              <span className="change-text">
                {comparison.avg_queue.percent < 0 ? 'Улучшение' : 'Ухудшение'} на
              </span>
              <span className="change-value">
                {Math.abs(comparison.avg_queue.percent).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h4>Среднее время ожидания</h4>
          <div className="metric-values">
            <div className="value-row">
              <span className="label">Базовая:</span>
              <span className="value">{baseline.avg_waiting_time.toFixed(1)} сек</span>
            </div>
            <div className="value-row">
              <span className="label">Ваша:</span>
              <span className="value">{custom.avg_waiting_time.toFixed(1)} сек</span>
            </div>
            <div className={`improvement ${comparison.avg_waiting_time.percent < 0 ? 'positive' : 'negative'}`}>
              <span className="change-text">
                {comparison.avg_waiting_time.percent < 0 ? 'Улучшение' : 'Ухудшение'} на
              </span>
              <span className="change-value">
                {Math.abs(comparison.avg_waiting_time.percent).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="detailed-analysis">
        <h4>Анализ эффективности</h4>
        <p>
          {comparison.avg_queue.percent < 0 && comparison.avg_waiting_time.percent < 0 
            ? 'Ваша конфигурация эффективнее базовой на ' + 
              Math.abs((comparison.avg_queue.percent + comparison.avg_waiting_time.percent) / 2).toFixed(1) + 
              '%. Рекомендуется сохранить настройки.'
            : 'Попробуйте изменить длительность фаз для улучшения показателей.'}
        </p>
      </div>

      <style jsx>{`
        .comparison-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .comparison-header h3 {
          color: white;
          font-size: 1.25rem;
        }
        
        .summary-badge {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .summary-badge.success {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .summary-badge.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #475569;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
        
        .metric-card h4 {
          color: white;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .metric-values {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .value-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .value-row:last-child {
          border-bottom: none;
        }
        
        .value-row .label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .value-row .value {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .improvement {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .improvement.positive {
          color: #10b981;
        }
        
        .improvement.negative {
          color: #ef4444;
        }
        
        .change-text {
          font-size: 0.875rem;
        }
        
        .change-value {
          font-weight: 600;
          font-size: 1.25rem;
        }
        
        .detailed-analysis {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
        
        .detailed-analysis h4 {
          color: #3b82f6;
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }
        
        .detailed-analysis p {
          color: #cbd5e1;
          line-height: 1.6;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};

export default ComparisonView;