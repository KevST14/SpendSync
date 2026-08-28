"use client";

import { useEffect, useState, type ReactNode } from "react";
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

const DEFAULT_PALETTE = ["#6a34e8", "#8e2de2", "#00e0d0", "#ffce3d", "#ff5a68"];

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** Re-render whenever the theme changes so chart.js internals recolour. */
function useThemeTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const observer = new MutationObserver(bump);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const media = window.matchMedia("(prefers-color-scheme: light)");
    media.addEventListener("change", bump);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", bump);
    };
  }, []);
  return tick;
}

export default function ChartCanvas({
  kind,
  labels,
  values,
  seriesLabel = "",
  color = "var-accent",
  series2,
  palette = DEFAULT_PALETTE,
  height = 260,
}: ChartProps) {
  useThemeTick();

  const grid = readVar("--color-border", "rgba(255,255,255,0.09)");
  const tick = readVar("--color-muted", "#b0b0c8");
  const surface = readVar("--color-surface", "#1a1a2e");
  const accent = readVar("--color-accent", "#00e0d0");
  const lineColor = color === "var-accent" ? accent : color;

  const wrap = (node: ReactNode) => <div style={{ height }}>{node}</div>;
  const showLegend = Boolean(series2);
  const legend = { display: showLegend, labels: { color: tick } } as const;
  const moneyAxes = {
    x: { grid: { color: grid }, ticks: { color: tick } },
    y: {
      grid: { color: grid },
      ticks: {
        color: tick,
        callback: (value: string | number) => `£${value}`,
      },
    },
  };

  if (kind === "doughnut") {
    const options: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { color: tick } } },
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
              borderColor: surface,
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
            bar(seriesLabel, values, lineColor),
            ...(series2
              ? [bar(series2.label, series2.values, series2.color ?? "#ff5a68")]
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
          line(seriesLabel, values, lineColor, !series2),
          ...(series2
            ? [line(series2.label, series2.values, series2.color ?? "#ff5a68", false)]
            : []),
        ],
      }}
    />,
  );
}
