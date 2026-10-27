'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Shield,
  Trash2,
  UserCheck,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  LogIn,
  Sparkles,
  Calendar,
  Lock,
  ArrowRight,
  RefreshCw,
  PlusCircle,
} from 'lucide-react'

interface AdminDashboardClientProps {
  initialUsers: any[]
  totalInvitations: number
  totalPublished: number
  totalRsvps: number
  siteUrl: string
}

export function AdminDashboardClient({
  initialUsers,
  totalInvitations,
  totalPublished,
  totalRsvps,
  siteUrl,
}: AdminDashboardClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({
    // Expand the first user by default
    [initialUsers[0]?.id]: true,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'USER'>('all')
  const [hasInvitationsFilter, setHasInvitationsFilter] = useState<'all' | 'with' | 'without'>('all')
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null)

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError })
    setTimeout(() => setToastMessage(null), 3500)
  }

  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  // Toggle user role between ADMIN and USER
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    setLoadingAction(`role-${userId}`)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
        showToast(`تم تغيير الصلاحية إلى ${newRole === 'ADMIN' ? 'مدير (ADMIN)' : 'عميل (USER)'}`)
      } else {
        showToast('تعذر تغيير الصلاحية', true)
      }
    } catch {
      showToast('حدث خطأ أثناء تغيير الصلاحية', true)
    } finally {
      setLoadingAction(null)
    }
  }

  // Impersonate / Login as Customer
  const handleImpersonate = async (userId: string, userName: string) => {
    if (!confirm(`هل تريد تسجيل الدخول بحساب العميل "${userName}" لفتح لوحة تحكمه؟`)) return
    setLoadingAction(`impersonate-${userId}`)
    try {
      const res = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: 'POST',
      })
      if (res.ok) {
        showToast(`تم تسجيل الدخول بحساب ${userName} بنجاح، جاري التحويل...`)
        window.location.href = '/dashboard'
      } else {
        showToast('تعذر الدخول بحساب العميل', true)
      }
    } catch {
      showToast('حدث خطأ أثناء تسجيل الدخول', true)
    } finally {
      setLoadingAction(null)
    }
  }

  // Toggle publication status of an invitation
  const handleToggleInvitationStatus = async (invitationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    setLoadingAction(`status-${invitationId}`)
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => ({
            ...u,
            invitations: (u.invitations || []).map((inv: any) =>
              inv.id === invitationId ? { ...inv, status: newStatus } : inv
            ),
          }))
        )
        showToast(`تم تغيير حالة الدعوة إلى ${newStatus === 'PUBLISHED' ? 'منشورة' : 'مسودة'}`)
      } else {
        showToast('تعذر تحديث حالة الدعوة', true)
      }
    } catch {
      showToast('حدث خطأ في الشبكة', true)
    } finally {
      setLoadingAction(null)
    }
  }

  // Delete invitation
  const handleDeleteInvitation = async (invitationId: string, slug: string) => {
    if (slug === 'mohamed-and-asmaa') {
      alert('لا يمكن حذف الدعوة النموذجية لمحمد وأسماء لحمايتها!')
      return
    }
    if (!confirm(`هل أنت متأكد من حذف هذه الدعوة (${slug}) نهائياً؟`)) return

    setLoadingAction(`delete-${invitationId}`)
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => ({
            ...u,
            invitations: (u.invitations || []).filter((inv: any) => inv.id !== invitationId),
          }))
        )
        showToast('تم حذف الدعوة بنجاح')
      } else {
        showToast('تعذر حذف الدعوة', true)
      }
    } catch {
      showToast('حدث خطأ أثناء الحذف', true)
    } finally {
      setLoadingAction(null)
    }
  }

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) return false

      // Invitations count filter
      const count = (u.invitations || []).length
      if (hasInvitationsFilter === 'with' && count === 0) return false
      if (hasInvitationsFilter === 'without' && count > 0) return false

      // Search query
      const q = searchQuery.trim().toLowerCase()
      if (!q) return true

      const nameMatch = u.name?.toLowerCase().includes(q)
      const emailMatch = u.email?.toLowerCase().includes(q)
      const invMatch = (u.invitations || []).some(
        (inv: any) =>
          inv.title?.toLowerCase().includes(q) ||
          inv.slug?.toLowerCase().includes(q) ||
          inv.couple?.groomFullName?.toLowerCase().includes(q) ||
          inv.couple?.brideFullName?.toLowerCase().includes(q)
      )

      return nameMatch || emailMatch || invMatch
    })
  }, [users, roleFilter, hasInvitationsFilter, searchQuery])

  return (
    <div className="space-y-8" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            toastMessage.isError
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Permanent Credentials Display */}
      <div className="bg-[#111827] text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96B]">
              SuperAdmin Command Center
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            لوحة الإشراف المركزية وإدارة العملاء والدعوات
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            تحكم كامل في كافة حسابات العملاء، استعراض دعوات كل حساب، تعديل حالات النشر، الدخول بحساب أي عميل، وإدارة الصلاحيات.
          </p>
        </div>

        {/* Permanent Credentials Pill */}
        <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl space-y-2 text-xs shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-[#C8A96B] font-semibold text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            <span>بيانات حساب المدير الثابتة:</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">المستخدم:</span>
              <span className="text-emerald-400 font-bold">admin</span>
            </div>
            <div>
              <span className="text-slate-500 block">كلمة المرور:</span>
              <span className="text-emerald-400 font-bold">admin123</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">إجمالي العملاء</span>
            <span className="text-2xl font-bold text-slate-900 block font-mono">{users.length}</span>
            <span className="text-[11px] text-slate-400 block">حساب مسجل بالمنصة</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">إجمالي الدعوات</span>
            <span className="text-2xl font-bold text-slate-900 block font-mono">{totalInvitations}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">{totalPublished} دعوة منشورة</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">ردود الحضور (RSVP)</span>
            <span className="text-2xl font-bold text-slate-900 block font-mono">{totalRsvps}</span>
            <span className="text-[11px] text-slate-400 block">إجمالي ردود الضيوف</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">رابط لوحة العميل</span>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#C8A96B] hover:text-[#A68648] inline-flex items-center gap-1 mt-1"
            >
              <span>فتح /dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[11px] text-slate-400 block">مساحة عمل العروسين</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث باسم العميل، البريد، أو عنوان الدعوة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-[#C8A96B] text-slate-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                roleFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              الكل ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('USER')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                roleFilter === 'USER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              العملاء ({users.filter((u) => u.role === 'USER').length})
            </button>
            <button
              onClick={() => setRoleFilter('ADMIN')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                roleFilter === 'ADMIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              المدراء ({users.filter((u) => u.role === 'ADMIN').length})
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setHasInvitationsFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                hasInvitationsFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              كافة الحسابات
            </button>
            <button
              onClick={() => setHasInvitationsFilter('with')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                hasInvitationsFilter === 'with' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              لديهم دعوات
            </button>
          </div>
        </div>
      </div>

      {/* Customers & Their Invitations Directory */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-400" />
            <h4 className="font-bold text-slate-800 text-sm">لم يتم العثور على حسابات تطابق البحث</h4>
            <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى أو تفريغ الفلاتر.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isExpanded = Boolean(expandedUsers[user.id])
            const userInvitations = user.invitations || []
            const isAdmin = user.role === 'ADMIN'

            return (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* User Header Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  {/* User Profile */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        isAdmin ? 'bg-amber-100 text-amber-800 border-2 border-amber-300' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {user.name || 'عميل بدون اسم'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {isAdmin ? 'مدير المنصة (ADMIN)' : 'عميل (USER)'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>
                          مسجل: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Invitation Count */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Impersonate button */}
                    <button
                      onClick={() => handleImpersonate(user.id, user.name || user.email)}
                      disabled={loadingAction === `impersonate-${user.id}`}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
                      title="الدخول بحساب هذا العميل لتصفح مساحته"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#C8A96B]" />
                      <span>دخول كعميل</span>
                    </button>

                    {/* Toggle Role Button */}
                    <button
                      onClick={() => handleToggleRole(user.id, user.role)}
                      disabled={loadingAction === `role-${user.id}`}
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAdmin ? 'تخفيض إلى عميل' : 'ترقية لمدير'}</span>
                    </button>

                    {/* Accordion Expand Button */}
                    <button
                      onClick={() => toggleUserExpanded(user.id)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        userInvitations.length > 0
                          ? 'bg-[#C8A96B] hover:bg-[#b08e50] text-slate-950'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>
                        الدعوات ({userInvitations.length})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Invitations List for this Customer */}
                {isExpanded && (
                  <div className="border-t border-slate-200 p-4 sm:p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-slate-700">
                        قائمة دعوات الزفاف المملوكة لهذا الحساب:
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {userInvitations.length === 0 ? 'لا توجد دعوات منشأة' : `${userInvitations.length} دعوة`}
                      </span>
                    </div>

                    {userInvitations.length === 0 ? (
                      <div className="p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                        لم يقم هذا العميل بإنشاء أي دعوة زفاف بعد.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userInvitations.map((inv: any) => {
                          const isPublished = inv.status === 'PUBLISHED'
                          const publicUrl = `${siteUrl}/wedding/${inv.slug}`
                          const groomName = inv.couple?.groomFullName || inv.couple?.groomFirstName || 'العريس'
                          const brideName = inv.couple?.brideFullName || inv.couple?.brideFirstName || 'العروس'

                          return (
                            <div
                              key={inv.id}
                              className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#C8A96B] transition-all space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-bold text-sm text-slate-900">
                                    {groomName} & {brideName}
                                  </h5>

                                  <button
                                    onClick={() => handleToggleInvitationStatus(inv.id, inv.status)}
                                    disabled={loadingAction === `status-${inv.id}`}
                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                                      isPublished
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                        : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                                    }`}
                                    title="اضغط للتبديل بين منشورة ومسودة"
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isPublished ? 'bg-emerald-600' : 'bg-amber-600'
                                      }`}
                                    />
                                    <span>{isPublished ? 'منشورة (اضغط للتعطيل)' : 'مسودة (اضغط للنشر)'}</span>
                                  </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                                  <span>/{inv.slug}</span>
                                  <span>•</span>
                                  <span>القالب: {inv.themeId || 'الشمبانيا الملكي'}</span>
                                  <span>•</span>
                                  <span>{inv._count?.rsvpResponses || 0} رد حضور</span>
                                </div>
                              </div>

                              {/* Controls for this Invitation */}
                              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/editor/${inv.id}`}
                                    className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                  >
                                    <Edit3 className="w-3 h-3 text-[#C8A96B]" />
                                    <span>المحرر المباشر</span>
                                  </Link>

                                  <a
                                    href={publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>فتح الرابط</span>
                                  </a>
                                </div>

                                {inv.slug !== 'mohamed-and-asmaa' && (
                                  <button
                                    onClick={() => handleDeleteInvitation(inv.id, inv.slug)}
                                    disabled={loadingAction === `delete-${inv.id}`}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="حذف هذه الدعوة"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
