import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useProjectStore } from '../../stores/useProjectStore';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { currentProject } = useProjectStore();

  const pathParts = location.pathname.split('/').filter(Boolean);

  const getLabel = (part: string) => {
    if (part === 'projects') return 'Projects';
    if (part === currentProject?.id) return currentProject?.name || 'SauceDemo QA';
    if (part === 'prd') return 'PRD Ingestion';
    if (part === 'scenarios') return 'Test Scenarios';
    if (part === 'test-cases') return 'Test Cases';
    if (part === 'code') return 'Playwright Code';
    if (part === 'execution') return 'Execution Center';
    if (part === 'agents') return 'AI Agents Pipeline';
    if (part === 'failures') return 'Failure Analysis';
    if (part === 'self-healing') return 'Self-Healing';
    if (part === 'coverage') return 'Coverage & Risk';
    if (part === 'bugs') return 'Jira Bugs';
    if (part === 'reports') return 'Execution Reports';
    if (part === 'settings') return 'Settings';
    if (part === 'dashboard') return 'Dashboard';
    return part;
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 select-none">
      <Link to="/dashboard" className="hover:text-slate-200 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathParts.map((part, index) => {
        const routeTo = `/${pathParts.slice(0, index + 1).join('/')}`;
        const isLast = index === pathParts.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast ? (
              <span className="text-slate-200 font-medium">{getLabel(part)}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-200 transition-colors">
                {getLabel(part)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
