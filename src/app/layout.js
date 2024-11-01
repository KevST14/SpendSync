// app/layout.js
import Sidebar from './components/Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-textPrimary">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
