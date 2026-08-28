"use client";

import { useRouter } from "next/navigation";
import { DATE_RANGES, type DateRange } from "@/lib/stats";

const DEFAULT: DateRange = "6m";

export default function DateRangeTabs({ current }: { current: DateRange }) {
  const router = useRouter();

  return (
    <div className="inline-flex rounded-lg border border-border p-1">
      {DATE_RANGES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={current === value}
          onClick={() =>
            router.replace(value === DEFAULT ? "/" : `/?range=${value}`, {
              scroll: false,
            })
          }
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            current === value ? "bg-brand text-white" : "text-muted hover:text-heading"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
