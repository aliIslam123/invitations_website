import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Mail, ExternalLink, Edit3, Eye, CheckCircle2, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminInvitationsPage() {
  const invitations = await prisma.weddingInvitation.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      couple: true,
      _count: { select: { rsvpResponses: true } },
    },
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          كافة دعوات الزفاف في المنصة ({invitations.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          مراقبة حالة النشر، القوالب المستخدمة، والروابط العامة لجميع العملاء
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">العروسين</th>
                <th className="p-4">الرابط المخصص</th>
                <th className="p-4">المالك (العميل)</th>
                <th className="p-4">القالب</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">ردود RSVP</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invitations.map((inv) => {
                const groom = inv.couple?.groomFullName || inv.couple?.groomFirstName || 'العريس'
                const bride = inv.couple?.brideFullName || inv.couple?.brideFirstName || 'العروس'
                const isPublished = inv.status === 'PUBLISHED'

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-bold text-slate-900">
                      {groom} & {bride}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      /{inv.slug}
                    </td>
                    <td className="p-4 text-slate-600">
                      {inv.user?.name || inv.user?.email || 'حساب النظام'}
                    </td>
                    <td className="p-4 text-slate-600">
                      {inv.themeId || 'الشمبانيا الملكي'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPublished ? 'منشورة' : 'مسودة'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {inv._count.rsvpResponses}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/editor/${inv.id}`}
                          className="px-2.5 py-1 rounded bg-[#0F172A] text-white hover:bg-slate-800 flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Edit3 className="w-3 h-3 text-[#C8A96B]" />
                          <span>تحرير</span>
                        </Link>
                        <a
                          href={`/wedding/${inv.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-slate-500 hover:text-slate-800"
                          title="فتح الرابط العام"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
