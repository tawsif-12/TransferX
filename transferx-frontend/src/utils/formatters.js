export const formatCurrency = (amount) => {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'EUR',
    notation: 'compact', maximumFractionDigits: 1,
  }).format(amount);
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

export const formatSalary = (weekly) =>
  `€${new Intl.NumberFormat('en-GB').format(weekly)}/wk`;

export const getInitials = (firstName, lastName) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

export const getPositionColor = (position) => ({
  Goalkeeper: '#f59e0b',
  Defender:   '#60a5fa',
  Midfielder: '#a78bfa',
  Forward:    '#f87171',
}[position] ?? '#6b7280');

export const isContractActive = (endDate) =>
  new Date(endDate) > new Date();
