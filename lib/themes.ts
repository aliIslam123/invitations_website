export type ThemeId =
  | 'royal-champagne'
  | 'minimal-ivory'
  | 'romantic-burgundy'
  | 'botanical-garden'
  | 'modern-black-gold'
  | 'soft-blush'
  | 'arabic-calligraphy'
  | 'traditional-arabic'
  | 'midnight-elegance'
  | 'editorial-photo'
  | 'sage-garden'
  | 'pearl-white'
  | 'desert-sunset'
  | 'contemporary-monochrome'
  | 'floral-watercolor'
  | 'grand-ballroom'

export type TemplateCategory = 'all' | 'luxury' | 'minimalist' | 'romantic' | 'cultural' | 'modern'

export interface ThemeConfig {
  id: ThemeId
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  category: 'luxury' | 'minimalist' | 'romantic' | 'cultural' | 'modern'
  badge?: string
  popular?: boolean
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
  sampleData: {
    groomName: string
    brideName: string
    title: string
    eventDate: string
    venueName: string
    city: string
  }
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'royal-champagne': {
    id: 'royal-champagne',
    name: 'Royal Champagne',
    nameAr: 'الشمبانيا الملكي',
    description: 'Warm ivory tones with champagne gold accents — timeless elegance',
    descriptionAr: 'درجات العاج الدافئة مع لمسات الذهب والشمبانيا، فخامة أزلية لا تزول',
    category: 'luxury',
    badge: 'الأكثر طلباً',
    popular: true,
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
    sampleData: {
      groomName: 'محمد أحمد',
      brideName: 'أسماء علي',
      title: 'حفل زفاف ملكي فاخر',
      eventDate: '2026-11-16',
      venueName: 'قصر الماسة للمؤتمرات والاحتفالات',
      city: 'القاهرة، مصر',
    },
  },
  'minimal-ivory': {
    id: 'minimal-ivory',
    name: 'Minimal Ivory',
    nameAr: 'العاجي المينيمالي',
    description: 'Clean lines, generous whitespace, and refined simplicity',
    descriptionAr: 'خطوط هندسية نقية ومساحات بيضاء مدروسة مع بساطة عصرية فائقة الرقي',
    category: 'minimalist',
    popular: true,
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
    sampleData: {
      groomName: 'عمر خالد',
      brideName: 'نور سليم',
      title: 'احتفال عائلي بسيط وراقي',
      eventDate: '2026-10-20',
      venueName: 'فيلا السكينة',
      city: 'دبي، الإمارات',
    },
  },
  'romantic-burgundy': {
    id: 'romantic-burgundy',
    name: 'Romantic Burgundy',
    nameAr: 'الرومانسية البورغندي',
    description: 'Deep burgundy and blush tones for a rich romantic atmosphere',
    descriptionAr: 'ألوان النبيذي الدافئ مع لمسات الورد الناعم لأجواء رومانسية لا تُنسى',
    category: 'romantic',
    badge: 'كلاسيكي رومانسي',
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
    sampleData: {
      groomName: 'يوسف شريف',
      brideName: 'سارة مراد',
      title: 'ليلة من ليالي العمر الرومانسية',
      eventDate: '2026-12-05',
      venueName: 'جراند نايل تاور',
      city: 'القاهرة، مصر',
    },
  },
  'botanical-garden': {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    nameAr: 'الحديقة النباتية الطبيعية',
    description: 'Forest greens and natural tones inspired by lush open-air gardens',
    descriptionAr: 'درجات الأخضر الزمرّدي والزيتوني المستوحاة من أحضان الطبيعة والحدائق المفتوحة',
    category: 'romantic',
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
    sampleData: {
      groomName: 'كريم مروان',
      brideName: 'مريم طارق',
      title: 'عقد قران في الحديقة الغنّاء',
      eventDate: '2026-09-18',
      venueName: 'حدائق الأندلس الملكية',
      city: 'الرياض، السعودية',
    },
  },
  'modern-black-gold': {
    id: 'modern-black-gold',
    name: 'Modern Black & Gold',
    nameAr: 'الأسود والذهبي العصري',
    description: 'Dramatic black backgrounds with luminous gold — bold luxury',
    descriptionAr: 'خلفيات داكنة مهيبة مع تدرجات الذهب البراق — أناقة البلاك تاي الفخمة',
    category: 'luxury',
    badge: 'بلاك تاي فاخر',
    popular: true,
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
    sampleData: {
      groomName: 'طارق عبد العزيز',
      brideName: 'رانيا منصور',
      title: 'احتفال بلاك تاي استثنائي',
      eventDate: '2026-11-28',
      venueName: 'فندق الريتز كارلتون',
      city: 'الدوحة، قطر',
    },
  },
  'soft-blush': {
    id: 'soft-blush',
    name: 'Soft Blush Romance',
    nameAr: 'الوردية الناعمة',
    description: 'Delicate blush pinks and soft pastels for a dreamy celebration',
    descriptionAr: 'درجات الوردي الباستيلي الحالم مع لمسات لؤلؤية خفيفة لأجمل الليالي',
    category: 'romantic',
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
    sampleData: {
      groomName: 'حمزة كمال',
      brideName: 'ليلى فؤاد',
      title: 'ليلة حالمة بحضور الأحباب',
      eventDate: '2026-10-15',
      venueName: 'منتجع الفورسيزونز',
      city: 'الإسكندرية، مصر',
    },
  },
  'arabic-calligraphy': {
    id: 'arabic-calligraphy',
    name: 'Arabic Calligraphy Masterpiece',
    nameAr: 'الخط العربي الأصيل',
    description: 'Deep emerald greens and opulent antique gold celebrating Arabic script',
    descriptionAr: 'روعة الحروف العربية بالخط الثلث والديواني مع الأخضر الملكي وتطريزات الذهب العتيق',
    category: 'cultural',
    badge: 'طابع عربي أصيل',
    popular: true,
    colors: {
      primary: '#1B4D3E',
      secondary: '#0F2E25',
      accent: '#D4AF37',
      background: '#F7F6F0',
      surface: '#FFFFFF',
      text: '#112920',
      textLight: '#527063',
      border: '#D8DFD5',
      gold: '#D4AF37',
    },
    fonts: {
      heading: "'Amiri', 'Alexandria', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Amiri', 'Alexandria', serif",
      accent: "'Amiri', serif",
    },
    heroLayout: 'calligraphy-centered',
    galleryLayout: 'editorial-grid',
    countdownStyle: 'traditional',
    borderRadius: '4px',
    shadowStyle: 'soft',
    decorativeElements: ['mashrabiya-pattern', 'islamic-arch', 'gold-calligraphy'],
    sampleData: {
      groomName: 'إبراهيم الهاشمي',
      brideName: 'فاطمة الزهراء',
      title: 'بارك الله لهما وبارك عليهما',
      eventDate: '2026-11-20',
      venueName: 'قاعة قصر الثقافة والضيافة',
      city: 'المدينة المنورة، السعودية',
    },
  },
  'traditional-arabic': {
    id: 'traditional-arabic',
    name: 'Heritage Terracotta',
    nameAr: 'التراث العربي الفاخر',
    description: 'Warm terracotta, sand dunes, and antique brass inspired by Arabian heritage',
    descriptionAr: 'أصالة التراث العربي بدفء رمال الصحراء وتدرجات التراكوتا والذهب النحاسي',
    category: 'cultural',
    colors: {
      primary: '#A0522D',
      secondary: '#6E3219',
      accent: '#D4AF7A',
      background: '#FAF6F0',
      surface: '#FFFFFF',
      text: '#3D1C06',
      textLight: '#8C5E48',
      border: '#E8D7CA',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Alexandria', 'Amiri', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', 'Tajawal', system-ui, sans-serif",
      accent: "'Amiri', serif",
    },
    heroLayout: 'heritage',
    galleryLayout: 'masonry',
    countdownStyle: 'traditional',
    borderRadius: '2px',
    shadowStyle: 'warm',
    decorativeElements: ['arabian-pattern', 'palm-motif', 'heritage-arch'],
    sampleData: {
      groomName: 'سلطان القاسمي',
      brideName: 'هند النعيمي',
      title: 'فرحة الأحباب واجتماع الأنساب',
      eventDate: '2026-12-12',
      venueName: 'قصر التراث للضيافة',
      city: 'أبوظبي، الإمارات',
    },
  },
  'midnight-elegance': {
    id: 'midnight-elegance',
    name: 'Midnight Elegance',
    nameAr: 'أناقة منتصف الليل',
    description: 'Deep royal navy blue with shimmering platinum and starlight accents',
    descriptionAr: 'سحر الليل الكحلي الملكي ببريق الفضة الاسترلينية والنجوم المتلألئة',
    category: 'luxury',
    badge: 'كحلي وفضي فاخر',
    colors: {
      primary: '#1A2B4C',
      secondary: '#0E1729',
      accent: '#A5B4C8',
      background: '#0B111E',
      surface: '#152033',
      text: '#E2E8F0',
      textLight: '#94A3B8',
      border: '#1E2F4D',
      gold: '#C0C8D6',
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Times New Roman', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', 'Tajawal', system-ui, sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    heroLayout: 'starlight',
    galleryLayout: 'cinematic',
    countdownStyle: 'luxury',
    borderRadius: '4px',
    shadowStyle: 'navy',
    decorativeElements: ['starlight', 'silver-border', 'constellation'],
    sampleData: {
      groomName: 'مازن العوضي',
      brideName: 'دينا السالم',
      title: 'ليلة استثنائية تحت ضوء النجوم',
      eventDate: '2026-12-25',
      venueName: 'جراند بولروم أتلانتس',
      city: 'دبي، الإمارات',
    },
  },
  'editorial-photo': {
    id: 'editorial-photo',
    name: 'Editorial Magazine',
    nameAr: 'المجلة الافتتاحية (إيديتوريال)',
    description: 'High-fashion editorial layout emphasizing bold typography and cinematic couple photography',
    descriptionAr: 'تصميم شبيه بأغلفة المجلات العالمية يبرز صور العروسين بطريقة سينمائية جذابة',
    category: 'modern',
    badge: 'تصميم مجلات الموضة',
    popular: true,
    colors: {
      primary: '#111111',
      secondary: '#333333',
      accent: '#888888',
      background: '#FFFFFF',
      surface: '#F8F8F8',
      text: '#0D0D0D',
      textLight: '#666666',
      border: '#E0E0E0',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Playfair Display', 'Didot', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
      accent: "'Playfair Display', serif",
    },
    heroLayout: 'magazine-cover',
    galleryLayout: 'editorial-grid',
    countdownStyle: 'minimal',
    borderRadius: '0',
    shadowStyle: 'none',
    decorativeElements: ['editorial-rule', 'monogram-stamp', 'issue-tag'],
    sampleData: {
      groomName: 'آدم حسني',
      brideName: 'جاسمين الشامي',
      title: 'قصة حب تتصدر العناوين',
      eventDate: '2026-11-08',
      venueName: 'لو باليه مودرن',
      city: 'بيروت، لبنان',
    },
  },
  'sage-garden': {
    id: 'sage-garden',
    name: 'Sage Garden Serenity',
    nameAr: 'حديقة المريمية الهادئة',
    description: 'Soft sage green, eucalyptus leaves, and serene earthy elegance',
    descriptionAr: 'درجات الأخضر السيج والكينا الهادئة لنقاء بصري وأجواء طبيعية مريحة ومميزة',
    category: 'minimalist',
    colors: {
      primary: '#607264',
      secondary: '#425345',
      accent: '#B4C292',
      background: '#F7F8F6',
      surface: '#FFFFFF',
      text: '#2F3C32',
      textLight: '#7A8C7F',
      border: '#E1E6E1',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Times New Roman', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    heroLayout: 'botanical-minimal',
    galleryLayout: 'minimal-grid',
    countdownStyle: 'nature',
    borderRadius: '8px',
    shadowStyle: 'soft',
    decorativeElements: ['eucalyptus-branch', 'subtle-circle', 'organic-line'],
    sampleData: {
      groomName: 'باسم رضوان',
      brideName: 'شهد عبد الله',
      title: 'فرحتنا في الطبيعة الساحرة',
      eventDate: '2026-10-30',
      venueName: 'مزرعة النخيل والأشجار',
      city: 'عمان، الأردن',
    },
  },
  'pearl-white': {
    id: 'pearl-white',
    name: 'Pearl White Pure',
    nameAr: 'اللؤلؤ الأبيض النقي',
    description: 'Iridescent pearl borders, pure alabaster, and refined monochromatic beauty',
    descriptionAr: 'بياض اللؤلؤ الخالص مع إطارات ناعمة جداً وشفافيات تعكس النقاء التام',
    category: 'minimalist',
    badge: 'نقاء وبساطة',
    colors: {
      primary: '#4A4A4A',
      secondary: '#7A7A7A',
      accent: '#DCD6CD',
      background: '#FAF9F6',
      surface: '#FFFFFF',
      text: '#2B2B2B',
      textLight: '#8C8C8C',
      border: '#ECE7E1',
      gold: '#D4AF7A',
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
    borderRadius: '6px',
    shadowStyle: 'pearl',
    decorativeElements: ['pearl-dot', 'fine-border', 'monogram'],
    sampleData: {
      groomName: 'فهد المطيري',
      brideName: 'ريما العتيبي',
      title: 'حفل زفاف مبارك',
      eventDate: '2026-11-14',
      venueName: 'قاعة اللؤلؤة الكبرى',
      city: 'الكويت',
    },
  },
  'desert-sunset': {
    id: 'desert-sunset',
    name: 'Desert Sunset Amber',
    nameAr: 'غروب الصحراء الدافئ',
    description: 'Rich amber, terracotta sands, and glowing copper sunset tones',
    descriptionAr: 'سحر ساعة الغروب الذهبية بدفء النحاس ووهج شمس الأصيل في الصحراء',
    category: 'romantic',
    colors: {
      primary: '#B85D34',
      secondary: '#8C3814',
      accent: '#E59B58',
      background: '#FBF5F0',
      surface: '#FFFFFF',
      text: '#442010',
      textLight: '#946650',
      border: '#ECDACF',
      gold: '#D98246',
    },
    fonts: {
      heading: "'Alexandria', 'Cormorant Garamond', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', 'Tajawal', system-ui, sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    heroLayout: 'sunset-glow',
    galleryLayout: 'masonry',
    countdownStyle: 'warm',
    borderRadius: '4px',
    shadowStyle: 'warm',
    decorativeElements: ['sunset-arc', 'warm-gradient', 'sand-dune'],
    sampleData: {
      groomName: 'زياد العمري',
      brideName: 'سلمى البلوشي',
      title: 'في موعد الغروب البهي نلتقي',
      eventDate: '2026-11-21',
      venueName: 'منتجع باب الشمس الصحراوي',
      city: 'دبي، الإمارات',
    },
  },
  'contemporary-monochrome': {
    id: 'contemporary-monochrome',
    name: 'Contemporary Swiss Monochrome',
    nameAr: 'المونوكروم المعاصر',
    description: 'Sleek black-and-white aesthetic with bold typography and Swiss grid precision',
    descriptionAr: 'طابع سويسري معاصر بالأبيض والأسود، دقة هندسية عالية وجرأة في الخطوط والتفاصيل',
    category: 'modern',
    colors: {
      primary: '#050505',
      secondary: '#222222',
      accent: '#555555',
      background: '#0D0D0D',
      surface: '#171717',
      text: '#F5F5F5',
      textLight: '#A3A3A3',
      border: '#292929',
      gold: '#FFFFFF',
    },
    fonts: {
      heading: "'Alexandria', sans-serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Alexandria', sans-serif",
      accent: "'Alexandria', sans-serif",
    },
    heroLayout: 'minimal',
    galleryLayout: 'cinematic',
    countdownStyle: 'minimal',
    borderRadius: '0',
    shadowStyle: 'none',
    decorativeElements: ['grid-line', 'swiss-cross', 'solid-box'],
    sampleData: {
      groomName: 'رامي حجازي',
      brideName: 'هالة خليل',
      title: 'احتفال عصري فريد',
      eventDate: '2026-12-19',
      venueName: 'ذا لوفت إيفنت سبيس',
      city: 'القاهرة، مصر',
    },
  },
  'floral-watercolor': {
    id: 'floral-watercolor',
    name: 'Floral Watercolor Dream',
    nameAr: 'الزهور المائية الحالمة',
    description: 'Hand-painted floral watercolor artwork in soft lilac, rose, and sage washes',
    descriptionAr: 'رسومات ألوان مائية رقيقة بدرجات اللافندر والوردي الناعم كلمسة فنية استثنائية',
    category: 'romantic',
    badge: 'رسم يدوي مائي',
    colors: {
      primary: '#7B5E7B',
      secondary: '#553C55',
      accent: '#B39DB3',
      background: '#FAF6F9',
      surface: '#FFFFFF',
      text: '#3A273A',
      textLight: '#8C748C',
      border: '#EADBEC',
      gold: '#C8A96B',
    },
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Tajawal', system-ui, sans-serif",
      arabic: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
      accent: "'Playfair Display', serif",
    },
    heroLayout: 'floral',
    galleryLayout: 'masonry',
    countdownStyle: 'soft',
    borderRadius: '12px',
    shadowStyle: 'blush',
    decorativeElements: ['watercolor-splash', 'lilac-flower', 'handpainted-wreath'],
    sampleData: {
      groomName: 'أنس الجوهري',
      brideName: 'يارا البستاني',
      title: 'باقة من الحب في ليلة العمر',
      eventDate: '2026-11-27',
      venueName: 'قصر الورود للفعاليات',
      city: 'جدة، السعودية',
    },
  },
  'grand-ballroom': {
    id: 'grand-ballroom',
    name: 'Grand Ballroom Majesty',
    nameAr: 'القاعة الملكية الكبرى',
    description: 'Majestic sapphire tones and 24k bright gold, reminiscent of royal palace gala balls',
    descriptionAr: 'فخامة القصور الأسطورية باللون الياقوتي الأزرق الملكي وتفاصيل الذهب الخالص عيار 24',
    category: 'luxury',
    badge: 'فخامة ملكية كبرى',
    colors: {
      primary: '#0F2B59',
      secondary: '#071733',
      accent: '#FFD700',
      background: '#0A1526',
      surface: '#11223D',
      text: '#F0F4FC',
      textLight: '#A3B4D0',
      border: '#1C355F',
      gold: '#E5C158',
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
    borderRadius: '4px',
    shadowStyle: 'gold',
    decorativeElements: ['chandelier-motif', 'royal-crest', 'gold-filigree'],
    sampleData: {
      groomName: 'الأمير فيصل بن خالد',
      brideName: 'الجوهرة بنت تركي',
      title: 'حفل الزفاف الملكي السعيد',
      eventDate: '2026-12-31',
      venueName: 'قاعة الاحتفالات الكبرى - قصر الشرق',
      city: 'الرياض، السعودية',
    },
  },
}

export const DEFAULT_THEME_ID: ThemeId = 'royal-champagne'

export function getTheme(themeId?: string | null): ThemeConfig {
  if (!themeId) return THEMES[DEFAULT_THEME_ID]
  return THEMES[themeId as ThemeId] ?? THEMES[DEFAULT_THEME_ID]
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES)
}

export function getTemplatesByCategory(category: TemplateCategory): ThemeConfig[] {
  if (category === 'all') return getAllThemes()
  return getAllThemes().filter((t) => t.category === category)
}

export function searchTemplates(query: string): ThemeConfig[] {
  const q = query.trim().toLowerCase()
  if (!q) return getAllThemes()
  return getAllThemes().filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.nameAr.includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.descriptionAr.includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.badge && t.badge.includes(q))
  )
}
