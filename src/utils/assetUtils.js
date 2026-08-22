/**
 * Helper utility to resolve public asset URLs.
 * Properly prefixes paths with Vite's import.meta.env.BASE_URL
 * for GitHub Pages subpath hosting (e.g. /invitation/).
 */
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
};

export default getAssetUrl;
