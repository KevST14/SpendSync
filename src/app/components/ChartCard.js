// app/components/ChartCard.js
export default function ChartCard({ title, chartId }) {
    return (
      <div className="bg-surface rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
        <h3 className="text-secondary mb-4 text-lg">{title}</h3>
        <div id={chartId} className="h-48 bg-gray-800 rounded-lg"></div>
      </div>
    );
  }
  