import React, { useState, useEffect } from 'react';
import {
  Bot,
  FileText,
  ListTree,
  CheckSquare,
  Code2,
  PlayCircle,
  AlertOctagon,
  Bug,
  Sparkles,
  ArrowDown,
  ArrowRight,
  RefreshCw,
  Activity,
  Cpu,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { api } from '../../services/api';
import { AIAgentState } from '@qagent/shared';

export const AgentsPage: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const [selectedAgent, setSelectedAgent] = useState<AIAgentState | null>(null);
  const [agents, setAgents] = useState<AIAgentState[]>([
    { id: 'RequirementAgent', name: 'Requirement Analyzer', description: 'Extracts user journeys, acceptance criteria, and risk areas from PRD', status: 'completed', progress: 100, tokensUsed: 2450, durationMs: 1820 },
    { id: 'ScenarioAgent', name: 'Scenario Generator', description: 'Synthesizes categorized functional, negative, and boundary scenarios', status: 'completed', progress: 100, tokensUsed: 3120, durationMs: 2150 },
    { id: 'TestCaseAgent', name: 'Test Case Designer', description: 'Generates detailed step-by-step test cases with AI Quality Scores', status: 'completed', progress: 100, tokensUsed: 6840, durationMs: 3420 },
    { id: 'CodeGenerationAgent', name: 'Playwright Code Generator', description: 'Produces typed Page Object Models and spec test suites', status: 'completed', progress: 100, tokensUsed: 8910, durationMs: 4120 },
    { id: 'ExecutionAgent', name: 'Execution Dispatcher', description: 'Orchestrates parallel worker pool and real-time event streaming', status: 'completed', progress: 100, tokensUsed: 1200, durationMs: 38400 },
    { id: 'FailureAnalysisAgent', name: 'Failure Diagnostics Agent', description: 'Isolates root causes, regression indicators, and stack trace insights', status: 'completed', progress: 100, tokensUsed: 2100, durationMs: 1450 },
    { id: 'SelfHealingAgent', name: 'Self-Healing Engine', description: 'Generates robust selector replacements and verified code diffs', status: 'completed', progress: 100, tokensUsed: 1940, durationMs: 1320 },
    { id: 'BugReportAgent', name: 'Jira Bug Generator', description: 'Formats Jira tickets with reproducibility steps, logs, and artifacts', status: 'completed', progress: 100, tokensUsed: 1650, durationMs: 980 },
  ]);

  useEffect(() => {
    setSelectedAgent(agents[0]);
    api.getAgentStatus().then((res) => {
      if (res.agents && res.agents.length > 0) setAgents(res.agents);
    }).catch(() => {});
  }, []);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'RequirementAgent': return <FileText className="w-5 h-5 text-sky-400" />;
      case 'ScenarioAgent': return <ListTree className="w-5 h-5 text-indigo-400" />;
      case 'TestCaseAgent': return <CheckSquare className="w-5 h-5 text-emerald-400" />;
      case 'CodeGenerationAgent': return <Code2 className="w-5 h-5 text-amber-400" />;
      case 'ExecutionAgent': return <PlayCircle className="w-5 h-5 text-rose-400" />;
      case 'FailureAnalysisAgent': return <AlertOctagon className="w-5 h-5 text-purple-400" />;
      case 'SelfHealingAgent': return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'BugReportAgent': return <Bug className="w-5 h-5 text-red-400" />;
      default: return <Bot className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            AI Agent Pipeline & Autonomous Orchestration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual topology of specialized AI agents coordinating requirement extraction, test synthesis, code generation, and defect resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" size="md">
            All 8 Agents Active & Healthy
          </Badge>
        </div>
      </div>

      {/* Main Grid: Interactive Flow Topology + Agent Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Pipeline Nodes */}
        <div className="lg:col-span-2 space-y-3">
          {/* PRD Input Root Node */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-center max-w-sm mx-auto shadow-md">
            <div className="text-[10px] font-mono uppercase text-slate-400">Input Source</div>
            <div className="text-xs font-bold text-white mt-0.5">PRD Document (Markdown / PDF)</div>
          </div>

          <div className="flex justify-center my-1">
            <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />
          </div>

          {/* Sequential Agent Nodes */}
          <div className="space-y-3">
            {agents.map((agent, idx) => {
              const isSelected = selectedAgent?.id === agent.id;

              return (
                <React.Fragment key={agent.id}>
                  <Card
                    hoverable
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500/80 bg-slate-800 shadow-xl shadow-emerald-950/20'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {getAgentIcon(agent.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-400 font-semibold">
                              0{idx + 1}.
                            </span>
                            <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                            <Badge variant={agent.status === 'completed' ? 'success' : 'warning'} size="sm" dot>
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{agent.description}</p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-4 text-right font-mono text-xs text-slate-400">
                        <div>
                          <div className="text-emerald-400 font-bold">~{agent.tokensUsed}</div>
                          <div className="text-[10px]">Tokens</div>
                        </div>
                        <div>
                          <div className="text-white font-bold">{agent.durationMs}ms</div>
                          <div className="text-[10px]">Latency</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {idx < agents.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Inspector */}
        <div>
          {selectedAgent ? (
            <Card className="p-6 bg-slate-900 border-slate-800 sticky top-20 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {getAgentIcon(selectedAgent.id)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
                  <Badge variant="purple" size="sm" className="font-mono mt-0.5">
                    {selectedAgent.id}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-1.5">
                  Core Responsibilities
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  {selectedAgent.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Tokens Consumed:</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{selectedAgent.tokensUsed}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Processing Time:</div>
                  <div className="text-sky-400 font-bold text-sm mt-0.5">{selectedAgent.durationMs}ms</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-2">
                  Agent Telemetry & Logs
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>[12:30:45] [INFO] Pipeline dispatch initialized.</div>
                  <div>[12:30:46] [EXEC] Validated input JSON against Zod schema.</div>
                  <div className="text-emerald-400">[12:30:47] [SUCCESS] Output generated with 98% confidence.</div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400">Select an agent node to view inspector.</Card>
          )}
        </div>
      </div>
    </div>
  );
};
