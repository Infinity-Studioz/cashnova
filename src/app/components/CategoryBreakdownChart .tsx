'use client';
import { useEffect, useRef } from 'react';
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default function CategoryBreakdownChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data: ChartData<'pie', number[], string> = {
      labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Others'],
      datasets: [
        {
          data: [1200, 800, 400, 300, 250, 550],
          backgroundColor: [
            '#4F46E5',
            '#10B981',
            '#F59E0B',
            '#EC4899',
            '#3B82F6',
            '#64748B',
          ],
          borderWidth: 0,
        },
      ],
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
      },
    };

    const chartInstance = new Chart(ctx, {
      type: 'pie',
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
