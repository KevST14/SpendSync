// app/components/StatsCard.js
export default function StatsCard({ icon, title, value }) {
    return (
      <div className="bg-surface rounded-lg p-6 flex items-center shadow-md hover:shadow-lg transition-all duration-300">
        <i className={`fas ${icon} text-4xl text-accent mr-4`}></i>
        <div>
          <h3 className="text-secondary text-sm font-medium">{title}</h3>
          <p className="text-primary text-2xl font-semibold">{value}</p>
        </div>
      </div>
    );
  }
  