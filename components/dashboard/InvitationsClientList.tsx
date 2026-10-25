'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Search,
  Filter,
  PlusCircle,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  Share2,
  QrCode as QrCodeIcon,
  Check,
  Sparkles,
  X,
  Download,
} from 'lucide-react'
import { formatWhatsAppMessage, getInvitationUrl } from '@/lib/utils'

interface InvitationItem {
  id: string
  slug: string
  title: string
  status: string
  language: string
  themeId: string
  createdAt: Date | string
  updatedAt: Date | string
  couple?: {
    brideFullName?: string | null
    brideFirstName?: string | null
    groomFullName?: string | null
    groomFirstName?: string | null
    weddingDate?: Date | string | null
  } | null
  _count: {
    rsvpResponses: number
    events: number
  }
}

interface InvitationsClientListProps {
  initialInvitations: InvitationItem[]
  siteUrl: string
}

export function InvitationsClientList({
  initialInvitations,
  siteUrl,
}: InvitationsClientListProps) {
  const router = useRouter()
  const effectiveSiteUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : siteUrl && !siteUrl.includes('localhost')
      ? siteUrl
      : 'https://invitations-website-rust.vercel.app'
  const [invitations, setInvitations] = useState(initialInvitations)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Modals state
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [qrModalItem, setQrModalItem] = useState<InvitationItem | null>(null)
  const [whatsAppModalItem, setWhatsAppModalItem] = useState<InvitationItem | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter logic
  const filtered = invitations.filter((inv) => {
    const matchesStatus =
      statusFilter === 'ALL' ? true : inv.status === statusFilter

    const bride = inv.couple?.brideFullName || inv.couple?.brideFirstName || ''
    const groom = inv.couple?.groomFullName || inv.couple?.groomFirstName || ''
    const query = searchTerm.toLowerCase()

    const matchesSearch =
      inv.title.toLowerCase().includes(query) ||
      inv.slug.toLowerCase().includes(query) ||
      bride.toLowerCase().includes(query) ||
      groom.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })

  // Copy URL to clipboard
  const handleCopyLink = async (slug: string) => {
    const url = getInvitationUrl(slug, effectiveSiteUrl)
    await navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  // Open QR modal and generate QR code dynamically
  const handleOpenQr = async (inv: InvitationItem) => {
    setQrModalItem(inv)
    try {
      const QRCode = (await import('qrcode')).default
      const url = getInvitationUrl(inv.slug, effectiveSiteUrl)
      const dataUrl = await QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#332A25',
          light: '#FFFFFF',
        },
      })
      setQrCodeDataUrl(dataUrl)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  // Toggle Publish / Unpublish
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    setIsProcessing(true)

    try {
      const res = await fetch(`/api/invitations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setInvitations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        )
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Duplicate Invitation
  const handleDuplicate = async (id: string) => {
    if (!confirm('هل تريد إنشاء نسخة مطابقة من هذه الدعوة؟')) return
    setIsProcessing(true)

    try {
      const res = await fetch(`/api/invitations/${id}/duplicate`, {
        method: 'POST',
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to duplicate:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Delete Invitation
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف دعوة "${title}" بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.id !== id))
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to delete invitation:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
            إدارة دعوات الزفاف
          </h2>
          <p className="text-xs text-[#918579] mt-0.5">
            عرض وتعديل وتخصيص ونشر كافة بطاقات ودعوات الزفاف
          </p>
        </div>

        <Link
          href="/dashboard/invitations/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء دعوة جديدة</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-sm border border-[#EAE1D3] shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الرابط المخصص..."
            className="w-full pl-4 pr-9 py-2 rounded-sm border border-[#EAE1D3] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF7F0]/40"
          />
          <Search className="w-4 h-4 text-[#918579] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#918579] ml-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>الحالة:</span>
          </span>

          {[
            { id: 'ALL', label: 'الكل' },
            { id: 'PUBLISHED', label: 'المنشورة' },
            { id: 'DRAFT', label: 'المسودات' },
            { id: 'ARCHIVED', label: 'المؤرشفة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-[#C8A96B] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#332A25] hover:bg-[#EAE1D3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-white rounded-sm border border-[#EAE1D3] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 mx-auto text-[#C8A96B] opacity-40 mb-3" />
            <h4 className="text-base font-bold text-[#332A25] mb-1">لا توجد نتائج مطابقة</h4>
            <p className="text-xs text-[#918579]">
              حاول تعديل كلمات البحث أو تصفية الحالات.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F0] border-b border-[#EAE1D3] text-[#918579] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">عنوان الدعوة والعروسين</th>
                  <th className="py-3 px-5">الرابط المباشر</th>
                  <th className="py-3 px-5">الحالة</th>
                  <th className="py-3 px-5">السمة</th>
                  <th className="py-3 px-5">الفعاليات</th>
                  <th className="py-3 px-5">ردود الحضور</th>
                  <th className="py-3 px-5 text-center">المشاركة والتوزيع</th>
                  <th className="py-3 px-5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1D3]">
                {filtered.map((inv) => {
                  const couple = inv.couple
                  const bride = couple?.brideFullName || couple?.brideFirstName || ''
                  const groom = couple?.groomFullName || couple?.groomFirstName || ''
                  const pageUrl = getInvitationUrl(inv.slug, effectiveSiteUrl)

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF7F0]/30 transition-colors">
                      {/* Name & Title */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-sm text-[#332A25]">
                          {bride && groom ? `${bride} & ${groom}` : inv.title}
                        </div>
                        <div className="text-[11px] text-[#918579] mt-0.5">{inv.title}</div>
                      </td>

                      {/* Slug / Link */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-[11px] text-[#332A25] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EAE1D3]">
                            /{inv.slug}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(inv.slug)}
                            className="p-1 text-[#918579] hover:text-[#C8A96B] transition-colors"
                            title="نسخ الرابط"
                          >
                            {copiedSlug === inv.slug ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(inv.id, inv.status)}
                          disabled={isProcessing}
                          title="اضغط لتغيير الحالة بين مسودة ومنشورة"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                            inv.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {inv.status === 'PUBLISHED'
                            ? '● منشورة'
                            : inv.status === 'DRAFT'
                            ? '○ مسودة'
                            : 'مؤرشفة'}
                        </button>
                      </td>

                      {/* Theme */}
                      <td className="py-4 px-5 text-[11px] text-[#918579] font-medium">
                        {inv.themeId}
                      </td>

                      {/* Events Count */}
                      <td className="py-4 px-5 text-[11px] text-[#332A25] font-semibold">
                        {inv._count.events} فعالية
                      </td>

                      {/* RSVPs */}
                      <td className="py-4 px-5">
                        <Link
                          href={`/dashboard/rsvp?invitationId=${inv.id}`}
                          className="font-semibold text-[#332A25] hover:text-[#C8A96B] underline"
                        >
                          {inv._count.rsvpResponses} رد
                        </Link>
                      </td>

                      {/* Sharing: QR & WhatsApp */}
                      <td className="py-4 px-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenQr(inv)}
                            className="p-1.5 rounded bg-[#FAF7F0] border border-[#EAE1D3] text-[#332A25] hover:border-[#C8A96B] transition-colors"
                            title="رمز الاستجابة السريع QR Code"
                          >
                            <QrCodeIcon className="w-3.5 h-3.5 text-[#C8A96B]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setWhatsAppModalItem(inv)}
                            className="p-1.5 rounded bg-[#FAF7F0] border border-[#EAE1D3] text-emerald-700 hover:border-emerald-500 transition-colors"
                            title="مشاركة عبر واتساب"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Visual Editor Link */}
                          <Link
                            href={`/dashboard/invitations/edit/${inv.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-[#FAF7F0] border border-[#EAE1D3] text-[#332A25] hover:border-[#C8A96B] transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#C8A96B]" />
                            <span>تعديل</span>
                          </Link>

                          {/* Public View */}
                          <a
                            href={pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#918579] hover:text-[#332A25]"
                            title="فتح الرابط العام"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(inv.id)}
                            className="p-1.5 text-[#918579] hover:text-[#332A25]"
                            title="تكرار / نسخ الدعوة"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(inv.id, inv.title)}
                            className="p-1.5 text-red-500 hover:text-red-700"
                            title="حذف الدعوة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-sm w-full p-6 text-center border border-[#EAE1D3] shadow-2xl relative">
            <button
              onClick={() => setQrModalItem(null)}
              className="absolute top-4 left-4 text-[#918579] hover:text-[#332A25]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif-luxury font-bold text-[#332A25] mb-1">
              رمز الاستجابة السريع (QR Code)
            </h3>
            <p className="text-xs text-[#918579] mb-4">
              يمكن مسح هذا الرمز بواسطة كاميرا الهاتف لفتح بطاقة الدعوة مباشرة.
            </p>

            {qrCodeDataUrl ? (
              <div className="p-4 bg-[#FAF7F0] rounded-sm border border-[#EAE1D3] inline-block mx-auto mb-4">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-52 h-52 mx-auto"
                />
              </div>
            ) : (
              <div className="w-52 h-52 mx-auto flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500">
                جاري توليد الرمز...
              </div>
            )}

            <div className="text-[11px] font-mono text-[#918579] mb-4 truncate px-2">
              {getInvitationUrl(qrModalItem.slug, effectiveSiteUrl)}
            </div>

            <a
              href={qrCodeDataUrl}
              download={`qr-${qrModalItem.slug}.png`}
              className="w-full py-2.5 rounded-sm font-semibold text-xs text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تحميل صورة QR بدقة عالية</span>
            </a>
          </div>
        </div>
      )}

      {/* WhatsApp Share Modal */}
      {whatsAppModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 border border-[#EAE1D3] shadow-2xl relative text-right">
            <button
              onClick={() => setWhatsAppModalItem(null)}
              className="absolute top-4 left-4 text-[#918579] hover:text-[#332A25]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif-luxury font-bold text-[#332A25] mb-1">
              المشاركة عبر واتساب (WhatsApp)
            </h3>
            <p className="text-xs text-[#918579] mb-4">
              إرسال رسالة الدعوة المصممة مع الرابط المباشر للضيوف عبر واتساب.
            </p>

            <div className="p-4 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0] text-xs text-[#332A25] whitespace-pre-line leading-relaxed mb-6 font-medium">
              {formatWhatsAppMessage(
                null,
                getInvitationUrl(whatsAppModalItem.slug, effectiveSiteUrl)
              )}
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  formatWhatsAppMessage(
                    null,
                    getInvitationUrl(whatsAppModalItem.slug, effectiveSiteUrl)
                  )
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-sm font-semibold text-xs text-white bg-[#25D366] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>فتح واتساب الآن وإرسال الدعوة</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    formatWhatsAppMessage(
                      null,
                      getInvitationUrl(whatsAppModalItem.slug, effectiveSiteUrl)
                    )
                  )
                  alert('تم نسخ نص الرسالة بالكامل!')
                }}
                className="px-4 py-3 rounded-sm border border-[#EAE1D3] text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                نسخ النص
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
