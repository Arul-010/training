import React from 'react';

/**
 * Reusable metric/stat card for the Dashboard.
 *
 * @param {React.ElementType} icon - A react-icons icon component
 * @param {string} colorVariant - CSS modifier: 'blue' | 'green' | 'amber' | 'indigo'
 * @param {string} label - Metric title text
 * @param {string|number} value - Primary metric value to display
 */
const MetricCard = ({ icon: Icon, colorVariant, label, value }) => {
  return (
    <div className="card metric-card">
      <div className={`metric-icon-box ${colorVariant}`}>
        <Icon />
      </div>
      <div className="metric-details">
        <span className="metric-label">{label}</span>
        <h3 className="metric-value">{value}</h3>
      </div>
    </div>
  );
};

export default MetricCard;
