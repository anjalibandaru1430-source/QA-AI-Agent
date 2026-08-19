import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Breadcrumbs } from './Breadcrumbs';
import { CommandPalette } from './CommandPalette';
import { GlobalSearchModal } from './GlobalSearchModal';
import { CreateProjectModal } from './CreateProjectModal';
import { ToastContainer } from '../common/Toast';
import { useProjectStore } from '../../stores/useProjectStore';
import { useExecutionStore } from '../../stores/useExecutionStore';

export const AppLayout: React.FC = () => {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const { fetchProjects } = useProjectStore();
  const { initWebSocket } = useExecutionStore();

  useEffect(() => {
    fetchProjects();
    initWebSocket();
  }, [fetchProjects, initWebSocket]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onCreateProjectOpen={() => setIsCreateProjectOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* Overlays & Modals */}
      <CommandPalette />
      <GlobalSearchModal />
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};
