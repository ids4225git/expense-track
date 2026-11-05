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

// Short labels for charts, e.g. ¥212K or $1.2K
const compactFormatters = {
  JPY: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'JPY',
    notation: 'compact',
    maximumFractionDigits: 1,
  }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }),
};

export function formatCompactCurrency(amount, currency) {
  const formatter = compactFormatters[currency];
  if (!formatter) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return formatter.format(amount);
}

export const CURRENCY_SYMBOLS = { JPY: '¥', USD: '$' };
