import React, { useState, useEffect } from 'react';
import { BarChart3, HardDrive, FileText, Image, Video, Music, Copy, RefreshCw, Eye, Download, Shield } from 'lucide-react';
import { fetchAnalytics } from '../services/api';
import { formatBytes } from '../components/MediaGrid';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetchAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div class="px-6 py-12 text-center text-gray-500">
        <RefreshCw class="w-8 h-8 animate-spin mx-auto text-[#f97316] mb-2" />
        <p class="text-[14px] font-bold">Calculating Hybrid Storage Metrics...</p>
      </div>
    );
  }

  const { totalFiles, totalStorage, countsByType, storageByType, duplicatesCount, totalViews, totalDownloads, recentUploads } = data || {};

  return (
    <div class="px-6 pb-28 pt-4">
      <div class="max-w-4xl mx-auto space-y-6">
        {/* Page Title Header */}
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-[22px] font-extrabold text-[#1a1a1a]">
              Analytics Dashboard
            </h2>
            <p class="text-[13px] text-[#6b7280]">
              Real-time hybrid storage distribution & telemetry statistics
            </p>
          </div>
          <button
            onClick={loadMetrics}
            class="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:text-[#f97316] transition-all shadow-sm"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>

        {/* Top 4 KPI Cards */}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
            <div class="w-10 h-10 rounded-2xl bg-[#fff7ed] text-[#f97316] flex items-center justify-center mb-3 font-bold">
              <HardDrive class="w-5 h-5" />
            </div>
            <p class="text-gray-400 text-[11px] font-extrabold uppercase">Storage Used</p>
            <h3 class="text-[20px] font-extrabold text-[#1a1a1a]">
              {formatBytes(totalStorage)}
            </h3>
          </div>

          <div class="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold">
              <FileText class="w-5 h-5" />
            </div>
            <p class="text-gray-400 text-[11px] font-extrabold uppercase">Total Files</p>
            <h3 class="text-[20px] font-extrabold text-[#1a1a1a]">
              {totalFiles || 0}
            </h3>
          </div>

          <div class="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 font-bold">
              <Copy class="w-5 h-5" />
            </div>
            <p class="text-gray-400 text-[11px] font-extrabold uppercase">Duplicates</p>
            <h3 class="text-[20px] font-extrabold text-amber-600">
              {duplicatesCount || 0}
            </h3>
          </div>

          <div class="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 font-bold">
              <Eye class="w-5 h-5" />
            </div>
            <p class="text-gray-400 text-[11px] font-extrabold uppercase">Total Views</p>
            <h3 class="text-[20px] font-extrabold text-[#1a1a1a]">
              {totalViews || 0}
            </h3>
          </div>
        </div>

        {/* Media Type Breakdown */}
        <div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-[16px] font-bold text-[#1a1a1a]">
            File Type Storage Distribution
          </h3>

          <div class="space-y-3">
            {[
              { type: 'Image', color: 'bg-amber-500', icon: Image },
              { type: 'Video', color: 'bg-yellow-500', icon: Video },
              { type: 'Audio', color: 'bg-blue-500', icon: Music },
              { type: 'Document', color: 'bg-emerald-500', icon: FileText }
            ].map((cat) => {
              const count = countsByType[cat.type] || 0;
              const storage = storageByType[cat.type] || 0;
              const percent = totalStorage > 0 ? Math.round((storage / totalStorage) * 100) : 0;
              const IconComp = cat.icon;

              return (
                <div key={cat.type} class="space-y-1.5">
                  <div class="flex items-center justify-between text-[13px] font-bold">
                    <div class="flex items-center gap-2">
                      <IconComp class="w-4 h-4 text-gray-500" />
                      <span>{cat.type}s ({count})</span>
                    </div>
                    <span class="text-gray-600">{formatBytes(storage)} ({percent}%)</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      class={`h-2.5 rounded-full ${cat.color} transition-all duration-700`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
