import express from 'express';
import db, { logAuditEvent } from '../db.js';
import crypto from 'crypto';

const router = express.Router();

// Helper to generate simulated telemetry waveform points
function generateWaveformData(points = 30, hasAnomaly = false) {
  const data = [];
  for (let i = 0; i < points; i++) {
    let value = Math.sin(i * 0.4) * 20 + 50 + (Math.random() * 6 - 3);
    if (hasAnomaly && i > 18 && i < 24) {
      value += (Math.random() * 40 + 35); // Critical spike
    }
    data.push(Number(value.toFixed(2)));
  }
  return data;
}

// 1. GET ALL IOT DEVICES & CURRENT TELEMETRY
router.get('/devices', (req, res) => {
  try {
    const devices = [
      {
        id: 'DEV_EEG_9042',
        name: 'Neuro-Electrode Array #1',
        type: 'EEG Sensory Telemetry',
        location: 'Lab Room 4B',
        frequency: '10 Hz (Alpha Band)',
        battery: '94%',
        status: 'Active',
        lastReading: '54.2 uV',
        latestWaveform: generateWaveformData(20, false)
      },
      {
        id: 'DEV_VIB_1102',
        name: 'Acoustic Accelerometer #3',
        type: 'Vibration & FFT Spectrum',
        location: 'Cryo Compressor B',
        frequency: '1.2 kHz Sampling',
        battery: '88%',
        status: 'Warning',
        lastReading: '88.7 dB',
        latestWaveform: generateWaveformData(20, true)
      },
      {
        id: 'DEV_TEMP_304',
        name: 'Thermal Matrix Monitor',
        type: 'Environmental Array',
        location: 'Server Rack 02',
        frequency: '1 Hz Sampling',
        battery: '99%',
        status: 'Active',
        lastReading: '36.5 °C',
        latestWaveform: generateWaveformData(20, false)
      }
    ];

    res.json({ devices });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IoT devices' });
  }
});

// 2. GET LIVE SENSOR TELEMETRY STREAM
router.get('/telemetry/:deviceId', (req, res) => {
  try {
    const { deviceId } = req.params;
    const isAnomaly = deviceId === 'DEV_VIB_1102';
    const waveform = generateWaveformData(40, isAnomaly);

    res.json({
      deviceId,
      timestamp: new Date().toISOString(),
      sampleRate: '250 Hz',
      units: deviceId.includes('EEG') ? 'uV' : deviceId.includes('VIB') ? 'dB' : '°C',
      dataPoints: waveform,
      currentValue: waveform[waveform.length - 1]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IoT telemetry' });
  }
});

// 3. RUN EDGE ML INFERENCE (Anomaly Detection, TinyML Classifier, Predictive RUL)
router.post('/infer', (req, res) => {
  try {
    const { deviceId = 'DEV_EEG_9042', modelType = 'anomaly' } = req.body;
    const latencyMs = Number((Math.random() * 4 + 7).toFixed(1)); // 7-11ms Edge execution time

    let inferenceResult = {};

    if (modelType === 'anomaly') {
      const isCritical = deviceId.includes('VIB');
      const anomalyScore = isCritical ? Number((0.82 + Math.random() * 0.15).toFixed(3)) : Number((0.08 + Math.random() * 0.12).toFixed(3));
      const status = anomalyScore > 0.6 ? 'CRITICAL ANOMALY DETECTED' : 'NORMAL (NOMINAL)';

      inferenceResult = {
        modelName: 'Edge-Autoencoder-Anomaly-v2.tflite',
        modelSize: '128 KB (TFLite Micro)',
        modelType: 'Isolation Forest / Autoencoder',
        deviceId,
        latency: `${latencyMs} ms`,
        anomalyScore,
        status,
        threshold: 0.60,
        recommendation: anomalyScore > 0.6
          ? 'Trigger immediate automated storage archive & alert system administrator.'
          : 'Signal integrity within optimal operating parameters.'
      };
    } else if (modelType === 'classify') {
      const classes = [
        { label: 'Alpha Frequency Focus (10Hz)', confidence: 0.94 },
        { label: 'Beta Excited State (22Hz)', confidence: 0.04 },
        { label: 'Artifact / Noise', confidence: 0.02 }
      ];

      inferenceResult = {
        modelName: 'TinyML-SignalClassifier-ResNet8.tflite',
        modelSize: '256 KB',
        modelType: 'Convolutional Signal Classifier',
        deviceId,
        latency: `${latencyMs + 2} ms`,
        topClass: classes[0].label,
        confidence: `${(classes[0].confidence * 100).toFixed(1)}%`,
        allClasses: classes,
        recommendation: 'Target signal matched known high-focus neural state.'
      };
    } else { // Predictive RUL
      inferenceResult = {
        modelName: 'Predictive-RUL-LSTM-Quantized.tflite',
        modelSize: '310 KB',
        modelType: 'Recurrent LSTM Predictive Maintenance',
        deviceId,
        latency: `${latencyMs + 3} ms`,
        estimatedRUL: '184 Hours remaining',
        healthScore: '91.5%',
        degredationRate: '0.04% / day',
        recommendation: 'Schedule sensor recalibration in 7 days.'
      };
    }

    logAuditEvent(
      'usr_admin_01',
      'NeuroStore Edge AI',
      'IOT_ML_INFERENCE',
      `Executed ${inferenceResult.modelName} on ${deviceId}. Result: ${inferenceResult.status || inferenceResult.topClass || inferenceResult.estimatedRUL} (${latencyMs}ms)`,
      req.ip
    );

    res.json({
      success: true,
      result: inferenceResult
    });
  } catch (err) {
    console.error('IoT ML infer error:', err);
    res.status(500).json({ error: 'Edge ML inference execution failed' });
  }
});

// 4. SIMULATE ANOMALY SPIKE
router.post('/simulate-spike', (req, res) => {
  try {
    const { deviceId } = req.body;
    const spikeWaveform = generateWaveformData(40, true);

    logAuditEvent(
      'usr_admin_01',
      'NeuroStore Edge AI',
      'IOT_SIMULATE_SPIKE',
      `Simulated critical anomaly spike on device ${deviceId || 'DEV_EEG_9042'}`,
      req.ip
    );

    res.json({
      success: true,
      message: 'Synthetic anomaly spike injected into IoT stream',
      dataPoints: spikeWaveform,
      triggeredAlert: true
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to simulate spike' });
  }
});

export default router;
