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
  Eye,
  Power,
  Ban,
  Check,
  LayoutGrid,
  ListFilter,
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
    [initialUsers[0]?.id]: true,
  })
  const [activeTab, setActiveTab] = useState<'CUSTOMERS' | 'ALL_INVITATIONS'>('CUSTOMERS')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'USER'>('all')
  const [invitationStatusFilter, setInvitationStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'SUSPENDED' | 'DRAFT'>('ALL')
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

  // All invitations flattened across all users
  const allInvitations = useMemo(() => {
    return users.flatMap((u) =>
      (u.invitations || []).map((inv: any) => ({
        ...inv,
        ownerName: u.name || 'بدون اسم',
        ownerEmail: u.email,
        ownerId: u.id,
        ownerRole: u.role,
      }))
    )
  }, [users])

  const totalSuspended = useMemo(() => {
    return allInvitations.filter((i) => i.status === 'SUSPENDED').length
  }, [allInvitations])

  const currentTotalPublished = useMemo(() => {
    return allInvitations.filter((i) => i.status === 'PUBLISHED').length
  }, [allInvitations])

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

  // Set explicit status for an invitation: 'PUBLISHED' | 'SUSPENDED' | 'DRAFT'
  const handleSetInvitationStatus = async (
    invitationId: string,
    newStatus: 'PUBLISHED' | 'SUSPENDED' | 'DRAFT',
    slug: string
  ) => {
    if (slug === 'mohamed-and-asmaa' && newStatus !== 'PUBLISHED') {
      alert('لا يمكن إيقاف أو تعطيل الدعوة النموذجية لمحمد وأسماء لحمايتها!')
      return
    }

    const actionText =
      newStatus === 'SUSPENDED'
        ? 'إيقاف وتعطيل هذه الدعوة وحجبها عن الزوار'
        : newStatus === 'PUBLISHED'
        ? 'تفعيل ونشر هذه الدعوة وإتاحتها للزوار'
        : 'تحويل هذه الدعوة إلى مسودة'

    if (!confirm(`هل أنت متأكد من ${actionText}؟`)) return

    setLoadingAction(`status-${invitationId}`)
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => ({
            ...u,
            invitations: (u.invitations || []).map((inv: any) =>
              inv.id === invitationId ? { ...inv, status: newStatus } : inv
            ),
          }))
        )
        const label =
          newStatus === 'PUBLISHED'
            ? '✅ تم تفعيل ونشر الدعوة بنجاح'
            : newStatus === 'SUSPENDED'
            ? '⛔ تم إيقاف وتعطيل الدعوة بنجاح'
            : '○ تم تحويل الدعوة إلى مسودة'
        showToast(label)
      } else {
        showToast(data.error || 'تعذر تحديث حالة الدعوة', true)
      }
    } catch {
      showToast('حدث خطأ في الشبكة أثناء تحديث الحالة', true)
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
    if (!confirm(`هل أنت متأكد من حذف هذه الدعوة (${slug}) نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`)) return

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
      if (roleFilter !== 'all' && u.role !== roleFilter) return false

      const count = (u.invitations || []).length
      if (hasInvitationsFilter === 'with' && count === 0) return false
      if (hasInvitationsFilter === 'without' && count > 0) return false

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

  // Filtered Invitations List
  const filteredInvitations = useMemo(() => {
    return allInvitations.filter((inv) => {
      if (invitationStatusFilter !== 'ALL' && inv.status !== invitationStatusFilter) return false

      const q = searchQuery.trim().toLowerCase()
      if (!q) return true

      const groom = inv.couple?.groomFullName || inv.couple?.groomFirstName || ''
      const bride = inv.couple?.brideFullName || inv.couple?.brideFirstName || ''
      return (
        inv.title?.toLowerCase().includes(q) ||
        inv.slug?.toLowerCase().includes(q) ||
        groom.toLowerCase().includes(q) ||
        bride.toLowerCase().includes(q) ||
        inv.ownerName?.toLowerCase().includes(q) ||
        inv.ownerEmail?.toLowerCase().includes(q)
      )
    })
  }, [allInvitations, invitationStatusFilter, searchQuery])

  return (
    <div className="space-y-8" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            toastMessage.isError ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
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
            لوحة الإشراف المركزية وإدارة الدعوات والعملاء
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            تحكم كامل وسريع: إيقاف أو تفعيل أي دعوة فوراً، مراجعة كافة الدعوات والحسابات، والتعديل والدخول كعميل.
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
            <span className="text-2xl font-bold text-slate-900 block font-mono">{allInvitations.length}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">
              {currentTotalPublished} دعوة منشورة ونشطة
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">الدعوات الموقوفة</span>
            <span className="text-2xl font-bold text-red-600 block font-mono">{totalSuspended}</span>
            <span className="text-[11px] text-slate-400 block">موقوفة من قِبل الإدارة</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <Ban className="w-5 h-5" />
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
      </div>

      {/* Main View Tabs (Customers vs All Invitations Quick Control) */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => setActiveTab('CUSTOMERS')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'CUSTOMERS'
              ? 'border-[#C8A96B] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-[#C8A96B]" />
          <span>حسابات العملاء ودعواتهم ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ALL_INVITATIONS')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'ALL_INVITATIONS'
              ? 'border-[#C8A96B] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-[#C8A96B]" />
          <span>التحكم المباشر بكافة الدعوات ({allInvitations.length})</span>
          {totalSuspended > 0 && (
            <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {totalSuspended} موقوفة
            </span>
          )}
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'CUSTOMERS'
                ? 'ابحث باسم العميل، البريد، أو عنوان الدعوة...'
                : 'ابحث باسم العروسين، الرابط، أو البريد...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-[#C8A96B] text-slate-900"
          />
        </div>

        {/* Tab-specific Filters */}
        {activeTab === 'CUSTOMERS' ? (
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
                جميع الحسابات
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
        ) : (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setInvitationStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                invitationStatusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              جميع الحالات ({allInvitations.length})
            </button>
            <button
              onClick={() => setInvitationStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                invitationStatusFilter === 'PUBLISHED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              منشورة ({allInvitations.filter((i) => i.status === 'PUBLISHED').length})
            </button>
            <button
              onClick={() => setInvitationStatusFilter('SUSPENDED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                invitationStatusFilter === 'SUSPENDED' ? 'bg-white text-red-600 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              موقوفة ⛔ ({totalSuspended})
            </button>
            <button
              onClick={() => setInvitationStatusFilter('DRAFT')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                invitationStatusFilter === 'DRAFT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              مسودة ({allInvitations.filter((i) => i.status === 'DRAFT').length})
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: CUSTOMERS DIRECTORY WITH INVITATION ACCORDIONS */}
      {activeTab === 'CUSTOMERS' && (
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">لم يتم العثور على أي عميل يطابق معايير البحث.</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isExpanded = !!expandedUsers[user.id]
              const userInvitations = user.invitations || []
              const isAdmin = user.role === 'ADMIN'

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  {/* Customer Row Header */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                        {user.name ? user.name[0] : user.email[0].toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">
                            {user.name || 'عميل بدون اسم'}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAdmin
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {isAdmin ? 'مدير منصة (ADMIN)' : 'عميل (USER)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.email}</span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400">
                            تسجيل: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Action Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      {/* Impersonate Button */}
                      <button
                        onClick={() => handleImpersonate(user.id, user.name || user.email)}
                        disabled={loadingAction === `impersonate-${user.id}`}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="الدخول بحساب هذا العميل لتصفح مساحته"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#C8A96B]" />
                        <span>دخول كعميل</span>
                      </button>

                      {/* Toggle Role Button */}
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        disabled={loadingAction === `role-${user.id}`}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAdmin ? 'تخفيض لعميل' : 'ترقية لمدير'}</span>
                      </button>

                      {/* Accordion Expand Button */}
                      <button
                        onClick={() => toggleUserExpanded(user.id)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          userInvitations.length > 0
                            ? 'bg-[#C8A96B] hover:bg-[#b08e50] text-slate-950'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>الدعوات ({userInvitations.length})</span>
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
                          {userInvitations.length === 0
                            ? 'لا توجد دعوات منشأة'
                            : `${userInvitations.length} دعوة`}
                        </span>
                      </div>

                      {userInvitations.length === 0 ? (
                        <div className="p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                          لم يقم هذا العميل بإنشاء أي دعوة زفاف بعد.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {userInvitations.map((inv: any) => {
                            const isSuspended = inv.status === 'SUSPENDED'
                            const isPublished = inv.status === 'PUBLISHED'
                            const publicUrl = `${siteUrl}/wedding/${inv.slug}`
                            const groomName =
                              inv.couple?.groomFullName || inv.couple?.groomFirstName || 'العريس'
                            const brideName =
                              inv.couple?.brideFullName || inv.couple?.brideFirstName || 'العروس'

                            return (
                              <div
                                key={inv.id}
                                className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                                  isSuspended
                                    ? 'bg-red-50/40 border-red-200'
                                    : 'bg-slate-50/70 border-slate-200 hover:border-[#C8A96B]'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-bold text-sm text-slate-900">
                                      {groomName} & {brideName}
                                    </h5>

                                    {/* Status Badge */}
                                    <span
                                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                        isSuspended
                                          ? 'bg-red-100 text-red-800 border border-red-300'
                                          : isPublished
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          isSuspended
                                            ? 'bg-red-600'
                                            : isPublished
                                            ? 'bg-emerald-600'
                                            : 'bg-amber-600'
                                        }`}
                                      />
                                      <span>
                                        {isSuspended
                                          ? '⛔ موقوفة ومعطلة'
                                          : isPublished
                                          ? '● منشورة ونشطة'
                                          : '○ مسودة'}
                                      </span>
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
                                    <span>/{inv.slug}</span>
                                    <span>•</span>
                                    <span>القالب: {inv.themeId || 'الشمبانيا الملكي'}</span>
                                    <span>•</span>
                                    <span>{inv._count?.rsvpResponses || 0} رد حضور</span>
                                  </div>
                                </div>

                                {/* Direct Admin Controls */}
                                <div className="pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                                  {/* Quick Stop / Activate Buttons */}
                                  <div className="flex items-center gap-1.5">
                                    {isPublished ? (
                                      <button
                                        onClick={() =>
                                          handleSetInvitationStatus(inv.id, 'SUSPENDED', inv.slug)
                                        }
                                        disabled={loadingAction === `status-${inv.id}`}
                                        className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                        title="إيقاف الدعوة فوراً ومنع الزوار من الوصول إليها"
                                      >
                                        <Ban className="w-3 h-3" />
                                        <span>إيقاف الدعوة ⛔</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleSetInvitationStatus(inv.id, 'PUBLISHED', inv.slug)
                                        }
                                        disabled={loadingAction === `status-${inv.id}`}
                                        className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                        title="تفعيل ونشر الدعوة لتصبح متاحة للعامة"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>تفعيل ونشر ✅</span>
                                      </button>
                                    )}

                                    {!isSuspended && isPublished && (
                                      <button
                                        onClick={() =>
                                          handleSetInvitationStatus(inv.id, 'DRAFT', inv.slug)
                                        }
                                        disabled={loadingAction === `status-${inv.id}`}
                                        className="px-2 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                                        title="تعيين كمسودة"
                                      >
                                        مسودة
                                      </button>
                                    )}
                                  </div>

                                  {/* Edit / View / Delete */}
                                  <div className="flex items-center gap-1.5">
                                    <Link
                                      href={`/editor/${inv.id}`}
                                      className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                      title="فتح المحرر المباشر لتعديل الدعوة"
                                    >
                                      <Edit3 className="w-3 h-3 text-[#C8A96B]" />
                                      <span>المحرر</span>
                                    </Link>

                                    <a
                                      href={publicUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                      title="معاينة الرابط الخارجي"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>الرابط</span>
                                    </a>

                                    {inv.slug !== 'mohamed-and-asmaa' && (
                                      <button
                                        onClick={() => handleDeleteInvitation(inv.id, inv.slug)}
                                        disabled={loadingAction === `delete-${inv.id}`}
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                        title="حذف هذه الدعوة نهائياً"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
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
      )}

      {/* TAB 2: DIRECT QUICK CONTROL OF ALL PLATFORM INVITATIONS */}
      {activeTab === 'ALL_INVITATIONS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  لوحة التحكم المركزية بكافة دعوات الموقع
                </h4>
                <p className="text-[11px] text-slate-500">
                  يمكنك إيقاف أو تفعيل أو تعديل أو معاينة أي دعوة زفاف على المنصة مباشرة من هذا الجدول.
                </p>
              </div>
              <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600">
                {filteredInvitations.length} دعوة
              </span>
            </div>

            {filteredInvitations.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                لا توجد دعوات تطابق معايير البحث أو التصفية الحالية.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">الدعوة والعروسين</th>
                      <th className="py-3 px-4">الرابط المخصص</th>
                      <th className="py-3 px-4">صاحب الدعوة (العميل)</th>
                      <th className="py-3 px-4">الحالة الحالية</th>
                      <th className="py-3 px-4 text-center">التحكم بالإيقاف / النشر</th>
                      <th className="py-3 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvitations.map((inv) => {
                      const isSuspended = inv.status === 'SUSPENDED'
                      const isPublished = inv.status === 'PUBLISHED'
                      const publicUrl = `${siteUrl}/wedding/${inv.slug}`
                      const groomName =
                        inv.couple?.groomFullName || inv.couple?.groomFirstName || 'العريس'
                      const brideName =
                        inv.couple?.brideFullName || inv.couple?.brideFirstName || 'العروس'

                      return (
                        <tr
                          key={inv.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSuspended ? 'bg-red-50/20' : ''
                          }`}
                        >
                          {/* Couple Names */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {groomName} & {brideName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {inv.title || 'دعوة زفاف'} • القالب: {inv.themeId || 'الشمبانيا الملكي'}
                            </div>
                          </td>

                          {/* Link / Slug */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <a
                              href={publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#C8A96B] hover:underline flex items-center gap-1"
                            >
                              <span>/{inv.slug}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>

                          {/* Owner */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{inv.ownerName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{inv.ownerEmail}</div>
                          </td>

                          {/* Current Status Badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                isSuspended
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : isPublished
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSuspended
                                    ? 'bg-red-600'
                                    : isPublished
                                    ? 'bg-emerald-600'
                                    : 'bg-amber-600'
                                }`}
                              />
                              <span>
                                {isSuspended
                                  ? '⛔ موقوفة ومعطلة'
                                  : isPublished
                                  ? '● منشورة ونشطة'
                                  : '○ مسودة'}
                              </span>
                            </span>
                          </td>

                          {/* Instant Stop / Publish Action */}
                          <td className="py-3.5 px-4 text-center">
                            {isPublished ? (
                              <button
                                onClick={() =>
                                  handleSetInvitationStatus(inv.id, 'SUSPENDED', inv.slug)
                                }
                                disabled={loadingAction === `status-${inv.id}`}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 mx-auto transition-colors cursor-pointer shadow-xs"
                                title="إيقاف الدعوة فوراً ومنع الزوار من فتحها"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>إيقاف الدعوة ⛔</span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSetInvitationStatus(inv.id, 'PUBLISHED', inv.slug)
                                }
                                disabled={loadingAction === `status-${inv.id}`}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 mx-auto transition-colors cursor-pointer shadow-xs"
                                title="تفعيل ونشر الدعوة"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>تفعيل ونشر ✅</span>
                              </button>
                            )}
                          </td>

                          {/* Other actions (Edit / Delete) */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <Link
                                href={`/editor/${inv.id}`}
                                className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                title="فتح المحرر لتعديل الدعوة"
                              >
                                <Edit3 className="w-3 h-3 text-[#C8A96B]" />
                                <span>تعديل بالمحرر</span>
                              </Link>

                              {inv.slug !== 'mohamed-and-asmaa' && (
                                <button
                                  onClick={() => handleDeleteInvitation(inv.id, inv.slug)}
                                  disabled={loadingAction === `delete-${inv.id}`}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="حذف الدعوة نهائياً"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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
      )}
    </div>
  )
}
