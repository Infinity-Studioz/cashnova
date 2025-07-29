// 'use client';

// import { useEffect, useRef } from 'react';
// import {
//   Chart,
//   BarController,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// export default function SpendingChart() {
//   const chartRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const ctx = chartRef.current?.getContext('2d');
//     if (!ctx) return;

//     const spendingChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Others'],
//         datasets: [
//           {
//             label: 'Budget',
//             data: [80000, 40000, 25000, 20000, 15000, 20000],
//             backgroundColor: '#e2e8f0',
//             borderRadius: 4,
//           },
//           {
//             label: 'Spent',
//             data: [72000, 32000, 18500, 8000, 5500, 8500],
//             backgroundColor: '#6366f1',
//             borderRadius: 4,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             grid: { display: false },
//           },
//           y: {
//             beginAtZero: true,
//             grid: { borderWidth: 0 },
//             ticks: {
//               callback: (value: number) => "₦" + value / 1000 + "k"
//             },
//           },
//         },
//         plugins: {
//           legend: { position: 'top', align: 'end' }
//         },
//         tooltip: {
//           callbacks: {
//             label: (context: any) => {
//               context.dataset.label + ": ₦" + `${Number(context.raw)}`.toLocaleString()
//             }
//           }

//         },
//       },
//     })
//     return () => spendingChart.destroy();
//   }, []);

//   return (
//     <div className="h-64">
//       <canvas ref={chartRef} />
//     </div>
//   );
// };


"use client";

import { useEffect, useRef } from "react";
import { Chart, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

const SpendingChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spendingChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clean up previous chart
    if (spendingChartRef.current) {
      spendingChartRef.current.destroy();
    }

    spendingChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Housing", "Food", "Transport", "Entertainment", "Health", "Others"],
        datasets: [
          {
            label: "Budget",
            data: [80000, 40000, 25000, 20000, 15000, 20000],
            // backgroundColor: "#e2e8f0",
            backgroundColor: "#596679",
            borderRadius: 4,
          },
          {
            label: "Spent",
            data: [72000, 32000, 18500, 8000, 5500, 8500],
            backgroundColor: "#6366f1",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            border: {
              display: false,
            },
            grid: {
              display: true,
            },
            ticks: {
              callback: (value: number | string) => `₦${Number(value) / 1000}k`,
            },
          }
        },
        plugins: {
          legend: {
            position: "top",
            align: "end",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ₦${(context.raw as number).toLocaleString()}`;
              },
            },
          },
        },
      },
    });

    return () => {
      spendingChartRef.current?.destroy();
    };
  }, []);

  return (
    <div className="h-64 relative">
      <canvas ref={canvasRef} id="spendingChart" />
    </div>
  );
};

export default SpendingChart;
