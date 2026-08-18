import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, CheckSquare, ListTree, Bug, FileText, PlayCircle } from 'lucide-react';
import { useCommandPaletteStore } from '../../stores/useCommandPaletteStore';
import { useProjectStore } from '../../stores/useProjectStore';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useCommandPaletteStore();
  const { currentProject } = useProjectStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  // Sample searchable index across entities
  const searchIndex = [
    { type: 'Requirement', code: 'REQ-001', title: 'User Authentication & Access Control', path: `/projects/${projectId}/prd` },
    { type: 'Requirement', code: 'REQ-002', title: 'Product Catalog, Filtering & Sorting', path: `/projects/${projectId}/prd` },
    { type: 'Requirement', code: 'REQ-004', title: 'Multi-Step Checkout & Tax Calculation', path: `/projects/${projectId}/prd` },
    { type: 'Scenario', code: 'SC-AUTH-001', title: 'Valid Authentication Workflow for Standard Users', path: `/projects/${projectId}/scenarios` },
    { type: 'Scenario', code: 'SC-CHK-001', title: 'End-to-End Single & Multi-Item Checkout Flow', path: `/projects/${projectId}/scenarios` },
    { type: 'TestCase', code: 'TC-AUTH-001', title: 'Standard user login with valid credentials', path: `/projects/${projectId}/test-cases` },
    { type: 'TestCase', code: 'TC-AUTH-004', title: 'Locked-out user login rejection', path: `/projects/${projectId}/test-cases` },
    { type: 'TestCase', code: 'TC-CHK-005', title: '8% Tax and Subtotal arithmetic calculation', path: `/projects/${projectId}/test-cases` },
    { type: 'Execution', code: 'EXEC-1042', title: 'Execution #1042 - 90.6% Pass Rate', path: `/projects/${projectId}/execution` },
    { type: 'Bug', code: 'BUG-001', title: '[SauceDemo] Locked-out user error message suspended copy', path: `/projects/${projectId}/bugs` },
    { type: 'Bug', code: 'BUG-002', title: '[SauceDemo] Problem user triggers broken product image asset 404s', path: `/projects/${projectId}/bugs` },
  ];

  const results = searchIndex.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'Requirement':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'Scenario':
        return <ListTree className="w-4 h-4 text-indigo-400" />;
      case 'TestCase':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'Execution':
        return <PlayCircle className="w-4 h-4 text-amber-400" />;
      case 'Bug':
        return <Bug className="w-4 h-4 text-rose-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-10 text-slate-100"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search across requirements, test cases, executions, bugs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={closeSearch}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      closeSearch();
                      setSearchTerm('');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                        {getIcon(item.type)}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <span className="font-mono text-emerald-400">{item.code}</span>
                          <span className="truncate max-w-xs">{item.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.type}</div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching results found for "{searchTerm}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
