export const formatCurrency = (amount) => {
  if (amount == null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PAID':
    case 'AVAILABLE':
    case 'PRESENT':
    case 'RESOLVED':
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'PENDING':
    case 'PARTIALLY_OCCUPIED':
    case 'LATE':
    case 'IN_PROGRESS':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'OVERDUE':
    case 'FULL':
    case 'ABSENT':
    case 'HIGH':
    case 'URGENT':
    case 'SUSPENDED':
      return 'bg-error-container text-on-error-container border-red-200';
    default:
      return 'bg-surface-container text-on-surface-variant border-outline-variant';
  }
};
