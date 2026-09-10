import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';

const Badge = ({ children, status, className = '' }) => {
  const colorClass = getStatusBadgeColor(status || children);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold border uppercase tracking-wider ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};

export default Badge;
