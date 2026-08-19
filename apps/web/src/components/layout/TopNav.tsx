import React, { useState } from 'react';
import {
  Search,
  Command,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useProjectStore } from '../../stores/useProjectStore';
import { useExecutionStore } from '../../stores/useExecutionStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useUserStore } from '../../stores/useUserStore';
import { useCommandPaletteStore } from '../../stores/useCommandPaletteStore';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export interface TopNavProps {
  onCreateProjectOpen: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onCreateProjectOpen }) => {
  const { projects, currentProject, selectProjectById } = useProjectStore();
  const { activeExecution } = useExecutionStore();
  const { notifications, markAllAsRead } = useNotificationStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openPalette, openSearch } = useCommandPaletteStore();
  const { currentUser } = useUserStore();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-14 bg-slate-950/80 border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl select-none">
      {/* Left: Project Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs font-medium text-slate-200 transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white max-w-[140px] truncate">
              {currentProject?.name || 'Select Project'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 glass-dropdown">
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase text-slate-400">Switch Workspace</div>
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      selectProjectById(p.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentProject?.id === p.id
                        ? 'bg-emerald-500/10 text-emerald-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {p.id === 'proj_saucedemo_001' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        Demo
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 mt-1.5 pt-1.5">
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    onCreateProjectOpen();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Execution Pulse Status Pill */}
        {activeExecution && (
          <Link
            to={`/projects/${currentProject?.id || 'proj_saucedemo_001'}/execution`}
            className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
          >
            {activeExecution.status === 'running' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-emerald-400 font-medium">
                  Run #{activeExecution.executionNumber}: {activeExecution.progressPercent}%
                </span>
                <span className="text-slate-400 font-mono">
                  ({activeExecution.passedCount}P / {activeExecution.failedCount}F)
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-mono">
                  Run #{activeExecution.executionNumber} Passed ({activeExecution.passedCount}/{activeExecution.totalTests})
                </span>
              </>
            )}
          </Link>
        )}
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={openPalette}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-400 transition-all shadow-sm group w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            <span>Search or command...</span>
          </div>
          <kbd className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Global Search shortcut button on mobile */}
        <button
          onClick={openSearch}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors md:hidden"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-80 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 glass-dropdown">
              <div className="px-2 py-1.5 flex items-center justify-between border-b border-slate-800 mb-1">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-emerald-400 hover:underline font-mono"
                >
                  Mark all as read
                </button>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs ${
                      n.isRead ? 'bg-transparent text-slate-400' : 'bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-100">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-semibold text-emerald-300">
            {currentUser?.initials || 'AB'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-slate-200">{currentUser?.name || 'Anjali Bandaru'}</div>
            <div className="text-[10px] text-slate-400 font-mono">{currentUser?.role || 'QA Lead'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
