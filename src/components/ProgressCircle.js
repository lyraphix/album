// src/components/ProgressCircle.js

import React from 'react';
import './ProgressCircle.css';

const ProgressCircle = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-circle-container">
      <div className="progress-circle">
        <div
          className="progress-circle-inner"
          style={{
            background: `conic-gradient(#4caf50 ${percentage}%, #ddd ${percentage}% 100%)`,
          }}
        ></div>
        <div className="progress-circle-text">{Math.round(percentage)}%</div>
      </div>
    </div>
  );
};

export default ProgressCircle;
