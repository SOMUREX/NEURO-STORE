import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Clock, User, Terminal, HardDrive } from 'lucide-react';
import { fetchAuditLogs } from '../services/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  return (
    <div class="px-6 pb-28 pt-4">
      <div class="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-[22px] font-extrabold text-[#1a1a1a]">
              Security Audit Logs
            </h2>
            <p class="text-[13px] text-[#6b7280]">
              Immutable audit trail capturing all authentication, file ingestion & deletion events
            </p>
          </div>
          <button
            onClick={loadAudit}
            class="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:text-[#f97316] transition-all shadow-sm"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>

        {/* Audit Log Entries List */}
        {loading ? (
          <div class="py-12 text-center text-gray-500 font-bold">
            <RefreshCw class="w-8 h-8 animate-spin mx-auto text-[#f97316] mb-2" />
            Loading System Audit Stream...
          </div>
        ) : logs.length === 0 ? (
          <div class="bg-white p-8 rounded-[32px] border border-gray-100 text-center text-gray-500">
            No audit events recorded yet.
          </div>
        ) : (
          <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div class="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} class="p-4 sm:p-5 hover:bg-gray-50/80 transition-colors flex items-start justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                        log.action === 'LOGIN' ? 'bg-blue-100 text-blue-700' :
                        log.action === 'UPLOAD' ? 'bg-emerald-100 text-emerald-700' :
                        log.action === 'DELETE' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {log.action}
                      </span>
                      <span class="text-[13px] font-bold text-[#1a1a1a]">
                        {log.user_name || 'System'}
                      </span>
                      <span class="text-[11px] text-gray-400 font-mono">
                        ({log.ip_address || '127.0.0.1'})
                      </span>
                    </div>

                    <p class="text-[12px] text-[#6b7280] font-medium leading-normal">
                      {log.details}
                    </p>
                  </div>

                  <div class="text-right text-[11px] text-gray-400 font-medium whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
