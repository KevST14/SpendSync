// app/components/Sidebar.js
export default function Sidebar() {
    return (
      <aside className="w-64 bg-surface p-5">
        <div className="mb-8">
          <img src="/logo.png" alt="SpendSync Logo" className="h-12 mx-auto" />
          <h2 className="text-center text-accent text-2xl mt-2">SpendSync</h2>
        </div>
        <nav className="space-y-4">
          <a href="/" className="block py-2 px-4 rounded hover:bg-primary">
            <i className="fas fa-home mr-2"></i> Dashboard
          </a>
          {/* Add other links as needed */}
        </nav>
      </aside>
    );
  }
  