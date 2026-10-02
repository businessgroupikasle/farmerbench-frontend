type VariantRecord = Record<string, any>;

const variantLabel = (variant: VariantRecord): string =>
  String(variant.label || variant.packSize || `${variant.quantity || ''} ${variant.unit || ''}`).trim();

export const getProductVariants = (product: any): VariantRecord[] => {
  const attributes = (product?.attributes as Record<string, any>) || {};
  return Array.isArray(attributes.variants) ? attributes.variants : [];
};

export const resolveProductVariant = (
  product: any,
  selectedAttributes?: Record<string, any> | null
): VariantRecord | undefined => {
  const variants = getProductVariants(product);
  if (variants.length === 0) return undefined;

  const requestedId = selectedAttributes?.variantId || selectedAttributes?.sku;
  const requestedPackSize = String(selectedAttributes?.packSize || '').trim().toLowerCase();

  return variants.find((variant) =>
    Boolean(requestedId) && [variant.id, variant.variantId, variant.sku].includes(requestedId)
  ) || variants.find((variant) =>
    Boolean(requestedPackSize) && variantLabel(variant).toLowerCase() === requestedPackSize
  ) || variants[0];
};

export const getCanonicalVariantSelection = (
  product: any,
  selectedAttributes?: Record<string, any> | null
): Record<string, any> => {
  const variant = resolveProductVariant(product, selectedAttributes);
  if (!variant) return { ...(selectedAttributes || {}) };

  return {
    ...(selectedAttributes || {}),
    packSize: variantLabel(variant),
    variantId: variant.id || variant.variantId || variant.sku,
    sku: variant.sku,
  };
};
