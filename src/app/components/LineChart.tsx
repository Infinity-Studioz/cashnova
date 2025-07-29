'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function LineChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    const lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Spending',
            data: [450, 600, 750, 550],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.05)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Budget',
            data: [500, 500, 500, 500],
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
            grid: {
              drawTicks: false
            }
          },
          x: {
            border: {
              display: false
            },
            grid: {
              display: false
            }
          }
        }

      },
    });

    return () => {
      lineChart.destroy();
    };
  }, []);

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
