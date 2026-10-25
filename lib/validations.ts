import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صالح'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
})

export const rsvpSubmissionSchema = z.object({
  invitationId: z.string().min(1),
  guestName: z.string().min(2, 'يرجى كتابة الاسم الكريم'),
  attendance: z.enum(['yes', 'no', 'maybe']).default('yes').optional(),
  guestCount: z.coerce.number().int().min(1).max(20).default(1).optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email('بريد إلكتروني غير صالح').optional().nullable().or(z.literal('')),
  message: z.string().max(1000, 'الرسالة طويلة جداً').optional().nullable(),
  dietary: z.string().max(200).optional().nullable(),
})

export const weddingEventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'عنوان الفعالية مطلوب'),
  date: z.string().or(z.date()),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  mapsUrl: z.string().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  venueImage: z.string().optional().nullable(),
  description: z.string().optional(),
  dressCode: z.string().optional(),
  notes: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
})

export const timelineItemSchema = z.object({
  id: z.string().optional(),
  time: z.string().optional(),
  title: z.string().min(2, 'العنوان مطلوب'),
  description: z.string().optional(),
  icon: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
})

export const coupleInformationSchema = z.object({
  brideFirstName: z.string().default(''),
  brideLastName: z.string().default(''),
  brideFullName: z.string().default(''),
  brideFather: z.string().optional().nullable(),
  brideMother: z.string().optional().nullable(),
  brideFamily: z.string().optional().nullable(),
  brideBio: z.string().optional().nullable(),
  bridePhoto: z.string().optional().nullable(),

  groomFirstName: z.string().default(''),
  groomLastName: z.string().default(''),
  groomFullName: z.string().default(''),
  groomFather: z.string().optional().nullable(),
  groomMother: z.string().optional().nullable(),
  groomFamily: z.string().optional().nullable(),
  groomBio: z.string().optional().nullable(),
  groomPhoto: z.string().optional().nullable(),

  couplePhoto: z.string().optional().nullable(),
  monogram: z.string().optional().nullable(),
  weddingDate: z.string().or(z.date()).optional().nullable(),
  weddingTime: z.string().optional().nullable(),
  timezone: z.string().default('Asia/Riyadh'),

  messageHeading: z.string().optional().nullable(),
  messageBody: z.string().optional().nullable(),
  heroLayout: z.string().default('cinematic'),
  heroImage: z.string().optional().nullable(),
  heroImageMobile: z.string().optional().nullable(),

  invitationText: z.string().optional().nullable(),
  invitationSubtext: z.string().optional().nullable(),

  familyNamesEnabled: z.boolean().default(false),
  familyNamesContent: z.string().optional().nullable(),

  dressCodeEnabled: z.boolean().default(false),
  dressCodeContent: z.string().optional().nullable(),

  giftInfoEnabled: z.boolean().default(false),
  giftInfoContent: z.string().optional().nullable(),

  contactEnabled: z.boolean().default(false),
  contactPhone: z.string().optional().nullable(),
  contactWhatsapp: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),

  wishesEnabled: z.boolean().default(false),
  postEventEnabled: z.boolean().default(false),
  postEventMessage: z.string().optional().nullable(),
})

export const invitationUpdateSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  slug: z.string().min(2, 'الرابط المخصص مطلوب').regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  language: z.enum(['ar', 'en', 'both']),
  direction: z.enum(['rtl', 'ltr']),
  themeId: z.string().default('royal-champagne'),
  animationPreset: z.enum(['subtle', 'elegant', 'cinematic']),

  coverEnabled: z.boolean().default(true),
  coverType: z.enum(['none', 'minimal', 'elegant', 'cinematic']),
  coverImage: z.string().optional().nullable(),
  coverOverlayColor: z.string().default('#332A25'),
  coverOverlayOpacity: z.coerce.number().default(0.5),
  coverMonogram: z.string().optional().nullable(),

  musicEnabled: z.boolean().default(false),
  musicUrl: z.string().optional().nullable(),
  musicTitle: z.string().optional().nullable(),
  musicAutoplay: z.boolean().default(false),
  musicPosition: z.string().default('bottom-right'),

  rsvpEnabled: z.boolean().default(false),
  rsvpDeadline: z.string().or(z.date()).optional().nullable(),
  rsvpMaxGuests: z.coerce.number().optional().nullable(),
  rsvpAllowPlusOne: z.boolean().default(true),
  rsvpRequireContact: z.boolean().default(false),
  rsvpConfirmMsg: z.string().optional().nullable(),
  rsvpDeclineMsg: z.string().optional().nullable(),

  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoImage: z.string().optional().nullable(),
  whatsappMessage: z.string().optional().nullable(),
})
