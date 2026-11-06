/**
 * Robust utility to resolve asset URLs with Vite's configured base path (e.g. for GitHub Pages).
 *
 * Guarantees:
 * - External, data, and blob URLs remain intact.
 * - Any leading duplicate repository base prefixes (e.g. "shafiya-kashmiri-designs/") are cleanly stripped.
 * - Produces consistent, idempotent URLs:
 *     getAssetUrl('assets/aistudio/plp_prod_1.png') -> '/shafiya-kashmiri-designs/assets/aistudio/plp_prod_1.png'
 *     getAssetUrl('/shafiya-kashmiri-designs/assets/aistudio/plp_prod_1.png') -> '/shafiya-kashmiri-designs/assets/aistudio/plp_prod_1.png'
 * - Provides a safe original product fallback if given null/undefined/empty string, preventing broken boxes.
 */
export const DEFAULT_FALLBACK_IMAGE =
  'assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png';

export function getAssetUrl(
  path: string | undefined | null,
  fallback = DEFAULT_FALLBACK_IMAGE
): string {
  let target = path && path.trim().length > 0 ? path.trim() : fallback;

  // Preserve external URLs, data URLs, and blob URLs
  if (/^(https?:|\/\/|data:|blob:)/i.test(target)) {
    return target;
  }

  // Get base URL configured in Vite (e.g. '/shafiya-kashmiri-designs/' or '/')
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const repoName = 'shafiya-kashmiri-designs';

  // Strip leading slashes
  let clean = target.replace(/^\/+/, '');

  // Strip any duplicate or repeated repo name prefixes
  while (clean.toLowerCase().startsWith(`${repoName}/`)) {
    clean = clean.slice(repoName.length + 1).replace(/^\/+/, '');
  }

  // If clean became empty, use fallback
  if (!clean) {
    clean = fallback.replace(/^\/+/, '');
  }

  return `${normalizedBase}${clean}`;
}
