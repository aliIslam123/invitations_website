export type ThemeId =
  | 'royal-champagne'
  | 'minimal-ivory'
  | 'romantic-burgundy'
  | 'botanical-garden'
  | 'modern-black-gold'
  | 'soft-blush'

export interface ThemeConfig {
  id: ThemeId
  name: string
  nameAr: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textLight: string
    border: string
    gold: string
  }
  fonts: {
    heading: string
    body: string
    arabic: string
    accent: string
  }
  heroLayout: string
  galleryLayout: string
  countdownStyle: string
  borderRadius: string
  shadowStyle: string
  decorativeElements: string[]
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'royal-champagne': {
    id: 'royal-champagne',
    name: 'Royal Champagne',
    nameAr: 'الشمبانيا الملكي',
    description: 'Warm ivory tones with champagne gold accents — timeless elegance',
    colors: {
      primary: '#C8A96B',
      secondary: '#332A25',
      accent: '#D4AF7A',
      background: '#FAF7F0',
      surface: '#FFFFFF',
      text: '#332A25',
      textLight: '#918579',
      border: '#EAE1D3',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Times New Roman', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', 'Tajawal', system-ui, sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    heroLayout: 'cinematic',
    galleryLayout: 'editorial-grid',
    countdownStyle: 'elegant',
    borderRadius: '0',
    shadowStyle: 'soft',
    decorativeElements: ['floral-ornament', 'gold-line', 'monogram'],
  },
  'minimal-ivory': {
    id: 'minimal-ivory',
    name: 'Minimal Ivory',
    nameAr: 'العاجي المينيمالي',
    description: 'Clean lines, generous whitespace, and refined simplicity',
    colors: {
      primary: '#332A25',
      secondary: '#918579',
      accent: '#C8A96B',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1A1410',
      textLight: '#6B6560',
      border: '#E8E3DC',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
      accent: "'Playfair Display', serif",
    },
    heroLayout: 'minimal',
    galleryLayout: 'minimal-grid',
    countdownStyle: 'minimal',
    borderRadius: '2px',
    shadowStyle: 'none',
    decorativeElements: ['thin-line', 'dot-separator'],
  },
  'romantic-burgundy': {
    id: 'romantic-burgundy',
    name: 'Romantic Burgundy',
    nameAr: 'الرومانسية البورغندي',
    description: 'Deep burgundy and blush tones for a rich romantic atmosphere',
    colors: {
      primary: '#722F37',
      secondary: '#4A1C24',
      accent: '#C8A96B',
      background: '#FDF5F5',
      surface: '#FFFFFF',
      text: '#2D0F14',
      textLight: '#8C6068',
      border: '#F0D4D8',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Libre Baskerville', 'Georgia', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', 'Tajawal', system-ui, sans-serif",
      accent: "'Libre Baskerville', serif",
    },
    heroLayout: 'floral',
    galleryLayout: 'masonry',
    countdownStyle: 'ornate',
    borderRadius: '4px',
    shadowStyle: 'warm',
    decorativeElements: ['rose-ornament', 'gold-line', 'floral-border'],
  },
  'botanical-garden': {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    nameAr: 'الحديقة النباتية',
    description: 'Forest greens and natural tones inspired by lush gardens',
    colors: {
      primary: '#2D4A3E',
      secondary: '#1A2E27',
      accent: '#C8A96B',
      background: '#F5F8F5',
      surface: '#FFFFFF',
      text: '#1A2E27',
      textLight: '#5A7A6E',
      border: '#D4E4D8',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Times New Roman', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    heroLayout: 'editorial',
    galleryLayout: 'masonry',
    countdownStyle: 'nature',
    borderRadius: '6px',
    shadowStyle: 'green',
    decorativeElements: ['leaf-ornament', 'botanical-border', 'vine-line'],
  },
  'modern-black-gold': {
    id: 'modern-black-gold',
    name: 'Modern Black & Gold',
    nameAr: 'الأسود والذهبي العصري',
    description: 'Dramatic black backgrounds with luminous gold — bold luxury',
    colors: {
      primary: '#C8A96B',
      secondary: '#D4AF7A',
      accent: '#F0D690',
      background: '#0A0806',
      surface: '#1A1510',
      text: '#F5EDD8',
      textLight: '#A89880',
      border: '#2A2018',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Times New Roman', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', 'Tajawal', system-ui, sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    heroLayout: 'cinematic',
    galleryLayout: 'cinematic',
    countdownStyle: 'luxury',
    borderRadius: '0',
    shadowStyle: 'gold',
    decorativeElements: ['gold-ornament', 'geometric-border', 'monogram'],
  },
  'soft-blush': {
    id: 'soft-blush',
    name: 'Soft Blush Romance',
    nameAr: 'الرومانسية الوردية الناعمة',
    description: 'Delicate blush pinks and soft pastels for a dreamy celebration',
    colors: {
      primary: '#C4858A',
      secondary: '#8C4E5A',
      accent: '#C8A96B',
      background: '#FDF8F8',
      surface: '#FFFFFF',
      text: '#3D2030',
      textLight: '#9A7080',
      border: '#F5DDE0',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
      accent: "'Playfair Display', serif",
    },
    heroLayout: 'floral',
    galleryLayout: 'editorial-grid',
    countdownStyle: 'soft',
    borderRadius: '8px',
    shadowStyle: 'blush',
    decorativeElements: ['rose-petal', 'soft-border', 'floral-ornament'],
  },
}

export const DEFAULT_THEME_ID: ThemeId = 'royal-champagne'

export function getTheme(themeId: string): ThemeConfig {
  return THEMES[themeId as ThemeId] ?? THEMES[DEFAULT_THEME_ID]
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES)
}
