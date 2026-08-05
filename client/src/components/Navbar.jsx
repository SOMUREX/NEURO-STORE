import React from 'react';
import { Bell, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function Navbar({ user, onOpenProfile, onOpenAudit }) {
  return (
    <header class="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md pt-10 pb-4 px-6 transition-all border-b border-gray-100/60">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left Side: Profile Greeting */}
        <div class="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            class="relative group focus:outline-none"
            title="User Profile & Role Settings"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt="Avatar"
              class="w-12 h-12 rounded-full object-cover border-2 border-[#f97316]/30 group-hover:border-[#f97316] transition-all shadow-sm"
            />
            <span class={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${user?.role === 'Admin' ? 'bg-[#f97316]' : 'bg-emerald-500'}`} />
          </button>

          <div>
            <p class="text-[13px] text-[#6b7280] font-medium leading-none mb-1">
              Good morning 👋
            </p>
            <div class="flex items-center gap-1.5">
              <h1 class="text-[19px] font-bold text-[#1a1a1a] leading-tight tracking-tight">
                {user?.name || "Dr. Someshwar Rao"}
              </h1>
              <span class={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${user?.role === 'Admin' ? 'bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20' : 'bg-gray-100 text-gray-600'}`}>
                {user?.role || "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Notification Bell with 10px orange dot */}
        <div class="flex items-center gap-2.5">
          {user?.role === 'Admin' && (
            <button
              onClick={onOpenAudit}
              class="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[12px] font-semibold bg-[#fff7ed] text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all border border-[#f97316]/20 shadow-sm"
              title="Audit Logs"
            >
              <ShieldCheck class="w-4 h-4" />
              <span class="hidden sm:inline">Audit</span>
            </button>
          )}

          <button
            class="relative w-[44px] h-[44px] rounded-full bg-[#f9fafb] border border-gray-100 flex items-center justify-center text-[#1a1a1a] hover:bg-white hover:shadow-md transition-all active:scale-95"
            title="Notifications"
          >
            <Bell class="w-5 h-5 text-gray-700" />
            {/* 10px orange dot indicator */}
            <span class="absolute top-2.5 right-2.5 w-[10px] h-[10px] rounded-full bg-[#f97316] border-2 border-white ring-2 ring-[#f97316]/20 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
