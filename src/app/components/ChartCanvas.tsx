"use client";

import type { ReactNode } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
);

const GRID = "rgba(255, 255, 255, 0.08)";
const TICK = "#b3b3b3";
const SURFACE = "#1a1a2e";
const DEFAULT_PALETTE = ["#4a00e0", "#8e2de2", "#00fff0", "#ffd700", "#ff4757"];

import type { ChartProps } from "./Chart";

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const moneyAxes = {
  x: { grid: { color: GRID }, ticks: { color: TICK } },
  y: {
    grid: { color: GRID },
    ticks: {
      color: TICK,
      callback: (value: string | number) => `£${value}`,
    },
  },
};

export default function ChartCanvas({
  kind,
  labels,
  values,
  seriesLabel = "",
  color = "#00fff0",
  palette = DEFAULT_PALETTE,
  height = 260,
}: ChartProps) {
  const wrap = (node: ReactNode) => <div style={{ height }}>{node}</div>;

  if (kind === "doughnut") {
    const options: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { color: TICK } } },
    };
    return wrap(
      <Doughnut
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: seriesLabel,
              data: values,
              backgroundColor: palette,
              borderColor: SURFACE,
              borderWidth: 2,
            },
          ],
        }}
      />,
    );
  }

  if (kind === "bar") {
    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: moneyAxes,
    };
    return wrap(
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: seriesLabel,
              data: values,
              backgroundColor: hexToRgba(color, 0.7),
              borderColor: color,
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        }}
      />,
    );
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: moneyAxes,
  };
  return wrap(
    <Line
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: seriesLabel,
            data: values,
            borderColor: color,
            backgroundColor: hexToRgba(color, 0.12),
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      }}
    />,
  );
}
