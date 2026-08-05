import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import ActiveTasks from './components/ActiveTasks';
import SearchFilter from './components/SearchFilter';
import MediaGrid from './components/MediaGrid';
import BottomNav from './components/BottomNav';
import UploadModal from './components/UploadModal';
import DuplicateWarningModal from './components/DuplicateWarningModal';
import FilePreviewModal from './components/FilePreviewModal';

import AnalyticsPage from './pages/AnalyticsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AIToolsPage from './pages/AIToolsPage';
import IoTMlPage from './pages/IoTMlPage';
import ProfilePage from './pages/ProfilePage';

import { fetchFiles } from './services/api';

export default function App() {
  const [user, setUser] = useState({
    id: 'usr_admin_01',
    name: 'Dr. Someshwar Rao',
    email: 'admin@neurostore.ai',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Duplicate Warning State
  const [duplicateData, setDuplicateData] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingTags, setPendingTags] = useState('');

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await fetchFiles({
        type: activeCategory,
        search: searchQuery
      });
      setFiles(res.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [activeCategory, searchQuery]);

  const handleUploadSuccess = (newFile) => {
    loadFiles();
  };

  const handleDuplicateDetected = (data, file, tags) => {
    setDuplicateData(data);
    setPendingFile(file);
    setPendingTags(tags);
  };

  const handleSwitchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'Admin' ? 'Dr. Someshwar Rao' : 'Alex Morgan',
      email: newRole === 'Admin' ? 'admin@neurostore.ai' : 'user@neurostore.ai'
    }));
  };

  return (
    <div class="min-h-screen bg-[#fafafa] text-[#1a1a1a] pb-24 font-sans selection:bg-[#f97316]/20">
      {/* Sticky Header */}
      <Navbar
        user={user}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenAudit={() => setActiveTab('audit')}
      />

      {/* Main Content Area */}
      <main class="pt-2">
        {activeTab === 'dashboard' && (
          <>
            {/* Promotional Carousel */}
            <HeroCarousel
              onSelectSlideCta={(slide) => {
                if (slide.id === 3) setActiveTab('ai');
                else if (slide.id === 2) setActiveTab('iot');
                else setIsUploadOpen(true);
              }}
            />

            {/* Active Ingestions Tracker */}
            <ActiveTasks onViewAll={() => setActiveTab('analytics')} />

            {/* Search and Category Filter Pills */}
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onOpenUploadModal={() => setIsUploadOpen(true)}
              totalResultsCount={files.length}
            />

            {/* Service & Multimedia Grid */}
            <MediaGrid
              files={files}
              onSelectFile={(f) => setSelectedFile(f)}
              onOpenUploadModal={() => setIsUploadOpen(true)}
            />
          </>
        )}

        {activeTab === 'upload' && (
          <div class="px-6 py-6 max-w-xl mx-auto">
            <button
              onClick={() => setIsUploadOpen(true)}
              class="w-full py-16 border-2 border-dashed border-[#f97316]/40 hover:border-[#f97316] bg-[#fff7ed]/50 hover:bg-[#fff7ed] rounded-[32px] text-center space-y-3 transition-all cursor-pointer shadow-sm group"
            >
              <div class="w-16 h-16 rounded-full bg-[#f97316] text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 class="text-[18px] font-bold text-[#1a1a1a]">
                Click to Launch Drag & Drop Upload
              </h3>
              <p class="text-[13px] text-[#6b7280]">
                Ingest Images, Videos, Audio or Documents with instant SHA-256 fingerprint check
              </p>
            </button>
          </div>
        )}

        {activeTab === 'search' && (
          <>
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onOpenUploadModal={() => setIsUploadOpen(true)}
              totalResultsCount={files.length}
            />
            <MediaGrid
              files={files}
              onSelectFile={(f) => setSelectedFile(f)}
              onOpenUploadModal={() => setIsUploadOpen(true)}
            />
          </>
        )}

        {activeTab === 'analytics' && <AnalyticsPage />}

        {activeTab === 'iot' && <IoTMlPage />}

        {activeTab === 'ai' && <AIToolsPage files={files} />}

        {activeTab === 'audit' && <AuditLogsPage />}

        {activeTab === 'profile' && (
          <ProfilePage
            user={user}
            onSwitchRole={handleSwitchRole}
          />
        )}
      </main>

      {/* Floating Upload Quick Action Button */}
      <button
        onClick={() => setIsUploadOpen(true)}
        class="fixed bottom-24 right-6 z-30 w-14 h-14 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ring-4 ring-[#f97316]/20"
        title="Upload Multimedia"
      >
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Fixed 80px Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Upload Center Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onDuplicateDetected={handleDuplicateDetected}
        user={user}
      />

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        duplicateData={duplicateData}
        pendingFile={pendingFile}
        pendingTags={pendingTags}
        onClose={() => setDuplicateData(null)}
        onForceSuccess={handleUploadSuccess}
        user={user}
      />

      {/* File Preview & Metadata Drawer Modal */}
      <FilePreviewModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onFileDeleted={() => loadFiles()}
        user={user}
      />
    </div>
  );
}
