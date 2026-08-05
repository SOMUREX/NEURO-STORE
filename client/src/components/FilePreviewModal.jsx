import React, { useState } from 'react';
import { X, Download, Trash2, Tag, HardDrive, Cpu, Calendar, User, Eye, FileText, Play, Shield, Sparkles } from 'lucide-react';
import { formatBytes } from './MediaGrid';
import { deleteFileApi } from '../services/api';

export default function FilePreviewModal({
  file,
  onClose,
  onFileDeleted,
  user
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!file) return null;

  const fileUrl = file.file_path ? `/${file.file_path}` : '';

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${file.name}" and its generated metadata?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFileApi(file.id, user?.id || 'usr_admin_01', user?.name || 'Dr. Someshwar Rao');
      onFileDeleted(file.id);
      onClose();
    } catch (err) {
      alert('Failed to delete file: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div class="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-gray-100">
        {/* Modal Top Bar */}
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fafafa]">
          <div class="flex items-center gap-3 truncate">
            <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20">
              {file.type}
            </span>
            <h3 class="text-[16px] font-bold text-[#1a1a1a] truncate">
              {file.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            class="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-all shrink-0"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div class="p-6 overflow-y-auto space-y-6">
          {/* Multimedia Player / Viewer Container */}
          <div class="bg-gray-950 rounded-[24px] overflow-hidden border border-gray-800 flex items-center justify-center min-h-[220px] max-h-[360px] relative shadow-inner">
            {file.type === 'Image' ? (
              <img
                src={fileUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                alt={file.name}
                class="max-h-[340px] w-auto object-contain"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
                }}
              />
            ) : file.type === 'Video' ? (
              <video
                controls
                src={fileUrl}
                class="w-full max-h-[340px]"
                poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"
              >
                Your browser does not support HTML5 video playback.
              </video>
            ) : file.type === 'Audio' ? (
              <div class="p-8 text-center space-y-4 w-full max-w-md">
                <div class="w-16 h-16 rounded-full bg-[#f97316]/20 text-[#f97316] flex items-center justify-center mx-auto ring-4 ring-[#f97316]/10 animate-pulse">
                  <Play class="w-8 h-8 fill-current ml-1" />
                </div>
                <div>
                  <p class="text-white text-[15px] font-bold truncate">{file.name}</p>
                  <p class="text-gray-400 text-[12px]">Audio Telemetry Waveform</p>
                </div>
                <audio controls src={fileUrl} class="w-full" />
              </div>
            ) : (
              <div class="p-8 text-center space-y-3">
                <FileText class="w-14 h-14 text-emerald-400 mx-auto" />
                <p class="text-white text-[15px] font-bold">{file.name}</p>
                <p class="text-gray-400 text-[12px]">PDF / Text Document Asset</p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-[12px] font-bold hover:bg-emerald-500 transition-all"
                >
                  <span>Open Full Document</span>
                </a>
              </div>
            )}
          </div>

          {/* Metadata Inspector Drawer */}
          <div class="bg-[#fafafa] rounded-[24px] p-5 border border-gray-200/80 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <h4 class="text-[14px] font-bold text-[#1a1a1a] flex items-center gap-2">
                <HardDrive class="w-4 h-4 text-[#f97316]" />
                <span>Generated Metadata & Hybrid Attributes</span>
              </h4>
              <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                DB ID: {file.id}
              </span>
            </div>

            {/* Metadata Fields Grid */}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
              <div class="bg-white p-3 rounded-2xl border border-gray-100">
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">File Size</p>
                <p class="font-bold text-[#1a1a1a]">{formatBytes(file.size)}</p>
              </div>

              <div class="bg-white p-3 rounded-2xl border border-gray-100">
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Resolution / Dim</p>
                <p class="font-bold text-[#1a1a1a]">{file.resolution || 'N/A'}</p>
              </div>

              <div class="bg-white p-3 rounded-2xl border border-gray-100">
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Duration</p>
                <p class="font-bold text-[#1a1a1a]">{file.duration || 'N/A'}</p>
              </div>

              <div class="bg-white p-3 rounded-2xl border border-gray-100">
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Upload Date</p>
                <p class="font-bold text-[#1a1a1a]">{new Date(file.upload_date).toLocaleDateString()}</p>
              </div>

              <div class="bg-white p-3 rounded-2xl border border-gray-100">
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Compression</p>
                <p class="font-bold text-emerald-600">{file.compression_ratio || 'Original'}</p>
              </div>

              <div class="bg-white p-3 rounded-2xl border border-gray-100">
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Uploader</p>
                <p class="font-bold text-[#1a1a1a] truncate">{file.uploader_name || 'Dr. Someshwar Rao'}</p>
              </div>
            </div>

            {/* SHA-256 Hash */}
            <div class="bg-white p-3 rounded-2xl border border-gray-100">
              <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-1">SHA-256 Hash Fingerprint</p>
              <p class="font-mono text-[10px] text-gray-700 break-all select-all font-semibold bg-gray-50 p-2 rounded-xl">
                {file.sha256 || 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'}
              </p>
            </div>

            {/* Tags */}
            {file.tags && file.tags.length > 0 && (
              <div>
                <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-1.5 flex items-center gap-1">
                  <Tag class="w-3 h-3 text-[#f97316]" />
                  <span>Metadata Tags</span>
                </p>
                <div class="flex flex-wrap gap-1.5">
                  {file.tags.map((tag, idx) => (
                    <span key={idx} class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div class="px-6 py-4 border-t border-gray-100 bg-[#fafafa] flex items-center justify-between gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            class="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[13px] transition-all flex items-center gap-1.5"
          >
            <Trash2 class="w-4 h-4" />
            <span>Delete File</span>
          </button>

          <a
            href={fileUrl}
            download={file.name}
            class="px-6 py-2.5 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-[13px] transition-all shadow-md flex items-center gap-2"
          >
            <Download class="w-4 h-4" />
            <span>Download Asset</span>
          </a>
        </div>
      </div>
    </div>
  );
}
