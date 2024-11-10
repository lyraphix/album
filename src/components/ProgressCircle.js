// src/components/ProgressCircle.js

import React from 'react';
import './ProgressCircle.css';

const ProgressCircle = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-circle">
      <div
        className="circle"
        style={{ background: `conic-gradient(#4d5bf9 ${percentage}%, #d9d9d9 0)` }}
      >
        <div className="inner-circle">
          <span>{`${Math.round(percentage)}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
