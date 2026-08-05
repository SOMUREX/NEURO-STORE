import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Zap, AlertTriangle, ShieldCheck, RefreshCw, Radio, Gauge, Play, ZapOff, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchIoTDevices, fetchIoTTelemetry, runIoTInference, simulateIoTSpike } from '../services/api';

export default function IoTMlPage() {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('DEV_EEG_9042');
  const [selectedModel, setSelectedModel] = useState('anomaly');

  const [telemetry, setTelemetry] = useState(null);
  const [inferenceResult, setInferenceResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [inferring, setInferring] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const devRes = await fetchIoTDevices();
      setDevices(devRes.devices || []);

      const telRes = await fetchIoTTelemetry(selectedDeviceId);
      setTelemetry(telRes);
    } catch (err) {
      console.error('IoT load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDeviceId]);

  const handleRunInference = async () => {
    setInferring(true);
    try {
      const res = await runIoTInference(selectedDeviceId, selectedModel);
      setInferenceResult(res.result);
    } catch (err) {
      alert('Inference error: ' + err.message);
    } finally {
      setInferring(false);
    }
  };

  const handleSimulateSpike = async () => {
    setSimulating(true);
    try {
      const res = await simulateIoTSpike(selectedDeviceId);
      setTelemetry(prev => ({
        ...prev,
        dataPoints: res.dataPoints
      }));
      // Auto run anomaly inference
      const inferRes = await runIoTInference(selectedDeviceId, 'anomaly');
      setInferenceResult(inferRes.result);
    } catch (err) {
      alert('Simulation error: ' + err.message);
    } fontally: {
      setSimulating(false);
    }
  };

  const activeDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  return (
    <div class="px-6 pb-28 pt-4">
      <div class="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 class="text-[22px] font-extrabold text-[#1a1a1a]">
                IoT & Edge ML Engine
              </h2>
            </div>
            <p class="text-[13px] text-[#6b7280]">
              Real-time sensory telemetry ingestion, TinyML signal classification & anomaly detection
            </p>
          </div>

          <button
            onClick={loadData}
            class="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:text-[#f97316] transition-all shadow-sm"
            title="Refresh IoT Telemetry Stream"
          >
            <RefreshCw class={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Device Selection Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {devices.map((dev) => {
            const isSelected = dev.id === selectedDeviceId;
            return (
              <button
                key={dev.id}
                onClick={() => {
                  setSelectedDeviceId(dev.id);
                  setInferenceResult(null);
                }}
                class={`p-4 rounded-[24px] border text-left transition-all ${
                  isSelected
                    ? 'bg-white border-[#f97316] shadow-active-job ring-2 ring-[#f97316]/20'
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <Radio class={`w-4 h-4 ${isSelected ? 'text-[#f97316]' : 'text-gray-400'}`} />
                    <span class="text-[11px] font-mono font-bold text-gray-500">{dev.id}</span>
                  </div>
                  <span class={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    dev.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {dev.status}
                  </span>
                </div>

                <h4 class="text-[13px] font-bold text-[#1a1a1a] truncate mb-0.5">
                  {dev.name}
                </h4>
                <p class="text-[11px] text-[#6b7280] truncate mb-2">
                  {dev.type}
                </p>

                <div class="flex items-center justify-between text-[10px] font-extrabold text-[#f97316] pt-2 border-t border-gray-100">
                  <span>{dev.frequency}</span>
                  <span>Battery {dev.battery}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Signal Waveform Graph Visualizer */}
        <div class="bg-[#090d16] text-white p-6 rounded-[32px] border border-gray-800 shadow-xl space-y-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Activity class="w-5 h-5 text-[#f97316] animate-pulse" />
              <span class="text-[14px] font-bold tracking-tight">
                Live Waveform Sensor Data Stream ({activeDevice?.name || selectedDeviceId})
              </span>
            </div>
            <span class="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              Sampling @ 250 Hz
            </span>
          </div>

          {/* SVG Waveform Canvas */}
          <div class="h-36 w-full flex items-end gap-1.5 pt-4 pb-2 border-b border-gray-800 relative">
            {telemetry?.dataPoints?.map((val, idx) => {
              const heightPercent = Math.min(Math.max((val / 100) * 100, 10), 95);
              const isSpike = val > 75;
              return (
                <div key={idx} class="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div
                    class={`w-full rounded-t-md transition-all duration-300 ${
                      isSpike ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : 'bg-[#f97316] group-hover:bg-amber-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2 text-[12px] font-mono text-gray-400">
              <span>Current Value:</span>
              <span class="text-white font-bold">{telemetry?.currentValue || '54.2'} {telemetry?.units || 'uV'}</span>
            </div>

            <button
              onClick={handleSimulateSpike}
              disabled={simulating}
              class="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[12px] font-bold transition-all shadow-md inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {simulating ? (
                <Loader2 class="w-3.5 h-3.5 animate-spin" />
              ) : (
                <AlertTriangle class="w-3.5 h-3.5" />
              )}
              <span>Inject Anomaly Spike</span>
            </button>
          </div>
        </div>

        {/* Edge ML Inference Sandbox */}
        <div class="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 class="text-[16px] font-bold text-[#1a1a1a] flex items-center gap-2">
                <Cpu class="w-5 h-5 text-[#f97316]" />
                <span>TinyML Edge Model Inference</span>
              </h3>
              <p class="text-[12px] text-[#6b7280]">
                Select Edge ML model specification to evaluate sensory signal frame
              </p>
            </div>

            <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20">
              TFLite Micro Quantized
            </span>
          </div>

          {/* Model Selector Pills */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'anomaly', label: 'Isolation Forest Anomaly', sub: 'Spike & Drift Detector' },
              { id: 'classify', label: 'TinyML Signal Classifier', sub: 'ResNet-8 Feature Mapping' },
              { id: 'rul', label: 'Predictive Maintenance', sub: 'LSTM Useful Life Estimator' }
            ].map((m) => {
              const isSel = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModel(m.id);
                    setInferenceResult(null);
                  }}
                  class={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSel
                      ? 'bg-[#fff7ed] border-[#f97316] text-[#f97316] font-bold'
                      : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p class="text-[13px] leading-tight mb-0.5">{m.label}</p>
                  <p class="text-[10px] text-gray-500 font-medium">{m.sub}</p>
                </button>
              );
            })}
          </div>

          {/* Run Inference Button */}
          <button
            onClick={handleRunInference}
            disabled={inferring}
            class="w-full py-3.5 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-[14px] transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {inferring ? (
              <>
                <Loader2 class="w-5 h-5 animate-spin" />
                <span>Running Edge Inference on Sensor...</span>
              </>
            ) : (
              <>
                <Zap class="w-5 h-5" />
                <span>Execute Edge ML Inference ({activeDevice?.id})</span>
              </>
            )}
          </button>

          {/* Inference Output Card */}
          {inferenceResult && (
            <div class="bg-[#fff7ed] p-5 rounded-[24px] border border-[#f97316]/30 space-y-4 animate-fade-in">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-[#f97316] font-bold text-[14px]">
                  <CheckCircle2 class="w-5 h-5" />
                  <span>Inference Result Output</span>
                </div>
                <span class="text-[11px] font-mono font-bold text-gray-600 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  Latency: {inferenceResult.latency}
                </span>
              </div>

              {/* Metrics Grid */}
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
                <div class="bg-white p-3 rounded-2xl border border-gray-100">
                  <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Model Name</p>
                  <p class="font-bold text-[#1a1a1a] truncate">{inferenceResult.modelName}</p>
                </div>

                <div class="bg-white p-3 rounded-2xl border border-gray-100">
                  <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Footprint</p>
                  <p class="font-bold text-[#1a1a1a]">{inferenceResult.modelSize}</p>
                </div>

                <div class="bg-white p-3 rounded-2xl border border-gray-100">
                  <p class="text-gray-400 text-[10px] uppercase font-extrabold mb-0.5">Primary Output</p>
                  <p class={`font-bold ${inferenceResult.anomalyScore > 0.6 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {inferenceResult.status || inferenceResult.topClass || inferenceResult.estimatedRUL}
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div class="bg-white p-3.5 rounded-2xl border border-gray-100 text-[12px]">
                <p class="text-[#f97316] font-bold mb-0.5">ML System Recommendation:</p>
                <p class="text-gray-700 font-medium">{inferenceResult.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
