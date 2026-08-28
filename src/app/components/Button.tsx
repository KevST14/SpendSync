import type { ButtonHTMLAttributes } from "react";

type Variant = "brand" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  brand: "bg-brand text-white hover:opacity-90",
  ghost: "border border-border text-heading hover:bg-elevated",
  danger: "bg-danger text-white hover:opacity-90",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "brand",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
