'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface WeeklySpending {
  week: string;
  spending: number;
  budget: number;
  formattedSpending: string;
  formattedBudget: string;
}

interface LineChartProps {
  data: WeeklySpending[];
  loading?: boolean;
}

export default function LineChart({ data, loading = false }: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Don't render chart if loading or no data
    if (loading || !data || data.length === 0) {
      return;
    }

    // Prepare chart data from real weekly spending data
    const labels = data.map(item => item.week);
    const spendingData = data.map(item => item.spending);
    const budgetData = data.map(item => item.budget);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Spending',
            data: spendingData,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.05)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#4f46e5',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Budget',
            data: budgetData,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0,
            fill: false,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                
                // Format amount in Nigerian Naira
                const formattedAmount = new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
                
                return `${label}: ${formattedAmount}`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
            grid: {
              drawTicks: false,
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              callback: function(value) {
                // Format Y-axis labels in Nigerian Naira (short format)
                const numValue = Number(value);
                if (numValue >= 1000000) {
                  return '₦' + (numValue / 1000000).toFixed(1) + 'M';
                } else if (numValue >= 1000) {
                  return '₦' + (numValue / 1000).toFixed(0) + 'K';
                } else {
                  return '₦' + numValue.toFixed(0);
                }
              },
              font: {
                size: 11,
              },
              color: '#6b7280',
            }
          },
          x: {
            border: {
              display: false
            },
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11,
              },
              color: '#6b7280',
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-medium text-sm">No weekly data yet</p>
          <p className="text-xs mt-1">Add more transactions to see spending trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}