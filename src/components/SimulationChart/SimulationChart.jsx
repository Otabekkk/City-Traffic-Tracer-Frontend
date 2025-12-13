import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Clock } from 'lucide-react';

const SimulationChart = ({ baselineData, customData, type = 'queue' }) => {
  const [chartType, setChartType] = useState('line');

  if (!baselineData?.timeline || !customData?.timeline) {
    return (
      <div className="chart-container">
        <div className="empty-state">
          <BarChart3 className="w-16 h-16 mx-auto mb-4" />
          <p className="text-text-muted">Данные для графика отсутствуют</p>
        </div>
      </div>
    );
  }

  const prepareData = () => {
    const data = [];
    const maxLength = Math.max(
      baselineData.timeline[type].length,
      customData.timeline[type].length
    );

    for (let i = 0; i < maxLength; i++) {
      data.push({
        time: i,
        baseline: baselineData.timeline[type][i] || 0,
        custom: customData.timeline[type][i] || 0,
        phase: baselineData.timeline.phase[i] || 0
      });
    }
    return data;
  };

  const data = prepareData();
  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  const getImprovement = () => {
    const baselineAvg = baselineData[`avg_${type}`];
    const customAvg = customData[`avg_${type}`];
    if (!baselineAvg || baselineAvg === 0) return 0;
    const percent = ((customAvg - baselineAvg) / baselineAvg * 100);
    return percent;
  };

  const improvement = getImprovement();
  const isImproved = improvement < 0;

  const getTitle = () => {
    switch(type) {
      case 'queue': return 'Длина очереди';
      case 'waiting_time': return 'Время ожидания';
      default: return 'Показатель';
    }
  };

  const getUnit = () => {
    switch(type) {
      case 'queue': return 'авто';
      case 'waiting_time': return 'сек';
      default: return '';
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{getTitle()}</h3>
          <p className="text-text-muted text-sm">Сравнение базового и настроенного сценариев</p>
        </div>
        
        <div className="chart-controls">
          <div className={`improvement-badge ${isImproved ? 'positive' : 'negative'}`}>
            {isImproved ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <TrendingUp className="w-5 h-5" />
            )}
            <div>
              <div className="text-xs">Изменение</div>
              <div className="text-lg font-bold">
                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="chart-type-toggle">
            <button
              onClick={() => setChartType('line')}
              className={chartType === 'line' ? 'active' : ''}
            >
              Линии
            </button>
            <button
              onClick={() => setChartType('area')}
              className={chartType === 'area' ? 'active' : ''}
            >
              Области
            </button>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              label={{ value: 'Время (сек)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              label={{ 
                value: type === 'queue' ? 'Автомобили' : 'Секунды', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#9CA3AF'
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem'
              }}
              formatter={(value) => [value.toFixed(1), getUnit()]}
              labelFormatter={(label) => `Время: ${label} сек`}
            />
            <Legend />
            {chartType === 'area' ? (
              <>
                <Area 
                  type="monotone" 
                  dataKey="baseline" 
                  name="Базовый сценарий"
                  stroke="#3B82F6" 
                  fill="url(#colorBaseline)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="custom" 
                  name="Настроенный сценарий"
                  stroke="#8B5CF6" 
                  fill="url(#colorCustom)"
                  strokeWidth={2}
                />
              </>
            ) : (
              <>
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  name="Базовый сценарий"
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="custom" 
                  name="Настроенный сценарий"
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}
            <defs>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      <div className="chart-stats">
        <div className="chart-stat">
          <div className="chart-stat-header">
            <div className="chart-stat-name">Среднее значение (базовый)</div>
            <div className="chart-stat-dot bg-blue-500"></div>
          </div>
          <div className="chart-stat-value">
            {baselineData[`avg_${type}`].toFixed(1)} {getUnit()}
          </div>
          <div className="chart-stat-max">
            Максимум: {Math.max(...baselineData.timeline[type]).toFixed(1)} {getUnit()}
          </div>
        </div>

        <div className="chart-stat">
          <div className="chart-stat-header">
            <div className="chart-stat-name">Среднее значение (настроенный)</div>
            <div className="chart-stat-dot bg-purple-500"></div>
          </div>
          <div className="chart-stat-value">
            {customData[`avg_${type}`].toFixed(1)} {getUnit()}
          </div>
          <div className="chart-stat-max">
            Максимум: {Math.max(...customData.timeline[type]).toFixed(1)} {getUnit()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationChart;