// Configure these with the verified business profiles in the deployment environment.
export const socialLinks = {
  facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com',
  youtube: import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com',
  whatsapp: 'https://wa.me/919360763060?text=Hello%20AgriEra%20Support%2C%20I%20would%20like%20assistance.',
};
