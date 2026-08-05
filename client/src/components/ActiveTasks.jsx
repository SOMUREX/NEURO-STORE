import React from 'react';
import { Cpu, HardDrive, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: 'job_01',
    title: 'SHA-256 Vector Indexing',
    subtitle: 'Brain_cortex_3D_scan.png',
    status: 'Processing',
    progress: 84,
    speed: '4.2 MB/s',
    iconBg: 'bg-[#fff7ed] text-[#f97316]',
    icon: HardDrive
  },
  {
    id: 'job_02',
    title: 'Perceptual Smart Compression',
    subtitle: 'Synapse_signal_propagation.mp4',
    status: 'Optimizing',
    progress: 62,
    speed: '12.8 MB/s',
    iconBg: 'bg-amber-50 text-amber-600',
    icon: Cpu
  },
  {
    id: 'job_03',
    title: 'Face Embedding Extraction',
    subtitle: 'EEG_alpha_wave_session.mp3',
    status: 'Complete',
    progress: 100,
    speed: 'Done',
    iconBg: 'bg-emerald-50 text-emerald-600',
    icon: CheckCircle2
  }
];

export default function ActiveTasks({ onViewAll }) {
  return (
    <div class="mb-6 px-6">
      <div class="max-w-4xl mx-auto">
        {/* Section Header */}
        <div class="flex items-center justify-between mb-3.5">
          <h3 class="text-[18px] font-bold text-[#1a1a1a] tracking-tight">
            Active Tasks & Ingestions
          </h3>
          <button
            onClick={onViewAll}
            class="text-[14px] font-bold text-[#f97316] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Snap Scroll Container */}
        <div class="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none">
          {MOCK_JOBS.map((job) => {
            const IconComp = job.icon;
            return (
              <div
                key={job.id}
                class="min-w-[320px] max-w-[320px] bg-white border border-[#ffedd5] rounded-[24px] p-6 snap-center shadow-active-job flex flex-col justify-between transition-all hover:border-[#f97316]/40"
              >
                <div>
                  <div class="flex items-center justify-between mb-3">
                    {/* 40px rounded box for icon */}
                    <div class={`w-[40px] h-[40px] rounded-2xl flex items-center justify-center font-bold ${job.iconBg}`}>
                      <IconComp class="w-5 h-5" />
                    </div>
                    <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#fafafa] border border-gray-100 text-[#6b7280]">
                      {job.speed}
                    </span>
                  </div>

                  <h4 class="text-[15px] font-bold text-[#1a1a1a] leading-tight mb-1 truncate">
                    {job.title}
                  </h4>
                  <p class="text-[12px] text-[#6b7280] truncate mb-4 font-medium">
                    {job.subtitle}
                  </p>
                </div>

                <div>
                  {/* Progress Bar (6px height) & percentage indicator */}
                  <div class="flex items-center justify-between text-[11px] font-extrabold text-[#1a1a1a] mb-1.5">
                    <span class="text-[#6b7280]">{job.status}</span>
                    <span class="text-[#f97316]">{job.progress}%</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-[6px] overflow-hidden mb-4">
                    <div
                      class="bg-[#f97316] h-[6px] rounded-full transition-all duration-500"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>

                  {/* Track Service Button (14px, Bold White on Orange) */}
                  <button
                    onClick={onViewAll}
                    class="w-full py-2.5 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white text-[14px] font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw class={`w-4 h-4 ${job.progress < 100 ? 'animate-spin' : ''}`} />
                    <span>Track Ingestion</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
