// app/components/ChartCard.js
import { Line, Bar } from 'react-chartjs-2';
import { chartOptions } from '../config/chartConfig';

export default function ChartCard({ title, chartData, chartType }) {
  return (
    <div className="bg-surface rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="text-secondary mb-4 text-lg">{title}</h3>
      <div className="h-48">
        {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
        {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
}
