import React, { useState } from 'react';
import { Cpu, Zap, ScanFace, Film, Sparkles, ArrowRight, CheckCircle2, Sliders, Search, Loader2 } from 'lucide-react';
import { runAICompress, runAIFaceLink, runAIVideoSummary, runAIVectorSearch } from '../services/api';

export default function AIToolsPage({ files = [] }) {
  const [activeTab, setActiveTab] = useState('compress');
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.id || 'fl_img_01');
  const [targetQuality, setTargetQuality] = useState(80);
  const [searchQuery, setSearchQuery] = useState('Neural cortical activity patterns');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunTool = async () => {
    setLoading(true);
    setResult(null);

    try {
      if (activeTab === 'compress') {
        const res = await runAICompress(selectedFileId, targetQuality);
        setResult(res);
      } else if (activeTab === 'facelink') {
        const res = await runAIFaceLink(selectedFileId);
        setResult(res);
      } else if (activeTab === 'summary') {
        const res = await runAIVideoSummary(selectedFileId);
        setResult(res);
      } else if (activeTab === 'vector') {
        const res = await runAIVectorSearch(searchQuery);
        setResult(res);
      }
    } catch (err) {
      alert('AI tool execution error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="px-6 pb-28 pt-4">
      <div class="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 class="text-[22px] font-extrabold text-[#1a1a1a] flex items-center gap-2">
            <Sparkles class="w-6 h-6 text-[#f97316]" />
            <span>AI Processing Layer (Prototype UI)</span>
          </h2>
          <p class="text-[13px] text-[#6b7280]">
            Interactive prototypes for perceptual smart compression, face embedding linking, video summarizer & vector search
          </p>
        </div>

        {/* AI Tool Selector Tabs */}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 p-1.5 rounded-[24px]">
          {[
            { id: 'compress', label: 'Smart Compress', icon: Zap },
            { id: 'facelink', label: 'Face Linking', icon: ScanFace },
            { id: 'summary', label: 'Video Summary', icon: Film },
            { id: 'vector', label: 'Vector Search', icon: Search }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult(null);
                }}
                class={`flex items-center justify-center gap-2 py-3 px-3 rounded-[20px] text-[12px] font-bold transition-all ${
                  isActive
                    ? 'bg-white text-[#f97316] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComp class="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Tool Control Panel */}
        <div class="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          {/* 1. Smart Compression */}
          {activeTab === 'compress' && (
            <div class="space-y-4">
              <h3 class="text-[16px] font-bold text-[#1a1a1a]">
                Perceptual Waveform & Visual Compression
              </h3>
              <p class="text-[12px] text-[#6b7280]">
                Optimizes multimedia file footprints while preserving perceptual quality indices.
              </p>

              <div>
                <label class="block text-[12px] font-bold text-[#1a1a1a] mb-1">
                  Select Target File:
                </label>
                <select
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  class="w-full bg-[#f3f4f6] text-[13px] font-medium p-3 rounded-2xl border border-transparent focus:border-[#f97316]"
                >
                  {files.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <div class="flex justify-between text-[12px] font-bold mb-1">
                  <span>Target Quality Ratio:</span>
                  <span class="text-[#f97316]">{targetQuality}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={targetQuality}
                  onChange={(e) => setTargetQuality(e.target.value)}
                  class="w-full accent-[#f97316]"
                />
              </div>
            </div>
          )}

          {/* 2. Face Linking */}
          {activeTab === 'facelink' && (
            <div class="space-y-4">
              <h3 class="text-[16px] font-bold text-[#1a1a1a]">
                Facial Feature Vector Linking
              </h3>
              <p class="text-[12px] text-[#6b7280]">
                Detects facial embeddings in images/video keyframes and links them to subject databases.
              </p>

              <div>
                <label class="block text-[12px] font-bold text-[#1a1a1a] mb-1">
                  Select Target Asset:
                </label>
                <select
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  class="w-full bg-[#f3f4f6] text-[13px] font-medium p-3 rounded-2xl border border-transparent"
                >
                  {files.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 3. Video Summarization */}
          {activeTab === 'summary' && (
            <div class="space-y-4">
              <h3 class="text-[16px] font-bold text-[#1a1a1a]">
                Automated Keyframe Video Summarizer
              </h3>
              <p class="text-[12px] text-[#6b7280]">
                Extracts key action spikes and generates condensed 30-second video digest.
              </p>

              <div>
                <label class="block text-[12px] font-bold text-[#1a1a1a] mb-1">
                  Select Video Recording:
                </label>
                <select
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  class="w-full bg-[#f3f4f6] text-[13px] font-medium p-3 rounded-2xl border border-transparent"
                >
                  {files.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 4. Vector Search */}
          {activeTab === 'vector' && (
            <div class="space-y-4">
              <h3 class="text-[16px] font-bold text-[#1a1a1a]">
                Content-Based Vector Similarity Search
              </h3>
              <p class="text-[12px] text-[#6b7280]">
                Computes high-dimensional cosine similarity across all stored asset embeddings.
              </p>

              <div>
                <label class="block text-[12px] font-bold text-[#1a1a1a] mb-1">
                  Similarity Query Prompt:
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Axonal calcium propagation spectrum"
                  class="w-full bg-[#f3f4f6] text-[13px] font-medium p-3.5 rounded-2xl border border-transparent focus:border-[#f97316] focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleRunTool}
            disabled={loading}
            class="w-full py-3.5 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-[14px] transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 class="w-5 h-5 animate-spin" />
                <span>Running AI Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles class="w-5 h-5" />
                <span>Execute AI Pipeline</span>
              </>
            )}
          </button>

          {/* AI Result Box */}
          {result && (
            <div class="mt-6 bg-[#fff7ed] p-5 rounded-[24px] border border-[#f97316]/30 space-y-3 animate-fade-in">
              <div class="flex items-center gap-2 text-[#f97316] font-bold text-[14px]">
                <CheckCircle2 class="w-5 h-5" />
                <span>AI Pipeline Execution Complete</span>
              </div>

              <pre class="bg-white p-4 rounded-2xl border border-gray-200 text-[11px] font-mono text-gray-800 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
