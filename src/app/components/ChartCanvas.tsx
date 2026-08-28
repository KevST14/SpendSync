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
import type { ChartProps } from "./Chart";

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
  series2,
  palette = DEFAULT_PALETTE,
  height = 260,
}: ChartProps) {
  const wrap = (node: ReactNode) => <div style={{ height }}>{node}</div>;
  const showLegend = Boolean(series2);
  const legend = { display: showLegend, labels: { color: TICK } } as const;

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
      plugins: { legend },
      scales: moneyAxes,
    };
    const bar = (label: string, data: number[], c: string) => ({
      label,
      data,
      backgroundColor: hexToRgba(c, 0.7),
      borderColor: c,
      borderWidth: 1,
      borderRadius: 4,
    });
    return wrap(
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            bar(seriesLabel, values, color),
            ...(series2
              ? [bar(series2.label, series2.values, series2.color ?? "#ff4757")]
              : []),
          ],
        }}
      />,
    );
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend },
    scales: moneyAxes,
  };
  const line = (label: string, data: number[], c: string, fill: boolean) => ({
    label,
    data,
    borderColor: c,
    backgroundColor: hexToRgba(c, 0.12),
    fill,
    tension: 0.4,
    pointRadius: 2,
  });
  return wrap(
    <Line
      options={options}
      data={{
        labels,
        datasets: [
          line(seriesLabel, values, color, !series2),
          ...(series2
            ? [line(series2.label, series2.values, series2.color ?? "#ff4757", false)]
            : []),
        ],
      }}
    />,
  );
}
