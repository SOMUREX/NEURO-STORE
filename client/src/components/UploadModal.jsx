import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, AlertTriangle, ShieldCheck, Tag, Loader2 } from 'lucide-react';
import { uploadFileApi } from '../services/api';

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  onDuplicateDetected,
  user
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMsg('');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setProgress(15);
    setErrorMsg('');

    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => (prev < 85 ? prev + 15 : prev));
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tags', tags);
      formData.append('userId', user?.id || 'usr_admin_01');
      formData.append('userName', user?.name || 'Dr. Someshwar Rao');

      const result = await uploadFileApi(formData);
      clearInterval(interval);
      setProgress(100);

      if (result.duplicateDetected) {
        onDuplicateDetected(result, selectedFile, tags);
        onClose();
      } else {
        setTimeout(() => {
          setIsUploading(false);
          setSelectedFile(null);
          setTags('');
          setProgress(0);
          onUploadSuccess(result.file);
          onClose();
        }, 400);
      }
    } catch (err) {
      clearInterval(interval);
      setIsUploading(false);
      setProgress(0);
      setErrorMsg(err.message || 'Upload failed');
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white w-full max-w-lg rounded-[32px] p-6 sm:p-8 shadow-2xl relative border border-gray-100">
        {/* Header */}
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#fff7ed] text-[#f97316] flex items-center justify-center font-bold">
              <UploadCloud class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-[18px] font-bold text-[#1a1a1a]">
                Multimedia Upload Center
              </h3>
              <p class="text-[12px] text-[#6b7280]">
                Hybrid Storage & SHA-256 Fingerprinting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            class="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div class="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[13px] font-medium flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            class={`border-2 border-dashed rounded-[24px] p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#f97316] bg-[#fff7ed]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-gray-200 hover:border-[#f97316] bg-gray-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              class="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />

            {selectedFile ? (
              <div class="flex items-center justify-center gap-3">
                <File class="w-8 h-8 text-emerald-600" />
                <div class="text-left truncate max-w-[240px]">
                  <p class="text-[14px] font-bold text-[#1a1a1a] truncate">
                    {selectedFile.name}
                  </p>
                  <p class="text-[11px] text-[#6b7280]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Media File'}
                  </p>
                </div>
              </div>
            ) : (
              <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto text-[#f97316] shadow-sm">
                  <UploadCloud class="w-6 h-6" />
                </div>
                <p class="text-[14px] font-bold text-[#1a1a1a]">
                  Drag & Drop or <span class="text-[#f97316]">Browse File</span>
                </p>
                <p class="text-[11px] text-[#6b7280]">
                  Supports Images, Videos, Audio & PDF Documents (Up to 100MB)
                </p>
              </div>
            )}
          </div>

          {/* Tags Input */}
          <div>
            <label class="block text-[12px] font-bold text-[#1a1a1a] mb-1.5 flex items-center gap-1">
              <Tag class="w-3.5 h-3.5 text-[#f97316]" />
              <span>Metadata Tags (Optional, comma-separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. MRI Scan, Cortex, Telemetry"
              class="w-full bg-[#f3f4f6] text-[13px] font-medium px-4 py-3 rounded-xl border border-transparent focus:border-[#f97316] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div class="space-y-1.5 pt-2">
              <div class="flex justify-between text-[11px] font-bold">
                <span class="text-[#6b7280]">Hashing & Storing File...</span>
                <span class="text-[#f97316]">{progress}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-[#f97316] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div class="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              class="w-1/2 py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              class="w-1/2 py-3.5 rounded-2xl bg-[#f97316] text-white font-bold text-[14px] hover:bg-[#ea580c] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 class="w-4 h-4 animate-spin" />
                  <span>Ingesting...</span>
                </>
              ) : (
                <span>Upload Now</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
