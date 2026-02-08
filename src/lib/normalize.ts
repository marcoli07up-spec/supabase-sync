/**
 * Remove accents/diacritics from a string for accent-insensitive search
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
