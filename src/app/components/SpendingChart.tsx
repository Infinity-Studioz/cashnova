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

// src/app/components/SpendingChart.tsx
"use client";

import { useEffect, useRef } from "react";
import { Chart, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

interface CategoryBudget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'good' | 'warning' | 'exceeded';
}

interface SpendingChartProps {
  categoryBudgets?: CategoryBudget[];
  isDarkMode?: boolean;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ 
  categoryBudgets = [], 
  isDarkMode = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spendingChartRef = useRef<Chart | null>(null);

  // Nigerian category prioritization for chart display
  const NIGERIAN_CATEGORY_PRIORITY = [
    'Rent/Housing', 'Food & Dining', 'Transport', 'Bills', 
    'Family Support', 'School Fees', 'Entertainment', 'Health/Medical'
  ];

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clean up previous chart
    if (spendingChartRef.current) {
      spendingChartRef.current.destroy();
    }

    // Prepare chart data from real budget data or fallback to Nigerian mock data
    const chartData = getChartData();

    // Dark mode color configuration
    const colors = {
      budgetBar: isDarkMode ? "#64748b" : "#596679",
      spentBar: "#6366f1",
      gridColor: isDarkMode ? "#374151" : "#e5e7eb",
      textColor: isDarkMode ? "#d1d5db" : "#374151",
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff"
    };

    spendingChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Budget",
            data: chartData.budgetData,
            backgroundColor: colors.budgetBar,
            borderRadius: 4,
            maxBarThickness: 40,
          },
          {
            label: "Spent",
            data: chartData.spentData,
            backgroundColor: colors.spentBar,
            borderRadius: 4,
            maxBarThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { 
              display: false 
            },
            ticks: {
              color: colors.textColor,
              font: {
                size: 12
              },
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            beginAtZero: true,
            border: {
              display: false,
            },
            grid: {
              display: true,
              color: colors.gridColor,
            },
            ticks: {
              color: colors.textColor,
              callback: (value: number | string) => {
                const numValue = Number(value);
                if (numValue >= 1000000) {
                  return `₦${(numValue / 1000000).toFixed(1)}M`;
                } else if (numValue >= 1000) {
                  return `₦${(numValue / 1000).toFixed(0)}k`;
                } else {
                  return `₦${numValue}`;
                }
              },
            },
          }
        },
        plugins: {
          legend: {
            position: "top" as const,
            align: "end" as const,
            labels: {
              color: colors.textColor,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 12,
                weight: '500'
              }
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            titleColor: isDarkMode ? "#f3f4f6" : "#111827",
            bodyColor: isDarkMode ? "#d1d5db" : "#374151",
            borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function (context) {
                const value = context.raw as number;
                const datasetLabel = context.dataset.label;
                
                // Add percentage for spent vs budget
                if (datasetLabel === 'Spent' && chartData.budgetData[context.dataIndex]) {
                  const budget = chartData.budgetData[context.dataIndex];
                  const percentage = budget > 0 ? ((value / budget) * 100).toFixed(1) : '0';
                  return `${datasetLabel}: ₦${value.toLocaleString()} (${percentage}%)`;
                }
                
                return `${datasetLabel}: ₦${value.toLocaleString()}`;
              },
              afterLabel: function(context) {
                if (context.dataset.label === 'Spent') {
                  const categoryData = categoryBudgets[context.dataIndex];
                  if (categoryData) {
                    const remaining = categoryData.remaining;
                    const status = categoryData.status;
                    
                    let statusText = '';
                    if (status === 'exceeded') statusText = ' (Over Budget!)';
                    else if (status === 'warning') statusText = ' (Near Limit)';
                    else statusText = ' (On Track)';
                    
                    return `Remaining: ₦${remaining.toLocaleString()}${statusText}`;
                  }
                }
                return '';
              }
            },
          },
        },
        // Enhanced animations
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        // Responsive behavior
        onResize: (chart, size) => {
          // Adjust font sizes based on chart size
          if (size.width < 400) {
            chart.options.scales!.x!.ticks!.font = { size: 10 };
            chart.options.scales!.y!.ticks!.font = { size: 10 };
          }
        }
      },
    });

    return () => {
      spendingChartRef.current?.destroy();
    };
  }, [categoryBudgets, isDarkMode]);

  const getChartData = () => {
    if (categoryBudgets && categoryBudgets.length > 0) {
      // Sort categories by Nigerian priority and take top 6
      const sortedCategories = [...categoryBudgets]
        .sort((a, b) => {
          const aPriority = NIGERIAN_CATEGORY_PRIORITY.indexOf(a.category);
          const bPriority = NIGERIAN_CATEGORY_PRIORITY.indexOf(b.category);
          
          // If both categories are in priority list, sort by priority
          if (aPriority !== -1 && bPriority !== -1) {
            return aPriority - bPriority;
          }
          // If only one is in priority list, prioritize it
          if (aPriority !== -1) return -1;
          if (bPriority !== -1) return 1;
          // If neither is in priority list, sort alphabetically
          return a.category.localeCompare(b.category);
        })
        .slice(0, 6);

      return {
        labels: sortedCategories.map(cat => {
          // Truncate long category names for better display
          return cat.category.length > 12 
            ? cat.category.substring(0, 12) + '...' 
            : cat.category;
        }),
        budgetData: sortedCategories.map(cat => cat.allocated),
        spentData: sortedCategories.map(cat => cat.spent)
      };
    }

    // Fallback to Nigerian-context mock data
    return {
      labels: ["Housing", "Food", "Transport", "Bills", "Family", "Others"],
      budgetData: [120000, 60000, 40000, 30000, 25000, 25000], // Updated to Nigerian amounts
      spentData: [115000, 45000, 35000, 28000, 20000, 15000]
    };
  };

  return (
    <div className="h-64 relative">
      <canvas ref={canvasRef} id="spendingChart" />
      
      {/* Loading state overlay */}
      {categoryBudgets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading Nigerian market data...</p>
          </div>
        </div>
      )}

      {/* Chart legend for mobile */}
      <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-600 dark:text-gray-400 sm:hidden">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-600 dark:bg-gray-400 rounded-full mr-2"></div>
          <span>Budget</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
          <span>Spent</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;