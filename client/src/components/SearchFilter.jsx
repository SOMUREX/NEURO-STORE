import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Files' },
  { id: 'Image', label: 'Images' },
  { id: 'Video', label: 'Videos' },
  { id: 'Audio', label: 'Audio' },
  { id: 'Document', label: 'Documents' }
];

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenUploadModal,
  totalResultsCount
}) {
  return (
    <div class="px-6 mb-6">
      <div class="max-w-4xl mx-auto space-y-3">
        {/* Search Bar Input */}
        <div class="relative flex items-center">
          <div class="absolute left-4 text-gray-400 pointer-events-none">
            <Search class="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, tag, description, or SHA-256 hash..."
            class="w-full bg-[#f3f4f6] text-[#1a1a1a] placeholder:text-[#6b7280] text-[14px] font-medium pl-12 pr-10 py-3.5 rounded-[16px] border border-transparent focus:border-[#f97316] focus:bg-white focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              class="absolute right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X class="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontal Scroll Filter Pills */}
        <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                class={`px-5 py-2.5 rounded-[32px] text-[13px] font-bold whitespace-nowrap transition-all active:scale-95 border ${
                  isActive
                    ? 'bg-[#f97316] text-white border-[#f97316] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
