"use client";

import { useEffect, useRef, useState } from "react";
import { formatGBP } from "@/lib/format";

interface CounterProps {
  value: number;
  variant?: "currency" | "count";
  duration?: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function render(n: number, variant: "currency" | "count"): string {
  return variant === "count" ? String(Math.round(n)) : formatGBP(n);
}

export default function Counter({
  value,
  variant = "currency",
  duration = 700,
}: CounterProps) {
  // Always initialise to the real value so SSR and no-JS render correctly.
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = value;

    if (prefersReducedMotion() || from === value) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Safety net if rAF is throttled (e.g. background tab): snap to the value.
    const fallback = window.setTimeout(() => setDisplay(value), duration + 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
  }, [value, duration]);

  return <>{render(display, variant)}</>;
}
