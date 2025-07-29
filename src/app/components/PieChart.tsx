"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PieChart() {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const ctx = chartRef.current?.getContext("2d");
        if (!ctx) return;

        const pieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Housing", "Food", "Transport", "Entertainment", "Utilities", "Others"],
                datasets: [
                    {
                        data: [1200, 800, 450, 200, 150, 100],
                        backgroundColor: [
                            "#4f46e5",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#3b82f6",
                            "#6b7280",
                        ],
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            boxWidth: 12,
                            padding: 20,
                        },
                    },
                },
            },
        });

        return () => {
            pieChart.destroy();
        };
    }, []);

    return (
        <div className="h-64">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
