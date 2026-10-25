'use client'

import React, { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react'

interface RSVPItem {
  id: string
  guestName: string
  attendance: string
  guestCount: number
  phone?: string | null
  email?: string | null
  message?: string | null
  dietary?: string | null
  createdAt: Date | string
  invitation: {
    id: string
    title: string
    slug: string
  }
}

interface RSVPClientManagerProps {
  initialResponses: RSVPItem[]
}

export function RSVPClientManager({ initialResponses }: RSVPClientManagerProps) {
  const [responses, setResponses] = useState(initialResponses)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'yes' | 'no' | 'maybe'>('ALL')
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter responses
  const filtered = responses.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' ? true : r.attendance === statusFilter
    const query = searchTerm.toLowerCase()
    const matchesSearch =
      r.guestName.toLowerCase().includes(query) ||
      (r.phone && r.phone.toLowerCase().includes(query)) ||
      (r.email && r.email.toLowerCase().includes(query)) ||
      r.invitation.title.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })

  // Summary counts
  const totalCount = responses.length
  const attendingCount = responses.filter((r) => r.attendance === 'yes').length
  const totalConfirmedGuests = responses
    .filter((r) => r.attendance === 'yes')
    .reduce((sum, r) => sum + (r.guestCount || 1), 0)
  const declinedCount = responses.filter((r) => r.attendance === 'no').length

  // Export to CSV
  const handleExportCSV = () => {
    if (responses.length === 0) {
      alert('لا توجد بيانات لتصديرها.')
      return
    }

    const headers = [
      'اسم الضيف (Guest Name)',
      'حالة الحضور (Attendance)',
      'عدد الأفراد (Guest Count)',
      'رقم الهاتف (Phone)',
      'البريد الإلكتروني (Email)',
      'المتطلبات الغذائية (Dietary)',
      'الرسالة والتهنئة (Message)',
      'الدعوة (Invitation)',
      'تاريخ التسجيل (Date)',
    ]

    const rows = filtered.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.attendance === 'yes' ? 'مؤكد الحضور' : r.attendance === 'no' ? 'معتذر' : 'محتمل',
      r.guestCount,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${(r.dietary || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.invitation.title.replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleString('ar-SA'),
    ])

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rsvp-guests-export-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Delete RSVP entry
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف رد "${name}"؟`)) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/rsvp/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setResponses((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
            إدارة ردود الحضور (RSVP)
          </h2>
          <p className="text-xs text-[#918579] mt-0.5">
            متابعة قوائم المدعوين وإحصائيات الحضور وتصدير التقارير
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>تصدير القائمة إلى ملف Excel / CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-sm border border-[#EAE1D3] shadow-xs">
          <span className="text-[11px] text-[#918579] block">إجمالي الردود</span>
          <span className="text-2xl font-serif-luxury font-bold text-[#332A25] mt-1 block">
            {totalCount}
          </span>
        </div>

        <div className="p-4 bg-white rounded-sm border border-[#EAE1D3] shadow-xs">
          <span className="text-[11px] text-emerald-700 font-semibold block">المؤكد حضورهم</span>
          <span className="text-2xl font-serif-luxury font-bold text-emerald-700 mt-1 block">
            {attendingCount} رد ({totalConfirmedGuests} ضيف)
          </span>
        </div>

        <div className="p-4 bg-white rounded-sm border border-[#EAE1D3] shadow-xs">
          <span className="text-[11px] text-rose-700 font-semibold block">المعتذرين</span>
          <span className="text-2xl font-serif-luxury font-bold text-rose-700 mt-1 block">
            {declinedCount} رد
          </span>
        </div>

        <div className="p-4 bg-white rounded-sm border border-[#EAE1D3] shadow-xs">
          <span className="text-[11px] text-[#918579] block">نسبة الحضور</span>
          <span className="text-2xl font-serif-luxury font-bold text-[#C8A96B] mt-1 block">
            {totalCount > 0 ? Math.round((attendingCount / totalCount) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white rounded-sm border border-[#EAE1D3] shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو الدعوة..."
            className="w-full pl-4 pr-9 py-2 rounded-sm border border-[#EAE1D3] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF7F0]/40"
          />
          <Search className="w-4 h-4 text-[#918579] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'كافة الردود' },
            { id: 'yes', label: 'الحاضرون فقط' },
            { id: 'no', label: 'المعتذرون فقط' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
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

      {/* Table */}
      <div className="bg-white rounded-sm border border-[#EAE1D3] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 mx-auto text-[#C8A96B] opacity-40 mb-3" />
            <h4 className="text-base font-bold text-[#332A25] mb-1">لا توجد ردود مسجلة بعد</h4>
            <p className="text-xs text-[#918579]">
              ستظهر هنا ردود الضيوف وتأكيدات الحضور بمجرد إرسالها من صفحة الدعوة.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F0] border-b border-[#EAE1D3] text-[#918579] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">اسم الضيف</th>
                  <th className="py-3 px-5">الدعوة المرتبطة</th>
                  <th className="py-3 px-5">الحالة</th>
                  <th className="py-3 px-5">العدد</th>
                  <th className="py-3 px-5">بيانات التواصل</th>
                  <th className="py-3 px-5">الرسالة والتهنئة</th>
                  <th className="py-3 px-5">التاريخ</th>
                  <th className="py-3 px-5 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1D3]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F0]/30 transition-colors">
                    <td className="py-4 px-5 font-semibold text-sm text-[#332A25]">
                      {r.guestName}
                    </td>
                    <td className="py-4 px-5 text-[#918579] font-medium">
                      {r.invitation.title}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.attendance === 'yes'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {r.attendance === 'yes' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مؤكد الحضور</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>معتذر</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-[#332A25]">
                      {r.attendance === 'yes' ? `${r.guestCount} أفراد` : '-'}
                    </td>
                    <td className="py-4 px-5 text-[#918579]">
                      {r.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#C8A96B]" />
                          <span dir="ltr">{r.phone}</span>
                        </div>
                      )}
                      {r.email && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-[#C8A96B]" />
                          <span>{r.email}</span>
                        </div>
                      )}
                      {!r.phone && !r.email && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-4 px-5 max-w-xs truncate text-[#918579]">
                      {r.message ? (
                        <span title={r.message}>{r.message}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-[#918579] whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.guestName)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                        title="حذف هذا الرد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
