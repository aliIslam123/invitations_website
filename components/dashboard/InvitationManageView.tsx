'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import {
  ExternalLink,
  Copy,
  Check,
  Share2,
  QrCode,
  Edit3,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  AlertCircle,
  Eye,
  ArrowRight,
} from 'lucide-react'

interface InvitationManageViewProps {
  invitation: any
  siteUrl: string
}

export function InvitationManageView({
  invitation,
  siteUrl,
}: InvitationManageViewProps) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [status, setStatus] = useState<string>(invitation.status)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const publicUrl = `${siteUrl}/wedding/${invitation.slug}`
  const groomName = invitation.couple?.groomFullName || invitation.couple?.groomFirstName || 'العريس'
  const brideName = invitation.couple?.brideFullName || invitation.couple?.brideFirstName || 'العروس'

  useEffect(() => {
    QRCode.toDataURL(
      publicUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#332A25',
          light: '#FAF7F0',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url)
        }
      }
    )
  }, [publicUrl])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const toggleStatus = async () => {
    setIsUpdatingStatus(true)
    const newStatus = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `يسرنا ويسعدنا دعوتكم لحضور حفل زفاف ${groomName} & ${brideName} 🤍\n\nتفضلوا بفتح الدعوة ومعرفة تفاصيل الموعد والموقع:\n${publicUrl}`
  )

  const rsvps = invitation.rsvpResponses || []
  const yesRsvps = rsvps.filter((r: any) => r.attendance === 'yes')
  const noRsvps = rsvps.filter((r: any) => r.attendance === 'no')
  const totalGuests = yesRsvps.reduce((sum: number, r: any) => sum + (r.guestCount || 1), 0)

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir="rtl">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE1D3]">
        <div className="space-y-1">
          <Link
            href="/dashboard/invitations"
            className="text-xs font-semibold text-[#918579] hover:text-[#C8A96B] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لكل الدعوات</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#332A25]">
            إدارة دعوة: {groomName} & {brideName}
          </h1>
          <p className="text-xs text-[#918579]">
            القالب: {invitation.themeId || 'الشمبانيا الملكي'} • المعرف: {invitation.slug}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStatus}
            disabled={isUpdatingStatus}
            className={`px-4 py-2 rounded-sm text-xs font-semibold transition-all flex items-center gap-2 ${
              status === 'PUBLISHED'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {isUpdatingStatus
                ? 'جاري التحديث...'
                : status === 'PUBLISHED'
                ? 'الحالة: منشورة للعامة'
                : 'الحالة: مسودة (غير منشورة)'}
            </span>
          </button>

          <Link
            href={`/editor/${invitation.id}`}
            className="px-5 py-2 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>المحرر المباشر</span>
          </Link>
        </div>
      </div>

      {/* Share and Public URL Banner */}
      <div className="p-6 rounded-lg bg-white border border-[#EAE1D3] shadow-xs space-y-4">
        <h3 className="font-serif-luxury font-bold text-base text-[#332A25]">
          الرابط العام والمشاركة السريعة
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 flex items-center bg-[#FAF7F0] border border-[#EAE1D3] rounded px-3 py-2 text-xs font-mono text-[#332A25] overflow-x-auto">
            <span className="truncate">{publicUrl}</span>
          </div>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-white border border-[#C8A96B] text-[#332A25] hover:bg-[#FAF7F0] rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة عبر واتساب</span>
          </a>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#FAF7F0] hover:bg-[#EAE1D3] border border-[#EAE1D3] text-[#332A25] rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>فتح الدعوة</span>
          </a>
        </div>
      </div>

      {/* Grid: QR Code + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* QR Code Card */}
        <div className="p-6 rounded-lg bg-white border border-[#EAE1D3] shadow-xs text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#A68648]">
            <QrCode className="w-4 h-4" />
            <span>رمز الاستجابة السريعة (QR Code)</span>
          </div>

          {qrDataUrl ? (
            <div className="space-y-3">
              <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#EAE1D3] inline-block shadow-inner">
                <img
                  src={qrDataUrl}
                  alt="Wedding Invitation QR Code"
                  className="w-48 h-48 mx-auto rounded"
                />
              </div>

              <div>
                <a
                  href={qrDataUrl}
                  download={`wedding-qr-${invitation.slug}.png`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium text-[#332A25] bg-[#FAF7F0] hover:bg-[#EAE1D3] border border-[#EAE1D3] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>تحميل الرمز بجودة عالية</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-[#918579]">
              جاري إنشاء الرمز...
            </div>
          )}

          <p className="text-[11px] text-[#918579]">
            يمكنك طباعة هذا الرمز على كروت الدعوة الورقية أو لافتات استقبال القاعة.
          </p>
        </div>

        {/* RSVP Stats Column */}
        <div className="md:col-span-2 p-6 rounded-lg bg-white border border-[#EAE1D3] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury font-bold text-base text-[#332A25]">
              ملخص ردود وتأكيد الحضور (RSVP)
            </h3>
            <Link
              href="/dashboard/rsvp"
              className="text-xs font-semibold text-[#C8A96B] hover:text-[#A68648]"
            >
              عرض سجل الحضور الشامل
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#FAF7F0] border border-[#EAE1D3] text-center space-y-1">
              <span className="text-[11px] text-[#918579] block">إجمالي الردود</span>
              <span className="text-2xl font-serif-luxury font-bold text-[#332A25] block">
                {rsvps.length}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] text-emerald-700 block">المؤكد حضورهم</span>
              <span className="text-2xl font-serif-luxury font-bold text-emerald-800 block">
                {totalGuests}
              </span>
              <span className="text-[10px] text-emerald-600 block">
                ({yesRsvps.length} دعوة مؤكدة)
              </span>
            </div>

            <div className="p-4 rounded-lg bg-red-50/50 border border-red-200 text-center space-y-1">
              <span className="text-[11px] text-red-700 block">المعتذرون</span>
              <span className="text-2xl font-serif-luxury font-bold text-red-800 block">
                {noRsvps.length}
              </span>
            </div>
          </div>

          {/* Recent RSVP List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-[#7A6B5F]">
              آخر الردود المسجلة لهذه الدعوة:
            </h4>

            {rsvps.length === 0 ? (
              <div className="text-center py-8 bg-[#FAF7F0]/40 rounded border border-dashed border-[#EAE1D3] text-xs text-[#918579]">
                لم يسجل أي ضيف رده حتى الآن. شارك رابط الدعوة مع الأحباب لتستقبل الردود هنا.
              </div>
            ) : (
              <div className="divide-y divide-[#EAE1D3] border border-[#EAE1D3] rounded overflow-hidden">
                {rsvps.slice(0, 5).map((r: any) => {
                  const isAttending = r.attendance === 'yes'
                  return (
                    <div
                      key={r.id}
                      className="p-3 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#332A25] block">
                          {r.guestName}
                        </span>
                        {r.notes && (
                          <p className="text-[11px] text-[#918579] line-clamp-1">
                            «{r.notes}»
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#918579]">
                          {isAttending ? `${r.guestCount || 1} أفراد` : 'اعتذار'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAttending
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isAttending ? 'حاضر بإذن الله' : 'معتذر'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
