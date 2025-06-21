// Currency utilities for multi-currency support
export const CURRENCIES = {
  IDR: {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    position: 'before',
    decimalPlaces: 0,
    thousandSeparator: '.',
    decimalSeparator: ','
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.'
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    position: 'before',
    decimalPlaces: 2,
    thousandSeparator: '.',
    decimalSeparator: ','
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    position: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.'
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    position: 'before',
    decimalPlaces: 0,
    thousandSeparator: ',',
    decimalSeparator: '.'
  }
};

// Exchange rates (static for now, can be updated via API later)
export const EXCHANGE_RATES = {
  IDR: 1,
  USD: 0.000065, // 1 IDR = 0.000065 USD
  EUR: 0.000060, // 1 IDR = 0.000060 EUR
  SGD: 0.000088, // 1 IDR = 0.000088 SGD
  JPY: 0.0098    // 1 IDR = 0.0098 JPY
};

// Format currency based on currency code
export function formatCurrency(amount, currencyCode = 'IDR') {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.IDR;
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0';
  
  // Format number with proper separators
  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces
  });
  
  // Add currency symbol
  if (currency.position === 'before') {
    return `${currency.symbol} ${formatted}`;
  } else {
    return `${formatted} ${currency.symbol}`;
  }
}

// Convert amount from one currency to another
export function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to base currency (IDR) first, then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
}

// Get currency options for select dropdown
export function getCurrencyOptions() {
  return Object.values(CURRENCIES).map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`
  }));
}

// Validate currency code
export function isValidCurrency(currencyCode) {
  return Object.keys(CURRENCIES).includes(currencyCode);
} 