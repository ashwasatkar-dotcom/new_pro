import React from 'react';

const StatTile = ({ icon, title, value, badgeText, badgeColor = 'bg-surface-container text-secondary', iconBg = 'bg-surface-container-low text-primary' }) => {
  return (
    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        {badgeText && (
          <span className={`font-label-sm text-[11px] px-2 py-0.5 rounded font-bold ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
      <div className="mt-space-xs">
        <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
          {value}
        </span>
        <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
          {title}
        </p>
      </div>
    </div>
  );
};

export default StatTile;
