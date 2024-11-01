// app/layout.js
import './globals.css';

export const metadata = {
  title: 'SpendSync - Personal Finance Tracker',
  description: 'Track and analyze your personal finances with SpendSync.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary font-sans">
        <div>{children}</div> {/* This should avoid any recursive layout call */}
      </body>
    </html>
  );
}
