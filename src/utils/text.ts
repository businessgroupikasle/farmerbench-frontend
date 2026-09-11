export const capitalizeFirstLetter = (value?: string | null): string => {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed ? trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1) : '';
};

export const normalizeNamedEntity = <T>(entity: T): T => {
  if (!entity || typeof entity !== 'object') return entity;
  const namedEntity = entity as T & { name?: string };
  return {
    ...namedEntity,
    ...(typeof namedEntity.name === 'string'
      ? { name: capitalizeFirstLetter(namedEntity.name) }
      : {}),
  } as T;
};