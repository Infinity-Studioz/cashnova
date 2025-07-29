"use client";

import { useEffect, useRef } from "react";

interface ProgressRingProps {
  percentage: number; // e.g., 71
  radius?: number;    // default 40
  strokeWidth?: number; // default 8
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  radius = 40,
  strokeWidth = 8,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const normalizedRadius = radius;
  const circumference = 2 * Math.PI * normalizedRadius;

  useEffect(() => {
    const offset = circumference - (percentage / 100) * circumference;
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [circumference, percentage]);

  return (
    <div className="relative w-24 h-24 mb-4">
      <svg
        className="progress-ring w-full h-full"
        viewBox="0 0 100 100"
      >
        <circle
          className="progress-ring__circle stroke-slate-300"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx="50"
          cy="50"
        />
        <circle
          ref={circleRef}
          className="progress-ring__circle stroke-indigo-600 transition-[stroke-dashoffset] duration-500"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx="50"
          cy="50"
          style={{
            strokeDasharray: `${circumference}`,
            strokeDashoffset: `${circumference}`,
            // transform: "rotate(0deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-slate-500 dark:text-slate-200">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
