/**
 * Currency formatting utility
 * Formats all monetary values in Indian Rupees (₹)
 */

export const CURRENCY_SYMBOL = '₹';

export const formatPrice = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return `${CURRENCY_SYMBOL}0.00`;
  }
  const numericAmount = Number(amount);
  return `${CURRENCY_SYMBOL}${numericAmount.toFixed(2)}`;
};

export const formatPriceWithUnit = (amount: number, unit = '100g'): string => {
  return `${CURRENCY_SYMBOL} ${amount.toFixed(2)} / ${unit}`;
};
