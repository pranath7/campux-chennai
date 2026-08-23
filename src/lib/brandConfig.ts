// Brand Configuration - Allows changing the product name, tagline, logos, and styling accents
export const BRAND_CONFIG = {
  // Configurable App Name
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Campux Chennai',
  shortName: 'Campux',
  placeholderTag: '[APP NAME]',
  
  // Tagline & Value Prop
  tagline: 'Verified Student Academic Marketplace & College Community',
  shortTagline: 'Find. Share. Learn. Grow — within your Chennai college community.',
  
  // Geography
  primaryCity: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India',
  currencySymbol: '₹',
  
  // Visual Theme Tokens
  theme: {
    primaryColor: '#2563EB', // Blue 600
    primaryLight: '#3B82F6', // Blue 500
    primaryDark: '#1D4ED8',  // Blue 700
    accentColor: '#10B981',  // Emerald 500
    warningColor: '#F59E0B', // Amber 500
    errorColor: '#EF4444',   // Rose 500
    bgDark: '#0B0F19',
    bgCardDark: '#111827',
  },
  
  // Trust Badges
  verifiedBadgeLabel: 'Verified Student',
  verifiedBadgeTooltip: 'Identity & College enrollment verified via institutional email / student ID',
  
  // Support & Meta
  supportEmail: 'support@campux.in',
  contactPhone: '+91 98400 12345',
  copyrightYear: new Date().getFullYear(),
};
