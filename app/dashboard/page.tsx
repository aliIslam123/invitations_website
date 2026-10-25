import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import {
  Mail,
  CheckCircle,
  FileText,
  Users,
  Eye,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  ExternalLink,
} from 'lucide-react'

export default async function DashboardOverviewPage() {
  let totalInvitations = 0
  let publishedCount = 0
  let draftCount = 0
  let totalRsvps = 0
  let rsvpSummary: any[] = []
  let recentInvitations: any[] = []
  let dbError: string | null = null

  try {
    const results = await Promise.all([
      prisma.weddingInvitation.count(),
      prisma.weddingInvitation.count({ where: { status: 'PUBLISHED' } }),
      prisma.weddingInvitation.count({ where: { status: 'DRAFT' } }),
      prisma.rSVPResponse.count(),
      prisma.rSVPResponse.findMany({
        select: {
          attendance: true,
          guestCount: true,
        },
      }),
      prisma.weddingInvitation.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          couple: true,
          _count: {
            select: { rsvpResponses: true, events: true },
          },
        },
      }),
    ])

    totalInvitations = results[0]
    publishedCount = results[1]
    draftCount = results[2]
    totalRsvps = results[3]
    rsvpSummary = results[4]
    recentInvitations = results[5]
  } catch (err: any) {
    console.error('Dashboard data fetch error:', err)
    dbError = err?.message || 'Database error'
  }

  if (dbError) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-lg border border-[#EAE1D3] shadow-md text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#C8A96B] mx-auto flex items-center justify-center text-[#C8A96B] text-2xl">
          ✨
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#332A25]">
            تفعيل قاعدة البيانات لأول مرة
          </h3>
          <p className="text-xs text-[#918579] leading-relaxed">
            قاعدة البيانات بحاجة إلى تفعيل الجداول وزرع الحساب الإداري والدعوة النموذجية. اضغط على الزر التالي للتفعيل الفوري:
          </p>
        </div>
        <div>
          <a
            href="/api/setup"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
          >
            <span>تهيئة وتفعيل قاعدة البيانات (1-Click Setup) 🚀</span>
          </a>
        </div>
      </div>
    )
  }

  // Calculate confirmed guests total
  const confirmedGuests = rsvpSummary
    .filter((r) => r.attendance === 'yes')
    .reduce((sum, r) => sum + (r.guestCount || 1), 0)

  const stats = [
    {
      title: 'إجمالي الدعوات',
      value: totalInvitations,
      icon: Mail,
      sub: `${publishedCount} منشورة • ${draftCount} مسودة`,
    },
    {
      title: 'الدعوات المنشورة',
      value: publishedCount,
      icon: CheckCircle,
      sub: 'متاحة للضيوف بروابط عامة',
    },
    {
      title: 'إجمالي ردود الحضور (RSVP)',
      value: totalRsvps,
      icon: Users,
      sub: `مجموع الردود المسجلة`,
    },
    {
      title: 'الضيوف المؤكد حضورهم',
      value: confirmedGuests,
      icon: Sparkles,
      sub: 'عدد الأفراد المسجلين',
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-sm border border-[#EAE1D3] shadow-xs">
        <div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
            مرحباً بك في استوديو دعوات الزفاف
          </h2>
          <p className="text-xs text-[#918579] mt-1">
            إدارة كافة دعوات الزفاف، تخصيص المظهر والسمات، وتتبع ردود الضيوف في مكان واحد.
          </p>
        </div>

        <Link
          href="/dashboard/invitations/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء دعوة جديدة</span>
        </Link>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="p-5 bg-white rounded-sm border border-[#EAE1D3] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#918579]">{stat.title}</span>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-serif-luxury font-bold text-[#332A25]">
                  {stat.value}
                </span>
                <p className="text-[11px] text-[#918579] mt-1">{stat.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Invitations Section */}
      <div className="bg-white rounded-sm border border-[#EAE1D3] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EAE1D3] flex items-center justify-between">
          <div>
            <h3 className="font-serif-luxury font-bold text-lg text-[#332A25]">
              أحدث دعوات الزفاف
            </h3>
            <p className="text-xs text-[#918579]">
              قائمة بالدعوات النشطة ومسودات العمل الحالية
            </p>
          </div>

          <Link
            href="/dashboard/invitations"
            className="text-xs font-semibold text-[#C8A96B] hover:underline flex items-center gap-1"
          >
            <span>عرض كافة الدعوات</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentInvitations.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-[#C8A96B] opacity-40 mb-3" />
            <h4 className="text-base font-bold text-[#332A25] mb-1">لا توجد دعوات بعد</h4>
            <p className="text-xs text-[#918579] mb-4">
              ابدأ بإنشاء أول دعوة زفاف فاخرة بضغطة زر واحدة.
            </p>
            <Link
              href="/dashboard/invitations/create"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C8A96B] rounded-sm hover:bg-[#A68648]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إنشاء دعوة</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F0] border-b border-[#EAE1D3] text-[#918579] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">اسم الدعوة والعروسين</th>
                  <th className="py-3 px-5">الرابط المخصص (Slug)</th>
                  <th className="py-3 px-5">الحالة</th>
                  <th className="py-3 px-5">السمة</th>
                  <th className="py-3 px-5">ردود الحضور</th>
                  <th className="py-3 px-5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1D3]">
                {recentInvitations.map((inv) => {
                  const couple = inv.couple
                  const bride = couple?.brideFullName || couple?.brideFirstName || ''
                  const groom = couple?.groomFullName || couple?.groomFirstName || ''

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF7F0]/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-sm text-[#332A25]">
                          {bride && groom ? `${bride} & ${groom}` : inv.title || 'دعوة بدون اسم'}
                        </div>
                        <div className="text-[11px] text-[#918579] mt-0.5">{inv.title}</div>
                      </td>
                      <td className="py-4 px-5 font-mono text-[11px] text-[#332A25]">
                        /wedding/{inv.slug}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {inv.status === 'PUBLISHED'
                            ? 'منشورة'
                            : inv.status === 'DRAFT'
                            ? 'مسودة'
                            : 'مؤرشفة'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[11px] text-[#918579]">
                        {inv.themeId}
                      </td>
                      <td className="py-4 px-5 font-semibold text-[#332A25]">
                        {inv._count.rsvpResponses} رد
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/dashboard/invitations/edit/${inv.id}`}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-[#FAF7F0] border border-[#EAE1D3] text-[#332A25] hover:border-[#C8A96B] transition-colors"
                          >
                            تعديل مباشر
                          </Link>

                          {inv.status === 'PUBLISHED' && (
                            <a
                              href={`/wedding/${inv.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-[#C8A96B] hover:text-[#A68648]"
                              title="معاينة الصفحة العامة"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
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
    </div>
  )
}
