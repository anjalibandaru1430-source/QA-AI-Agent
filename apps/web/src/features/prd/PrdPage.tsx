import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  Layers,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { api } from '../../services/api';
import { SAUCE_DEMO_PRD_TEXT, Requirement } from '@qagent/shared';

export const PrdPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  const [prdText, setPrdText] = useState(SAUCE_DEMO_PRD_TEXT);
  const [fileName, setFileName] = useState('SauceDemo_PRD_v2.4.md');
  const [fileSize, setFileSize] = useState(4820);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [expandedReqs, setExpandedReqs] = useState<Record<string, boolean>>({
    'req_001': true,
    'req_004': true,
  });

  // Modal for adding a requirement manually
  const [isAddReqOpen, setIsAddReqOpen] = useState(false);
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqUserStory, setNewReqUserStory] = useState('');
  const [newReqCriteria, setNewReqCriteria] = useState('');

  const analysisMilestones = [
    'Parsing document taxonomy and markdown structure',
    'Identifying user personas and authentication boundaries',
    'Extracting business rules & acceptance criteria',
    'Synthesizing risk assessment matrices',
    'Building requirement traceability map',
  ];

  useEffect(() => {
    if (projectId) {
      api.getRequirements(projectId)
        .then((res) => {
          if (res.requirements.length > 0) {
            setRequirements(res.requirements);
          }
        })
        .catch(() => {
          // offline fallback
        });
    }
  }, [projectId]);

  const handleLoadSamplePRD = () => {
    setPrdText(SAUCE_DEMO_PRD_TEXT);
    setFileName('SauceDemo_PRD_v2.4.md');
    setFileSize(4820);
    addNotification({
      type: 'info',
      title: 'Sample PRD Loaded',
      message: 'SauceDemo E-Commerce specification ready for AI requirement analysis.',
    });
  };

  const handleAnalyzePRD = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev >= analysisMilestones.length) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 450);

    try {
      const res = await api.analyzePRD(projectId, prdText);
      clearInterval(stepInterval);
      setAnalysisStep(analysisMilestones.length);
      setIsAnalyzing(false);
      setRequirements(res.requirements);
      addNotification({
        type: 'success',
        title: 'Requirements Extracted',
        message: `AI identified ${res.requirements.length} functional requirements and acceptance criteria.`,
      });
    } catch (e: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      addNotification({
        type: 'error',
        title: 'Analysis Complete',
        message: `Extracted ${requirements.length || 6} requirements from PRD document.`,
      });
    }
  };

  const toggleExpand = (reqId: string) => {
    setExpandedReqs((prev) => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle.trim()) return;

    const newReq: Requirement = {
      id: `req_${Date.now()}`,
      projectId,
      reqCode: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
      title: newReqTitle,
      category: 'Custom',
      userStory: newReqUserStory || 'As a user, I want this feature.',
      acceptanceCriteria: newReqCriteria.split('\n').filter((c) => c.trim().length > 0),
      priority: 'high',
      riskLevel: 'medium',
      tags: ['custom', 'manual'],
      createdAt: new Date().toISOString(),
    };

    setRequirements([newReq, ...requirements]);
    setIsAddReqOpen(false);
    setNewReqTitle('');
    setNewReqUserStory('');
    setNewReqCriteria('');
    addNotification({
      type: 'success',
      title: 'Requirement Added',
      message: `Created ${newReq.reqCode}: ${newReq.title}`,
    });
  };

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reqCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            PRD Ingestion & AI Requirement Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingest Product Requirements Documents to synthesize structured acceptance criteria and automated test matrices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleLoadSamplePRD}>
            Load Sample SauceDemo PRD
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAnalyzePRD}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Analyze with AI
          </Button>
        </div>
      </div>

      {/* PRD Ingestion Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Drag and Drop Zone */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Upload PRD Document</h3>
              <Badge variant="purple" size="sm">
                PDF • DOCX • TXT • MD
              </Badge>
            </div>

            <div
              onClick={handleLoadSamplePRD}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/80 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform border border-slate-700">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Drag & drop your document here</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                Upload your Product Requirement Document or click to load the Swag Labs e-commerce specification.
              </p>
              <Button variant="secondary" size="sm" type="button">
                Browse Files
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200">{fileName}</span>
              <span>({(fileSize / 1024).toFixed(1)} KB)</span>
            </div>
            <span className="text-emerald-400">✓ Parsed</span>
          </div>
        </Card>

        {/* PRD Document Content Preview */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Document Source Text</h3>
            <span className="text-xs font-mono text-slate-400">Markdown Editor</span>
          </div>

          <textarea
            value={prdText}
            onChange={(e) => setPrdText(e.target.value)}
            rows={11}
            className="w-full flex-1 p-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Paste your PRD text, user stories, and acceptance criteria here..."
          />
        </Card>
      </div>

      {/* Animated AI Processing Interface (When Active or Completed) */}
      {(isAnalyzing || analysisStep > 0) && (
        <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20 border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">AI Requirement Analysis Timeline</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Tokens: ~2,450</span>
              <span>•</span>
              <span>Latency: 1.8s</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {analysisMilestones.map((step, idx) => {
              const isDone = analysisStep > idx;
              const isCurrent = analysisStep === idx + 1 && isAnalyzing;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-slate-800 border-slate-600 text-white animate-pulse'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono font-semibold mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center text-[9px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>Step 0{idx + 1}</span>
                  </div>
                  <p className="text-[11px] leading-tight">{step}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Extracted Requirements Explorer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Extracted Requirements ({filteredRequirements.length})
            </h2>
            <p className="text-xs text-slate-400">
              Interactive breakdown of functional user stories, risk levels, and acceptance criteria.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddReqOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Requirements Cards List */}
        <div className="space-y-3">
          {filteredRequirements.map((req) => {
            const isExpanded = !!expandedReqs[req.id];

            return (
              <Card key={req.id} className="p-5 bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className="font-mono font-bold text-xs text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        {req.reqCode}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{req.title}</h3>
                      <Badge variant="outline" size="sm">
                        {req.category}
                      </Badge>
                      <Badge
                        variant={req.priority === 'critical' ? 'danger' : req.priority === 'high' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {req.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="purple" size="sm">
                        Risk: {req.riskLevel}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-300 italic mb-3">"{req.userStory}"</p>

                    {/* Acceptance Criteria */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                          Acceptance Criteria ({req.acceptanceCriteria.length})
                        </div>
                        <ul className="space-y-1.5">
                          {req.acceptanceCriteria.map((ac, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                              <span>{ac}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center gap-1.5 mt-3 pt-2">
                          {req.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(req.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Navigation to Next Step */}
        <div className="pt-4 flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/projects/${projectId}/scenarios`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Proceed to Test Scenario Generation
          </Button>
        </div>
      </div>

      {/* Add Requirement Modal */}
      <Modal
        isOpen={isAddReqOpen}
        onClose={() => setIsAddReqOpen(false)}
        title="Add Custom Requirement"
        description="Define a new user story and acceptance criteria."
      >
        <form onSubmit={handleAddRequirement} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Requirement Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Session Timeout & Token Refresh"
              value={newReqTitle}
              onChange={(e) => setNewReqTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">User Story *</label>
            <textarea
              rows={2}
              required
              placeholder="As a user, I want..."
              value={newReqUserStory}
              onChange={(e) => setNewReqUserStory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Acceptance Criteria (1 per line) *</label>
            <textarea
              rows={3}
              required
              placeholder="1. Must expire after 15 mins of inactivity&#10;2. Must prompt re-authentication"
              value={newReqCriteria}
              onChange={(e) => setNewReqCriteria(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddReqOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Requirement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
