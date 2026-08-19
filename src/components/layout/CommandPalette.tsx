import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  ListTree,
  CheckSquare,
  Code2,
  PlayCircle,
  Bug,
  FileSpreadsheet,
  Settings,
  Bot,
  Sun,
  Moon,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCommandPaletteStore } from '../../stores/useCommandPaletteStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const CommandPalette: React.FC = () => {
  const { isOpen, closePalette, togglePalette } = useCommandPaletteStore();
  const { currentProject } = useProjectStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  // Global Ctrl+K / Cmd+K keybinding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePalette, closePalette]);

  const commands = [
    {
      title: 'Run All Playwright Tests',
      category: 'Automation',
      icon: <PlayCircle className="w-4 h-4 text-emerald-400" />,
      action: () => navigate(`/projects/${projectId}/execution`),
    },
    {
      title: 'Upload / Analyze PRD Document',
      category: 'Workspace',
      icon: <FileText className="w-4 h-4 text-sky-400" />,
      action: () => navigate(`/projects/${projectId}/prd`),
    },
    {
      title: 'View Test Scenarios',
      category: 'Workspace',
      icon: <ListTree className="w-4 h-4 text-indigo-400" />,
      action: () => navigate(`/projects/${projectId}/scenarios`),
    },
    {
      title: 'Design Detailed Test Cases',
      category: 'Workspace',
      icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
      action: () => navigate(`/projects/${projectId}/test-cases`),
    },
    {
      title: 'Open Monaco Code Generator',
      category: 'Automation',
      icon: <Code2 className="w-4 h-4 text-amber-400" />,
      action: () => navigate(`/projects/${projectId}/code`),
    },
    {
      title: 'Inspect AI Failure Diagnostics & Self-Healing',
      category: 'Intelligence',
      icon: <Bot className="w-4 h-4 text-rose-400" />,
      action: () => navigate(`/projects/${projectId}/failures`),
    },
    {
      title: 'View AI Agent React Flow Pipeline',
      category: 'Intelligence',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      action: () => navigate(`/projects/${projectId}/agents`),
    },
    {
      title: 'Traceability Matrix & Risk Heatmap',
      category: 'Intelligence',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      action: () => navigate(`/projects/${projectId}/coverage`),
    },
    {
      title: 'Manage Jira Bug Tickets',
      category: 'Quality',
      icon: <Bug className="w-4 h-4 text-rose-400" />,
      action: () => navigate(`/projects/${projectId}/bugs`),
    },
    {
      title: 'Generate Execution Report & Email',
      category: 'Quality',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
      action: () => navigate(`/projects/${projectId}/reports`),
    },
    {
      title: `Toggle Theme (Current: ${theme})`,
      category: 'Preferences',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      action: () => toggleTheme(),
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd: typeof commands[0]) => {
    cmd.action();
    closePalette();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-10 text-slate-100"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search workflow..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ESC
              </kbd>
            </div>

            {/* Commands List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors ${
                      selectedIndex === idx
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                        {cmd.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-slate-100">{cmd.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{cmd.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching commands found for "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span>Navigation:</span>
                <kbd className="px-1 py-0.2 rounded bg-slate-800 border border-slate-700">↑</kbd>
                <kbd className="px-1 py-0.2 rounded bg-slate-800 border border-slate-700">↓</kbd>
              </div>
              <div className="flex items-center gap-2">
                <span>Select:</span>
                <kbd className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700">↵</kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
