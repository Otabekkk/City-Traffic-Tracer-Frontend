import React from 'react';
import { Car, Truck, Bicycle } from 'lucide-react';

const TrafficLane = ({ direction, state, vehicleCount, position }) => {
  const getLaneColor = () => {
    switch(state) {
      case 'G':
      case 'g':
        return 'border-green-500 bg-green-500/10';
      case 'y':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'r':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const renderVehicles = () => {
    const vehicles = [];
    const icons = [Car, Truck, Bicycle];
    
    for (let i = 0; i < Math.min(vehicleCount, 8); i++) {
      const Icon = icons[i % icons.length];
      const animationClass = position === 'north' || position === 'south' ? 'animate-move-horizontal' : 'animate-move-vertical';
      
      vehicles.push(
        <div
          key={i}
          className={`absolute ${animationClass}`}
          style={{
            [position === 'north' || position === 'south' ? 'left' : 'top']: `${(i + 1) * 10}%`,
            animationDelay: `${i * 0.3}s`
          }}
        >
          <Icon className="w-8 h-8 text-white/80" />
        </div>
      );
    }
    return vehicles;
  };

  const laneClasses = `lane ${position} ${getLaneColor()}`;

  return (
    <div className={laneClasses}>
      <div className="lane-label">
        {direction.toUpperCase()}: {vehicleCount} авто
      </div>
      <div className="absolute inset-0 overflow-hidden">
        {renderVehicles()}
      </div>
    </div>
  );
};

export default TrafficLane;