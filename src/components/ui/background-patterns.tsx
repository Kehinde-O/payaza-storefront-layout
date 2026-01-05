import React from 'react';

export const DotPattern = ({ className = "", width = 20, height = 20, cx = 1, cy = 1, cr = 1, color = "#CBD5E1" }) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="dot-pattern"
        x="0"
        y="0"
        width={width}
        height={height}
        patternUnits="userSpaceOnUse"
      >
        <circle cx={cx} cy={cy} r={cr} fill={color} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dot-pattern)" />
  </svg>
);

export const GridPattern = ({ className = "", width = 40, height = 40, strokeDasharray = "0", stroke = "#E2E8F0" }) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="grid-pattern"
        x="0"
        y="0"
        width={width}
        height={height}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M ${width} 0 L 0 0 0 ${height}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray={strokeDasharray}
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
);

export const WavePattern = ({ className = "", color = "#F1F5F9" }) => (
  <svg
    className={className}
    viewBox="0 0 1440 320"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      fill={color}
      fillOpacity="1"
      d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
);

export const CircleBlur = ({ className = "", color = "rgba(99, 102, 241, 0.15)", style }: { className?: string; color?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute rounded-full filter blur-3xl ${className}`}
    style={{ backgroundColor: color, ...style }}
  />
);

