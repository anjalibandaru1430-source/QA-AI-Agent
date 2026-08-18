import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ListTree,
  CheckSquare,
  Code2,
  PlayCircle,
  Activity,
  Bot,
  AlertOctagon,
  Sparkles,
  Bug,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useProjectStore } from '../../stores/useProjectStore';

interface SidebarNavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  count?: number;
  pulse?: boolean;
}

interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentProject } = useProjectStore();
  const projectId = currentProject?.id || 'proj_saucedemo_001';

  const navGroups: SidebarNavGroup[] = [
    {
      title: 'Workspace',
      items: [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, path: `/projects/${projectId}/dashboard` },
        { name: 'PRD Ingestion', icon: <FileText className="w-4 h-4" />, path: `/projects/${projectId}/prd`, badge: 'AI' },
        { name: 'Test Scenarios', icon: <ListTree className="w-4 h-4" />, path: `/projects/${projectId}/scenarios`, count: currentProject?.stats?.totalScenarios || 12 },
        { name: 'Test Cases', icon: <CheckSquare className="w-4 h-4" />, path: `/projects/${projectId}/test-cases`, count: currentProject?.stats?.totalTestCases || 32 },
      ],
    },
    {
      title: 'Automation',
      items: [
        { name: 'Code Generation', icon: <Code2 className="w-4 h-4" />, path: `/projects/${projectId}/code` },
        { name: 'Execution Center', icon: <PlayCircle className="w-4 h-4" />, path: `/projects/${projectId}/execution`, pulse: true },
        { name: 'Live Runs', icon: <Activity className="w-4 h-4" />, path: `/projects/${projectId}/execution` },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { name: 'AI Agents Pipeline', icon: <Bot className="w-4 h-4" />, path: `/projects/${projectId}/agents` },
        { name: 'Failure Analysis', icon: <AlertOctagon className="w-4 h-4" />, path: `/projects/${projectId}/failures`, count: 2 },
        { name: 'Self-Healing', icon: <Sparkles className="w-4 h-4" />, path: `/projects/${projectId}/self-healing` },
        { name: 'Coverage & Risk', icon: <ShieldCheck className="w-4 h-4" />, path: `/projects/${projectId}/coverage` },
      ],
    },
    {
      title: 'Quality & Delivery',
      items: [
        { name: 'Jira Bugs', icon: <Bug className="w-4 h-4" />, path: `/projects/${projectId}/bugs`, count: currentProject?.stats?.activeBugs || 2 },
        { name: 'Execution Reports', icon: <FileSpreadsheet className="w-4 h-4" />, path: `/projects/${projectId}/reports` },
      ],
    },
    {
      title: 'Settings',
      items: [
        { name: 'Settings & Integrations', icon: <Settings className="w-4 h-4" />, path: `/projects/${projectId}/settings` },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between z-30 transition-all duration-300 select-none backdrop-blur-xl',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/80">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-sm shadow-emerald-950/20">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  QAgent <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">SaaS</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono -mt-0.5 truncate max-w-[130px]">
                  {currentProject?.name || 'SauceDemo QA'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-3 overflow-y-auto max-h-[calc(100vh-120px)] space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {!collapsed && (
                <h4 className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  {group.title}
                </h4>
              )}
              <div className="space-y-0.5">
                {group.items.map((item, iIdx) => (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                      )
                    }
                  >
                    <div className="shrink-0">{item.icon}</div>
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {item.count}
                          </span>
                        )}
                        {item.pulse && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-200 truncate">Playwright Engine</p>
              <p className="text-[10px] text-slate-400 font-mono">4 Workers Ready</p>
            </div>
          </div>
        ) : (
          <div className="w-2 h-2 mx-auto rounded-full bg-emerald-400 animate-pulse" />
        )}
      </div>
    </aside>
  );
};
