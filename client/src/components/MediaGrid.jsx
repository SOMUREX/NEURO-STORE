import React from 'react';
import { Image, Video, Music, FileText, Eye, Download, Tag, HardDrive, Sparkles } from 'lucide-react';

const CATEGORY_STYLES = {
  Image: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200/50',
    icon: Image,
    label: 'Image Asset'
  },
  Video: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200/50',
    icon: Video,
    label: 'Video Asset'
  },
  Audio: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200/50',
    icon: Music,
    label: 'Audio Recording'
  },
  Document: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200/50',
    icon: FileText,
    label: 'PDF / Text Doc'
  }
};

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function MediaGrid({ files, onSelectFile, onOpenUploadModal }) {
  if (!files || files.length === 0) {
    return (
      <div class="px-6 mb-8">
        <div class="max-w-4xl mx-auto bg-white rounded-[32px] border border-gray-100 p-12 text-center shadow-sm">
          <div class="w-16 h-16 rounded-full bg-[#fff7ed] text-[#f97316] flex items-center justify-center mx-auto mb-4">
            <Sparkles class="w-8 h-8" />
          </div>
          <h3 class="text-[18px] font-bold text-[#1a1a1a] mb-1">
            No Multimedia Files Found
          </h3>
          <p class="text-[13px] text-[#6b7280] max-w-md mx-auto mb-6">
            Upload your first neural scan, audio recording, or paper to initialize hybrid storage & SHA-256 metadata.
          </p>
          <button
            onClick={onOpenUploadModal}
            class="px-6 py-3 rounded-full bg-[#f97316] text-white text-[14px] font-bold shadow-md hover:bg-[#ea580c] transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Upload Multimedia</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="px-6 mb-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[18px] font-bold text-[#1a1a1a] tracking-tight">
            Repository Storage ({files.length})
          </h3>
          <span class="text-[12px] font-semibold text-[#6b7280]">
            Tactile Metadata Cards
          </span>
        </div>

        {/* 2-Column CSS Grid with 16px gap */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file) => {
            const style = CATEGORY_STYLES[file.type] || CATEGORY_STYLES.Document;
            const IconComp = style.icon;

            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file)}
                class="bg-white border border-gray-100/80 rounded-[32px] p-5 card-tactile-hover cursor-pointer relative group flex flex-col justify-between"
              >
                <div>
                  {/* Top: 56px rounded-square icon container with light tint */}
                  <div class="flex items-start justify-between mb-3.5">
                    <div class={`w-[56px] h-[56px] rounded-[22px] ${style.bg} ${style.text} flex items-center justify-center border ${style.border} shadow-sm group-hover:scale-105 transition-transform`}>
                      <IconComp class="w-6 h-6" />
                    </div>

                    <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
                      {formatBytes(file.size)}
                    </span>
                  </div>

                  {/* Center: Title & Description */}
                  <h4 class="text-[15px] font-bold text-[#1a1a1a] truncate mb-1 group-hover:text-[#f97316] transition-colors">
                    {file.name}
                  </h4>
                  <p class="text-[12px] text-[#6b7280] line-clamp-2 mb-3 font-medium leading-relaxed">
                    {file.description || file.resolution || 'Automatic metadata cataloged.'}
                  </p>

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div class="flex flex-wrap gap-1.5 mb-4">
                      {file.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#fff7ed] text-[#f97316] border border-[#f97316]/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Views & File Details link */}
                <div class="pt-3 border-t border-gray-100/60 flex items-center justify-between text-[11px] font-bold text-[#6b7280]">
                  <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1">
                      <Eye class="w-3.5 h-3.5 text-gray-400" />
                      <span>{file.views || 0}</span>
                    </span>
                    <span class="flex items-center gap-1">
                      <Download class="w-3.5 h-3.5 text-gray-400" />
                      <span>{file.downloads || 0}</span>
                    </span>
                  </div>

                  <span class="text-[#f97316] group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
