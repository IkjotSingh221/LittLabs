import React, { useState, useEffect } from 'react';
import './Analyzer.css';

const GradientSlider = ({ overallScore }) => {
  const [value, setValue] = useState(overallScore);

  useEffect(() => {
    setValue(overallScore);
  }, [overallScore]);

  const getThumbColor = (value) => {
    const percentage = value / 100;
    const red = Math.round(255 * (1 - percentage));
    const green = Math.round(255 * percentage);
    return `rgb(${red}, ${green}, 0)`; // Color transitions from red to green
  };

  return (
    <div className="slider-container">
      <div className="slider-track">
        <div
          className="slider-value-indicator"
          style={{
            left: `${value}%`,
            transform: `translateX(-50%)`,
            backgroundColor: getThumbColor(value),
          }}
        >
          <div
            className="triangle"
            style={{
              borderBottomColor: getThumbColor(value),
            }}
          ></div>
        </div>
      </div>
     
    </div>
  );
};

export default GradientSlider;
