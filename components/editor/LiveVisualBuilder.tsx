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
  Clock,
  Coffee,
  Utensils,
  Cake,
  Camera,
  Scissors,
  MapPin,
  Navigation,
  Shirt,
  Gift,
  ChevronLeft,
} from 'lucide-react'
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer'
import { WeddingCalendarCard } from '@/components/invitation/WeddingCalendarCard'
import { THEMES, getAllThemes, getTheme } from '@/lib/themes'
import { ANIMATION_PRESETS } from '@/lib/animations'
import { getInvitationUrl, formatSafeArabicDate } from '@/lib/utils'
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

  // Sync state if initialInvitation updates from server, but never overwrite active typing
  const initialIdRef = useRef(initialInvitation?.id)
  useEffect(() => {
    if (initialInvitation?.id && initialInvitation.id !== initialIdRef.current) {
      initialIdRef.current = initialInvitation.id
      setInvitation(initialInvitation)
    }
  }, [initialInvitation])

  const [activeTab, setActiveTab] = useState<
    | 'couple'
    | 'events'
    | 'timeline'
    | 'music'
    | 'effects'
    | 'gallery'
    | 'rsvp'
    | 'theme'
    | 'sections'
    | 'seo'
  >('couple')

  // Preview viewport mode: desktop, tablet, mobile
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  // Editor layout mode: 'split', 'wide', 'preview'
  const [editorLayoutMode, setEditorLayoutMode] = useState<'split' | 'wide' | 'preview'>('split')

  // Audio preview for music library in dashboard
  const [previewTrackUrl, setPreviewTrackUrl] = useState<string | null>(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  // Audio Trimmer preview states
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0)
  const [isTrimPreviewPlaying, setIsTrimPreviewPlaying] = useState<boolean>(false)

  const formatSecondsToMMSS = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const parseMMSSToSeconds = (text: string) => {
    if (!text) return 0
    const parts = text.split(':').map((p) => parseInt(p.trim(), 10))
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return Math.max(0, parts[0] * 60 + parts[1])
    }
    const val = parseFloat(text)
    return isNaN(val) ? 0 : Math.max(0, val)
  }

  // New photo input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [newPhotoCaption, setNewPhotoCaption] = useState('')

  // Update top-level invitation field
  const updateInvitationField = (field: string, value: any) => {
    setInvitation((prev: any) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  // Update couple sub-record with automatic synchronization of full names and invitation title
  const updateCoupleField = (field: string, value: any) => {
    setInvitation((prev: any) => {
      const currentCouple = prev.couple || {}
      const updatedCouple = {
        ...currentCouple,
        [field]: value,
      }

      // Automatically maintain clean groomFullName and brideFullName whenever first or last/family name changes
      if (field === 'groomFirstName' || field === 'groomLastName') {
        const first = (field === 'groomFirstName' ? value : (updatedCouple.groomFirstName || '')).trim()
        const last = (field === 'groomLastName' ? value : (updatedCouple.groomLastName || '')).trim()
        updatedCouple.groomFullName = [first, last].filter(Boolean).join(' ')
      }
      if (field === 'brideFirstName' || field === 'brideLastName') {
        const first = (field === 'brideFirstName' ? value : (updatedCouple.brideFirstName || '')).trim()
        const last = (field === 'brideLastName' ? value : (updatedCouple.brideLastName || '')).trim()
        updatedCouple.brideFullName = [first, last].filter(Boolean).join(' ')
      }

      if (field === 'groomFullName') {
        updatedCouple.groomFullName = value
      }
      if (field === 'brideFullName') {
        updatedCouple.brideFullName = value
      }

      const gName = updatedCouple.groomFullName || [updatedCouple.groomFirstName, updatedCouple.groomLastName].filter(Boolean).join(' ') || 'العريس'
      const bName = updatedCouple.brideFullName || [updatedCouple.brideFirstName, updatedCouple.brideLastName].filter(Boolean).join(' ') || 'العروس'

      return {
        ...prev,
        title: `${gName} & ${bName}`,
        couple: updatedCouple,
      }
    })
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

    if (file.size > 4.2 * 1024 * 1024) {
      alert(
        `حجم الملف (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) كبير للرفع المباشر.\n\nالحد الأقصى للملفات المرفوعة مباشرة هو 4 ميجابايت لضمان سرعة تصفح الضيوف.\n\n💡 يمكنك وضع رابط المقطع الصوتي أو الصورة مباشرة أو اختيار مقطع مميز من مكتبة المقاطع الجاهزة.`
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
      if (e.target) e.target.value = ''
    }
  }

  // Section visibility and reordering handlers
  const sections = useMemo(() => {
    const list = [...(invitation.sections || [])]
    const defaultSections = [
      'hero',
      'message',
      'countdown',
      'events',
      'timeline',
      'gallery',
      'rsvp',
      'additional',
    ]
    for (const key of defaultSections) {
      if (!list.some((s) => s.sectionKey === key)) {
        list.push({ sectionKey: key, displayOrder: list.length, isVisible: true })
      }
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder)
  }, [invitation.sections])

  const isEventsSectionVisible = sections.find((s) => s.sectionKey === 'events')?.isVisible !== false
  const isTimelineSectionVisible = sections.find((s) => s.sectionKey === 'timeline')?.isVisible !== false
  const isGallerySectionActive = sections.find((s) => s.sectionKey === 'gallery')?.isVisible !== false

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

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const reordered = [...sections]
    const temp = reordered[index]
    reordered[index] = reordered[targetIndex]
    reordered[targetIndex] = temp

    const updated = reordered.map((sec, idx) => ({
      ...sec,
      displayOrder: idx,
    }))

    updateInvitationField('sections', updated)
  }

  // Save changes to database
  const handleSave = async (statusOverride?: string) => {
    setIsSaving(true)
    try {
      const payload = {
        ...invitation,
        sections,
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
          setInvitation((prev: any) => ({
            ...prev,
            ...data.invitation,
            couple: {
              ...(prev.couple || {}),
              ...(data.invitation.couple || {}),
            },
            events: data.invitation.events || prev.events,
            timeline: data.invitation.timeline || prev.timeline,
            sections: data.invitation.sections || prev.sections,
          }))
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

  // Event Handlers
  const handleAddEvent = () => {
    const mainDate = invitation.couple?.weddingDate
      ? (typeof invitation.couple.weddingDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(invitation.couple.weddingDate)
          ? invitation.couple.weddingDate
          : new Date(invitation.couple.weddingDate).toISOString().split('T')[0])
      : '2026-11-16'
    const newEv = {
      id: `ev-${Date.now()}`,
      title: 'حفل الزفاف والعشاء الملكي',
      venueName: 'قاعة ليلتي للاحتفالات',
      address: 'شارع صلاح سالم، خلف مسجد الشرطة، القاهرة',
      date: mainDate,
      startTime: invitation.couple?.weddingTime || '07:00 مساءً',
      endTime: '11:30 مساءً',
      mapsUrl: 'https://maps.app.goo.gl/mmPPrcYeGhn95doW9',
      description: 'نستقبلكم بكل حب وترحاب لمشاركتنا ليلة العمر ومأدبة العشاء الفاخرة.',
      dressCode: 'الزي الرسمي الكامل / فساتين السهرة الراقية',
      showDressCode: true,
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

  const handleDeleteEvent = (index: number) => {
    const list = (invitation.events || []).filter((_: any, idx: number) => idx !== index)
    updateInvitationField('events', list)
  }

  // Timeline Handlers
  const handleAddTimelineItem = () => {
    const newItem = {
      id: `tm-${Date.now()}`,
      time: '08:30 م',
      title: 'زفة العروسين وبداية الحفل',
      description: 'دخول العروسين واستقبال التهاني والمباركات',
      icon: 'sparkles',
      displayOrder: (invitation.timeline || []).length,
      isVisible: true,
    }
    updateInvitationField('timeline', [...(invitation.timeline || []), newItem])
  }

  const updateTimelineField = (index: number, field: string, value: any) => {
    const list = [...(invitation.timeline || [])]
    list[index] = { ...list[index], [field]: value }
    updateInvitationField('timeline', list)
  }

  const handleDeleteTimelineItem = (index: number) => {
    const list = (invitation.timeline || []).filter((_: any, idx: number) => idx !== index)
    updateInvitationField('timeline', list)
  }

  // Gallery Handlers
  const handleAddPhoto = () => {
    if (!newPhotoUrl) return
    const newImg = {
      id: `img-${Date.now()}`,
      url: newPhotoUrl,
      caption: newPhotoCaption || null,
      displayOrder: (invitation.gallery || []).length,
      isVisible: true,
    }
    updateInvitationField('gallery', [...(invitation.gallery || []), newImg])
    setNewPhotoUrl('')
    setNewPhotoCaption('')
  }

  const handleDeletePhoto = (index: number) => {
    const list = (invitation.gallery || []).filter((_: any, idx: number) => idx !== index)
    updateInvitationField('gallery', list)
  }

  // Audio Library Preview
  const handlePreviewAudio = (url: string) => {
    if (previewTrackUrl === url && isPreviewPlaying) {
      if (previewAudioRef.current) previewAudioRef.current.pause()
      setIsPreviewPlaying(false)
      setIsTrimPreviewPlaying(false)
    } else {
      setPreviewTrackUrl(url)
      setIsPreviewPlaying(true)
      setIsTrimPreviewPlaying(false)
      if (previewAudioRef.current) {
        previewAudioRef.current.src = url
        previewAudioRef.current.currentTime = 0
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] font-arabic-luxury text-[#332A25]">
      {/* Hidden audio element for previews & trimmer */}
      <audio
        ref={previewAudioRef}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration || 0
          setAudioDuration(d)
          if (!getThemeCustomVal('musicEnd', null) && d > 0) {
            updateThemeCustomField('musicEnd', Math.round(d))
          }
        }}
        onTimeUpdate={(e) => {
          const cur = e.currentTarget.currentTime
          setAudioCurrentTime(cur)
          if (isTrimPreviewPlaying) {
            const startSec = getThemeCustomVal('musicStart', 0)
            const endSec = getThemeCustomVal('musicEnd', audioDuration || 60)
            if (cur >= endSec) {
              if (previewAudioRef.current) {
                previewAudioRef.current.currentTime = startSec
              }
            }
          }
        }}
        onEnded={() => {
          setIsPreviewPlaying(false)
          setIsTrimPreviewPlaying(false)
        }}
        className="hidden"
      />

      {/* TOP HEADER BAR */}
      <div className="h-14 border-b border-[#EAE1D3] bg-white px-4 flex items-center justify-between shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="p-1.5 rounded-lg border border-[#EAE1D3] text-[#73675C] hover:text-[#332A25] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
            title="العودة للوحة التحكم"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs md:text-sm font-bold text-[#332A25] truncate max-w-[200px] md:max-w-xs">
                {invitation.title || 'محرر الدعوة الفاخر'}
              </h1>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  invitation.status === 'PUBLISHED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {invitation.status === 'PUBLISHED' ? 'منشورة' : 'مسودة'}
              </span>
            </div>
            <p className="text-[10px] text-[#918579] hidden sm:block">
              {hasUnsavedChanges ? '⚠️ توجد تعديلات غير محفوظة' : '✓ كافة التعديلات محفوظة'}
            </p>
          </div>
        </div>

        {/* Center: Viewport & Layout Mode */}
        <div className="hidden lg:flex items-center gap-4 bg-[#FAF7F0] p-1 rounded-lg border border-[#EAE1D3]">
          {/* Viewport: Desktop / Tablet / Mobile */}
          <div className="flex items-center gap-1 border-l border-[#EAE1D3] pl-2">
            {[
              { id: 'desktop', icon: Monitor, label: 'كمبيوتر' },
              { id: 'tablet', icon: Tablet, label: 'تابلت' },
              { id: 'mobile', icon: Smartphone, label: 'جوال' },
            ].map((vp) => {
              const Icon = vp.icon
              return (
                <button
                  key={vp.id}
                  type="button"
                  onClick={() => setViewportMode(vp.id as any)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewportMode === vp.id
                      ? 'bg-white text-[#C8A96B] shadow-xs'
                      : 'text-[#918579] hover:text-[#332A25]'
                  }`}
                  title={vp.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>

          {/* Layout: Split / Wide / Preview */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditorLayoutMode('split')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                editorLayoutMode === 'split'
                  ? 'bg-white text-[#C8A96B] shadow-xs'
                  : 'text-[#918579] hover:text-[#332A25]'
              }`}
            >
              شاشة مقسومة
            </button>
            <button
              type="button"
              onClick={() => setEditorLayoutMode('wide')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                editorLayoutMode === 'wide'
                  ? 'bg-white text-[#C8A96B] shadow-xs'
                  : 'text-[#918579] hover:text-[#332A25]'
              }`}
            >
              استوديو عريض
            </button>
            <button
              type="button"
              onClick={() => setEditorLayoutMode('preview')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                editorLayoutMode === 'preview'
                  ? 'bg-white text-[#C8A96B] shadow-xs'
                  : 'text-[#918579] hover:text-[#332A25]'
              }`}
            >
              معاينة كاملة
            </button>
          </div>
        </div>

        {/* Right Actions: Live Link, Publish, Save */}
        <div className="flex items-center gap-2">
          {saveSuccessNotice && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 animate-fade-in flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم الحفظ فوراً!</span>
            </span>
          )}

          <button
            type="button"
            onClick={copyPublicLink}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#EAE1D3] text-xs text-[#332A25] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
            title="نسخ رابط الدعوة المباشر"
          >
            <Copy className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>{copyNotice ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </button>

          {invitation.slug && (
            <a
              href={`${publicUrl}?v=${Date.now()}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async (e) => {
                if (hasUnsavedChanges) {
                  e.preventDefault()
                  await handleSave()
                  window.open(`${publicUrl}?v=${Date.now()}`, '_blank')
                }
              }}
              className="px-2.5 py-1.5 rounded border border-[#C8A96B]/50 bg-[#FAF7F0] text-[#332A25] hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
              title="فتح الرابط المباشر للدعوة بدون كاش"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="hidden sm:inline">رابط الدعوة المباشر</span>
            </a>
          )}

          {invitation.status === 'DRAFT' ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('PUBLISHED')}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>نشر الدعوة</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('DRAFT')}
              className="px-3 py-1.5 rounded-md text-xs font-semibold border border-amber-300 text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              مسودة
            </button>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave()}
            className="px-4 py-1.5 rounded-md text-xs font-bold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </div>

      {/* MAIN SPLIT LAYOUT */}
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
              { id: 'events', label: 'مكان الحفل والفعاليات', icon: MapPin },
              { id: 'timeline', label: 'برنامج الحفل', icon: Clock },
              { id: 'music', label: 'الموسيقى والصوت', icon: Music },
              { id: 'effects', label: 'تأثيرات الورود', icon: Flower2 },
              { id: 'gallery', label: 'معرض الصور', icon: ImageIcon },
              { id: 'rsvp', label: 'تأكيد الحضور (RSVP)', icon: Users },
              { id: 'theme', label: 'السمة والألوان', icon: Palette },
              { id: 'sections', label: 'ترتيب الأقسام', icon: Layers },
              { id: 'seo', label: 'الغلاف والمشاركة', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#C8A96B] text-white shadow-xs font-bold'
                      : 'text-[#73675C] hover:bg-white/80 hover:text-[#332A25]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* TAB CONTENT PANELS */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
            {/* ========================================================= */}
            {/* TAB 1: COUPLE & DATE & DETAILS */}
            {/* ========================================================= */}
            {activeTab === 'couple' && (
              <div className="space-y-5">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  معلومات وبيانات العروسين وموعد الحفل
                </h4>

                {/* Groom's info */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#EAE1D3] pb-2">
                    <span className="text-xs font-bold text-[#332A25]">
                      بيانات العريس
                    </span>
                    <span className="text-[10px] text-[#C8A96B] font-semibold">
                      تظهر في واجهة الدعوة والغلاف
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-[#332A25]">
                        اسم العريس الأول
                      </label>
                      <input
                        type="text"
                        value={invitation.couple?.groomFirstName || ''}
                        onChange={(e) => updateCoupleField('groomFirstName', e.target.value)}
                        placeholder="مثال: محمد"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-[#332A25]">
                        عائلة العريس (اللقب)
                      </label>
                      <input
                        type="text"
                        value={invitation.couple?.groomLastName || ''}
                        onChange={(e) => updateCoupleField('groomLastName', e.target.value)}
                        placeholder="مثال: الغامدي"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-[#332A25]">
                      الاسم الكامل المعروض للعريس في الدعوة
                    </label>
                    <input
                      type="text"
                      value={
                        invitation.couple?.groomFullName ||
                        [invitation.couple?.groomFirstName, invitation.couple?.groomLastName].filter(Boolean).join(' ') ||
                        ''
                      }
                      onChange={(e) => updateCoupleField('groomFullName', e.target.value)}
                      placeholder="الاسم الكامل كما سيظهر في كافة شاشات الدعوة"
                      className="w-full px-3 py-2 text-xs rounded border border-[#C8A96B]/50 focus:border-[#C8A96B] bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Bride's info */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#EAE1D3] pb-2">
                    <span className="text-xs font-bold text-[#332A25]">
                      بيانات العروس
                    </span>
                    <span className="text-[10px] text-[#C8A96B] font-semibold">
                      تظهر في واجهة الدعوة والغلاف
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-[#332A25]">
                        اسم العروس الأول
                      </label>
                      <input
                        type="text"
                        value={invitation.couple?.brideFirstName || ''}
                        onChange={(e) => updateCoupleField('brideFirstName', e.target.value)}
                        placeholder="مثال: سارة"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-[#332A25]">
                        عائلة العروس (اللقب)
                      </label>
                      <input
                        type="text"
                        value={invitation.couple?.brideLastName || ''}
                        onChange={(e) => updateCoupleField('brideLastName', e.target.value)}
                        placeholder="مثال: العتيبي"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-[#332A25]">
                      الاسم الكامل المعروض للعروس في الدعوة
                    </label>
                    <input
                      type="text"
                      value={
                        invitation.couple?.brideFullName ||
                        [invitation.couple?.brideFirstName, invitation.couple?.brideLastName].filter(Boolean).join(' ') ||
                        ''
                      }
                      onChange={(e) => updateCoupleField('brideFullName', e.target.value)}
                      placeholder="الاسم الكامل كما سيظهر في كافة شاشات الدعوة"
                      className="w-full px-3 py-2 text-xs rounded border border-[#C8A96B]/50 focus:border-[#C8A96B] bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Family Names & Announcement Card */}
                <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/40 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C8A96B]" />
                      <span className="text-xs font-bold text-[#332A25]">
                        إظهار اسم العائلة وكلمة الأهل (دعوة العائلتين):
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.couple?.familyNamesEnabled)}
                      onChange={(e) => updateCoupleField('familyNamesEnabled', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-[#918579] leading-relaxed">
                    تظهر صيغة دعوة الأهل والعائلتين بوضوح وأناقة في أعلى واجهة الدعوة وبدايتها وعند ترحيب الضيوف.
                  </p>

                  {Boolean(invitation.couple?.familyNamesEnabled) && (
                    <div className="space-y-2 pt-2 border-t border-[#EAE1D3]">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-semibold text-[#332A25]">
                          صيغة دعوة العائلتين المكتوبة:
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const gFamily = invitation.couple?.groomLastName?.trim() || invitation.couple?.groomFullName?.trim() || 'العريس'
                            const bFamily = invitation.couple?.brideLastName?.trim() || invitation.couple?.brideFullName?.trim() || 'العروس'
                            const autoMsg = `يتشرف آل ${gFamily} وآل ${bFamily} بدعوتكم لحضور حفل الزفاف المبارك`
                            updateCoupleField('familyNamesContent', autoMsg)
                          }}
                          className="text-[10px] text-[#C8A96B] hover:underline font-semibold cursor-pointer"
                        >
                          توليد تلقائي من العائلتين 🪄
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={invitation.couple?.familyNamesContent || ''}
                        onChange={(e) => updateCoupleField('familyNamesContent', e.target.value)}
                        placeholder="يتشرف آل فلان وآل فلان بدعوتكم لحضور حفل الزفاف..."
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0] text-[#332A25]"
                      />

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateCoupleField(
                              'familyNamesContent',
                              `يتشرف والد العريس ووالد العروس بدعوتكم لمشاركتهم فرحة العمر`
                            )
                          }
                          className="px-2 py-1 text-[10px] bg-[#FAF7F0] hover:bg-[#EAE1D3] rounded border border-[#EAE1D3] text-[#7A6B5F]"
                        >
                          صيغة الوالدين
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateCoupleField(
                              'familyNamesContent',
                              `بقلوب تفيض بالحب والسرور، تتشرف عائلتا العروسين بدعوتكم لمشاركتنا أجمل ليالي العمر`
                            )
                          }
                          className="px-2 py-1 text-[10px] bg-[#FAF7F0] hover:bg-[#EAE1D3] rounded border border-[#EAE1D3] text-[#7A6B5F]"
                        >
                          صيغة محبة العائلتين
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monogram Box at start of invitation */}
                <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/30 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                      <span className="text-xs font-bold text-[#332A25]">
                        شعار الحروف الأولى في بداية الدعوة (المونوغرام Monogram):
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateThemeCustomField('showMonogram', !getThemeCustomVal('showMonogram', true))
                      }
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                        getThemeCustomVal('showMonogram', true)
                          ? 'bg-[#10B981]/15 text-[#059669] border-[#10B981]/40 shadow-xs'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {getThemeCustomVal('showMonogram', true) ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>معروضة في بداية الدعوة</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>مخفية من بداية الدعوة</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#918579]">
                    تظهر الحروف في الدائرة والشعار الفاخر في أعلى واجهة الدعوة والغلاف. يمكنك إخفاؤها أو تعديلها.
                  </p>

                  {getThemeCustomVal('showMonogram', true) && (
                    <div className="space-y-2 pt-2 border-t border-[#EAE1D3]">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-semibold text-[#332A25]">
                          نص الحروف الأولى (مثال: M & A أو م & أ):
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const gChar = invitation.couple?.groomFirstName?.trim()?.charAt(0) || invitation.couple?.groomFullName?.trim()?.charAt(0) || 'M'
                            const bChar = invitation.couple?.brideFirstName?.trim()?.charAt(0) || invitation.couple?.brideFullName?.trim()?.charAt(0) || 'A'
                            const autoLetters = `${gChar} & ${bChar}`
                            updateInvitationField('coverMonogram', autoLetters)
                            updateCoupleField('monogram', autoLetters)
                          }}
                          className="text-[10px] text-[#C8A96B] hover:underline font-semibold cursor-pointer"
                        >
                          توليد تلقائي من الأسماء 🪄
                        </button>
                      </div>
                      <input
                        type="text"
                        value={invitation.coverMonogram || invitation.couple?.monogram || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          updateInvitationField('coverMonogram', val)
                          updateCoupleField('monogram', val)
                        }}
                        placeholder="مثال: M & A أو م & أ"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] font-serif-luxury text-center tracking-widest text-sm bg-[#FAF7F0]"
                      />
                    </div>
                  )}
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-[#332A25]">
                          تاريخ يوم الزفاف *
                        </label>
                        {invitation.couple?.weddingDate && (
                          <span className="text-[10px] text-[#C8A96B] font-bold">
                            {formatSafeArabicDate(invitation.couple.weddingDate)}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={
                          invitation.couple?.weddingDate
                            ? (typeof invitation.couple.weddingDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(invitation.couple.weddingDate)
                                ? invitation.couple.weddingDate
                                : new Date(invitation.couple.weddingDate).toISOString().split('T')[0])
                            : ''
                        }
                        onChange={(e) => {
                          const newDate = e.target.value
                          const currentCouple = invitation.couple || {}
                          const currentEvents = [...(invitation.events || [])]
                          if (currentEvents.length > 0) {
                            currentEvents[0] = { ...currentEvents[0], date: newDate }
                          }
                          setInvitation((prev: any) => ({
                            ...prev,
                            couple: { ...currentCouple, weddingDate: newDate },
                            events: currentEvents,
                          }))
                          setHasUnsavedChanges(true)
                        }}
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                        وقت وتوقيت الحفل
                      </label>
                      <input
                        type="text"
                        value={invitation.couple?.weddingTime || ''}
                        onChange={(e) => {
                          const newTime = e.target.value
                          const currentCouple = invitation.couple || {}
                          const currentEvents = [...(invitation.events || [])]
                          if (currentEvents.length > 0 && !currentEvents[0].startTime) {
                            currentEvents[0] = { ...currentEvents[0], startTime: newTime }
                          }
                          setInvitation((prev: any) => ({
                            ...prev,
                            couple: { ...currentCouple, weddingTime: newTime },
                            events: currentEvents,
                          }))
                          setHasUnsavedChanges(true)
                        }}
                        placeholder="مثال: 07:00 مساءً"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                      />
                    </div>
                  </div>

                  {/* Calendar Widget Card show/hide */}
                  <div className="pt-2 border-t border-[#EAE1D3] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#332A25]">
                        عرض بطاقة نتيجة التقويم الفاخرة (Calendar Badge)
                      </label>
                      <input
                        type="checkbox"
                        checked={getThemeCustomVal('calendarEnabled', true)}
                        onChange={(e) =>
                          updateThemeCustomField('calendarEnabled', e.target.checked)
                        }
                        className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                      />
                    </div>
                    {getThemeCustomVal('calendarEnabled', true) &&
                      invitation.couple?.weddingDate && (
                        <div className="pt-1 flex justify-center">
                          <WeddingCalendarCard
                            weddingDate={invitation.couple.weddingDate}
                            theme={getTheme(invitation.themeId || 'royal-champagne')}
                          />
                        </div>
                      )}
                  </div>
                </div>

                {/* Hero Layout & Main Texts */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-[#EAE1D3]">
                    <Layout className="w-4 h-4 text-[#C8A96B]" />
                    <span className="text-xs font-bold text-[#332A25]">
                      تصميم ونصوص واجهة الدعوة الرئيسية (Hero)
                    </span>
                  </div>

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

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      نص رسالة الدعوة الرئيسية
                    </label>
                    <textarea
                      rows={3}
                      value={invitation.couple?.messageBody || ''}
                      onChange={(e) => updateCoupleField('messageBody', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>
                </div>

                {/* Hero and Couple Photos Upload */}
                <div className="space-y-3">
                  {/* Hero Background */}
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

                  {/* Groom & Bride individual photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Groom Photo */}
                    <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#332A25]">
                          صورة العريس (اختياري)
                        </label>
                        <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>{isUploading === 'groomPhoto' ? 'رفع...' : 'رفع صورة'}</span>
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
                        placeholder="رابط صورة العريس"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                      />
                    </div>

                    {/* Bride Photo */}
                    <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#332A25]">
                          صورة العروس (اختياري)
                        </label>
                        <label className="cursor-pointer text-[11px] font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>{isUploading === 'bridePhoto' ? 'رفع...' : 'رفع صورة'}</span>
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
                        placeholder="رابط صورة العروس"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                      />
                    </div>
                  </div>
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

                {/* General Dress Code Section */}
                <div className="p-4 bg-white border-2 border-[#C8A96B]/40 rounded-lg space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Shirt className="w-4 h-4 text-[#C8A96B]" />
                      <span className="text-xs font-bold text-[#332A25]">
                        قواعد الزي الرسمي العام (Dress Code):
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !Boolean(invitation.couple?.dressCodeEnabled)
                        const currentCouple = invitation.couple || {}
                        const updatedCouple = {
                          ...currentCouple,
                          dressCodeEnabled: nextVal,
                          dressCodeContent:
                            currentCouple.dressCodeContent ||
                            'نرجو التكرم بالالتزام بالزي الرسمي الكامل (بدلة كاملة للرجال، فساتين سواريه للسيدات)',
                        }
                        const updatedSections = sections.map((s) =>
                          s.sectionKey === 'additional' ? { ...s, isVisible: true } : s
                        )
                        if (!updatedSections.some((s) => s.sectionKey === 'additional')) {
                          updatedSections.push({
                            sectionKey: 'additional',
                            displayOrder: updatedSections.length,
                            isVisible: true,
                          })
                        }
                        setInvitation((prev: any) => ({
                          ...prev,
                          couple: updatedCouple,
                          sections: updatedSections,
                        }))
                        setHasUnsavedChanges(true)
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                        invitation.couple?.dressCodeEnabled
                          ? 'bg-[#10B981]/15 text-[#059669] border-[#10B981]/40 shadow-xs'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {invitation.couple?.dressCodeEnabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>معروضة في الدعوة</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>مخفية من الدعوة</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#918579]">
                    تحدد للضيوف نوع الملابس المفضلة لحفل الزفاف. تظهر أو تختفي فوراً بضغطة زر.
                  </p>

                  {invitation.couple?.dressCodeEnabled && (
                    <div className="space-y-2 pt-1 border-t border-[#EAE1D3]">
                      <label className="block text-[11px] font-semibold text-[#332A25]">
                        نص قواعد الزي الرسمي:
                      </label>
                      <textarea
                        rows={2}
                        value={invitation.couple?.dressCodeContent || ''}
                        onChange={(e) => updateCoupleField('dressCodeContent', e.target.value)}
                        placeholder="مثال: نرجو التكرم بالالتزام بالزي الرسمي الكامل..."
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]"
                      />
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-[#918579] self-center">اقتراحات سريعة:</span>
                        {[
                          'الزي الرسمي الكامل (Black Tie)',
                          'بدلة كاملة وفساتين سهرة راقية',
                          'زي أنيق ومحتشم',
                          'ملابس كلاسيكية أنيقة',
                        ].map((presetText) => (
                          <button
                            key={presetText}
                            type="button"
                            onClick={() => updateCoupleField('dressCodeContent', presetText)}
                            className="px-2 py-0.5 text-[10px] bg-white border border-[#EAE1D3] hover:border-[#C8A96B] hover:text-[#C8A96B] rounded transition-colors cursor-pointer"
                          >
                            + {presetText}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Gift Information Section */}
                <div className="p-4 bg-white border-2 border-[#C8A96B]/40 rounded-lg space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#C8A96B]" />
                      <span className="text-xs font-bold text-[#332A25]">
                        معلومات وبطاقة الهدية (Gift Information / Registry):
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !Boolean(invitation.couple?.giftInfoEnabled)
                        const currentCouple = invitation.couple || {}
                        const updatedCouple = {
                          ...currentCouple,
                          giftInfoEnabled: nextVal,
                          giftInfoContent:
                            currentCouple.giftInfoContent ||
                            'حضوركم ومشاركتكم فرحتنا هي أجمل وأثمن هدية لنا.',
                        }
                        const updatedSections = sections.map((s) =>
                          s.sectionKey === 'additional' ? { ...s, isVisible: true } : s
                        )
                        if (!updatedSections.some((s) => s.sectionKey === 'additional')) {
                          updatedSections.push({
                            sectionKey: 'additional',
                            displayOrder: updatedSections.length,
                            isVisible: true,
                          })
                        }
                        setInvitation((prev: any) => ({
                          ...prev,
                          couple: updatedCouple,
                          sections: updatedSections,
                        }))
                        setHasUnsavedChanges(true)
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                        invitation.couple?.giftInfoEnabled
                          ? 'bg-[#10B981]/15 text-[#059669] border-[#10B981]/40 shadow-xs'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {invitation.couple?.giftInfoEnabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>معروضة في الدعوة</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>مخفية من الدعوة</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#918579]">
                    تحدد للضيوف تفاصيل الهدية أو رسالة رقيقة بأن وجودهم ومشاركتهم الفرحة هي أجمل هدية. تظهر أو تختفي فوراً بضغطة زر.
                  </p>

                  {invitation.couple?.giftInfoEnabled && (
                    <div className="space-y-2 pt-1 border-t border-[#EAE1D3]">
                      <label className="block text-[11px] font-semibold text-[#332A25]">
                        نص رسالة معلومات الهدية:
                      </label>
                      <textarea
                        rows={2}
                        value={invitation.couple?.giftInfoContent || ''}
                        onChange={(e) => updateCoupleField('giftInfoContent', e.target.value)}
                        placeholder="مثال: حضوركم ومشاركتكم فرحتنا هي أجمل وأثمن هدية لنا..."
                        className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]"
                      />
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-[#918579] self-center">اقتراحات سريعة:</span>
                        {[
                          'حضوركم ومشاركتكم فرحتنا هي أجمل وأثمن هدية لنا.',
                          'دعواتكم الصادقة وحضوركم الكريم هما أثمن ما نرجوه.',
                          'فرحتنا تكتمل بلقائكم ورؤيتكم بيننا، ولا نرجو سوى دعواتكم.',
                        ].map((presetText) => (
                          <button
                            key={presetText}
                            type="button"
                            onClick={() => updateCoupleField('giftInfoContent', presetText)}
                            className="px-2 py-0.5 text-[10px] bg-white border border-[#EAE1D3] hover:border-[#C8A96B] hover:text-[#C8A96B] rounded transition-colors cursor-pointer"
                          >
                            + {presetText}
                          </button>
                        ))}
                      </div>
                    </div>
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
                      نص الرسالة الختامية
                    </label>
                    <textarea
                      rows={3}
                      value={invitation.couple?.postEventMessage || ''}
                      onChange={(e) => updateCoupleField('postEventMessage', e.target.value)}
                      placeholder="حضوركم شرف لنا وسعادتنا تكتمل برؤيتكم..."
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] focus:border-[#C8A96B]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: EVENTS & VENUE LOCATION (كافة تحكمات الموقع هنا حصراً) */}
            {/* ========================================================= */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    مكان الحفل وتفاصيل الموقع والفعاليات
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

                {/* Master Location Card Controls */}
                <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/50 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE1D3]">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          getThemeCustomVal('showLocationCard', true)
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#332A25]">
                          كارت مكان الحفل (اللوكيشن والموقع)
                        </h5>
                        <p className="text-[10px] text-[#918579]">
                          {getThemeCustomVal('showLocationCard', true)
                            ? 'معروض بالدعوة للمدعوين مع زر خريطة جوجل'
                            : 'مخفي حالياً من الدعوة'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateThemeCustomField(
                          'showLocationCard',
                          !getThemeCustomVal('showLocationCard', true)
                        )
                      }
                      className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        getThemeCustomVal('showLocationCard', true)
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {getThemeCustomVal('showLocationCard', true) ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>معروض بالدعوة</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-red-500" />
                          <span>مخفي</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Primary Venue Details */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[#332A25] mb-1">
                        📍 اللوكيشن مكتوب (اسم القاعة / الفندق / المكان)
                      </label>
                      <input
                        type="text"
                        value={invitation.events?.[0]?.venueName || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          const events = [...(invitation.events || [])]
                          if (events.length === 0) {
                            events.push({
                              id: `ev-${Date.now()}`,
                              title: 'حفل الزفاف',
                              venueName: val,
                              date: invitation.couple?.weddingDate || new Date().toISOString(),
                              startTime: invitation.couple?.weddingTime || '07:00 مساءً',
                              isVisible: true,
                              displayOrder: 0,
                            })
                          } else {
                            events[0] = { ...events[0], venueName: val }
                          }
                          updateInvitationField('events', events)
                        }}
                        placeholder="مثال: قاعة ليلتي للاحتفالات - نادي اتحاد الشرطة"
                        className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-[#FAF7F0] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#332A25] mb-1">
                        📝 العنوان والشارع والمعلم بالتفصيل
                      </label>
                      <input
                        type="text"
                        value={invitation.events?.[0]?.address || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          const events = [...(invitation.events || [])]
                          if (events.length === 0) {
                            events.push({
                              id: `ev-${Date.now()}`,
                              title: 'حفل الزفاف',
                              address: val,
                              date: invitation.couple?.weddingDate || new Date().toISOString(),
                              startTime: invitation.couple?.weddingTime || '07:00 مساءً',
                              isVisible: true,
                              displayOrder: 0,
                            })
                          } else {
                            events[0] = { ...events[0], address: val }
                          }
                          updateInvitationField('events', events)
                        }}
                        placeholder="مثال: شارع صلاح سالم، خلف مسجد الشرطة، القاهرة"
                        className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-[#FAF7F0]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-[#332A25]">
                          🔗 اللوكيشن كـ لينك (رابط Google Maps)
                        </label>
                        {invitation.events?.[0]?.mapsUrl && (
                          <a
                            href={invitation.events[0].mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#C8A96B] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>فتح الرابط للتأكد منه</span>
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={invitation.events?.[0]?.mapsUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          const events = [...(invitation.events || [])]
                          if (events.length === 0) {
                            events.push({
                              id: `ev-${Date.now()}`,
                              title: 'حفل الزفاف',
                              mapsUrl: val,
                              date: invitation.couple?.weddingDate || new Date().toISOString(),
                              startTime: invitation.couple?.weddingTime || '07:00 مساءً',
                              isVisible: true,
                              displayOrder: 0,
                            })
                          } else {
                            events[0] = { ...events[0], mapsUrl: val }
                          }
                          updateInvitationField('events', events)
                        }}
                        placeholder="https://maps.app.goo.gl/... أو https://maps.google.com/?q=..."
                        className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-[#FAF7F0] font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Events list cards */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-[#332A25]">
                    قائمة الفعاليات والمواعيد التفصيلية:
                  </h5>
                  {(!invitation.events || invitation.events.length === 0) ? (
                    <div className="p-6 text-center border-2 border-dashed border-[#EAE1D3] rounded-lg">
                      <p className="text-xs text-[#918579] mb-3">لا توجد فعاليات مضافة بعد</p>
                      <button
                        type="button"
                        onClick={handleAddEvent}
                        className="px-3 py-1.5 rounded bg-[#C8A96B] text-white text-xs font-semibold cursor-pointer"
                      >
                        إضافة أول فعالية +
                      </button>
                    </div>
                  ) : (
                    invitation.events.map((ev: any, idx: number) => (
                      <div
                        key={ev.id || idx}
                        className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 relative group shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#EAE1D3]">
                          <span className="text-xs font-bold text-[#332A25]">
                            فعالية رقم {idx + 1}: {ev.title || 'بدون عنوان'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(idx)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                            title="حذف الفعالية"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                              عنوان الفعالية
                            </label>
                            <input
                              type="text"
                              value={ev.title || ''}
                              onChange={(e) => updateEventField(idx, 'title', e.target.value)}
                              placeholder="حفل الزفاف الرئيسي"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                              وقت بداية الحفل (موعد الحضور)
                            </label>
                            <input
                              type="text"
                              value={ev.startTime || ''}
                              onChange={(e) => updateEventField(idx, 'startTime', e.target.value)}
                              placeholder="07:00 مساءً"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                            />
                          </div>
                        </div>

                        {/* End Time Control with Show/Hide toggle */}
                        <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#C8A96B]" />
                              <span className="text-[11px] font-bold text-[#332A25]">
                                وقت نهاية الحفل (اختياري):
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const isVisible =
                                  ev.showEndTime !== false &&
                                  !ev.notes?.includes('hideEndTime') &&
                                  Boolean(ev.endTime && ev.endTime.trim())
                                const nextVisible = !isVisible
                                const list = [...(invitation.events || [])]
                                let currentNotes = (list[idx].notes || '').split(',').filter(Boolean)
                                if (nextVisible) {
                                  currentNotes = currentNotes.filter((n: string) => n !== 'hideEndTime')
                                } else {
                                  if (!currentNotes.includes('hideEndTime')) currentNotes.push('hideEndTime')
                                }
                                list[idx] = {
                                  ...list[idx],
                                  showEndTime: nextVisible,
                                  endTime: nextVisible ? (list[idx].endTime || '11:30 مساءً') : '',
                                  notes: currentNotes.join(',') || null,
                                }
                                updateInvitationField('events', list)
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                                ev.showEndTime !== false &&
                                !ev.notes?.includes('hideEndTime') &&
                                Boolean(ev.endTime && ev.endTime.trim())
                                  ? 'bg-[#10B981]/15 text-[#059669] border-[#10B981]/30 shadow-xs'
                                  : 'bg-red-50 text-red-600 border-red-200'
                              }`}
                            >
                              {ev.showEndTime !== false &&
                              !ev.notes?.includes('hideEndTime') &&
                              Boolean(ev.endTime && ev.endTime.trim()) ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>معروض في الدعوة</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>مخفي من الدعوة</span>
                                </>
                              )}
                            </button>
                          </div>
                          {ev.showEndTime !== false &&
                          !ev.notes?.includes('hideEndTime') &&
                          Boolean(ev.endTime && ev.endTime.trim()) ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ev.endTime || ''}
                                onChange={(e) => updateEventField(idx, 'endTime', e.target.value)}
                                placeholder="مثال: 11:30 مساءً"
                                className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...(invitation.events || [])]
                                  let currentNotes = (list[idx].notes || '').split(',').filter(Boolean)
                                  if (!currentNotes.includes('hideEndTime')) currentNotes.push('hideEndTime')
                                  list[idx] = {
                                    ...list[idx],
                                    showEndTime: false,
                                    endTime: '',
                                    notes: currentNotes.join(',') || null,
                                  }
                                  updateInvitationField('events', list)
                                }}
                                className="text-[10px] text-red-500 hover:underline shrink-0 font-medium cursor-pointer"
                              >
                                مسح وإخفاء ✕
                              </button>
                            </div>
                          ) : (
                            <p className="text-[10px] text-[#918579]">
                              وقت نهاية الحفل مخفي، ويظهر في الدعوة موعد البداية فقط. اضغط على الزر بالأعلى إذا رغبت في إظهاره.
                            </p>
                          )}
                        </div>

                        {/* Event Date Control */}
                        <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold text-[#332A25]">
                              📅 تاريخ ويوم الفعالية:
                            </label>
                            {invitation.couple?.weddingDate && (
                              <button
                                type="button"
                                onClick={() => {
                                  const mainDate =
                                    typeof invitation.couple.weddingDate === 'string' &&
                                    /^\d{4}-\d{2}-\d{2}$/.test(invitation.couple.weddingDate)
                                      ? invitation.couple.weddingDate
                                      : new Date(invitation.couple.weddingDate).toISOString().split('T')[0]
                                  updateEventField(idx, 'date', mainDate)
                                }}
                                className="text-[10px] text-[#C8A96B] hover:underline font-bold cursor-pointer"
                              >
                                🔄 تعيين نفس موعد الزفاف الرئيسي ({formatSafeArabicDate(invitation.couple.weddingDate)})
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="date"
                              value={
                                ev.date
                                  ? (typeof ev.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ev.date)
                                      ? ev.date
                                      : new Date(ev.date).toISOString().split('T')[0])
                                  : (invitation.couple?.weddingDate
                                      ? (typeof invitation.couple.weddingDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(invitation.couple.weddingDate)
                                          ? invitation.couple.weddingDate
                                          : new Date(invitation.couple.weddingDate).toISOString().split('T')[0])
                                      : '')
                              }
                              onChange={(e) => updateEventField(idx, 'date', e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white font-semibold"
                            />
                            <div className="text-xs font-bold px-3 py-1.5 bg-white rounded border border-[#C8A96B]/40 text-[#C8A96B] text-center shadow-xs">
                              {formatSafeArabicDate(ev.date || invitation.couple?.weddingDate) || 'حدد التاريخ'}
                            </div>
                          </div>
                        </div>

                        {/* Per-event dress code control with clear toggle */}
                        <div className="p-3 bg-[#FAF7F0] rounded border border-[#EAE1D3] space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Shirt className="w-3.5 h-3.5 text-[#C8A96B]" />
                              <span className="text-[11px] font-bold text-[#332A25]">
                                الزي الرسمي الخاص بهذه الفعالية:
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const isVisible =
                                  ev.showDressCode !== false && !ev.notes?.includes('hideDressCode')
                                const nextVisible = !isVisible
                                const list = [...(invitation.events || [])]
                                list[idx] = {
                                  ...list[idx],
                                  showDressCode: nextVisible,
                                  notes: nextVisible ? null : 'hideDressCode',
                                }
                                updateInvitationField('events', list)
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                                ev.showDressCode !== false && !ev.notes?.includes('hideDressCode')
                                  ? 'bg-[#10B981]/15 text-[#059669] border-[#10B981]/30'
                                  : 'bg-red-50 text-red-600 border-red-200'
                              }`}
                            >
                              {ev.showDressCode !== false &&
                              !ev.notes?.includes('hideDressCode') ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>معروض</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>مخفي</span>
                                </>
                              )}
                            </button>
                          </div>
                          <input
                            type="text"
                            value={ev.dressCode || ''}
                            onChange={(e) => updateEventField(idx, 'dressCode', e.target.value)}
                            placeholder="مثال: بدلة رسمية / فستان سهرة"
                            className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3] bg-white"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            ملاحظات إضافية للضيوف
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

            {/* ========================================================= */}
            {/* TAB 3: TIMELINE (مسار وبرنامج الحفل) */}
            {/* ========================================================= */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    مسار وبرنامج الحفل (Timeline)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddTimelineItem}
                    className="px-3 py-1.5 rounded bg-[#C8A96B] text-white text-xs font-semibold hover:bg-[#A68648] flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة فقرة جديدة</span>
                  </button>
                </div>

                {/* Master timeline show/hide */}
                <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/50 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C8A96B]" />
                    <div>
                      <h5 className="text-xs font-bold text-[#332A25]">
                        عرض قسم مسار وبرنامج الحفل في الدعوة
                      </h5>
                      <p className="text-[10px] text-[#918579]">
                        {isTimelineSectionVisible && getThemeCustomVal('timelineVisible', true)
                          ? 'القسم معروض بالدعوة'
                          : 'القسم مخفي بالكامل من الدعوة'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const currentVal =
                        isTimelineSectionVisible && getThemeCustomVal('timelineVisible', true)
                      const nextVal = !currentVal
                      updateThemeCustomField('timelineVisible', nextVal)
                      const updatedSecs = sections.map((s) =>
                        s.sectionKey === 'timeline' ? { ...s, isVisible: nextVal } : s
                      )
                      updateInvitationField('sections', updatedSecs)
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                      isTimelineSectionVisible && getThemeCustomVal('timelineVisible', true)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {isTimelineSectionVisible && getThemeCustomVal('timelineVisible', true) ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>معروض بالدعوة</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>مخفي</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Timeline items list */}
                <div className="space-y-3">
                  {(!invitation.timeline || invitation.timeline.length === 0) ? (
                    <div className="p-6 text-center border-2 border-dashed border-[#EAE1D3] rounded-lg">
                      <p className="text-xs text-[#918579] mb-3">لا توجد فقرات لبرنامج الحفل</p>
                      <button
                        type="button"
                        onClick={handleAddTimelineItem}
                        className="px-3 py-1.5 rounded bg-[#C8A96B] text-white text-xs font-semibold cursor-pointer"
                      >
                        إضافة أول فقرة +
                      </button>
                    </div>
                  ) : (
                    invitation.timeline.map((tm: any, idx: number) => (
                      <div
                        key={tm.id || idx}
                        className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#EAE1D3]">
                          <span className="text-xs font-bold text-[#332A25]">
                            فقرة {idx + 1}: {tm.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteTimelineItem(idx)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                            title="حذف الفقرة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                              وقت الفقرة
                            </label>
                            <input
                              type="text"
                              value={tm.time || ''}
                              onChange={(e) => updateTimelineField(idx, 'time', e.target.value)}
                              placeholder="08:30 م"
                              className="w-full px-2 py-1.5 text-xs rounded border border-[#EAE1D3]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                              عنوان الفقرة
                            </label>
                            <input
                              type="text"
                              value={tm.title || ''}
                              onChange={(e) => updateTimelineField(idx, 'title', e.target.value)}
                              placeholder="الزفة الملكية"
                              className="w-full px-2 py-1.5 text-xs rounded border border-[#EAE1D3] font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                            وصف مختصر
                          </label>
                          <input
                            type="text"
                            value={tm.description || ''}
                            onChange={(e) => updateTimelineField(idx, 'description', e.target.value)}
                            placeholder="وصف إضافي لهذه اللحظة..."
                            className="w-full px-2 py-1.5 text-xs rounded border border-[#EAE1D3]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: MUSIC & AUDIO TRIMMER */}
            {/* ========================================================= */}
            {activeTab === 'music' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    الموسيقى والصوت والخلفية الصوتية
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#332A25]">تشغيل الموسيقى</span>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.musicEnabled)}
                      onChange={(e) => updateInvitationField('musicEnabled', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Upload or URL */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <label className="block text-xs font-bold text-[#332A25]">
                    رابط ملف الموسيقى (أو رفع ملف MP3 من جهازك)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={invitation.musicUrl || ''}
                      onChange={(e) => updateInvitationField('musicUrl', e.target.value)}
                      placeholder="https://... رابط ملف صوتي مباشر أو ارفع ملفك"
                      className="flex-1 px-3 py-2 text-xs rounded border border-[#EAE1D3] font-mono text-left"
                      dir="ltr"
                    />
                    <label className="px-3 py-2 rounded bg-[#FAF7F0] border border-[#C8A96B] text-[#C8A96B] text-xs font-semibold hover:bg-[#C8A96B] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading === 'music' ? 'جاري الرفع...' : 'رفع ملف'}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        disabled={isUploading !== null}
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            (url) => {
                              updateInvitationField('musicUrl', url)
                              updateInvitationField('musicEnabled', true)
                            },
                            'music'
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* Music Presets Library */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <h5 className="text-xs font-bold text-[#332A25]">
                    مكتبة المقاطع الموسيقية الفاخرة الجاهزة:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WEDDING_MUSIC_PRESETS.map((preset) => {
                      const isSelected = invitation.musicUrl === preset.url
                      const isPlaying = previewTrackUrl === preset.url && isPreviewPlaying
                      return (
                        <div
                          key={preset.id}
                          className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#C8A96B] bg-[#FAF7F0]'
                              : 'border-[#EAE1D3] bg-white hover:border-[#C8A96B]/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handlePreviewAudio(preset.url)}
                              className="p-1.5 rounded-full bg-[#FAF7F0] text-[#C8A96B] hover:bg-[#C8A96B] hover:text-white transition-colors cursor-pointer"
                              title={isPlaying ? 'إيقاف' : 'استماع'}
                            >
                              {isPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <div>
                              <p className="text-xs font-bold text-[#332A25]">{preset.title}</p>
                              <p className="text-[10px] text-[#918579]">{preset.duration}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              updateInvitationField('musicUrl', preset.url)
                              updateInvitationField('musicTitle', preset.title)
                              updateInvitationField('musicEnabled', true)
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                              isSelected
                                ? 'bg-[#C8A96B] text-white font-bold'
                                : 'bg-[#FAF7F0] text-[#73675C] hover:bg-[#EAE1D3]'
                            }`}
                          >
                            {isSelected ? 'مختارة ✓' : 'اختيار'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Audio Trimmer */}
                {invitation.musicUrl && (
                  <div className="p-4 bg-white rounded-lg border-2 border-[#C8A96B]/40 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EAE1D3]">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-[#C8A96B]" />
                        <h5 className="text-xs font-bold text-[#332A25]">
                          تحديد وقص جزء من المقطع الصوتي (Audio Trimmer)
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateThemeCustomField(
                            'musicTrimEnabled',
                            !getThemeCustomVal('musicTrimEnabled', false)
                          )
                        }
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer border ${
                          getThemeCustomVal('musicTrimEnabled', false)
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {getThemeCustomVal('musicTrimEnabled', false)
                          ? 'مفعل ✓'
                          : 'معطل'}
                      </button>
                    </div>

                    {getThemeCustomVal('musicTrimEnabled', false) && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                              بداية المقطع (ثواني)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={audioDuration || 600}
                              value={getThemeCustomVal('musicStart', 0)}
                              onChange={(e) =>
                                updateThemeCustomField('musicStart', Number(e.target.value))
                              }
                              className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3]"
                            />
                            <span className="text-[10px] text-[#918579]">
                              {formatSecondsToMMSS(getThemeCustomVal('musicStart', 0))}
                            </span>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                              نهاية المقطع (ثواني)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={audioDuration || 600}
                              value={getThemeCustomVal('musicEnd', Math.round(audioDuration || 60))}
                              onChange={(e) =>
                                updateThemeCustomField('musicEnd', Number(e.target.value))
                              }
                              className="w-full px-3 py-1.5 text-xs rounded border border-[#EAE1D3]"
                            />
                            <span className="text-[10px] text-[#918579]">
                              {formatSecondsToMMSS(
                                getThemeCustomVal('musicEnd', Math.round(audioDuration || 60))
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Test Button for Trimmer */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isTrimPreviewPlaying) {
                              if (previewAudioRef.current) previewAudioRef.current.pause()
                              setIsTrimPreviewPlaying(false)
                            } else {
                              const s = getThemeCustomVal('musicStart', 0)
                              if (previewAudioRef.current) {
                                previewAudioRef.current.src = invitation.musicUrl
                                previewAudioRef.current.currentTime = s
                                previewAudioRef.current
                                  .play()
                                  .then(() => setIsTrimPreviewPlaying(true))
                                  .catch(() => setIsTrimPreviewPlaying(false))
                              }
                            }
                          }}
                          className="w-full py-2 rounded bg-[#FAF7F0] border border-[#C8A96B] text-[#C8A96B] text-xs font-bold hover:bg-[#C8A96B] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isTrimPreviewPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>إيقاف الاستماع التجريبي</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>تجربة الجزء المقصوص المحدد</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: EFFECTS (تأثيرات الورود) */}
            {/* ========================================================= */}
            {activeTab === 'effects' && (
              <div className="space-y-6">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  تأثيرات تساقط الورود في خلفية الدعوة
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'romantic', title: 'ورود رومانسية بيضاء', desc: 'بتلات بيضاء وعاجية ناعمة' },
                    { id: 'golden', title: 'بتلات ذهبية فاخرة', desc: 'لمسات ذهبية متلألئة' },
                    { id: 'classic', title: 'ورود حمراء كلاسيكية', desc: 'بتلات الورد الأحمر الملكي' },
                    { id: 'none', title: 'بدون تأثير', desc: 'خلفية هادئة وثابتة' },
                  ].map((eff) => {
                    const currentEffect = getThemeCustomVal('backgroundEffect', 'romantic')
                    const isSelected = currentEffect === eff.id
                    return (
                      <button
                        key={eff.id}
                        type="button"
                        onClick={() => updateThemeCustomField('backgroundEffect', eff.id)}
                        className={`p-4 rounded-lg border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#C8A96B] bg-[#FAF7F0] shadow-xs'
                            : 'border-[#EAE1D3] bg-white hover:border-[#C8A96B]/40'
                        }`}
                      >
                        <Flower2
                          className={`w-5 h-5 mb-2 ${
                            isSelected ? 'text-[#C8A96B]' : 'text-gray-400'
                          }`}
                        />
                        <p className="text-xs font-bold text-[#332A25]">{eff.title}</p>
                        <p className="text-[10px] text-[#918579] mt-0.5">{eff.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 6: GALLERY (معرض الصور) */}
            {/* ========================================================= */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    معرض صور العروسين التذكارية
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#332A25]">إظهار المعرض</span>
                    <input
                      type="checkbox"
                      checked={isGallerySectionActive}
                      onChange={() => toggleSectionVisibility('gallery')}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Add Photo Form */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#332A25]">
                      إضافة صورة جديدة للمعرض
                    </label>
                    <label className="cursor-pointer text-xs font-semibold text-[#C8A96B] hover:underline flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading === 'gallery' ? 'جاري الرفع...' : 'رفع من جهازك'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading !== null}
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            (url) => {
                              const newImg = {
                                id: `img-${Date.now()}`,
                                url,
                                caption: null,
                                displayOrder: (invitation.gallery || []).length,
                                isVisible: true,
                              }
                              updateInvitationField('gallery', [
                                ...(invitation.gallery || []),
                                newImg,
                              ])
                            },
                            'gallery'
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://... رابط الصورة"
                      className="flex-1 px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      disabled={!newPhotoUrl}
                      className="px-4 py-2 bg-[#C8A96B] text-white text-xs font-bold rounded hover:bg-[#A68648] disabled:opacity-50 cursor-pointer"
                    >
                      إضافة
                    </button>
                  </div>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(invitation.gallery || []).map((img: any, idx: number) => (
                    <div
                      key={img.id || idx}
                      className="relative rounded-lg overflow-hidden border border-[#EAE1D3] bg-white group aspect-square shadow-xs"
                    >
                      <img
                        src={img.url || img.imageUrl}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(idx)}
                        className="absolute top-2 left-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 7: RSVP (تأكيد الحضور) */}
            {/* ========================================================= */}
            {activeTab === 'rsvp' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                    نموذج تأكيد الحضور (RSVP)
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#332A25]">تفعيل النموذج</span>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.rsvpEnabled)}
                      onChange={(e) => updateInvitationField('rsvpEnabled', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-4 shadow-xs">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      الموعد النهائي لتأكيد الحضور
                    </label>
                    <input
                      type="date"
                      value={
                        invitation.rsvpDeadline
                          ? new Date(invitation.rsvpDeadline).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => updateInvitationField('rsvpDeadline', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                      الحد الأقصى للمرافقين لكل دعوة
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={invitation.rsvpMaxGuests || 2}
                      onChange={(e) => updateInvitationField('rsvpMaxGuests', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE1D3]">
                    <span className="text-xs font-semibold text-[#332A25]">
                      السماح للضيف بإضافة مرافق (+1)
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.rsvpAllowPlusOne)}
                      onChange={(e) => updateInvitationField('rsvpAllowPlusOne', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE1D3]">
                    <span className="text-xs font-semibold text-[#332A25]">
                      طلب رقم هاتف الضيف إجبارياً للتواصل
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.rsvpRequireContact)}
                      onChange={(e) => updateInvitationField('rsvpRequireContact', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 8: THEME & COLORS */}
            {/* ========================================================= */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  السمة والألوان العامة للدعوة
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getAllThemes().map((t) => {
                    const isSelected = (invitation.themeId || 'royal-champagne') === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateInvitationField('themeId', t.id)}
                        className={`p-3.5 rounded-lg border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#C8A96B] bg-[#FAF7F0] ring-2 ring-[#C8A96B]/20 shadow-xs'
                            : 'border-[#EAE1D3] bg-white hover:border-[#C8A96B]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#332A25]">{t.nameAr}</span>
                          <div className="flex gap-1">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10"
                              style={{ backgroundColor: t.colors.primary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10"
                              style={{ backgroundColor: t.colors.background }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10"
                              style={{ backgroundColor: t.colors.surface }}
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-[#918579]">{t.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 9: SECTIONS REORDERING & VISIBILITY */}
            {/* ========================================================= */}
            {activeTab === 'sections' && (
              <div className="space-y-5">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  ترتيب وإظهار أقسام الدعوة
                </h4>

                <div className="space-y-2">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.sectionKey}
                      className="p-3 bg-[#FAF7F0] rounded-lg border border-[#EAE1D3] flex items-center justify-between shadow-xs"
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
                          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, 'down')}
                          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 10: COVER ENVELOPE & SOCIAL SHARE */}
            {/* ========================================================= */}
            {activeTab === 'seo' && (
              <div className="space-y-5">
                <h4 className="text-sm font-serif-luxury font-bold text-[#332A25]">
                  الغلاف السينمائي الخارجي والمشاركة
                </h4>

                {/* Envelope Cover Toggle */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#332A25]">
                        تفعيل الغلاف السينمائي الخارجي (Envelope Cover)
                      </span>
                      <p className="text-[10px] text-[#918579]">
                        يظهر كبطاقة مغلقة أنيقة ينقر عليها الضيف لفتح الدعوة
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(invitation.coverEnabled)}
                      onChange={(e) => updateInvitationField('coverEnabled', e.target.checked)}
                      className="w-4 h-4 text-[#C8A96B] cursor-pointer"
                    />
                  </div>

                  {invitation.coverEnabled && (
                    <div className="space-y-3 pt-2 border-t border-[#EAE1D3]">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                          نوع الغلاف
                        </label>
                        <select
                          value={invitation.coverType || 'elegant'}
                          onChange={(e) => updateInvitationField('coverType', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                        >
                          <option value="elegant">أنيق كلاسيكي (Classic Luxury)</option>
                          <option value="wax">ختم شمعي ملكي (Royal Wax Seal)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                          صورة الغلاف الخارجي
                        </label>
                        <input
                          type="text"
                          value={invitation.coverImage || ''}
                          onChange={(e) => updateInvitationField('coverImage', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Message */}
                <div className="p-4 bg-white rounded-lg border border-[#EAE1D3] space-y-2 shadow-xs">
                  <label className="block text-xs font-semibold text-[#332A25]">
                    رسالة المشاركة عبر واتساب
                  </label>
                  <textarea
                    rows={4}
                    value={invitation.whatsappMessage || ''}
                    onChange={(e) => updateInvitationField('whatsappMessage', e.target.value)}
                    placeholder="يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا..."
                    className="w-full px-3 py-2 text-xs rounded border border-[#EAE1D3]"
                  />
                </div>
              </div>
            )}
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
