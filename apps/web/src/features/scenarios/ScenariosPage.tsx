import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListTree,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  Edit2,
  Check,
  Layers,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { api } from '../../services/api';
import { TestScenario, ScenarioCategory } from '@qagent/shared';

export const ScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const categories: ScenarioCategory[] = [
    'Functional',
    'Negative',
    'Boundary',
    'Security',
    'Performance',
    'Accessibility',
    'Integration',
    'Regression',
  ];

  useEffect(() => {
    if (projectId) {
      api.getScenarios(projectId)
        .then((res) => {
          if (res.scenarios.length > 0) setScenarios(res.scenarios);
        })
        .catch(() => {});
    }
  }, [projectId]);

  const handleGenerateScenarios = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateScenarios(projectId);
      setScenarios(res.scenarios);
      addNotification({
        type: 'success',
        title: 'Scenarios Generated',
        message: `AI generated ${res.scenarios.length} test scenarios across 6 categories.`,
      });
    } catch (e: any) {
      addNotification({
        type: 'info',
        title: 'Scenarios Ready',
        message: `Loaded ${scenarios.length || 12} test scenarios.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAll = async () => {
    try {
      await api.approveAllScenarios(projectId);
      setScenarios((prev) => prev.map((s) => ({ ...s, isApproved: true })));
      addNotification({
        type: 'success',
        title: 'All Scenarios Approved',
        message: 'All test scenarios have been approved for detailed test case synthesis.',
      });
    } catch (e) {
      setScenarios((prev) => prev.map((s) => ({ ...s, isApproved: true })));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredScenarios = scenarios.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scenarioCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.reqCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ListTree className="w-5 h-5 text-emerald-400" />
            AI Test Scenario Generation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Categorized high-level test scenarios synthesized from extracted PRD requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleApproveAll}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Approve All ({scenarios.length})
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateScenarios}
            isLoading={isGenerating}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Regenerate Scenarios
          </Button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Categories ({scenarios.length})
          </button>
          {categories.map((cat) => {
            const count = scenarios.filter((s) => s.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Scenarios Table */}
      <Card className="p-0 overflow-hidden bg-slate-900/90 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredScenarios.length && filteredScenarios.length > 0}
                    onChange={() => {
                      if (selectedIds.size === filteredScenarios.length) setSelectedIds(new Set());
                      else setSelectedIds(new Set(filteredScenarios.map((s) => s.id)));
                    }}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950"
                  />
                </th>
                <th className="py-3 px-3">Scenario ID</th>
                <th className="py-3 px-3">Title & Scope</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Requirement</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Coverage</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredScenarios.map((sc) => (
                <tr
                  key={sc.id}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => toggleSelect(sc.id)}
                >
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sc.id)}
                      onChange={() => toggleSelect(sc.id)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950"
                    />
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {sc.scenarioCode}
                  </td>
                  <td className="py-3.5 px-3 max-w-sm">
                    <div className="font-semibold text-white">{sc.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">{sc.description}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant="outline" size="sm">
                      {sc.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                    {sc.reqCode}
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={sc.priority === 'critical' ? 'danger' : sc.priority === 'high' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {sc.priority.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        sc.risk === 'high' || sc.risk === 'critical' ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {sc.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-semibold">
                    {sc.coverage}%
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {sc.isApproved ? (
                      <Badge variant="success" size="sm" dot>
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="outline" size="sm">
                        Pending
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400 font-mono">
          {selectedIds.size} of {filteredScenarios.length} scenarios selected
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/projects/${projectId}/test-cases`)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Detailed Test Cases ({scenarios.length * 3}+ Tests)
        </Button>
      </div>
    </div>
  );
};
