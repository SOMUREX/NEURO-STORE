import React from 'react';
import { User, ShieldCheck, Mail, Key, LogOut, Check } from 'lucide-react';

export default function ProfilePage({ user, onSwitchRole, onLogout }) {
  return (
    <div class="px-6 pb-28 pt-4">
      <div class="max-w-md mx-auto space-y-6">
        {/* Profile Card */}
        <div class="bg-white rounded-[32px] p-6 text-center border border-gray-100 shadow-sm relative">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt="Avatar"
            class="w-24 h-24 rounded-full object-cover border-4 border-[#fff7ed] shadow-md mx-auto mb-3"
          />
          <h2 class="text-[20px] font-extrabold text-[#1a1a1a]">
            {user?.name || "Dr. Someshwar Rao"}
          </h2>
          <p class="text-[13px] text-[#6b7280] font-medium mb-3">
            {user?.email || "admin@neurostore.ai"}
          </p>

          <span class={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
            user?.role === 'Admin' ? 'bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          }`}>
            Role: {user?.role || "Admin"}
          </span>
        </div>

        {/* Role-Based Access Control Switcher */}
        <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-[15px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-[#f97316]" />
            <span>Role-Based Access Control (RBAC) Switcher</span>
          </h3>
          <p class="text-[12px] text-[#6b7280]">
            Switch roles to test user vs administrator permission boundaries in NeuroStore.
          </p>

          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSwitchRole('Admin')}
              class={`p-4 rounded-2xl border text-left transition-all ${
                user?.role === 'Admin'
                  ? 'border-[#f97316] bg-[#fff7ed] text-[#f97316]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-[13px]">Administrator</span>
                {user?.role === 'Admin' && <Check class="w-4 h-4" />}
              </div>
              <p class="text-[10px] text-gray-500">Full upload, delete, audit logs & AI features</p>
            </button>

            <button
              onClick={() => onSwitchRole('User')}
              class={`p-4 rounded-2xl border text-left transition-all ${
                user?.role === 'User'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-[13px]">Regular User</span>
                {user?.role === 'User' && <Check class="w-4 h-4" />}
              </div>
              <p class="text-[10px] text-gray-500">Upload & view personal multimedia repository</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
