"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  formattedAmount: string;
  color: string;
}

interface PieChartProps {
  data: SpendingCategory[];
  loading?: boolean;
}

export default function PieChart({ data, loading = false }: PieChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Don't render chart if loading or no data
    if (loading || !data || data.length === 0) {
      return;
    }

    // Prepare chart data from real spending categories
    const labels = data.map(item => item.category);
    const amounts = data.map(item => item.amount);
    const colors = data.map(item => item.color);

    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: amounts,
            backgroundColor: colors,
            borderWidth: 0,
            hoverBorderWidth: 2,
            hoverBorderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide legend since categories are shown separately
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                // Format amount in Nigerian Naira
                const formattedAmount = new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
                
                return `${label}: ${formattedAmount} (${percentage}%)`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
          }
        },
        animation: {
          animateRotate: true,
          animateScale: false,
          duration: 1000,
        },
        interaction: {
          intersect: false,
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
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-medium text-sm">No spending data yet</p>
          <p className="text-xs mt-1">Add transactions to see your spending breakdown</p>
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