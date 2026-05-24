export const isValidId = (
  id: string | number | undefined | null
): boolean => id !== undefined && id !== null && String(id).length > 0;
