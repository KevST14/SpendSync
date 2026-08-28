import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendSync - Personal Finance Tracker",
  description: "Track and analyze your personal finances with SpendSync.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary font-sans">
        <div>{children}</div>
      </body>
    </html>
  );
}
