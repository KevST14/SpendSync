"use client";

import { Line, Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import { chartOptions } from "../config/chartConfig";

interface ChartCardProps {
  title: string;
  chartData: ChartData<"line"> | ChartData<"bar">;
  chartType: "line" | "bar";
}

export default function ChartCard({ title, chartData, chartType }: ChartCardProps) {
  return (
    <div className="bg-surface rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105">
      <h3 className="text-secondary mb-4 text-lg">{title}</h3>
      <div className="h-48">
        {chartType === "line" && (
          <Line data={chartData as ChartData<"line">} options={chartOptions} />
        )}
        {chartType === "bar" && (
          <Bar data={chartData as ChartData<"bar">} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
