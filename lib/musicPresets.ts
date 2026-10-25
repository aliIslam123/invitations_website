export interface MusicTrack {
  id: string
  title: string
  titleAr: string
  artist: string
  url: string
  duration?: string
  genre: 'classical' | 'oriental' | 'acoustic' | 'ambient'
}

export const WEDDING_MUSIC_PRESETS: MusicTrack[] = [
  {
    id: 'canon-in-d',
    title: 'Canon in D - Romantic Acoustic Piano',
    titleAr: 'كانون إن دي - بيانو رومانسي هادئ',
    artist: 'Johann Pachelbel (Acoustic Arrangement)',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
    duration: '2:45',
    genre: 'classical',
  },
  {
    id: 'thousand-years-harp',
    title: 'Golden Harp & Soft Strings',
    titleAr: 'لحن قيثارة الهارب والأوتار الملكية',
    artist: 'Royal Chamber Strings',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-invitation-waltz-14930.mp3',
    duration: '2:15',
    genre: 'acoustic',
  },
  {
    id: 'royal-love-waltz',
    title: 'Royal Love Waltz - Majestic Symphony',
    titleAr: 'فالس الحب الملكي - سيمفونية هادئة',
    artist: 'Imperial Wedding Orchestra',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=in-love-123498.mp3',
    duration: '3:10',
    genre: 'classical',
  },
  {
    id: 'arabesque-oud',
    title: 'Arabesque Romantic Oud & Cello',
    titleAr: 'أنغام العود الملكية والتشيلو الهادئ',
    artist: 'فرقة التراث الملكي',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8872e42.mp3?filename=middle-eastern-oriental-relaxing-10642.mp3',
    duration: '2:30',
    genre: 'oriental',
  },
  {
    id: 'royal-zaffe-drums',
    title: 'Traditional Royal Zaffe & Flute',
    titleAr: 'الزفة الملكية الفاخرة - ناي وإيقاع هادئ',
    artist: 'زفة السعادة الملكية',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630d704f.mp3?filename=oriental-traditional-celebration-7128.mp3',
    duration: '3:05',
    genre: 'oriental',
  },
]
