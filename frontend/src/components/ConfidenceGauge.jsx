import React from 'react';

const ConfidenceGauge = ({ score = 84, verdict = 'Authentic' }) => {
  const radius = 56;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#E0A96D'; // Tan default
  let glowColor = 'rgba(224, 169, 109, 0.4)';

  if (verdict === 'Authentic') {
    strokeColor = '#10B981'; // Emerald
    glowColor = 'rgba(16, 185, 129, 0.4)';
  } else if (verdict === 'Likely False') {
    strokeColor = '#F43F5E'; // Crimson
    glowColor = 'rgba(244, 63, 94, 0.4)';
  } else {
    strokeColor = '#F59E0B'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 transition-all duration-1000 ease-out"
        style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
      >
        {/* Track */}
        <circle
          stroke="rgba(255, 255, 255, 0.08)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Fill Arc */}
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black tracking-tight text-white font-mono">
          {score}%
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-tan-300 -mt-0.5">
          Confidence
        </span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
