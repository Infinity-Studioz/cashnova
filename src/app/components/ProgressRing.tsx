// // src/app/components/ProgressRing.tsx
// "use client";

// import { useEffect, useRef } from "react";

// interface ProgressRingProps {
//   percentage: number; // e.g., 71
//   radius?: number;    // default 40
//   strokeWidth?: number; // default 8
// }

// const ProgressRing: React.FC<ProgressRingProps> = ({
//   percentage,
//   radius = 40,
//   strokeWidth = 8,
// }) => {
//   const circleRef = useRef<SVGCircleElement>(null);
//   const normalizedRadius = radius;
//   const circumference = 2 * Math.PI * normalizedRadius;

//   useEffect(() => {
//     const offset = circumference - (percentage / 100) * circumference;
//     if (circleRef.current) {
//       circleRef.current.style.strokeDasharray = `${circumference}`;
//       circleRef.current.style.strokeDashoffset = `${offset}`;
//     }
//   }, [circumference, percentage]);

//   return (
//     <div className="relative w-24 h-24 mb-4">
//       <svg
//         className="progress-ring w-full h-full"
//         viewBox="0 0 100 100"
//       >
//         <circle
//           className="progress-ring__circle stroke-slate-300"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           r={normalizedRadius}
//           cx="50"
//           cy="50"
//         />
//         <circle
//           ref={circleRef}
//           className="progress-ring__circle stroke-indigo-600 transition-[stroke-dashoffset] duration-500"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           r={normalizedRadius}
//           cx="50"
//           cy="50"
//           style={{
//             strokeDasharray: `${circumference}`,
//             strokeDashoffset: `${circumference}`,
//             // transform: "rotate(0deg)",
//             transformOrigin: "center",
//           }}
//         />
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-xl font-bold text-slate-500 dark:text-slate-200">
//           {percentage}%
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ProgressRing;

"use client";

import { useEffect, useRef } from "react";

interface ProgressRingProps {
  percentage: number; // e.g., 71
  radius?: number;    // default 40
  strokeWidth?: number; // default 8
  size?: 'sm' | 'md' | 'lg' | 'xl'; // preset sizes
  status?: 'good' | 'warning' | 'exceeded'; // budget health status
  label?: string; // accessibility label
  showPercentage?: boolean; // show percentage text
  animate?: boolean; // enable/disable animation
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  radius = 40,
  strokeWidth = 8,
  size = 'md',
  status = 'good',
  label = 'Budget progress',
  showPercentage = true,
  animate = true
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const normalizedRadius = radius;
  const circumference = 2 * Math.PI * normalizedRadius;

  // Size presets for different use cases
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  // Color coding based on budget health status
  const getStatusColors = () => {
    switch (status) {
      case 'exceeded':
        return {
          progress: 'stroke-red-500',
          background: 'stroke-red-100 dark:stroke-red-900',
          text: 'text-red-600 dark:text-red-400'
        };
      case 'warning':
        return {
          progress: 'stroke-yellow-500',
          background: 'stroke-yellow-100 dark:stroke-yellow-900',
          text: 'text-yellow-600 dark:text-yellow-400'
        };
      default: // good
        return {
          progress: 'stroke-indigo-600 dark:stroke-indigo-500',
          background: 'stroke-slate-200 dark:stroke-slate-700',
          text: 'text-slate-600 dark:text-slate-300'
        };
    }
  };

  const colors = getStatusColors();

  useEffect(() => {
    const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
    
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      
      if (animate) {
        // Start from top and animate smoothly
        circleRef.current.style.strokeDashoffset = `${circumference}`;
        
        // Use requestAnimationFrame for smooth animation
        const animateProgress = () => {
          if (circleRef.current) {
            circleRef.current.style.strokeDashoffset = `${offset}`;
          }
        };
        
        // Small delay to ensure initial state is set
        setTimeout(animateProgress, 50);
      } else {
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }
    }
  }, [circumference, percentage, animate]);

  // Determine status text for Nigerian context
  const getStatusText = () => {
    if (percentage >= 100) return 'Budget Exceeded!';
    if (percentage >= 90) return 'Near Budget Limit';
    if (percentage >= 75) return 'On Track';
    if (percentage >= 50) return 'Good Progress';
    return 'Just Started';
  };

  return (
    <div className={`relative ${sizeClasses[size]} mb-4`}>
      <svg
        className="progress-ring w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${label}: ${percentage}% complete`}
      >
        {/* Background circle */}
        <circle
          className={`progress-ring__background ${colors.background} transition-colors duration-300`}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx="50"
          cy="50"
        />
        
        {/* Progress circle */}
        <circle
          ref={circleRef}
          className={`progress-ring__progress ${colors.progress} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx="50"
          cy="50"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${circumference}`,
            strokeDashoffset: `${circumference}`,
            transformOrigin: "center",
          }}
        />
        
        {/* Glow effect for exceeded status */}
        {status === 'exceeded' && (
          <circle
            className="progress-ring__glow stroke-red-500 opacity-30"
            strokeWidth={strokeWidth + 2}
            fill="transparent"
            r={normalizedRadius}
            cx="50"
            cy="50"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${circumference}`,
              strokeDashoffset: circumference - (Math.min(percentage, 100) / 100) * circumference,
              filter: 'blur(2px)',
            }}
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className={`${textSizes[size]} font-bold ${colors.text} transition-colors duration-300`}>
            {Math.round(percentage)}%
          </span>
        )}
        
        {size === 'lg' || size === 'xl' ? (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
            {getStatusText()}
          </span>
        ) : null}
      </div>

      {/* Status indicator dot */}
      {status !== 'good' && (
        <div className="absolute -top-1 -right-1">
          <div className={`w-3 h-3 rounded-full ${
            status === 'exceeded' ? 'bg-red-500' : 'bg-yellow-500'
          } border-2 border-white dark:border-gray-800 animate-pulse`} />
        </div>
      )}

      {/* Accessibility */}
      <div className="sr-only">
        Budget progress: {percentage}% of allocated amount used. 
        Status: {getStatusText()}
      </div>
    </div>
  );
};

export default ProgressRing;