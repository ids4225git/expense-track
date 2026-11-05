const formatters = {
  JPY: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

export function formatCurrency(amount, currency) {
  const formatter = formatters[currency];
  if (!formatter) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return formatter.format(amount);
}
