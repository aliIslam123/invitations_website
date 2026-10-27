import React from 'react'
import { prisma } from '@/lib/db'
import { Users, Mail, Calendar, Shield, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          invitations: true,
          sessions: true,
        },
      },
      invitations: {
        select: {
          id: true,
          slug: true,
          status: true,
        },
      },
    },
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          إدارة حسابات العملاء ({users.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          قائمة المستخدمين والعملاء المسجلين عبر Google OAuth أو البريد الإلكتروني
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">العميل</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الصلاحية (Role)</th>
                <th className="p-4">عدد الدعوات</th>
                <th className="p-4">تاريخ التسجيل</th>
                <th className="p-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name || 'بدون اسم'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800">
                    {u._count.invitations}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>نشط</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
