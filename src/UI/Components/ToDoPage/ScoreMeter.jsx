import React, { useState, useEffect } from 'react';
import './ScoreMeter.css';

const ConcentricCircularProgressBars = ({ percentages }) => {
    const [offsets, setOffsets] = useState([0, 0, 0]);

    useEffect(() => {
        const progressOffsets = percentages.map(percentage => (1 - percentage / 100));
        setOffsets(progressOffsets);
    }, [percentages]);

    return (
        <div className="progress-circles">
            <svg className="progress-circles__svg" viewBox="0 0 200 200">
                <circle
                    className="progress-circles__bg"
                    cx="100"
                    cy="100" 
                    r="70" 
                />
                <circle
                    className="progress-circles__bg"
                    cx="100"
                    cy="100"
                    r="55"
                />
                <circle
                    className="progress-circles__bg"
                    cx="100"
                    cy="100"
                    r="40"
                />

                <circle
                    className="progress-circles__progress progress-circles__progress--outer"
                    cx="100"
                    cy="100"
                    r="70"
                    style={{ strokeDashoffset: offsets[0]*440, strokeDasharray: 440 }}
                />
                <circle
                    className="progress-circles__progress progress-circles__progress--middle"
                    cx="100"
                    cy="100"
                    r="55"
                    style={{ strokeDashoffset: offsets[1]*346, strokeDasharray: 346 }}
                />
                <circle
                    className="progress-circles__progress progress-circles__progress--inner"
                    cx="100"
                    cy="100"
                    r="40"
                    style={{ strokeDashoffset: offsets[2]*251, strokeDasharray: 251 }}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    className="progress-circles__text"
                >
                    {percentages[0]}%
                </text>
            </svg>
        </div>
    );
};

export default ConcentricCircularProgressBars;