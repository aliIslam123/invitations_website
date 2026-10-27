'use client'

import React, { useState, useMemo } from 'react'
import { ThemeConfig, TemplateCategory } from '@/lib/themes'
import { TemplateCard } from './TemplateCard'
import { Search, Sparkles, Filter, Check } from 'lucide-react'

interface TemplatesFilterViewProps {
  initialTemplates: ThemeConfig[]
  initialCategory?: string
}

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'all', label: 'جميع التصاميم (16)' },
  { id: 'luxury', label: 'ملكية وفاخرة' },
  { id: 'minimalist', label: 'مينيمال وبسيطة' },
  { id: 'romantic', label: 'رومانسية ووردية' },
  { id: 'cultural', label: 'تراث وخط عربي' },
  { id: 'modern', label: 'عصرية وإيديتوريال' },
]

export function TemplatesFilterView({
  initialTemplates,
  initialCategory = 'all',
}: TemplatesFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>(
    (initialCategory as TemplateCategory) || 'all'
  )
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter((template) => {
      const matchesCategory =
        selectedCategory === 'all' || template.category === selectedCategory

      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        template.name.toLowerCase().includes(q) ||
        template.nameAr.includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.descriptionAr.includes(q) ||
        (template.badge && template.badge.includes(q))

      return matchesCategory && matchesSearch
    })
  }, [initialTemplates, selectedCategory, searchQuery])

  return (
    <div className="space-y-8" dir="rtl">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-[#EAE1D3] shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C8A96B] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-[#6B5E55] hover:bg-[#EAE1D3]/50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#918579]" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو الطابع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-[#FAF7F0] border border-[#EAE1D3] rounded-md text-xs focus:outline-none focus:border-[#C8A96B] focus:bg-white text-[#332A25] placeholder-[#918579]"
          />
        </div>
      </div>

      {/* Grid of Templates */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-[#EAE1D3] p-8">
          <Sparkles className="w-8 h-8 text-[#C8A96B] mx-auto mb-3 opacity-60" />
          <h4 className="font-serif-luxury font-bold text-base text-[#332A25] mb-1">
            لم يتم العثور على تصاميم تطابق بحثك
          </h4>
          <p className="text-xs text-[#918579] mb-4">
            جرب اختيار تصنيف آخر أو تفريغ خانة البحث.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#C8A96B] rounded-sm hover:bg-[#A68648]"
          >
            عرض كافة التصاميم
          </button>
        </div>
      )}
    </div>
  )
}
