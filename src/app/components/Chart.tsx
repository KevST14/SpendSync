"use client";

import dynamic from "next/dynamic";

export type ChartKind = "line" | "bar" | "doughnut";

export interface ChartSeries {
  label: string;
  values: number[];
  color?: string;
}

export interface ChartProps {
  kind: ChartKind;
  labels: string[];
  values: number[];
  /** Dataset label, shown in tooltips (and the legend when `series2` is set). */
  seriesLabel?: string;
  /** Accent colour for line / bar charts. */
  color?: string;
  /** Optional second series for line / bar charts; adds a legend. */
  series2?: ChartSeries;
  /** Slice colours for doughnut charts. */
  palette?: string[];
  height?: number;
}

/**
 * Chart.js is ~60 kB, so the canvas (and the library) is code-split and only
 * loaded in the browser. This wrapper is the stable, typed entry point.
 */
const ChartCanvas = dynamic(() => import("./ChartCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center text-muted">
      Loading chart…
    </div>
  ),
});

export default function Chart(props: ChartProps) {
  return <ChartCanvas {...props} />;
}
