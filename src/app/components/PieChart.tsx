// "use client";
// import { useEffect, useRef } from "react";
// import Chart from "chart.js/auto";

// interface SpendingCategory {
//   category: string;
//   amount: number;
//   percentage: number;
//   formattedAmount: string;
//   color: string;
// }

// interface PieChartProps {
//   data: SpendingCategory[];
//   loading?: boolean;
// }

// export default function PieChart({ data, loading = false }: PieChartProps) {
//   const chartRef = useRef<HTMLCanvasElement | null>(null);
//   const chartInstanceRef = useRef<Chart | null>(null);

//   useEffect(() => {
//     const ctx = chartRef.current?.getContext("2d");
//     if (!ctx) return;

//     // Destroy existing chart if it exists
//     if (chartInstanceRef.current) {
//       chartInstanceRef.current.destroy();
//     }

//     // Don't render chart if loading or no data
//     if (loading || !data || data.length === 0) {
//       return;
//     }

//     // Prepare chart data from real spending categories
//     const labels = data.map(item => item.category);
//     const amounts = data.map(item => item.amount);
//     const colors = data.map(item => item.color);

//     chartInstanceRef.current = new Chart(ctx, {
//       type: "pie",
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             data: amounts,
//             backgroundColor: colors,
//             borderWidth: 0,
//             hoverBorderWidth: 2,
//             hoverBorderColor: '#ffffff',
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false, // Hide legend since categories are shown separately
//           },
//           tooltip: {
//             callbacks: {
//               label: function(context) {
//                 const label = context.label || '';
//                 const value = context.parsed;
//                 const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//                 const percentage = ((value / total) * 100).toFixed(1);

//                 // Format amount in Nigerian Naira
//                 const formattedAmount = new Intl.NumberFormat('en-NG', {
//                   style: 'currency',
//                   currency: 'NGN',
//                   minimumFractionDigits: 0,
//                   maximumFractionDigits: 0
//                 }).format(value);

//                 return `${label}: ${formattedAmount} (${percentage}%)`;
//               }
//             },
//             backgroundColor: 'rgba(0, 0, 0, 0.8)',
//             titleColor: 'white',
//             bodyColor: 'white',
//             borderColor: 'rgba(255, 255, 255, 0.1)',
//             borderWidth: 1,
//           }
//         },
//         animation: {
//           animateRotate: true,
//           animateScale: false,
//           duration: 1000,
//         },
//         interaction: {
//           intersect: false,
//         },
//       },
//     });

//     return () => {
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.destroy();
//         chartInstanceRef.current = null;
//       }
//     };
//   }, [data, loading]);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="h-64 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   // Show empty state if no data
//   if (!data || data.length === 0) {
//     return (
//       <div className="h-64 flex items-center justify-center text-gray-400">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
//             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <p className="font-medium text-sm">No spending data yet</p>
//           <p className="text-xs mt-1">Add transactions to see your spending breakdown</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-64">
//       <canvas ref={chartRef}></canvas>
//     </div>
//   );
// }

// src/components/PieChart.tsx
"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  formattedAmount: string;
  color: string;
  isOverBudget?: boolean;
  budgetAmount?: number;
  transactionCount?: number;
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

    // Prepare chart data with enhanced Nigerian context
    const labels = data.map(item => item.category);
    const amounts = data.map(item => item.amount);
    const colors = data.map(item => item.color);
    const borderColors = data.map(item => item.isOverBudget ? '#ef4444' : '#ffffff');

    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: amounts,
            backgroundColor: colors,
            borderWidth: data.map(item => item.isOverBudget ? 3 : 1),
            borderColor: borderColors,
            hoverBorderWidth: 3,
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
              title: function (context) {
                const dataIndex = context[0].dataIndex;
                const item = data[dataIndex];
                return item.category + (item.isOverBudget ? ' (Over Budget!)' : '');
              },
              label: function (context) {
                const dataIndex = context.dataIndex;
                const item = data[dataIndex];
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);

                // Format amount in Nigerian Naira
                const formattedAmount = new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value).replace('NGN', '₦');

                return `Amount: ${formattedAmount} (${percentage}%)`;
              },
              afterLabel: function (context) {
                const dataIndex = context.dataIndex;
                const item = data[dataIndex];
                const additionalInfo = [];

                if (item.transactionCount) {
                  additionalInfo.push(`${item.transactionCount} transactions`);
                }

                if (item.budgetAmount && item.budgetAmount > 0) {
                  const budgetFormatted = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 0,
                  }).format(item.budgetAmount).replace('NGN', '₦');
                  additionalInfo.push(`Budget: ${budgetFormatted}`);

                  const utilizationPercentage = ((item.amount / item.budgetAmount) * 100).toFixed(1);
                  additionalInfo.push(`Utilization: ${utilizationPercentage}%`);
                }

                return additionalInfo;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            footerColor: '#cbd5e0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
          }
        },
        animation: {
          animateRotate: true,
          animateScale: false,
          duration: 1200,
          easing: 'easeInOutQuart',
        },
        interaction: {
          intersect: false,
        },
        elements: {
          arc: {
            hoverBackgroundColor: function (context) {
              const originalColor = context.element.options.backgroundColor;
              // Darken the color on hover
              return Chart.helpers.color(originalColor).alpha(0.8).rgbString();
            }
          }
        }
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
          <p className="text-sm text-gray-500">Loading spending data...</p>
        </div>
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
          <p className="font-medium text-sm text-gray-600 mb-1">No spending data yet</p>
          <p className="text-xs text-gray-500 mb-3">
            Add transactions to see your spending breakdown
          </p>
          <button
            onClick={() => window.location.href = '/addTransaction'}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Add Your First Transaction →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 relative">
      <canvas ref={chartRef}></canvas>
      {/* Overlay indicators for over-budget categories */}
      {data.some(item => item.isOverBudget) && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            Over Budget
          </div>
        </div>
      )}
    </div>
  );
}