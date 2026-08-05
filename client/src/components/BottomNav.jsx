import React from 'react';
import { Home, UploadCloud, Search, BarChart3, ShieldCheck, Cpu, Radio } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'upload', label: 'Upload', icon: UploadCloud },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'iot', label: 'IoT ML', icon: Radio },
  { id: 'ai', label: 'AI Tools', icon: Cpu },
  { id: 'audit', label: 'Audit', icon: ShieldCheck }
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <footer class="fixed bottom-0 left-0 right-0 z-40 h-[80px] bg-white border-t border-gray-100 shadow-lg px-3 flex items-center justify-center">
      <div class="w-full max-w-2xl flex items-center justify-between">
        {NAV_ITEMS.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              class={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#f97316] font-bold scale-105'
                  : 'text-gray-400 hover:text-gray-600 font-medium'
              }`}
            >
              <div class={`p-1 rounded-xl mb-0.5 ${isActive ? 'bg-[#fff7ed]' : ''}`}>
                <IconComp class={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span class="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
