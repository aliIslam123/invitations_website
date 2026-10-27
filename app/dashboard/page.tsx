import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import {
  Mail,
  CheckCircle,
  FileText,
  Users,
  Eye,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  Calendar,
  ExternalLink,
  Edit3,
  Palette,
  Heart,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardOverviewPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard')
  }

  const isAdmin = session.role === 'ADMIN'
  const filterClause = isAdmin ? {} : { userId: session.userId }

  let totalInvitations = 0
  let publishedCount = 0
  let draftCount = 0
  let totalRsvps = 0
  let rsvpSummary: any[] = []
  let recentInvitations: any[] = []
  let dbError: string | null = null

  try {
    const results = await Promise.all([
      prisma.weddingInvitation.count({ where: filterClause }),
      prisma.weddingInvitation.count({ where: { ...filterClause, status: 'PUBLISHED' } }),
      prisma.weddingInvitation.count({ where: { ...filterClause, status: 'DRAFT' } }),
      prisma.rSVPResponse.count({
        where: isAdmin ? {} : { invitation: { userId: session.userId } },
      }),
      prisma.rSVPResponse.findMany({
        where: isAdmin ? {} : { invitation: { userId: session.userId } },
        select: {
          attendance: true,
          guestCount: true,
        },
      }),
      prisma.weddingInvitation.findMany({
        where: filterClause,
        take: 6,
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
            قاعدة البيانات بحاجة إلى تفعيل الجداول وزرع الحساب الإداري والدعوة النموذجية.
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
      title: 'إجمالي دعواتكم',
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
      title: 'إجمالي ردود الحضور',
      value: totalRsvps,
      icon: Users,
      sub: `مجموع استجابات الضيوف المسجلة`,
    },
    {
      title: 'الضيوف المؤكد حضورهم',
      value: confirmedGuests,
      icon: Sparkles,
      sub: 'إجمالي الأفراد المرحب بهم',
    },
  ]

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://invitations-website-rust.vercel.app'

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#EAE1D3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F0] text-[#A68648] border border-[#C8A96B]/30">
              {isAdmin ? 'حساب مدير المنصة' : 'مساحة العروسين'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#332A25]">
            أهلاً بك، {session.name || session.email}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B5F]">
            هنا يمكنك متابعة دعواتك وتعديل تفاصيلها ولحظات الفرح واستقبال ردود أحبابكم.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/invitations/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء دعوة جديدة</span>
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-xs font-medium border border-[#EAE1D3] text-[#332A25] hover:bg-[#FAF7F0] transition-colors"
          >
            <Palette className="w-4 h-4 text-[#C8A96B]" />
            <span>استكشاف القوالب</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-lg border border-[#EAE1D3] shadow-xs flex items-center justify-between hover:border-[#C8A96B] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-xs text-[#918579] font-medium block">
                  {stat.title}
                </span>
                <span className="text-2xl font-serif-luxury font-bold text-[#332A25] block">
                  {stat.value}
                </span>
                <span className="text-[11px] text-[#A68648] block">
                  {stat.sub}
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-[#FAF7F0] border border-[#EAE1D3] flex items-center justify-center text-[#C8A96B] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Invitations or Empty State */}
      <div className="bg-white rounded-lg border border-[#EAE1D3] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#EAE1D3] flex items-center justify-between">
          <div>
            <h3 className="font-serif-luxury font-bold text-lg text-[#332A25]">
              دعوات الزفاف الخاصة بك
            </h3>
            <p className="text-xs text-[#918579] mt-0.5">
              إدارة الروابط، التعديل المباشر، ومتابعة الردود
            </p>
          </div>

          {recentInvitations.length > 0 && (
            <Link
              href="/dashboard/invitations"
              className="text-xs font-semibold text-[#C8A96B] hover:text-[#A68648] inline-flex items-center gap-1"
            >
              <span>عرض كل الدعوات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentInvitations.length === 0 ? (
          <div className="text-center py-16 px-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F0] border border-[#C8A96B] mx-auto flex items-center justify-center text-[#C8A96B]">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif-luxury font-bold text-lg text-[#332A25]">
                لم تقم بإنشاء أي دعوة زفاف بعد
              </h4>
              <p className="text-xs text-[#918579] max-w-sm mx-auto">
                اختر قالباً مميزاً من مكتبة التصاميم وابدأ بتخصيص بطاقة زفافكم الملكية الآن.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/invitations/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء دعوتكم الأولى الآن</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE1D3]">
            {recentInvitations.map((inv) => {
              const groomName = inv.couple?.groomFullName || inv.couple?.groomFirstName || 'العريس'
              const brideName = inv.couple?.brideFullName || inv.couple?.brideFirstName || 'العروس'
              const isPublished = inv.status === 'PUBLISHED'
              const publicUrl = `${siteUrl}/wedding/${inv.slug}`

              return (
                <div
                  key={inv.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF7F0]/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-luxury font-bold text-base text-[#332A25]">
                        {groomName} & {brideName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isPublished ? 'منشورة للعامة' : 'مسودة قيد التجهيز'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#918579]">
                      <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#EAE1D3]">
                        /{inv.slug}
                      </span>
                      <span>القالب: {inv.themeId || 'الشمبانيا الملكي'}</span>
                      <span>•</span>
                      <span>{inv._count?.rsvpResponses || 0} رد حضور</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link
                      href={`/editor/${inv.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>المحرر المباشر</span>
                    </Link>

                    <Link
                      href={`/dashboard/invitations/${inv.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium border border-[#EAE1D3] text-[#332A25] bg-white hover:bg-[#FAF7F0] transition-colors"
                    >
                      <span>إدارة الدعوة</span>
                    </Link>

                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-sm border border-[#EAE1D3] text-[#7A6B5F] hover:text-[#C8A96B] hover:bg-white transition-colors"
                      title="معاينة الرابط العام"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
