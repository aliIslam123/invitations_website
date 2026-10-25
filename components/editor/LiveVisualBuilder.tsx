'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Palette,
  Layout,
  Music,
  Calendar,
  Users,
  Settings,
  Image as ImageIcon,
  Check,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers,
  Share2,
  Upload,
  Plus,
  Trash2,
  Copy,
  Flower2,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  Heart,
  Edit3,
} from 'lucide-react'
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer'
import { WeddingCalendarCard } from '@/components/invitation/WeddingCalendarCard'
import { THEMES, getAllThemes, getTheme } from '@/lib/themes'
import { ANIMATION_PRESETS } from '@/lib/animations'
import { getInvitationUrl } from '@/lib/utils'
import { WEDDING_MUSIC_PRESETS } from '@/lib/musicPresets'

interface LiveVisualBuilderProps {
  initialInvitation: any
  siteUrl: string
}

export function LiveVisualBuilder({
  initialInvitation,
  siteUrl,
}: LiveVisualBuilderProps) {
  const router = useRouter()
  const [invitation, setInvitation] = useState(initialInvitation)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false)
  const [copyNotice, setCopyNotice] = useState(false)
  const [isUploading, setIsUploading] = useState<string | null>(null)

  const effectiveSiteUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : siteUrl && !siteUrl.includes('localhost')
      ? siteUrl
      : 'https://invitations-website-rust.vercel.app'

  // Sync state if initialInvitation updates from server router.refresh(), but never overwrite active typing
  useEffect(() => {
    if (initialInvitation && !hasUnsavedChanges) {
      setInvitation(initialInvitation)
    }
  }, [initialInvitation, hasUnsavedChanges])
  const [activeTab, setActiveTab] = useState<
    | 'couple'
    | 'theme'
    | 'effects'
    | 'gallery'
    | 'music'
    | 'sections'
    | 'events'
    | 'rsvp'
    | 'seo'
  >('couple')

  // Preview viewport mode: desktop, tablet, mobile
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  // Editor layout mode: 'split' (side by side 640px), 'wide' (wide studio 960px), 'preview' (full preview)
  const [editorLayoutMode, setEditorLayoutMode] = useState<'split' | 'wide' | 'preview'>('split')

  // Audio preview for music library in dashboard
  const [previewTrackUrl, setPreviewTrackUrl] = useState<string | null>(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  // New photo input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [newPhotoCaption, setNewPhotoCaption] = useState('')

  // Update top-level invitation field
  const updateInvitationField = (field: string, value: any) => {
    setInvitation((prev: any) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  // Update couple sub-record
  const updateCoupleField = (field: string, value: any) => {
    setInvitation((prev: any) => ({
      ...prev,
      couple: {
        ...(prev.couple || {}),
        [field]: value,
      },
    }))
    setHasUnsavedChanges(true)
  }

  // Helper to update custom effects inside themeCustom JSON
  const updateThemeCustomField = (key: string, value: any) => {
    let currentCustom: any = {}
    if (invitation.themeCustom) {
      try {
        currentCustom =
          typeof invitation.themeCustom === 'string'
            ? JSON.parse(invitation.themeCustom)
            : invitation.themeCustom
      } catch {}
    }
    const updated = { ...currentCustom, [key]: value }
    updateInvitationField('themeCustom', JSON.stringify(updated))
  }

  const getThemeCustomVal = (key: string, defaultVal: any) => {
    if (!invitation.themeCustom) return defaultVal
    try {
      const parsed =
        typeof invitation.themeCustom === 'string'
          ? JSON.parse(invitation.themeCustom)
          : invitation.themeCustom
      return parsed[key] !== undefined ? parsed[key] : defaultVal
    } catch {
      return defaultVal
    }
  }

  // File Upload Helper with error shielding
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    fieldKey: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Pre-check for Vercel serverless request limits
    if (file.size > 4.2 * 1024 * 1024) {
      alert(
        `حجم الملف (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) كبير للرفع المباشر.\n\nالحد الأقصى للملفات المرفوعة مباشرة هو 4 ميجابايت لضمان سرعة تصفح الضيوف.\n\n💡 يمكنك:\n1. وضع رابط المقطع الصوتي أو الصورة مباشرة (URL) في الخانة المخصصة وسيتم تشغيله بأي حجم.\n2. أو اختيار مقطع مميز من مكتبة المقاطع الجاهزة.`
      )
      if (e.target) e.target.value = ''
      return
    }

    setIsUploading(fieldKey)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('invitationId', invitation.id)

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          try {
            onSuccess(data.url)
          } catch (callbackErr) {
            console.error('Error applying uploaded file:', callbackErr)
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        alert(errData.error || 'حدث خطأ أثناء رفع الملف. يرجى التأكد من أن حجم الملف أقل من 4 ميجابايت.')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('تعذر رفع الملف من الجهاز. يرجى التأكد من أن حجم الملف أقل من 4 ميجابايت.')
    } finally {
      setIsUploading(null)
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  // Save changes to database
  const handleSave = async (statusOverride?: string) => {
    setIsSaving(true)
    try {
      const payload = {
        ...invitation,
        status: statusOverride || invitation.status,
      }

      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.invitation) {
          setInvitation(data.invitation)
        } else if (statusOverride) {
          updateInvitationField('status', statusOverride)
        }
        setHasUnsavedChanges(false)
        setSaveSuccessNotice(true)
        setTimeout(() => setSaveSuccessNotice(false), 3000)
        router.refresh()
      } else {
        alert('حدث خطأ أثناء حفظ التعديلات.')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('تعذر الحفظ.')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save on debounce: Automatically saves 2 seconds after the user stops typing
  useEffect(() => {
    if (!hasUnsavedChanges || isSaving) return

    const timer = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [hasUnsavedChanges, isSaving, invitation])

  // Ctrl+S / Cmd+S shortcut to save immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [invitation, isSaving])

  // Section visibility and reordering handlers
  const sections = useMemo(() => {
    const list = invitation.sections || [
      { sectionKey: 'hero', displayOrder: 0, isVisible: true },
      { sectionKey: 'message', displayOrder: 1, isVisible: true },
      { sectionKey: 'countdown', displayOrder: 2, isVisible: true },
      { sectionKey: 'events', displayOrder: 3, isVisible: true },
      { sectionKey: 'timeline', displayOrder: 4, isVisible: true },
      { sectionKey: 'gallery', displayOrder: 5, isVisible: true },
      { sectionKey: 'rsvp', displayOrder: 6, isVisible: true },
      { sectionKey: 'additional', displayOrder: 7, isVisible: true },
    ]
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder)
  }, [invitation.sections])

  const isEventsSectionVisible = sections.find((s) => s.sectionKey === 'events')?.isVisible !== false

  const toggleSectionVisibility = (key: string) => {
    const updated = sections.map((s) =>
      s.sectionKey === key ? { ...s, isVisible: !s.isVisible } : s
    )
    updateInvitationField('sections', updated)
    if (key === 'rsvp') {
      const rsvpSec = sections.find((s) => s.sectionKey === 'rsvp')
      updateInvitationField('rsvpEnabled', !rsvpSec?.isVisible)
    }
  }

  const handleToggleRSVP = (enabled: boolean) => {
    updateInvitationField('rsvpEnabled', enabled)
    const currentSecs = sections || []
    const updatedSecs = currentSecs.map((s: any) =>
      s.sectionKey === 'rsvp' ? { ...s, isVisible: enabled } : s
    )
    updateInvitationField('sections', updatedSecs)
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[targetIndex]
    newSections[targetIndex] = temp

    const reordered = newSections.map((s, idx) => ({ ...s, displayOrder: idx }))
    updateInvitationField('sections', reordered)
  }

  // Event Handlers
  const handleAddEvent = () => {
    const newEv = {
      id: `ev-${Date.now()}`,
      title: 'حفل الزفاف والعشاء الملكي',
      venueName: 'قاعة ليلتي للاحتفالات',
      address: 'جدة، طريق الكورنيش، حي الشاطئ، بوابة رقم 3',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00 مساءً',
      endTime: '01:00 صباحاً',
      mapsUrl: 'https://maps.google.com/?q=Laylaty+Hall+Jeddah',
      description: 'نستقبلكم بكل حب وترحاب لمشاركتنا ليلة العمر ومأدبة العشاء الفاخرة.',
      dressCode: 'الزي السعودي الرسمي / فساتين السهرة الراقية',
      displayOrder: (invitation.events || []).length,
      isVisible: true,
    }
    updateInvitationField('events', [...(invitation.events || []), newEv])
  }

  const updateEventField = (index: number, field: string, value: any) => {
    const list = [...(invitation.events || [])]
    list[index] = { ...list[index], [field]: value }
    updateInvitationField('events', list)
  }

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= (invitation.events || []).length) return
    const list = [...(invitation.events || [])]
    const temp = list[index]
    list[index] = list[target]
    list[target] = temp
    const reordered = list.map((ev, idx) => ({ ...ev, displayOrder: idx }))
    updateInvitationField('events', reordered)
  }

  const deleteEvent = (index: number) => {
    const list = [...(invitation.events || [])]
    list.splice(index, 1)
    const reordered = list.map((ev, idx) => ({ ...ev, displayOrder: idx }))
    updateInvitationField('events', reordered)
  }

  // Gallery Handlers
  const galleryPhotos = invitation.gallery || []

  const handleAddPhotoByUrl = () => {
    if (!newPhotoUrl.trim()) return
    const newPhoto = {
      id: `temp-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim(),
      altText: newPhotoCaption.trim(),
      displayOrder: galleryPhotos.length,
      isVisible: true,
    }
    updateInvitationField('gallery', [...galleryPhotos, newPhoto])
    setNewPhotoUrl('')
    setNewPhotoCaption('')
  }

  const handleAddSamplePhotos = () => {
    const samples = [
      {
        id: `sample-1-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        caption: 'نظرة أولى تجمعنا بكل حب وشغف',
        displayOrder: galleryPhotos.length,
        isVisible: true,
      },
      {
        id: `sample-2-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        caption: 'تفاصيل الخواتم وبداية العهد الأبدي',
        displayOrder: galleryPhotos.length + 1,
        isVisible: true,
      },
      {
        id: `sample-3-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        caption: 'أجواء الحفل وتجهيزات القاعة الملكية',
        displayOrder: galleryPhotos.length + 2,
        isVisible: true,
      },
      {
        id: `sample-4-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
        caption: 'جلسة التصوير في الحديقة الملكية',
        displayOrder: galleryPhotos.length + 3,
        isVisible: true,
      },
    ]
    updateInvitationField('gallery', [...galleryPhotos, ...samples])
  }

  const updateGalleryPhotoField = (index: number, field: string, val: any) => {
    const list = [...galleryPhotos]
    list[index] = { ...list[index], [field]: val }
    updateInvitationField('gallery', list)
  }

  const moveGalleryPhoto = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= galleryPhotos.length) return
    const list = [...galleryPhotos]
    const temp = list[index]
    list[index] = list[target]
    list[target] = temp
    const reordered = list.map((item, idx) => ({ ...item, displayOrder: idx }))
    updateInvitationField('gallery', reordered)
  }

  const deleteGalleryPhoto = (index: number) => {
    const list = [...galleryPhotos]
    list.splice(index, 1)
    const reordered = list.map((item, idx) => ({ ...item, displayOrder: idx }))
    updateInvitationField('gallery', reordered)
  }

  // Dashboard Music Preview Helper
  const togglePreviewTrack = (url: string) => {
    if (previewTrackUrl === url && isPreviewPlaying) {
      previewAudioRef.current?.pause()
      setIsPreviewPlaying(false)
    } else {
      setPreviewTrackUrl(url)
      setIsPreviewPlaying(true)
      if (previewAudioRef.current) {
        previewAudioRef.current.src = url
        previewAudioRef.current.play().catch(() => setIsPreviewPlaying(false))
      }
    }
  }

  const publicUrl = getInvitationUrl(invitation.slug, effectiveSiteUrl)

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopyNotice(true)
    setTimeout(() => setCopyNotice(false), 2000)
  }

  const sectionLabels: Record<string, string> = {
    hero: 'واجهة البداية والعروسين (Hero)',
    message: 'رسالة الدعوة وكلمة الأهل (Message)',
    countdown: 'العد التنازلي لموعد الزفاف (Countdown)',
    events: 'الفعاليات وتفاصيل الموقع (Events & Maps)',
    timeline: 'مسار وبرنامج الحفل (Timeline)',
    gallery: 'معرض الصور التذكارية (Gallery)',
    rsvp: 'نموذج تأكيد الحضور (RSVP)',
    additional: 'قواعد الزي والهدايا (Additional)',
  }

  const isGallerySectionActive = sections.find((s) => s.sectionKey === 'gallery')?.isVisible ?? true

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] font-arabic-luxury text-[#332A25]">
      {/* Hidden audio element for dashboard track previews */}
      <audio
        ref={previewAudioRef}
        onEnded={() => setIsPreviewPlaying(false)}
      />

      {/* Top Header / Builder Toolbar */}
      <div className="h-16 bg-white border-b border-[#EAE1D3] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/invitations')}
            className="text-xs text-[#918579] hover:text-[#332A25] font-semibold"
          >
            ← العودة للقائمة
          </button>
          <div className="h-4 w-[1px] bg-[#EAE1D3]" />
          <div>
            <h1 className="text-sm md:text-base font-serif-luxury font-bold text-[#332A25] truncate max-w-[200px] md:max-w-md">
              {invitation.title || 'تعديل الدعوة'}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-[#918579]">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  invitation.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{invitation.status === 'PUBLISHED' ? 'منشورة أونلاين' : 'مسودة خاصة'}</span>
              {hasUnsavedChanges && !isSaving && (
                <span className="text-amber-700 font-medium flex items-center gap-1 animate-pulse">
                  ● جاري حفظ التعديلات تلقائياً...
                </span>
              )}
              {isSaving && (
                <span className="text-[#C8A96B] font-semibold flex items-center gap-1">
                  ⏳ جاري الحفظ والتحديث المباشر...
                </span>
              )}
              {saveSuccessNotice && !hasUnsavedChanges && !isSaving && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> تم حفظ التعديلات وتحديث الرابط فورياً!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Layout & Viewport Switchers */}
        <div className="flex items-center gap-2">
          {/* Editor Layout Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-md border border-[#EAE1D3]">
            <button
              type="button"
              onClick={() => setEditorLayoutMode('wide')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                editorLayoutMode === 'wide'
                  ? 'bg-white shadow-xs text-[#C8A96B]'
                  : 'text-[#918579] hover:text-[#332A25]'
              }`}
              title="مساحة تعديل موسعة ومريحة (بدون معاينة جانبية)"
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden md:inline">محرر واسع</span>
            </button>

            <button
              type="button"
              onClick={() => setEditorLayoutMode('split')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                editorLayoutMode === 'split'
                  ? 'bg-white shadow-xs text-[#C8A96B]'
                  : 'text-[#918579] hover:text-[#332A25]'
              }`}
              title="تعديل مع معاينة مباشرة جنباً إلى جنب"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">متوازن</span>
            </button>

            <button
              type="button"
              onClick={() => setEditorLayoutMode('preview')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                editorLayoutMode === 'preview'
                  ? 'bg-white shadow-xs text-[#C8A96B]'
                  : 'text-[#918579] hover:text-[#332A25]'
              }`}
              title="معاينة الدعوة بالكامل"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">معاينة فقط</span>
            </button>
          </div>

          {/* Viewport Mode Toggle (Visible when preview is active or split) */}
          {editorLayoutMode !== 'wide' && (
            <div className="hidden md:flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-md border border-[#EAE1D3]">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-white shadow-xs text-[#C8A96B]' : 'text-[#918579]'
                }`}
                title="معاينة شاشة الكمبيوتر (Desktop)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewportMode === 'tablet' ? 'bg-white shadow-xs text-[#C8A96B]' : 'text-[#918579]'
                }`}
                title="معاينة التابلت (Tablet)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-white shadow-xs text-[#C8A96B]' : 'text-[#918579]'
                }`}
                title="معاينة الموبايل (Mobile)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyPublicLink}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#EAE1D3] text-xs text-[#332A25] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
            title="نسخ رابط الدعوة المباشر"
          >
            <Copy className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>{copyNotice ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </button>

          {invitation.status === 'PUBLISHED' && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async (e) => {
                if (hasUnsavedChanges) {
                  e.preventDefault()
                  await handleSave()
                  window.open(publicUrl, '_blank')
                }
              }}
              className="p-2 rounded border border-[#EAE1D3] text-[#332A25] hover:bg-[#FAF7F0] transition-colors"
              title="فتح الرابط العام الفعلي"
            >
              <ExternalLink className="w-4 h-4 text-[#C8A96B]" />
            </a>
          )}

          {invitation.status === 'DRAFT' ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('PUBLISHED')}
              className="px-3.5 py-1.5 rounded-sm text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>نشر الدعوة</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('DRAFT')}
              className="px-3 py-1.5 rounded-sm text-xs font-semibold border border-amber-300 text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              مسودة
            </button>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave()}
            className="px-4 py-1.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Control Panel + Right Live Preview */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT PANEL: Settings & Controls */}
        <div
          className={`bg-white border-l border-[#EAE1D3] flex flex-col shrink-0 overflow-hidden shadow-xs z-10 transition-all duration-300 ${
            editorLayoutMode === 'preview'
              ? 'hidden'
              : editorLayoutMode === 'wide'
              ? 'w-full lg:w-[940px] xl:w-[1040px] max-w-5xl mx-auto shadow-md border-x'
              : 'w-full lg:w-[580px] xl:w-[650px]'
          }`}
        >
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-[#EAE1D3] bg-[#FAF7F0] p-2 overflow-x-auto text-[11px] font-semibold scrollbar-none">
            {[
              { id: 'couple', label: 'العروسين والموعد', icon: Sparkles },
              { id: 'events', label: 'الفعاليات والموقع', icon: Calendar },
              { id: 'rsvp', label: 'تأكيد الحضور (RSVP)', icon: Users },
              { id: 'music', label: 'الموسيقى', icon: Music },
              { id: 'effects', label: 'تأثيرات الورود', icon: Flower2 },
              { id: 'gallery', label: 'معرض الصور', icon: ImageIcon },
              { id: 'theme', label: 'السمة والألوان', icon: Palette },
              { id: 'sections', label: 'ترتيب الأقسام', icon: Layers },
              { id: 'seo', label: 'الغلاف والمشاركة', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white shadow-xs text-[#C8A96B] border border-[#C8A96B]/40 font-bold'
                      : 'text-[#918579] hover:text-[#332A25] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A96B]' : 'text-[#918579]'}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
            {/* TAB: COUPLE INFO & IMAGES */}
            {activeTab === 'couple' && (
              <div className="space-y-5">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  معلومات وبيانات العروسين
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      اسم العروس
                    </label>
                    <input
                      type="text"
                      value={invitation.couple?.brideFirstName || ''}
                      onChange={(e) => updateCoupleField('brideFirstName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      عائلة العروس
                    </label>
                    <input
                      type="text"
                      value={invitation.couple?.brideLastName || ''}
                      onChange={(e) => updateCoupleField('brideLastName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      اسم العريس
                    </label>
                    <input
                      type="text"
                      value={invitation.couple?.groomFirstName || ''}
                      onChange={(e) => updateCoupleField('groomFirstName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      عائلة العريس
                    </label>
                    <input
                      type="text"
                      value={invitation.couple?.groomLastName || ''}
                      onChange={(e) => updateCoupleField('groomLastName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>
                </div>

                {/* Wedding Date, Time & Calendar Widget */}
                <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/30 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#EAE1D3]">
                    <Calendar className="w-4 h-4 text-[#C8A96B]" />
                    <span className="text-xs font-bold text-[#332A25]">
                      تاريخ وتوقيت حفل الزفاف الرئيسي
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                        تاريخ يوم الزفاف *
                      </label>
                      <input
                        type="date"
                        value={
                          invitation.couple?.weddingDate
                            ? new Date(invitation.couple.weddingDate)
                                .toISOString()
                                .split('T')[0]
                            : ''
                        }
                        onChange={(e) => {
                          const newDate = e.target.value
                          updateCoupleField('weddingDate', newDate)
                          // Sync with first event date if present
                          if (invitation.events && invitation.events.length > 0) {
                            const updatedEvents = [...invitation.events]
                            updatedEvents[0] = { ...updatedEvents[0], date: newDate }
                            updateInvitationField('events', updatedEvents)
                          }
                        }}
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0] font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                        وقت الحفل (نص ترحيبي)
                      </label>
                      <input
                        type="text"
                        value={invitation.couple?.weddingTime || ''}
                        onChange={(e) => {
                          const newTime = e.target.value
                          updateCoupleField('weddingTime', newTime)
                          if (invitation.events && invitation.events.length > 0) {
                            const updatedEvents = [...invitation.events]
                            updatedEvents[0] = { ...updatedEvents[0], startTime: newTime }
                            updateInvitationField('events', updatedEvents)
                          }
                        }}
                        placeholder="مثال: 08:00 مساءً"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]"
                      />
                    </div>
                  </div>

                  {/* Wedding Calendar Toggle with Heart Icon */}
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#C8A96B] fill-current" />
                        <span className="text-xs font-bold text-[#332A25]">
                          إظهار تقويم شهر الزفاف (مع وسم القلب ❤️ على يوم الحفل)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={getThemeCustomVal('calendarEnabled', true)}
                        onChange={(e) =>
                          updateThemeCustomField('calendarEnabled', e.target.checked)
                        }
                        className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                      />
                    </div>

                    <p className="text-[11px] text-[#918579] leading-relaxed">
                      يظهر تقويماً شهرياً أنيقاً تحت خانة الميعاد مع قلب ملكي يُحدد يوم زفافكم بدقة، وزر لحفظ الموعد في تقويم جوجل.
                    </p>

                    {getThemeCustomVal('calendarEnabled', true) &&
                      invitation.couple?.weddingDate && (
                        <div className="pt-1 flex justify-center">
                          <WeddingCalendarCard
                            weddingDate={invitation.couple.weddingDate}
                            theme={getTheme(invitation.themeId || 'royal-champagne')}
                            isRtl={true}
                          />
                        </div>
                      )}
                  </div>
                </div>

                {/* Bride & Groom Photos Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Bride Photo */}
                  <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#332A25]">
                        صورة العروس (اختياري)
                      </label>
                      <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>{isUploading === 'bridePhoto' ? 'جاري الرفع...' : 'رفع صورة'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading !== null}
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              (url) => updateCoupleField('bridePhoto', url),
                              'bridePhoto'
                            )
                          }
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={invitation.couple?.bridePhoto || ''}
                      onChange={(e) => updateCoupleField('bridePhoto', e.target.value)}
                      placeholder="رابط صورة العروس أو ارفع من جهازك"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-white"
                    />
                    {invitation.couple?.bridePhoto && (
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={invitation.couple.bridePhoto}
                          alt="Bride"
                          className="w-10 h-10 rounded-full object-cover border border-[#C8A96B]"
                        />
                        <button
                          type="button"
                          onClick={() => updateCoupleField('bridePhoto', null)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Groom Photo */}
                  <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#332A25]">
                        صورة العريس (اختياري)
                      </label>
                      <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>{isUploading === 'groomPhoto' ? 'جاري الرفع...' : 'رفع صورة'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading !== null}
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              (url) => updateCoupleField('groomPhoto', url),
                              'groomPhoto'
                            )
                          }
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={invitation.couple?.groomPhoto || ''}
                      onChange={(e) => updateCoupleField('groomPhoto', e.target.value)}
                      placeholder="رابط صورة العريس أو ارفع من جهازك"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-white"
                    />
                    {invitation.couple?.groomPhoto && (
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={invitation.couple.groomPhoto}
                          alt="Groom"
                          className="w-10 h-10 rounded-full object-cover border border-[#C8A96B]"
                        />
                        <button
                          type="button"
                          onClick={() => updateCoupleField('groomPhoto', null)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hero Background Image with Upload */}
                <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#332A25]">
                      صورة واجهة العروسين الرئيسية (Hero Background)
                    </label>
                    <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>{isUploading === 'hero' ? 'جاري الرفع...' : 'رفع صورة من جهازك'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading !== null}
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            (url) => updateCoupleField('heroImage', url),
                            'hero'
                          )
                        }
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={invitation.couple?.heroImage || ''}
                    onChange={(e) => updateCoupleField('heroImage', e.target.value)}
                    placeholder="https://... رابط صورة الواجهة أو ارفع من جهازك"
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-white"
                  />
                  {invitation.couple?.heroImage && (
                    <div className="relative h-28 rounded overflow-hidden border border-[#C8A96B]/30">
                      <img
                        src={invitation.couple.heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                    عنوان الدعوة في الواجهة
                  </label>
                  <input
                    type="text"
                    value={invitation.couple?.invitationText || ''}
                    onChange={(e) => updateCoupleField('invitationText', e.target.value)}
                    placeholder="دعوة لحضور حفل الزفاف المبارك"
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                    نص رسالة الدعوة
                  </label>
                  <textarea
                    rows={4}
                    value={invitation.couple?.messageBody || ''}
                    onChange={(e) => updateCoupleField('messageBody', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                  />
                </div>

                {/* Hero Layout Selector */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                    تصميم واجهة البداية (Hero Layout)
                  </label>
                  <select
                    value={invitation.couple?.heroLayout || 'cinematic'}
                    onChange={(e) => updateCoupleField('heroLayout', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] cursor-pointer"
                  >
                    <option value="cinematic">سينمائي خلفية كاملة (Full Cinematic)</option>
                    <option value="editorial">تحريري نمط المجلات (Editorial Portrait)</option>
                    <option value="minimal">مينيمالي هادئ (Minimal Luxury)</option>
                    <option value="floral">رومانسي زهري (Floral Romantic)</option>
                    <option value="split">شاشة مقسومة (Split Screen)</option>
                    <option value="arabic">خط عربي كلاسيكي (Arabic Typography)</option>
                  </select>
                </div>

                {/* Subtext under Couple names */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                    العبارة الترحيبية أسفل اسم العروسين
                  </label>
                  <input
                    type="text"
                    value={invitation.couple?.invitationSubtext || ''}
                    onChange={(e) => updateCoupleField('invitationSubtext', e.target.value)}
                    placeholder="وبحضوركم يكتمل الفرح وتتوج أجمل اللحظات"
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                  />
                </div>

                {/* Family Names Box */}
                <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#332A25]">
                      إظهار كلمة الأهل وعائلتي العروسين
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.couple?.familyNamesEnabled)}
                      onChange={(e) => updateCoupleField('familyNamesEnabled', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                  {invitation.couple?.familyNamesEnabled && (
                    <textarea
                      rows={2}
                      value={invitation.couple?.familyNamesContent || ''}
                      onChange={(e) => updateCoupleField('familyNamesContent', e.target.value)}
                      placeholder="يتشرف فلان وفلان بدعوتكم لحضور حفل زفاف كريمتهما..."
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                    />
                  )}
                </div>

                {/* Closing Message at the End of the Invitation */}
                <div className="p-4 bg-white border-2 border-[#C8A96B]/40 rounded-lg space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-[#C8A96B]" />
                    <span className="text-xs font-bold text-[#332A25]">
                      رسالة ختامية وشكر في نهاية الدعوة من تحت:
                    </span>
                  </div>
                  <p className="text-[11px] text-[#918579]">
                    تظهر في بطاقة خاصة في أسفل الدعوة لشكر الضيوف على تلبية الدعوة.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                      عنوان رسالة الختام
                    </label>
                    <input
                      type="text"
                      value={invitation.couple?.closingTitle || ''}
                      onChange={(e) => updateCoupleField('closingTitle', e.target.value)}
                      placeholder="مثال: شاكرين لكم مشاركتنا فرحتنا"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                      نص الرسالة الختامية في أسفل الدعوة
                    </label>
                    <textarea
                      rows={3}
                      value={invitation.couple?.postEventMessage || ''}
                      onChange={(e) => updateCoupleField('postEventMessage', e.target.value)}
                      placeholder="مثال: حضوركم شرف لنا وسعادتنا تكتمل برؤيتكم، شاكرين لكم ومقدرين طيب مشاعركم ودعواتكم الصادقة."
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GALLERY (معرض الصور) */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    إدارة معرض الصور التذكارية
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSamplePhotos}
                    className="text-[11px] text-[#C8A96B] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>إضافة 4 صور نموذجية</span>
                  </button>
                </div>

                {/* Status notice */}
                <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#332A25]">
                    تفعيل ظهور قسم الصور في الدعوة
                  </span>
                  <input
                    type="checkbox"
                    checked={isGallerySectionActive}
                    onChange={() => toggleSectionVisibility('gallery')}
                    className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                  />
                </div>

                {/* Upload New Image Box */}
                <div className="p-4 bg-white border-2 border-dashed border-[#C8A96B]/50 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-[#332A25]">
                    إضافة صورة جديدة إلى المعرض:
                  </p>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 py-2 px-3 rounded border border-[#C8A96B] text-center text-xs font-semibold text-[#C8A96B] hover:bg-[#FAF7F0] cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading === 'gallery' ? 'جاري الرفع...' : 'رفع صورة من جهازك'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading !== null}
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            (url) => {
                              const newPhoto = {
                                id: `upload-${Date.now()}`,
                                url,
                                caption: '',
                                altText: '',
                                displayOrder: galleryPhotos.length,
                                isVisible: true,
                              }
                              updateInvitationField('gallery', [...galleryPhotos, newPhoto])
                              // Automatically activate gallery section visibility so user sees it in preview
                              const currentSecs = invitation.sections || []
                              const updatedSecs = currentSecs.map((s: any) =>
                                s.sectionKey === 'gallery' ? { ...s, isVisible: true } : s
                              )
                              updateInvitationField('sections', updatedSecs)
                            },
                            'gallery'
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Or add by URL */}
                  <div className="pt-2 border-t border-[#EAE1D3] space-y-2">
                    <span className="text-[10px] text-[#918579] block">أو أضف رابط صورة مباشر:</span>
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://... رابط الصورة"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-white"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="تعليق اختياري على الصورة..."
                        className="flex-1 px-3 py-1.5 text-xs rounded border border-[#EAE1D3]"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        disabled={!newPhotoUrl.trim()}
                        className="px-3 py-1.5 rounded bg-[#C8A96B] text-white text-xs font-semibold hover:bg-[#A68648] disabled:opacity-40 cursor-pointer"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Photos List */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#332A25]">
                    الصور الحالية ({galleryPhotos.length} صورة):
                  </p>

                  {galleryPhotos.length === 0 ? (
                    <p className="text-xs text-[#918579] p-4 text-center bg-[#FAF7F0] rounded">
                      لا توجد صور في المعرض حالياً. يمكنك رفع الصور أو استخدام "إضافة صور نموذجية" أعلاه.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {galleryPhotos.map((photo: any, idx: number) => {
                        if (!photo || !photo.url) return null
                        return (
                        <div
                          key={photo.id || idx}
                          className="p-3 bg-[#FAF7F0] rounded-lg border border-[#EAE1D3] flex items-center gap-3"
                        >
                          {/* Image thumbnail */}
                          <div className="w-16 h-16 rounded overflow-hidden shrink-0 border border-[#C8A96B]/30 bg-black/10">
                            <img
                              src={photo.url}
                              alt={photo.caption || 'Photo'}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Caption & Settings */}
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={photo.caption || ''}
                              onChange={(e) =>
                                updateGalleryPhotoField(idx, 'caption', e.target.value)
                              }
                              placeholder="أدخل تعليقاً على الصورة..."
                              className="w-full px-2 py-1 text-xs rounded border border-[#EAE1D3] bg-white"
                            />
                            <div className="flex items-center gap-2">
                              <label className="text-[10px] text-[#918579] flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={photo.isVisible ?? true}
                                  onChange={(e) =>
                                    updateGalleryPhotoField(idx, 'isVisible', e.target.checked)
                                  }
                                  className="w-3 h-3"
                                />
                                <span>إظهار في المعرض</span>
                              </label>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveGalleryPhoto(idx, 'up')}
                              className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                              title="تحريك لأعلى"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-[#332A25]" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === galleryPhotos.length - 1}
                              onClick={() => moveGalleryPhoto(idx, 'down')}
                              className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                              title="تحريك لأسفل"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-[#332A25]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteGalleryPhoto(idx)}
                              className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                              title="حذف الصورة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: EFFECTS (تأثيرات الورود والتمرير السينمائي) */}
            {activeTab === 'effects' && (
              <div className="space-y-6">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  تأثيرات الخلفية والورود المتحركة والتمرير
                </h4>

                {/* Floating Floral & Petals Effect */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-[#332A25]">
                    تأثير الزهور والورود المتحركة في خلفية الدعوة:
                  </label>
                  <p className="text-[11px] text-[#918579]">
                    تتحرك برقة متناهية وخفة في خلفية الشاشة لتعطي طابعاً ملكياً رومانسياً دون إزعاج القارئ.
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: 'romantic',
                        title: '💐 مزيج رومانسي ملكي (بتلات ورد + بريق ذهبي)',
                        desc: 'أكثر الخيارات فخامة، يجمع بين بتلات الورد المتطايرة وحبيبات البريق الهادئة',
                      },
                      {
                        id: 'petals',
                        title: '🌸 بتلات ورود ملكية ناعمة (Rose Petals)',
                        desc: 'بتلات ورد مخملية ناعمة تتساقط برقة وانسيابية',
                      },
                      {
                        id: 'leaves',
                        title: '🌿 أوراق شجر وأغصان ذهبية خفية (Botanical Leaves)',
                        desc: 'أوراق نباتية رقيقة مذهبة مستوحاة من الطبيعة والقصور',
                      },
                      {
                        id: 'sparkles',
                        title: '✨ غبار ذهبي لامع متلألئ (Golden Stardust)',
                        desc: 'نجوم وحبيبات بريق تتلألأ بهدوء ملكي في الخلفية',
                      },
                      {
                        id: 'none',
                        title: '🚫 بدون تأثيرات متحركة في الخلفية',
                        desc: 'خلفية ثابتة كلاسيكية بدون زهور متساقطة',
                      },
                    ].map((eff) => {
                      const current = getThemeCustomVal('backgroundEffect', 'romantic')
                      const isSelected = current === eff.id
                      return (
                        <div
                          key={eff.id}
                          onClick={() => updateThemeCustomField('backgroundEffect', eff.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C8A96B] bg-[#FAF7F0] shadow-xs'
                              : 'border-[#EAE1D3] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#332A25]">{eff.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#C8A96B]" />}
                          </div>
                          <p className="text-[11px] text-[#918579] mt-1">{eff.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Auto Scroll on Open Settings */}
                <div className="pt-4 border-t border-[#EAE1D3] space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3]">
                    <div>
                      <span className="text-xs font-semibold text-[#332A25] block">
                        التمرير التلقائي الناعم عند فتح الدعوة (Cinematic Auto-Tour)
                      </span>
                      <span className="text-[11px] text-[#918579]">
                        يبدأ الموقع بالنزول الهادئ تلقائياً بمجرد ضغط الضيف على "فتح الدعوة".
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={getThemeCustomVal('autoScrollEnabled', true)}
                      onChange={(e) =>
                        updateThemeCustomField('autoScrollEnabled', e.target.checked)
                      }
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MUSIC (الموسيقى الملكية) */}
            {activeTab === 'music' && (
              <div className="space-y-6">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  المشغل الموسيقي وقائمة ألحان الزفاف
                </h4>

                <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#332A25]">تفعيل الموسيقى في الدعوة</span>
                  <input
                    type="checkbox"
                    checked={invitation.musicEnabled}
                    onChange={(e) => updateInvitationField('musicEnabled', e.target.checked)}
                    className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                  />
                </div>

                {invitation.musicEnabled && (
                  <>
                    {/* Curated Presets Library */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-[#332A25]">
                        اختر من مكتبة ألحان الزفاف الملكية (استمع قبل الاختيار):
                      </label>

                      <div className="space-y-2">
                        {WEDDING_MUSIC_PRESETS.map((track) => {
                          const isSelected = invitation.musicUrl === track.url
                          const isTrackPreviewing =
                            previewTrackUrl === track.url && isPreviewPlaying

                          return (
                            <div
                              key={track.id}
                              className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#C8A96B] bg-[#FAF7F0] shadow-xs'
                                  : 'border-[#EAE1D3] hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Listen Preview Button */}
                                <button
                                  type="button"
                                  onClick={() => togglePreviewTrack(track.url)}
                                  className="w-8 h-8 rounded-full bg-[#C8A96B] text-white flex items-center justify-center shrink-0 hover:scale-105 cursor-pointer shadow-xs"
                                  title={isTrackPreviewing ? 'إيقاف الاستماع' : 'استماع للمقطع'}
                                >
                                  {isTrackPreviewing ? (
                                    <Pause className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 ml-0.5" />
                                  )}
                                </button>

                                <div>
                                  <p className="text-xs font-bold text-[#332A25]">{track.titleAr}</p>
                                  <p className="text-[10px] text-[#918579]">{track.artist}</p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  updateInvitationField('musicUrl', track.url)
                                  updateInvitationField('musicTitle', track.titleAr)
                                }}
                                className={`px-2.5 py-1 text-[11px] rounded font-semibold cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-[#C8A96B] text-white'
                                    : 'border border-[#C8A96B] text-[#C8A96B] hover:bg-[#C8A96B] hover:text-white'
                                }`}
                              >
                                {isSelected ? 'المقطع المختار ✓' : 'اختيار المقطع'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Custom Audio Upload or URL */}
                    <div className="p-3 bg-white border border-[#EAE1D3] rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#332A25]">
                          رفع مقطع صوتي مخصص من جهازك:
                        </label>
                        <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploading === 'music' ? 'جاري الرفع...' : 'اختيار ملف صوتي'}</span>
                          <input
                            type="file"
                            accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                            className="hidden"
                            disabled={isUploading !== null}
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f && f.size > 4.2 * 1024 * 1024) {
                                alert(
                                  `حجم الملف الصوتي (${(f.size / (1024 * 1024)).toFixed(1)} ميجابايت) كبير للرفع المباشر.\n\nالحد الأقصى للرفع المباشر هو 4 ميجابايت لضمان سرعة تصفح الضيوف.\n\n💡 يمكنك:\n1. وضع رابط المقطع الصوتي المباشر (URL) في الخانة أدناه وسيعمل فوراً بأي حجم!\n2. أو اختيار مقطع مميز من مكتبة الموسيقى الجاهزة بالأعلى.`
                                )
                                e.target.value = ''
                                return
                              }
                              handleFileUpload(
                                e,
                                (url) => {
                                  updateInvitationField('musicUrl', url)
                                  updateInvitationField('musicTitle', 'مقطع صوتي خاص')
                                },
                                'music'
                              )
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#73675C] mb-1">
                          اسم أو عنوان المقطع الموسيقي
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: موسيقى زفاف رومانسية هادئة"
                          value={invitation.musicTitle || ''}
                          onChange={(e) => updateInvitationField('musicTitle', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#73675C] mb-1">
                          أو الصق رابط المقطع الصوتي المباشر (Direct Audio URL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/audio.mp3 (رابط مقطع مباشر أو من جوجل درايف)"
                          value={invitation.musicUrl || ''}
                          onChange={(e) => updateInvitationField('musicUrl', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] outline-none font-mono"
                        />
                        <p className="text-[10px] text-[#918579] mt-1">
                          يدعم أي رابط مباشر لصوت بصيغة MP3 أو WAV من أي موقع على الإنترنت.
                        </p>
                      </div>

                      {invitation.musicUrl && (
                        <div className="flex items-center justify-between p-2.5 bg-[#FAF7F0] rounded border border-[#C8A96B]/40">
                          <div className="flex items-center gap-2 truncate">
                            <Music className="w-4 h-4 text-[#C8A96B] shrink-0" />
                            <span className="text-xs font-semibold truncate text-[#332A25]">
                              الملف الصوتي النشط: {invitation.musicTitle || invitation.musicUrl}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePreviewTrack(invitation.musicUrl)}
                            className="px-2.5 py-1 text-xs rounded bg-[#C8A96B] text-white hover:bg-[#A68648] flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {previewTrackUrl === invitation.musicUrl && isPreviewPlaying ? (
                              <>
                                <Pause className="w-3 h-3" />
                                <span>إيقاف</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                <span>تجربة الصوت</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Position selector */}
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                        موقع زر الموسيقى في الشاشة
                      </label>
                      <select
                        value={invitation.musicPosition || 'bottom-right'}
                        onChange={(e) => updateInvitationField('musicPosition', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] cursor-pointer"
                      >
                        <option value="bottom-right">أسفل اليمين (موصى به)</option>
                        <option value="bottom-left">أسفل اليسار</option>
                        <option value="top-right">أعلى اليمين</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB: THEME & APPEARANCE */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  السمات والأنماط البصرية
                </h4>

                {/* Theme Selector */}
                <div className="space-y-2.5">
                  {getAllThemes().map((t) => (
                    <div
                      key={t.id}
                      onClick={() => updateInvitationField('themeId', t.id)}
                      className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                        invitation.themeId === t.id
                          ? 'border-[#C8A96B] bg-[#FAF7F0] shadow-xs'
                          : 'border-[#EAE1D3] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.colors.primary }}
                        />
                        <div>
                          <p className="text-xs font-bold text-[#332A25]">{t.nameAr}</p>
                          <p className="text-[10px] text-[#918579]">{t.name}</p>
                        </div>
                      </div>
                      {invitation.themeId === t.id && (
                        <Check className="w-4 h-4 text-[#C8A96B]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECTIONS ORDER & VISIBILITY */}
            {activeTab === 'sections' && (
              <div className="space-y-5">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  ترتيب وإظهار أقسام الدعوة
                </h4>

                <div className="space-y-2">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.sectionKey}
                      className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={sec.isVisible}
                          onChange={() => toggleSectionVisibility(sec.sectionKey)}
                          className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[#332A25]">
                          {sectionLabels[sec.sectionKey] || sec.sectionKey}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, 'up')}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, 'down')}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EVENTS */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    تفاصيل الموعد والقاعة والفعاليات
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="px-3 py-1.5 rounded bg-[#C8A96B] text-white text-xs font-semibold hover:bg-[#A68648] flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة فعالية جديدة</span>
                  </button>
                </div>

                {/* Master Section Visibility Toggle */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isEventsSectionVisible ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isEventsSectionVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#332A25]">
                        إظهار قسم الفعاليات والموقع في الدعوة
                      </p>
                      <p className="text-[11px] text-[#918579]">
                        {isEventsSectionVisible
                          ? 'القسم معروض حالياً للضيوف في صفحة الدعوة'
                          : 'القسم مخفي بالكامل ولن يظهر للضيوف'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility('events')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isEventsSectionVisible ? 'bg-[#C8A96B]' : 'bg-gray-300'
                    }`}
                    title={isEventsSectionVisible ? 'اضغط لإخفاء القسم بالكامل' : 'اضغط لإظهار القسم'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEventsSectionVisible ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Section Titles Customization */}
                <div className="p-4 bg-[#FAF7F0] rounded-lg border border-[#EAE1D3] space-y-3">
                  <p className="text-xs font-bold text-[#332A25]">
                    تخصيص عناوين قسم الموقع والموعد:
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                      العنوان الفرعي (أعلى القسم)
                    </label>
                    <input
                      type="text"
                      value={getThemeCustomVal('eventsSubtitle', 'الموعد والمكان')}
                      onChange={(e) => updateThemeCustomField('eventsSubtitle', e.target.value)}
                      placeholder="الموعد والمكان"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white focus:border-[#C8A96B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                      العنوان الرئيسي للقسم
                    </label>
                    <input
                      type="text"
                      value={getThemeCustomVal('eventsTitle', 'تفاصيل الحفل والموقع')}
                      onChange={(e) => updateThemeCustomField('eventsTitle', e.target.value)}
                      placeholder="تفاصيل الحفل والموقع"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white focus:border-[#C8A96B]"
                    />
                  </div>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-[#332A25]">
                    قائمة الفعاليات والمواقع ({ (invitation.events || []).length }):
                  </p>

                  {(invitation.events || []).length === 0 ? (
                    <div className="p-4 text-center bg-[#FAF7F0] rounded border border-[#EAE1D3] text-xs text-[#918579]">
                      لا توجد فعاليات مضافة حالياً. اضغط "إضافة فعالية جديدة" لإضافة الحفل أو القاعة.
                    </div>
                  ) : (
                    (invitation.events || []).map((ev: any, idx: number) => (
                      <div
                        key={ev.id || idx}
                        className={`p-4 rounded-lg border space-y-3 relative shadow-xs transition-all ${
                          ev.isVisible !== false ? 'bg-[#FAF7F0] border-[#EAE1D3]' : 'bg-gray-50 border-gray-300 opacity-70'
                        }`}
                      >
                        {/* Event Header with controls */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#EAE1D3]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#C8A96B]">
                              الفعالية #{idx + 1}
                            </span>
                            {ev.title && (
                              <span className="text-xs text-[#332A25] font-semibold truncate max-w-[140px] sm:max-w-xs">
                                • {ev.title}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Visibility Toggle Button */}
                            <button
                              type="button"
                              onClick={() => updateEventField(idx, 'isVisible', ev.isVisible === false ? true : false)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                ev.isVisible !== false
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300'
                              }`}
                              title={ev.isVisible !== false ? 'الفعالية معروضة للضيوف (اضغط للإخفاء)' : 'الفعالية مخفية (اضغط للإظهار)'}
                            >
                              {ev.isVisible !== false ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>معروضة</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                                  <span>مخفية</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveEvent(idx, 'up')}
                              className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                              title="تحريك لأعلى"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-[#332A25]" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (invitation.events || []).length - 1}
                              onClick={() => moveEvent(idx, 'down')}
                              className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                              title="تحريك لأسفل"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-[#332A25]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEvent(idx)}
                              className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                              title="حذف هذه الفعالية"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {ev.isVisible === false && (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-center gap-1.5 font-medium">
                            <EyeOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>هذه الفعالية مخفية حالياً ولن تظهر للضيوف في صفحة الدعوة.</span>
                          </div>
                        )}

                        {/* Event Title */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            عنوان الفعالية
                          </label>
                          <input
                            type="text"
                            value={ev.title || ''}
                            onChange={(e) => updateEventField(idx, 'title', e.target.value)}
                            placeholder="مثال: حفل الزفاف والعشاء الملكي"
                            className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white font-bold"
                          />
                        </div>

                        {/* Venue Name */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            اسم المكان / القاعة / الفندق
                          </label>
                          <input
                            type="text"
                            value={ev.venueName || ''}
                            onChange={(e) => updateEventField(idx, 'venueName', e.target.value)}
                            placeholder="مثال: قاعة ليلتي للاحتفالات"
                            className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                          />
                        </div>

                        {/* Detailed Address */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            العنوان بالتفصيل (المدينة، الحي، الشارع، المعلم)
                          </label>
                          <textarea
                            rows={2}
                            value={ev.address || ''}
                            onChange={(e) => updateEventField(idx, 'address', e.target.value)}
                            placeholder="مثال: جدة، طريق الكورنيش، حي الشاطئ، بوابة رقم 3 أمام نافورة الملك فهد"
                            className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                          />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-[#918579] mb-1">
                              التاريخ
                            </label>
                            <input
                              type="date"
                              value={
                                ev.date
                                  ? typeof ev.date === 'string'
                                    ? ev.date.split('T')[0]
                                    : new Date(ev.date).toISOString().split('T')[0]
                                  : ''
                              }
                              onChange={(e) => updateEventField(idx, 'date', e.target.value)}
                              className="w-full px-2 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-[#918579] mb-1">
                              وقت البدء
                            </label>
                            <input
                              type="text"
                              value={ev.startTime || ''}
                              onChange={(e) => updateEventField(idx, 'startTime', e.target.value)}
                              placeholder="08:00 مساءً"
                              className="w-full px-2 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-[#918579] mb-1">
                              وقت الانتهاء
                            </label>
                            <input
                              type="text"
                              value={ev.endTime || ''}
                              onChange={(e) => updateEventField(idx, 'endTime', e.target.value)}
                              placeholder="01:00 صباحاً"
                              className="w-full px-2 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                            />
                          </div>
                        </div>

                        {/* Maps URL */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            رابط خرائط جوجل (Google Maps URL)
                          </label>
                          <input
                            type="url"
                            value={ev.mapsUrl || ''}
                            onChange={(e) => updateEventField(idx, 'mapsUrl', e.target.value)}
                            placeholder="https://maps.google.com/?q=..."
                            className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                          />
                        </div>

                        {/* Notes / Description */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            ملاحظات وتفاصيل إضافية للضيوف
                          </label>
                          <input
                            type="text"
                            value={ev.description || ''}
                            onChange={(e) => updateEventField(idx, 'description', e.target.value)}
                            placeholder="مثال: نرجو الحضور قبل موعد الزفة بنصف ساعة"
                            className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: RSVP */}
            {activeTab === 'rsvp' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    إعدادات زر تأكيد الحضور (RSVP)
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      invitation.rsvpEnabled
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {invitation.rsvpEnabled ? 'الزر مفعّل في الدعوة' : 'الزر معطّل ومخفي'}
                  </span>
                </div>

                {/* Primary RSVP Switch Banner */}
                <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/40 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#332A25] block">
                          تفعيل زر تأكيد الحضور في الدعوة
                        </span>
                        <span className="text-[11px] text-[#918579]">
                          إظهار زر تأكيد الحضور الذهبي وبطاقة الرد للضيوف
                        </span>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(invitation.rsvpEnabled)}
                        onChange={(e) => handleToggleRSVP(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8A96B]"></div>
                    </label>
                  </div>

                  {invitation.rsvpEnabled && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[11px] text-[#918579] mb-2 font-medium">
                        معاينة شكل الزر في واجهة الدعوة:
                      </p>
                      <div className="flex items-center justify-center p-3 bg-[#FAF7F0] rounded-sm border border-[#EAE1D3]">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-[#332A25] bg-gradient-to-r from-[#DFCA9B] via-[#C8A96B] to-[#DFCA9B] shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#332A25]" />
                          <span>تأكيد الحضور (RSVP)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {invitation.rsvpEnabled && (
                  <div className="space-y-4 p-4 bg-[#FAF7F0] rounded-xl border border-[#EAE1D3]">
                    <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-lg">
                      <Sparkles className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#332A25] space-y-1">
                        <p className="font-bold">نموذج تأكيد الحضور مبسط وسهل جداً للضيوف:</p>
                        <p className="text-[11px] text-[#918579] leading-relaxed">
                          • يتضمن فقط: <span className="font-bold text-[#332A25]">الاسم الكريم</span> (مطلوب).<br />
                          • يتيح للضيف ترك: <span className="font-bold text-[#332A25]">رسالة تهنئة للعروسين</span> (اختياري).<br />
                          • تم إلغاء أي شروط أو مواعيد إغلاق مفاجئة لضمان تسجيل كل الضيوف بسلاسة.
                        </p>
                      </div>
                    </div>

                    {/* Thank You Message */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-[#332A25]">
                        رسالة الشكر والترحيب بعد تأكيد الحضور
                      </label>
                      <textarea
                        rows={3}
                        value={invitation.rsvpConfirmMsg || ''}
                        onChange={(e) => updateInvitationField('rsvpConfirmMsg', e.target.value)}
                        placeholder="تم تأكيد حضوركم بكل سرور، ننتظركم بشوق لنحتفل معاً بهذه المناسبة السعيدة!"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#EAE1D3] bg-white focus:outline-none focus:border-[#C8A96B]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SEO & COVER */}
            {activeTab === 'seo' && (
              <div className="space-y-5">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  غلاف الدعوة ورسالة الواتساب
                </h4>

                <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#332A25] block">
                      تفعيل غلاف الدعوة السينمائي
                    </span>
                    <span className="text-[11px] text-[#918579]">
                      شاشة افتتاحية بختم ملكي وزر "فتح الدعوة"
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={invitation.coverEnabled}
                    onChange={(e) => updateInvitationField('coverEnabled', e.target.checked)}
                    className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                  />
                </div>

                {invitation.coverEnabled && (
                  <div className="space-y-4">
                    {/* Cover Background Image */}
                    <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#332A25]">
                          صورة خلفية الغلاف (Cover Image)
                        </label>
                        <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>{isUploading === 'cover' ? 'جاري الرفع...' : 'رفع صورة من جهازك'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading !== null}
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                (url) => updateInvitationField('coverImage', url),
                                'cover'
                              )
                            }
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={invitation.coverImage || ''}
                        onChange={(e) => updateInvitationField('coverImage', e.target.value)}
                        placeholder="رابط صورة الغلاف أو ارفع من جهازك"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-white"
                      />
                      {invitation.coverImage && (
                        <div className="relative h-20 rounded overflow-hidden border border-[#C8A96B]/30">
                          <img
                            src={invitation.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                        المونوغرام / الحروف الأولى
                      </label>
                      <input
                        type="text"
                        value={invitation.coverMonogram || ''}
                        onChange={(e) => updateInvitationField('coverMonogram', e.target.value)}
                        placeholder="A & S"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                    رسالة المشاركة عبر واتساب
                  </label>
                  <textarea
                    rows={4}
                    value={invitation.whatsappMessage || ''}
                    onChange={(e) => updateInvitationField('whatsappMessage', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Action Bar in Editor Panel */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-[#EAE1D3] p-3 px-5 flex items-center justify-between z-20 shadow-md">
            <div className="flex items-center gap-2">
              {hasUnsavedChanges ? (
                <span className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>توجد تعديلات غير محفوظة</span>
                </span>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم حفظ جميع التعديلات</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditorLayoutMode(editorLayoutMode === 'preview' ? 'split' : 'preview')}
                className="px-3 py-2 rounded-lg text-xs font-bold border border-[#EAE1D3] text-[#332A25] hover:bg-[#FAF7F0] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>معاينة</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave()}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#DFCA9B] via-[#C8A96B] to-[#B89248] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Visual Preview */}
        <div
          className={`flex-1 bg-gray-100 p-2 md:p-6 overflow-auto items-start justify-center transition-all ${
            editorLayoutMode === 'wide' ? 'hidden' : 'flex'
          }`}
        >
          {editorLayoutMode === 'preview' && (
            <button
              onClick={() => setEditorLayoutMode('split')}
              className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full text-xs font-bold text-white bg-[#332A25]/90 hover:bg-[#332A25] shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer border border-[#C8A96B]/50 transition-all hover:scale-105"
            >
              <Edit3 className="w-4 h-4 text-[#C8A96B]" />
              <span>العودة للتعديل</span>
            </button>
          )}

          <div
            className={`transition-all duration-300 shadow-2xl bg-white overflow-hidden rounded-sm ${
              viewportMode === 'mobile'
                ? 'w-[390px] min-h-[780px] border-[10px] border-gray-800 rounded-[36px]'
                : viewportMode === 'tablet'
                ? 'w-[768px] min-h-[85vh] border-2 border-gray-800 rounded-lg'
                : 'w-full max-w-5xl min-h-[90vh]'
            }`}
          >
            <InvitationRenderer invitation={invitation} isPreviewMode={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
