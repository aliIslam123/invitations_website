'use client'

import React, { useState } from 'react'
import {
  Upload,
  Image as ImageIcon,
  Music,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Filter,
} from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

interface MediaItem {
  id: string
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  url: string
  mediaType: string
  createdAt: Date | string
}

interface MediaLibraryManagerProps {
  initialAssets: MediaItem[]
}

export function MediaLibraryManager({ initialAssets }: MediaLibraryManagerProps) {
  const [assets, setAssets] = useState(initialAssets)
  const [filterType, setFilterType] = useState<'ALL' | 'image' | 'audio'>('ALL')
  const [isUploading, setIsUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4.2 * 1024 * 1024) {
      alert(
        `حجم الملف (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) كبير جداً للرفع المباشر.\n\nالحد الأقصى للرفع المباشر هو 4 ميجابايت لضمان سرعة تحميل الموقع لدى الضيوف.\n\n💡 بالنسبة للمقاطع الصوتية الكبيرة، يمكنك لصق رابط المقطع المباشر (URL) في إعدادات الموسيقى داخل محرر الدعوة.`
      )
      if (e.target) e.target.value = ''
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.asset) {
        setAssets((prev) => [data.asset, ...prev])
      } else {
        alert(data.error || 'حدث خطأ أثناء رفع الملف.')
      }
    } catch (err) {
      console.error('Upload failed:', err)
      alert('فشل رفع الملف. تأكد من أن حجم الملف أقل من 4 ميجابايت.')
    } finally {
      setIsUploading(false)
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2500)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد بالتأكيد حذف هذا الملف؟')) return

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filtered = assets.filter((a) => {
    if (filterType === 'ALL') return true
    return a.mediaType === filterType
  })

  return (
    <div className="space-y-6">
      {/* Header and Upload Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
            مكتبة الوسائط والملفات
          </h2>
          <p className="text-xs text-[#918579] mt-0.5">
            إدارة الصور الفوتوغرافية، وخلفيات الشاشة، والمقاطع الصوتية
          </p>
        </div>

        {/* Upload Button with hidden file input */}
        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs cursor-pointer self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'جاري الرفع...' : 'رفع صورة أو مقطع صوتي'}</span>
          <input
            type="file"
            accept="image/*,audio/*,.mp3,.wav,.m4a,.ogg,.aac"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE1D3] pb-3">
        {[
          { id: 'ALL', label: 'كافة الملفات' },
          { id: 'image', label: 'الصور فقط' },
          { id: 'audio', label: 'المقاطع الصوتية' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#C8A96B] text-white shadow-xs'
                : 'bg-[#FAF7F0] text-[#332A25] hover:bg-[#EAE1D3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Media Assets */}
      {filtered.length === 0 ? (
        <div className="p-16 bg-white rounded-sm border border-[#EAE1D3] text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-[#C8A96B] opacity-40 mb-3" />
          <h4 className="text-base font-bold text-[#332A25] mb-1">المكتبة فارغة</h4>
          <p className="text-xs text-[#918579]">
            قم برفع أول صورة أو ملف صوتي للبدء في استخدامها داخل دعواتك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-sm border border-[#EAE1D3] overflow-hidden shadow-xs flex flex-col justify-between group"
            >
              {/* Thumbnail or Audio Card */}
              {item.mediaType === 'image' ? (
                <div className="h-36 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-36 w-full bg-[#FAF7F0] flex flex-col items-center justify-center p-4 text-center">
                  <Music className="w-10 h-10 text-[#C8A96B] mb-2" />
                  <audio src={item.url} controls className="w-full h-8" />
                </div>
              )}

              {/* Meta Info */}
              <div className="p-3 border-t border-[#EAE1D3]">
                <p className="text-xs font-semibold text-[#332A25] truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#918579] mt-1">
                  <span>{formatFileSize(item.fileSize)}</span>
                  <span>{item.createdAt && !isNaN(new Date(item.createdAt).getTime()) ? new Date(item.createdAt).toLocaleDateString('ar-SA') : 'الآن'}</span>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="p-1 text-[#918579] hover:text-[#C8A96B] transition-colors"
                    title="نسخ رابط الملف"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#918579] hover:text-[#332A25]"
                    title="معاينة كاملة"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
