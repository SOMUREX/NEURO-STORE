# NeuroStore - Intelligent Multimedia Management & Hybrid Storage System

[![Live Demo](https://img.shields.io/badge/Live%20Website-Demo%20App-f97316?style=for-the-badge&logo=react)](https://somurex.github.io/NEURO-STORE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-SOMUREX%2FNEURO--STORE-181717?style=for-the-badge&logo=github)](https://github.com/SOMUREX/NEURO-STORE)
[![Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Node.js%20%7C%20SQLite%20%7C%20Edge%20AI-blue?style=for-the-badge)](https://github.com/SOMUREX/NEURO-STORE)

> **NeuroStore** is a state-of-the-art multimedia asset management and hybrid storage architecture designed for intelligent sensory data ingestion, cryptographic SHA-256 duplicate collision safeguard, automated metadata cataloging, and TinyML Edge AI telemetry processing.

---

## 🌐 Live Website & Demo Links

* **Live Frontend Interface**: [https://somurex.github.io/NEURO-STORE](https://somurex.github.io/NEURO-STORE)
* **GitHub Repository**: [https://github.com/SOMUREX/NEURO-STORE](https://github.com/SOMUREX/NEURO-STORE)
* **Local Web Server**: [http://localhost:3000](http://localhost:3000)
* **Backend REST API Engine**: [http://localhost:5000](http://localhost:5000)

---

## 🧠 System Architecture & Workflow

```
[ USER ACCESS ] ➔ [ AUTHENTICATION (RBAC) ] ➔ [ MULTIMEDIA / IOT INGESTION ]
                                                        ↓
                                              [ FILE VALIDATION ]
                                                        ↓
                                     [ SHA-256 DUPLICATE DETECTION ]
                                                        ↓
                                       ┌────────────────────────────────┐
                                       │    HYBRID STORAGE ENGINE       │
                                       ├────────────────────────────────┤
                                       │ 1. Raw Binary Files (/uploads) │
                                       │ 2. Metadata Database (SQLite)  │
                                       └────────────────────────────────┘
                                                        ↓
                                   [ INTELLIGENT EDGE AI & SEARCH LAYER ]
                                                        ↓
                                   [ RESULTS PRESENTATION & AUDIT LOGS ]
```

---

## 🌟 Key Features

### 1. 🔐 Security & Role-Based Access Control (RBAC)
- **Role Switcher**: Multi-role support for **Administrator** (`admin@neurostore.ai`) and **User** (`user@neurostore.ai`).
- **Audit Logs**: Immutable audit stream capturing authentication, uploads, deletes, and metadata actions.

### 2. 💾 Hybrid Storage & SHA-256 Duplicate Safeguard
- **Separate Binary & Metadata Engine**: Physical files reside in `server/uploads/`, while structural attributes are indexed in SQLite.
- **SHA-256 Fingerprinting**: Generates a cryptographic hash for every upload. Shows an interactive **Duplicate Alert Dialog** if a collision occurs.

### 3. 🎨 Orange `#f97316` Soft Tech UI Design System
- Built with **Plus Jakarta Sans** typography, 24px–32px rounded cards, sticky headers, notification bell with a 10px orange indicator, 4s auto-sliding hero carousel, and active task progress trackers.

### 4. 🤖 AI Processing Layer (Prototype UI)
- **Smart Lossless/Lossy Compression**: Quality slider calculating byte savings (`NeuroLossless-AV1-Quantizer`).
- **Facial Embedding Linking**: Identifies face bounding boxes and links to subject profiles.
- **Video Keyframe Summarization**: Condensed 30-second digest generation.
- **Vector Similarity Search**: High-dimensional cosine vector matching across repository embeddings.

### 5. 📡 IoT & Edge Machine Learning Engine
- **Sensory Telemetry Streams**: Live ingestion of EEG brainwaves (`DEV_EEG_9042`), industrial vibration (`DEV_VIB_1102`), and thermal arrays (`DEV_TEMP_304`).
- **TinyML Models**: Isolation Forest Anomaly Detection, ResNet-8 Signal Classifier, and LSTM Predictive Maintenance (RUL).
- **Ultra-Fast Performance**: Execution time `< 8 ms` with low memory footprint (`128 KB TFLite Micro`).

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone Repository
```bash
git clone https://github.com/SOMUREX/NEURO-STORE.git
cd NEURO-STORE
```

### 2. Start Backend REST API Server
```bash
cd server
npm install
node index.js
# Backend API runs on http://localhost:5000
```

### 3. Start Frontend React Vite App
```bash
cd ../client
npm install
npm run dev
# Frontend app runs on http://localhost:3000
```

---

## 📄 License & Citation
Developed in alignment with the **NeuroStore** research paper specification for intelligent multimodal asset management.
