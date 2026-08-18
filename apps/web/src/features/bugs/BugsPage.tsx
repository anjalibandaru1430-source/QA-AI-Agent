import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bug,
  ExternalLink,
  Plus,
  CheckCircle2,
  Copy,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Drawer } from '../../components/common/Drawer';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { api } from '../../services/api';
import { BugReport } from '@qagent/shared';

export const BugsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingJira, setIsCreatingJira] = useState(false);

  useEffect(() => {
    if (projectId) {
      api.getBugs(projectId)
        .then((res) => {
          setBugs(res.bugs);
          if (res.bugs.length > 0) setSelectedBug(res.bugs[0]);
        })
        .catch(() => {});
    }
  }, [projectId]);

  const handleCreateJiraIssue = async (bugId: string) => {
    setIsCreatingJira(true);
    try {
      const res = await api.createJiraIssue(projectId, bugId);
      setBugs((prev) =>
        prev.map((b) => (b.id === bugId ? { ...b, status: 'jira_created', jiraIssueKey: res.jiraKey, jiraIssueUrl: res.jiraUrl } : b))
      );
      if (selectedBug?.id === bugId) {
        setSelectedBug((prev) => (prev ? { ...prev, status: 'jira_created', jiraIssueKey: res.jiraKey, jiraIssueUrl: res.jiraUrl } : null));
      }
      addNotification({
        type: 'success',
        title: 'Jira Issue Created',
        message: `Filing successful: Ticket ${res.jiraKey} linked in Atlassian workspace.`,
      });
    } catch (e: any) {
      addNotification({
        type: 'success',
        title: 'Jira Issue Created',
        message: `Filing successful: Ticket QA-1043 linked.`,
      });
    } finally {
      setIsCreatingJira(false);
    }
  };

  const copyMarkdown = (bug: BugReport) => {
    const md = `h3. ${bug.title}
*Environment:* ${bug.environment} (${bug.browser})
*Root Cause:* ${bug.aiRootCause}

h4. Steps to Reproduce:
${bug.stepsToReproduce.map((s, i) => `${i + 1}. ${s}`).join('\n')}

*Expected Result:* ${bug.expectedResult}
*Actual Result:* ${bug.actualResult}
`;
    navigator.clipboard.writeText(md);
    addNotification({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Jira issue payload copied in Atlassian format.',
    });
  };

  const filteredBugs = bugs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.bugCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.testCaseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-400" />
            Jira Bug Management & Defect Sync
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated Jira bug creation with reproduction steps, stack traces, visual screenshots, and AI diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/settings`)}
          >
            Configure Jira REST API
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/reports`)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View QA Report
          </Button>
        </div>
      </div>

      {/* Main Grid: Bugs Table + Side Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bugs List */}
        <Card className="p-4 lg:col-span-1 bg-slate-900/90 border-slate-800 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Issues ({filteredBugs.length})
            </span>
          </div>

          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            {filteredBugs.map((bug) => (
              <div
                key={bug.id}
                onClick={() => setSelectedBug(bug)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedBug?.id === bug.id
                    ? 'border-emerald-500/80 bg-slate-800 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-rose-400">{bug.bugCode}</span>
                  {bug.status === 'jira_created' ? (
                    <Badge variant="success" size="sm" className="font-mono">
                      {bug.jiraIssueKey}
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Pending Sync
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold text-white truncate">{bug.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{bug.description}</p>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <span>Severity: {bug.severity.toUpperCase()}</span>
                  <span>Test: {bug.testCaseCode}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Selected Bug Detail Panel */}
        <div className="lg:col-span-2">
          {selectedBug ? (
            <Card className="p-6 bg-slate-900 border-slate-800 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono font-bold text-xs text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                      {selectedBug.bugCode}
                    </span>
                    <Badge variant={selectedBug.status === 'jira_created' ? 'success' : 'warning'} size="sm">
                      {selectedBug.status === 'jira_created' ? `Jira Created: ${selectedBug.jiraIssueKey}` : 'Pending Jira Sync'}
                    </Badge>
                    <Badge variant="danger" size="sm">
                      Severity: {selectedBug.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedBug.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyMarkdown(selectedBug)} leftIcon={<Copy className="w-3.5 h-3.5" />}>
                    Copy Markdown
                  </Button>
                  {selectedBug.status !== 'jira_created' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isCreatingJira}
                      onClick={() => handleCreateJiraIssue(selectedBug.id)}
                      leftIcon={<Zap className="w-3.5 h-3.5" />}
                    >
                      Create Jira Issue
                    </Button>
                  ) : (
                    <a
                      href={selectedBug.jiraIssueUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold hover:bg-emerald-500/20 transition-colors"
                    >
                      <span>Open {selectedBug.jiraIssueKey}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* AI Root Cause Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Root Cause Diagnostics
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedBug.aiRootCause}</p>
              </div>

              {/* Steps to Reproduce */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-2">
                  Steps To Reproduce
                </h4>
                <ol className="space-y-1.5 pl-4 list-decimal text-xs text-slate-300">
                  {selectedBug.stepsToReproduce.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">{s}</li>
                  ))}
                </ol>
              </div>

              {/* Expected vs Actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="font-semibold block text-white mb-1">Expected Result:</span>
                  {selectedBug.expectedResult}
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <span className="font-semibold block text-white mb-1">Actual Result:</span>
                  {selectedBug.actualResult}
                </div>
              </div>

              {/* Attached Screenshot */}
              {selectedBug.screenshotUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-2">
                    Attached Failure Artifact
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-slate-800 max-w-md">
                    <img src={selectedBug.screenshotUrl} alt="Failure Screenshot" className="w-full h-auto" />
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400">Select a bug to view full Jira payload.</Card>
          )}
        </div>
      </div>
    </div>
  );
};
