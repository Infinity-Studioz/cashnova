'use client';
import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function MonthlyComparisonChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data: ChartData<'line'> = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'May 2023',
          data: [800, 950, 1100, 650],
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'April 2023',
          data: [700, 850, 900, 750],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        y: {
          beginAtZero: true,
          border: {
            display: false, // Hides the axis border
          },
          grid: {
            display: true, // Shows grid lines
          },
        },
        x: {
          border: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
      },
    };

    const chartInstance = new Chart(ctx, {
      type: 'line',
      data,
      options,
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
