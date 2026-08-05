import React from 'react';
import { ShieldAlert, FileText, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { uploadFileApi } from '../services/api';

export default function DuplicateWarningModal({
  duplicateData,
  pendingFile,
  pendingTags,
  onClose,
  onForceSuccess,
  user
}) {
  if (!duplicateData) return null;

  const { existingFile, sha256 } = duplicateData;

  const handleForceUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', pendingFile);
      formData.append('tags', pendingTags || '');
      formData.append('forceUpload', 'true');
      formData.append('userId', user?.id || 'usr_admin_01');
      formData.append('userName', user?.name || 'Dr. Someshwar Rao');

      const result = await uploadFileApi(formData);
      onForceSuccess(result.file);
      onClose();
    } catch (err) {
      alert('Force upload failed: ' + err.message);
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div class="bg-white w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl relative border border-amber-200">
        <button
          onClick={onClose}
          class="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
        >
          <X class="w-4 h-4" />
        </button>

        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200 shadow-sm">
          <ShieldAlert class="w-7 h-7" />
        </div>

        <h3 class="text-[19px] font-bold text-[#1a1a1a] mb-1">
          SHA-256 Duplicate Detected!
        </h3>
        <p class="text-[12px] text-[#6b7280] mb-4">
          NeuroStore hash fingerprinting identified an identical binary payload already stored in the hybrid storage layer.
        </p>

        {/* SHA-256 Display Box */}
        <div class="bg-gray-50 p-3 rounded-2xl border border-gray-200 mb-4 font-mono text-[10px] text-gray-700 break-all leading-tight">
          <span class="font-bold text-[#f97316]">SHA-256 Hash:</span> {sha256}
        </div>

        {/* Comparison Box */}
        <div class="bg-[#fff7ed] p-4 rounded-2xl border border-[#f97316]/20 mb-6 space-y-2">
          <p class="text-[11px] font-bold text-[#f97316] uppercase tracking-wider">
            Existing File in Repository:
          </p>
          <div class="flex items-center justify-between text-[13px] font-bold text-[#1a1a1a]">
            <span class="truncate">{existingFile?.name}</span>
            <span class="text-[11px] text-[#6b7280]">{(existingFile?.size / 1024).toFixed(1)} KB</span>
          </div>
          <p class="text-[11px] text-[#6b7280]">
            Uploaded by: <span class="font-semibold text-gray-800">{existingFile?.uploader}</span> on {new Date(existingFile?.upload_date).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div class="flex items-center gap-3">
          <button
            onClick={onClose}
            class="w-1/2 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] transition-all"
          >
            Skip Upload
          </button>
          <button
            onClick={handleForceUpload}
            class="w-1/2 py-3 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-[13px] transition-all shadow-md"
          >
            Force Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}
