import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import {
  Users,
  Mail,
  CheckCircle,
  Eye,
  Palette,
  Shield,
  Activity,
  ArrowUpRight,
  Sparkles,
  Server,
  Database,
  Calendar,
} from 'lucide-react'
import { getAllThemes } from '@/lib/themes'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PlatformAdminDashboardPage() {
  const [
    totalUsers,
    totalInvitations,
    publishedInvitations,
    totalRsvps,
    recentUsers,
    recentInvitations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.weddingInvitation.count(),
    prisma.weddingInvitation.count({ where: { status: 'PUBLISHED' } }),
    prisma.rSVPResponse.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { invitations: true } },
      },
    }),
    prisma.weddingInvitation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        couple: true,
        _count: { select: { rsvpResponses: true } },
      },
    }),
  ])

  const templatesCount = getAllThemes().length

  const stats = [
    {
      title: 'إجمالي العملاء والمسجلين',
      value: totalUsers,
      sub: 'حسابات مسجلة وموثقة',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'إجمالي دعوات الزفاف',
      value: totalInvitations,
      sub: `${publishedInvitations} منشورة على الروابط العامة`,
      icon: Mail,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'إجمالي ردود الحضور (RSVP)',
      value: totalRsvps,
      sub: 'ردود ضيوف مسجلة في النظام',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'القوالب الملكية النشطة',
      value: templatesCount,
      sub: 'تصاميم مدمجة وجاهزة',
      icon: Palette,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Live Production
            </span>
            <span className="text-xs text-slate-500">
              قاعدة بيانات PostgreSQL متصلة ومحدثة
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            لوحة الإشراف المركزية للمنصة
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/platform-admin/templates"
            className="px-4 py-2 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>معاينة القوالب الـ 16</span>
          </Link>
          <Link
            href="/platform-admin/customers"
            className="px-4 py-2 rounded text-xs font-semibold bg-[#0F172A] hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>إدارة العملاء</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">
                  {s.title}
                </span>
                <span className="text-2xl font-bold text-slate-900 block font-mono">
                  {s.value}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {s.sub}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Tables: Recent Users & Recent Invitations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Customers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C8A96B]" />
              <span>أحدث العملاء المسجلين</span>
            </h3>
            <Link
              href="/platform-admin/customers"
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              عرض الكل
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    {u.name || 'مستخدم غير مسمى'}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px] block">
                    {u.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    {u._count.invitations} دعوة
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invitations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C8A96B]" />
              <span>أحدث الدعوات في المنصة</span>
            </h3>
            <Link
              href="/platform-admin/invitations"
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              عرض الكل
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentInvitations.map((inv) => {
              const groom = inv.couple?.groomFullName || inv.couple?.groomFirstName || 'العريس'
              const bride = inv.couple?.brideFullName || inv.couple?.brideFirstName || 'العروس'
              const isPublished = inv.status === 'PUBLISHED'
              return (
                <div key={inv.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">
                      {groom} & {bride}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] block">
                      /{inv.slug} • مالك: {inv.user?.name || inv.user?.email || 'غير مخصص'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isPublished ? 'منشورة' : 'مسودة'}
                    </span>
                    <Link
                      href={`/wedding/${inv.slug}`}
                      target="_blank"
                      className="p-1 rounded text-slate-400 hover:text-slate-600"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
