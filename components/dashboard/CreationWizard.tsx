'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Music,
  Palette,
  Eye,
  Send,
  Users,
  Share2,
} from 'lucide-react'
import { THEMES, getAllThemes } from '@/lib/themes'
import { ANIMATION_PRESETS } from '@/lib/animations'
import { slugify } from '@/lib/utils'

export function CreationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Full form state with sensible luxury defaults
  const [formData, setFormData] = useState({
    title: 'حفل زفاف مبارك',
    slug: `wedding-${Date.now().toString().slice(-4)}`,
    status: 'PUBLISHED',
    language: 'ar',
    direction: 'rtl',
    themeId: 'royal-champagne',
    animationPreset: 'elegant',

    // Cover
    coverEnabled: true,
    coverType: 'cinematic',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
    coverMonogram: 'A & S',

    // Couple
    brideFirstName: 'سارة',
    brideLastName: 'العتيبي',
    brideFullName: 'سارة العتيبي',
    groomFirstName: 'أحمد',
    groomLastName: 'الغامدي',
    groomFullName: 'أحمد الغامدي',
    weddingDate: '2026-12-18',
    weddingTime: '08:00 مساءً',
    timezone: 'Asia/Riyadh',

    // Hero & Message
    heroLayout: 'cinematic',
    messageHeading: 'بسم الله الرحمن الرحيم',
    messageBody: 'بكل مشاعر الود والامتنان، نتشرف بدعوتكم لمشاركتنا فرحتنا الغامرة وبداية حكايتنا معاً.',
    invitationText: 'دعوة لحضور حفل الزفاف المبارك',

    // Event
    eventTitle: 'حفل الزفاف والعشاء الملكي',
    venueName: 'فندق الريتز كارلتون - القاعة الكبرى',
    address: 'الرياض، المملكة العربية السعودية',
    mapsUrl: 'https://maps.google.com',

    // Music
    musicEnabled: true,
    musicTitle: 'Canon in D - Romantic Acoustic',
    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',

    // RSVP
    rsvpEnabled: true,
    rsvpDeadline: '2026-12-10',
    rsvpMaxGuests: 4,
    rsvpAllowPlusOne: true,

    // SEO
    seoTitle: 'دعوة زفاف فاخرة',
    seoDescription: 'نتشرف بحضوركم لمشاركتنا فرحة العمر.',
    whatsappMessage: 'يسعدنا دعوتكم لمشاركتنا فرحتنا ❤️\n\nتفاصيل الدعوة والمكان من هنا:\n[INVITATION_URL]',
  })

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-generate slug when bride and groom names change
  const handleBrideChange = (val: string) => {
    updateField('brideFirstName', val)
    updateField('brideFullName', `${val} ${formData.brideLastName}`.trim())
    if (val && formData.groomFirstName) {
      updateField('slug', slugify(`${val}-and-${formData.groomFirstName}`))
      updateField('coverMonogram', `${val.charAt(0)} & ${formData.groomFirstName.charAt(0)}`)
    }
  }

  const handleGroomChange = (val: string) => {
    updateField('groomFirstName', val)
    updateField('groomFullName', `${val} ${formData.groomLastName}`.trim())
    if (val && formData.brideFirstName) {
      updateField('slug', slugify(`${formData.brideFirstName}-and-${val}`))
      updateField('coverMonogram', `${formData.brideFirstName.charAt(0)} & ${val.charAt(0)}`)
    }
  }

  const handleSubmit = async (publishImmediately: boolean = true) => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const payload = {
        title: `${formData.brideFullName} & ${formData.groomFullName}`,
        slug: formData.slug,
        status: publishImmediately ? 'PUBLISHED' : 'DRAFT',
        language: formData.language,
        direction: formData.direction,
        themeId: formData.themeId,
        animationPreset: formData.animationPreset,
        coverEnabled: formData.coverEnabled,
        coverType: formData.coverType,
        coverImage: formData.coverImage,
        coverMonogram: formData.coverMonogram,
        musicEnabled: formData.musicEnabled,
        musicUrl: formData.musicUrl,
        musicTitle: formData.musicTitle,
        rsvpEnabled: formData.rsvpEnabled,
        rsvpDeadline: formData.rsvpDeadline,
        rsvpMaxGuests: formData.rsvpMaxGuests,
        rsvpAllowPlusOne: formData.rsvpAllowPlusOne,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        whatsappMessage: formData.whatsappMessage,

        couple: {
          brideFirstName: formData.brideFirstName,
          brideLastName: formData.brideLastName,
          brideFullName: formData.brideFullName,
          groomFirstName: formData.groomFirstName,
          groomLastName: formData.groomLastName,
          groomFullName: formData.groomFullName,
          weddingDate: formData.weddingDate,
          weddingTime: formData.weddingTime,
          timezone: formData.timezone,
          heroLayout: formData.heroLayout,
          heroImage: formData.coverImage,
          messageHeading: formData.messageHeading,
          messageBody: formData.messageBody,
          invitationText: formData.invitationText,
        },

        events: [
          {
            title: formData.eventTitle,
            date: formData.weddingDate,
            startTime: formData.weddingTime,
            venueName: formData.venueName,
            address: formData.address,
            mapsUrl: formData.mapsUrl,
            isVisible: true,
          },
        ],

        sections: [
          { sectionKey: 'hero', displayOrder: 1, isVisible: true },
          { sectionKey: 'message', displayOrder: 2, isVisible: true },
          { sectionKey: 'countdown', displayOrder: 3, isVisible: true },
          { sectionKey: 'events', displayOrder: 4, isVisible: true },
          { sectionKey: 'timeline', displayOrder: 5, isVisible: true },
          { sectionKey: 'gallery', displayOrder: 6, isVisible: true },
          { sectionKey: 'rsvp', displayOrder: 7, isVisible: formData.rsvpEnabled },
        ],
      }

      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'تعذر إنشاء الدعوة')
      }

      // Redirect to visual builder
      router.push(`/dashboard/invitations/edit/${data.id}`)
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء الحفظ.')
      setIsSubmitting(false)
    }
  }

  const steps = [
    { num: 1, title: 'العروسين والمعلومات الأساسية' },
    { num: 2, title: 'الموعد والمكان والفعالية' },
    { num: 3, title: 'السمة والمظهر العام' },
    { num: 4, title: 'الموسيقى وتأكيد الحضور' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Step Indicators */}
      <div className="bg-white p-4 rounded-sm border border-[#EAE1D3] shadow-xs">
        <div className="flex items-center justify-between">
          {steps.map((s) => (
            <div key={s.num} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === s.num
                    ? 'bg-[#C8A96B] text-white shadow-xs'
                    : currentStep > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FAF7F0] text-[#918579] border border-[#EAE1D3]'
                }`}
              >
                {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#332A25] truncate">
                {s.title}
              </span>
              {s.num < steps.length && (
                <div className="flex-1 h-[1px] bg-[#EAE1D3] mx-2 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Basic Info & Couple */}
      {currentStep === 1 && (
        <div className="bg-white p-6 md:p-8 rounded-sm border border-[#EAE1D3] shadow-xs space-y-6">
          <div className="border-b border-[#EAE1D3] pb-4">
            <h3 className="text-xl font-serif-luxury font-bold text-[#332A25]">
              بيانات العروسين والرابط
            </h3>
            <p className="text-xs text-[#918579] mt-0.5">
              حدد أسماء العروسين لإنشاء الرابط والشعار المونوغرام تلقائياً
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                اسم العروس *
              </label>
              <input
                type="text"
                required
                value={formData.brideFirstName}
                onChange={(e) => handleBrideChange(e.target.value)}
                placeholder="مثال: سارة"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                عائلة العروس
              </label>
              <input
                type="text"
                value={formData.brideLastName}
                onChange={(e) => {
                  updateField('brideLastName', e.target.value)
                  updateField('brideFullName', `${formData.brideFirstName} ${e.target.value}`.trim())
                }}
                placeholder="مثال: العتيبي"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                اسم العريس *
              </label>
              <input
                type="text"
                required
                value={formData.groomFirstName}
                onChange={(e) => handleGroomChange(e.target.value)}
                placeholder="مثال: أحمد"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                عائلة العريس
              </label>
              <input
                type="text"
                value={formData.groomLastName}
                onChange={(e) => {
                  updateField('groomLastName', e.target.value)
                  updateField('groomFullName', `${formData.groomFirstName} ${e.target.value}`.trim())
                }}
                placeholder="مثال: الغامدي"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          {/* Slug URL */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#332A25]">
              رابط الدعوة المباشر (URL Slug) *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-[#FAF7F0] border border-l-0 border-[#EAE1D3] text-xs text-[#918579] rounded-r-sm">
                /wedding/
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => updateField('slug', slugify(e.target.value))}
                className="flex-1 px-3.5 py-2.5 rounded-l-sm border border-[#EAE1D3] text-sm font-mono focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          {/* Monogram Seal */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#332A25]">
              رمز الشعار (Monogram)
            </label>
            <input
              type="text"
              value={formData.coverMonogram}
              onChange={(e) => updateField('coverMonogram', e.target.value)}
              placeholder="مثال: S & A"
              className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm font-serif-luxury focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>
      )}

      {/* STEP 2: Date, Time & Event Venue */}
      {currentStep === 2 && (
        <div className="bg-white p-6 md:p-8 rounded-sm border border-[#EAE1D3] shadow-xs space-y-6">
          <div className="border-b border-[#EAE1D3] pb-4">
            <h3 className="text-xl font-serif-luxury font-bold text-[#332A25]">
              الموعد والموقع الجغرافي
            </h3>
            <p className="text-xs text-[#918579] mt-0.5">
              تحديد تاريخ ووقت الحفل وموقع القاعة على Google Maps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                تاريخ حفل الزفاف *
              </label>
              <input
                type="date"
                required
                value={formData.weddingDate}
                onChange={(e) => updateField('weddingDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                الوقت والتوقيت *
              </label>
              <input
                type="text"
                value={formData.weddingTime}
                onChange={(e) => updateField('weddingTime', e.target.value)}
                placeholder="مثال: 08:00 مساءً"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#332A25]">
              اسم القاعة أو الفندق *
            </label>
            <input
              type="text"
              required
              value={formData.venueName}
              onChange={(e) => updateField('venueName', e.target.value)}
              placeholder="مثال: قاعة الفورسيزونز الكبرى"
              className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#332A25]">
              العنوان التفصيلي
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="مثال: طريق الملك فهد، الرياض"
              className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#332A25]">
              رابط موقع Google Maps
            </label>
            <input
              type="url"
              value={formData.mapsUrl}
              onChange={(e) => updateField('mapsUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Theme & Hero Layout */}
      {currentStep === 3 && (
        <div className="bg-white p-6 md:p-8 rounded-sm border border-[#EAE1D3] shadow-xs space-y-6">
          <div className="border-b border-[#EAE1D3] pb-4">
            <h3 className="text-xl font-serif-luxury font-bold text-[#332A25]">
              اختيار السمة والتصميم الفاخر
            </h3>
            <p className="text-xs text-[#918579] mt-0.5">
              اختر أحد التصاميم الجاهزة الستة مع إمكانية التخصيص الكامل لاحقاً
            </p>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getAllThemes().map((t) => (
              <div
                key={t.id}
                onClick={() => updateField('themeId', t.id)}
                className={`p-4 rounded-sm border-2 cursor-pointer transition-all ${
                  formData.themeId === t.id
                    ? 'border-[#C8A96B] shadow-md scale-102'
                    : 'border-[#EAE1D3] hover:border-[#C8A96B]/50'
                }`}
                style={{ backgroundColor: t.colors.background }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: t.colors.primary, borderColor: t.colors.gold }}
                  />
                  <span className="font-bold text-xs" style={{ color: t.colors.text }}>
                    {t.nameAr}
                  </span>
                </div>
                <p className="text-[10px] opacity-75 line-clamp-2" style={{ color: t.colors.textLight }}>
                  {t.description}
                </p>
              </div>
            ))}
          </div>

          {/* Hero Layout Selection */}
          <div className="pt-4 border-t border-[#EAE1D3]">
            <label className="block text-xs font-semibold mb-2 text-[#332A25]">
              نمط واجهة البداية (Hero Layout)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'cinematic', label: 'سينمائي خلفية كاملة' },
                { id: 'editorial', label: 'تحريري مجلة راقية' },
                { id: 'minimal', label: 'مينيمالي بسيط وهادئ' },
                { id: 'floral', label: 'رومانسي مع زخارف' },
                { id: 'split', label: 'شاشة مقسومة (نصفين)' },
                { id: 'arabic', label: 'خط عربي كلاسيكي' },
              ].map((h) => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => updateField('heroLayout', h.id)}
                  className={`p-3 rounded-sm border text-xs font-medium cursor-pointer transition-colors ${
                    formData.heroLayout === h.id
                      ? 'border-[#C8A96B] bg-[#FAF7F0] font-bold text-[#332A25]'
                      : 'border-[#EAE1D3] hover:bg-gray-50'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Music & RSVP */}
      {currentStep === 4 && (
        <div className="bg-white p-6 md:p-8 rounded-sm border border-[#EAE1D3] shadow-xs space-y-6">
          <div className="border-b border-[#EAE1D3] pb-4">
            <h3 className="text-xl font-serif-luxury font-bold text-[#332A25]">
              الموسيقى وخيارات الحضور (RSVP)
            </h3>
            <p className="text-xs text-[#918579] mt-0.5">
              تفعيل المشغل الموسيقي واستقبال ردود المدعوين
            </p>
          </div>

          {/* Music Toggle */}
          <div className="p-4 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-[#C8A96B]" />
              <div>
                <span className="font-semibold text-xs text-[#332A25] block">
                  تشغيل موسيقى هادئة في الخلفية
                </span>
                <span className="text-[11px] text-[#918579]">
                  يتم تشغيل الموسيقى بتفاعل الضيف مع زر فتح الدعوة
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={formData.musicEnabled}
              onChange={(e) => updateField('musicEnabled', e.target.checked)}
              className="w-4 h-4 text-[#C8A96B] cursor-pointer"
            />
          </div>

          {/* RSVP Toggle */}
          <div className="p-4 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#C8A96B]" />
              <div>
                <span className="font-semibold text-xs text-[#332A25] block">
                  تفعيل نموذج تأكيد الحضور (RSVP)
                </span>
                <span className="text-[11px] text-[#918579]">
                  السماح للضيوف بتأكيد الحضور وتحديد عدد الأفراد والتهنئة
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={formData.rsvpEnabled}
              onChange={(e) => updateField('rsvpEnabled', e.target.checked)}
              className="w-4 h-4 text-[#C8A96B] cursor-pointer"
            />
          </div>

          {formData.rsvpEnabled && (
            <div className="p-4 rounded-sm border border-[#EAE1D3] bg-white space-y-2">
              <p className="text-xs text-[#332A25] font-semibold">
                ✨ استمارة تأكيد الحضور مبسطة ومريحة للضيوف:
              </p>
              <p className="text-[11px] text-[#918579] leading-relaxed">
                يقوم الضيف بإدخال اسمه الكريم فقط (مطلوب) مع إمكانية ترك رسالة تهنئة للعروسين (اختياري)، بدون أي تعقيدات أو مواعيد إغلاق مفاجئة.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#EAE1D3]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-5 py-2.5 rounded-sm border border-[#EAE1D3] text-xs font-semibold text-[#332A25] hover:bg-white transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="px-4 py-2.5 rounded-sm border border-[#EAE1D3] text-xs font-semibold text-[#332A25] hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
              >
                حفظ كمسودة
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(true)}
                className="px-6 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري الإنشاء...' : 'نشر وفتح المحرر المباشر'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
