// src/components/ProgressCircle.js

import React from 'react';
import './ProgressCircle.css';

const ProgressCircle = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-circle">
      <svg className="progress-ring" width="120" height="120">
        <circle
          className="progress-ring__circle"
          stroke="black" // Changed from green to black
          strokeWidth="4"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          style={{
            strokeDasharray: `${2 * Math.PI * 52}`,
            strokeDashoffset: `${2 * Math.PI * 52 * (1 - percentage / 100)}`,
            transition: 'stroke-dashoffset 0.35s',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="progress-circle__text">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export default ProgressCircle;
