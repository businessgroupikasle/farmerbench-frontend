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

export const getProductPricing = (product: {
  price?: number | string | null;
  discountPrice?: number | string | null;
}) => {
  const rawPrice = Number(product.price) || 0;
  const rawDiscountPrice = Number(product.discountPrice) || 0;
  const isDiscounted = rawPrice > 0 && rawDiscountPrice > 0 && rawPrice !== rawDiscountPrice;
  const originalPrice = isDiscounted ? Math.max(rawPrice, rawDiscountPrice) : rawPrice;
  const currentPrice = isDiscounted ? Math.min(rawPrice, rawDiscountPrice) : rawPrice;
  const discountPercent = isDiscounted
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const savingsAmount = isDiscounted ? Math.max(0, originalPrice - currentPrice) : 0;

  return {
    isDiscounted,
    originalPrice,
    currentPrice,
    discountPercent,
    savingsAmount,
  };
};
