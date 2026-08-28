/**
 * Utility to resolve image URLs based on environment variables
 * Supports images uploaded to backend `/uploads` folder, external URLs, and local fallbacks.
 */

export const getUploadUrl = (filenameOrPath?: string | null, fallbackUrl?: string): string => {
  if (!filenameOrPath) {
    return fallbackUrl || '';
  }

  // Already a full external URL (http / https) or base64 data URI
  if (
    filenameOrPath.startsWith('http://') ||
    filenameOrPath.startsWith('https://') ||
    filenameOrPath.startsWith('data:')
  ) {
    return filenameOrPath;
  }

  // Get base URL from environment
  const uploadsBaseUrl =
    import.meta.env.VITE_UPLOADS_BASE_URL ||
    (import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '/uploads')
      : 'http://localhost:5000/uploads');

  const cleanPath = filenameOrPath.startsWith('/') ? filenameOrPath.slice(1) : filenameOrPath;
  return `${uploadsBaseUrl}/${cleanPath}`;
};

/**
 * Returns backend uploads URL for the default hero background image
 */
export const getHeroBgUrl = (localFallback: string): string => {
  const backendUrl = getUploadUrl('hero-bg.jpg');
  return backendUrl || localFallback;
};
