import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  StopCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Terminal as TerminalIcon,
  Cpu,
  Monitor,
  Maximize2,
  RefreshCw,
  Sparkles,
  Bug,
  ChevronRight,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Drawer } from '../../components/common/Drawer';
import { Tabs } from '../../components/common/Tabs';
import { useProjectStore } from '../../stores/useProjectStore';
import { useExecutionStore } from '../../stores/useExecutionStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { TestResult, WorkerState } from '@qagent/shared';

export const ExecutionPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const {
    executions,
    activeExecution,
    liveLogs,
    selectedTestResult,
    isDrawerOpen,
    openTestDetails,
    closeDrawer,
    startExecution,
    cancelExecution,
    fetchExecutions,
  } = useExecutionStore();
  const { addNotification } = useNotificationStore();

  const projectId = currentProject?.id || 'proj_saucedemo_001';
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'passed' | 'failed'>('all');
  const [drawerTab, setDrawerTab] = useState<string>('overview');

  useEffect(() => {
    if (projectId) fetchExecutions(projectId);
  }, [projectId, fetchExecutions]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveLogs]);

  const handleStartRun = async () => {
    try {
      await startExecution(projectId, 'chromium');
      addNotification({
        type: 'info',
        title: 'Execution Started',
        message: 'Playwright test runner initialized with 4 parallel Chromium workers.',
      });
    } catch (e: any) {
      addNotification({
        type: 'error',
        title: 'Run Error',
        message: e.message || 'Could not start execution',
      });
    }
  };

  const handleCancelRun = async () => {
    if (activeExecution) {
      await cancelExecution(activeExecution.id);
      addNotification({
        type: 'warning',
        title: 'Execution Cancelled',
        message: `Execution #${activeExecution.executionNumber} was stopped.`,
      });
    }
  };

  const execution = activeExecution || executions[0] || {
    id: 'exec_1042',
    executionNumber: 1042,
    status: 'completed',
    browser: 'chromium',
    environment: 'demo',
    executionMode: 'local',
    totalTests: 32,
    completedTests: 32,
    passedCount: 29,
    failedCount: 2,
    skippedCount: 1,
    runningCount: 0,
    progressPercent: 100,
    durationMs: 38400,
    results: [],
    workers: [
      { workerId: 1, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
      { workerId: 2, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
      { workerId: 3, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
      { workerId: 4, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
    ],
    logs: [
      '[12:31:00] [Execution #1042] Initialized 4 parallel workers.',
      '[12:31:03] [Worker 1] PASS TC-AUTH-001 (1240ms)',
      '[12:31:11] [Worker 2] FAIL TC-AUTH-004 (1120ms)',
      '[12:31:38] [Execution #1042] Finished in 38.4s. 29 Passed, 2 Failed, 1 Skipped.',
    ],
  };

  // Mock results list for display if empty
  const results: TestResult[] = execution.results?.length > 0 ? execution.results : [
    {
      id: 'res_001',
      executionId: execution.id,
      testCaseId: 'tc_001',
      testCaseCode: 'TC-AUTH-001',
      testTitle: 'Standard user login with valid credentials',
      status: 'passed',
      durationMs: 1240,
      workerId: 1,
      browser: 'chromium',
      startedAt: new Date().toISOString(),
      stepLogs: [
        { timestamp: '12:31:02', stepNumber: 1, action: 'Navigating to login page', status: 'passed' },
        { timestamp: '12:31:02', stepNumber: 2, action: 'Entering standard_user', status: 'passed' },
        { timestamp: '12:31:03', stepNumber: 3, action: 'Entering password', status: 'passed' },
        { timestamp: '12:31:03', stepNumber: 4, action: 'Clicking login button', status: 'passed' },
        { timestamp: '12:31:03', stepNumber: 5, action: 'Asserting title is Products', status: 'passed' },
      ],
      screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      consoleLogs: [{ level: 'info', message: 'Page loaded in 420ms', timestamp: '12:31:02' }],
      networkLogs: [{ url: 'https://www.saucedemo.com/inventory.html', method: 'GET', status: 200, durationMs: 120 }],
    },
    {
      id: 'res_004',
      executionId: execution.id,
      testCaseId: 'tc_004',
      testCaseCode: 'TC-AUTH-004',
      testTitle: 'Locked-out user login rejection',
      status: 'failed',
      durationMs: 1120,
      workerId: 2,
      browser: 'chromium',
      startedAt: new Date().toISOString(),
      stepLogs: [
        { timestamp: '12:31:10', stepNumber: 1, action: 'Navigating to login page', status: 'passed' },
        { timestamp: '12:31:10', stepNumber: 2, action: 'Entering locked_out_user', status: 'passed' },
        { timestamp: '12:31:11', stepNumber: 3, action: 'Clicking login button', status: 'passed' },
        { timestamp: '12:31:11', stepNumber: 4, action: 'Asserting exact error banner', status: 'failed', error: 'Expected "Sorry, this user has been locked out." but received "User account suspended by admin"' },
      ],
      screenshotUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80',
      consoleLogs: [{ level: 'warn', message: 'HTTP 403 Forbidden payload returned', timestamp: '12:31:11' }],
      networkLogs: [{ url: 'https://www.saucedemo.com/api/v1/auth/login', method: 'POST', status: 403, durationMs: 210 }],
      stackTrace: `AssertionError: Timed out waiting for expect(locator).toHaveText()\n  Expected: "Epic sadface: Sorry, this user has been locked out."\n  Received: "Epic sadface: User account suspended by admin"`,
    },
  ];

  const filteredResults = results.filter((r) => {
    if (activeTab === 'passed') return r.status === 'passed';
    if (activeTab === 'failed') return r.status === 'failed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Execution Header Banner */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono font-bold text-base text-white">
              Execution #{execution.executionNumber}
            </span>
            <Badge
              variant={execution.status === 'running' ? 'warning' : execution.failedCount > 0 ? 'danger' : 'success'}
              size="md"
              dot
            >
              {execution.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" size="sm" className="font-mono">
              Chromium • 4 Workers
            </Badge>
            <Badge variant="purple" size="sm">
              SauceDemo v2.4
            </Badge>
          </div>

          <p className="text-xs text-slate-400">
            {execution.status === 'running'
              ? `Currently executing test batch across 4 parallel browser instances (${execution.progressPercent}%)...`
              : `Execution completed in ${(execution.durationMs / 1000).toFixed(1)}s with ${execution.passedCount} passed tests.`}
          </p>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${execution.progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-white">{execution.progressPercent}%</span>
          </div>
        </div>

        {/* Real-time Metric Counters & Control Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-center">
            <div>
              <div className="text-sm font-bold text-emerald-400">{execution.passedCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Passed</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-sm font-bold text-rose-400">{execution.failedCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Failed</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-sm font-bold text-slate-400">{execution.skippedCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Skipped</div>
            </div>
          </div>

          {execution.status === 'running' ? (
            <Button
              variant="danger"
              size="md"
              onClick={handleCancelRun}
              leftIcon={<StopCircle className="w-4 h-4" />}
            >
              Stop Execution
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleStartRun}
              leftIcon={<PlayCircle className="w-4 h-4" />}
            >
              Run All Tests (32)
            </Button>
          )}
        </div>
      </Card>

      {/* Main Execution View: Live Browser Simulator + Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[440px]">
        {/* Live Browser Simulator */}
        <Card className="p-0 bg-slate-900 border-slate-800 flex flex-col overflow-hidden">
          {/* Browser Chrome Header */}
          <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex-1 max-w-sm mx-4 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">https://www.saucedemo.com/</span>
            </div>

            <Badge variant="success" size="sm" dot>
              Live Stream
            </Badge>
          </div>

          {/* Interactive Simulated Web View */}
          <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden select-none">
            {/* Visual Swag Labs Login Simulation Frame */}
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative">
              <div className="text-center mb-4">
                <div className="font-extrabold text-sm text-emerald-400 font-mono tracking-wider">SWAG LABS</div>
                <div className="text-[10px] text-slate-400">Playwright Target Viewport</div>
              </div>

              <div className="space-y-2.5">
                <div className="p-2 rounded bg-slate-950 border border-emerald-500/50 text-[11px] text-slate-200 font-mono flex items-center justify-between">
                  <span>standard_user</span>
                  <span className="text-[9px] text-emerald-400 font-mono">#user-name</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>••••••••••••</span>
                  <span className="text-[9px] text-slate-400 font-mono">#password</span>
                </div>
                <div className="py-2 rounded bg-emerald-600 text-center font-bold text-xs text-white shadow-sm ring-2 ring-emerald-400/40">
                  LOGIN
                </div>
              </div>

              {/* Real-time active test bounding box marker */}
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                TC-AUTH-001 (Worker 1)
              </div>
            </div>

            {/* Viewport Meta Indicator */}
            <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-400 flex items-center gap-3">
              <span>Resolution: 1280x800</span>
              <span>•</span>
              <span>FPS: 60</span>
            </div>
          </div>
        </Card>

        {/* Live Terminal Output */}
        <Card className="p-0 bg-slate-950 border-slate-800 flex flex-col overflow-hidden font-mono text-xs">
          <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <TerminalIcon className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-[11px]">Playwright Execution Log Stream</span>
            </div>
            <span className="text-[10px] text-slate-400">PTY // xterm.js active</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            {liveLogs.map((log, idx) => {
              const isPass = log.includes('PASS');
              const isFail = log.includes('FAIL');
              const isRun = log.includes('RUNS');

              return (
                <div
                  key={idx}
                  className={`font-mono ${
                    isPass
                      ? 'text-emerald-400'
                      : isFail
                      ? 'text-rose-400 font-semibold'
                      : isRun
                      ? 'text-sky-300'
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </Card>
      </div>

      {/* Parallel Worker Pool Status Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Parallel Worker Pool (4 Instances)
          </h3>
          <span className="text-xs font-mono text-slate-400">Total CPU Threads: 8</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {execution.workers?.map((w) => (
            <Card key={w.workerId} className="p-4 bg-slate-900/90 border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-white">Worker #{w.workerId}</span>
                <Badge variant={w.status === 'running' ? 'warning' : 'success'} size="sm">
                  {w.status.toUpperCase()}
                </Badge>
              </div>

              <div className="text-[11px] text-slate-300 font-mono truncate">
                {w.currentTestCaseCode ? `${w.currentTestCaseCode}` : '8/8 Completed'}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {w.currentTestTitle || 'Idle / Ready for dispatch'}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${w.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{w.progressPercent}%</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Test Results Inspection Table */}
      <Card className="p-5 bg-slate-900/90 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Executed Test Results</h3>
            <p className="text-xs text-slate-400">Click any test to inspect DOM steps, screenshots, and AI diagnostics</p>
          </div>

          {/* Result Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('passed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'passed' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Passed ({results.filter((r) => r.status === 'passed').length})
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'failed' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Failed ({results.filter((r) => r.status === 'failed').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Test Case</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Worker</th>
                <th className="py-2.5 px-3">Browser</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredResults.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => openTestDetails(r)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <Badge variant={r.status === 'passed' ? 'success' : 'danger'} size="sm" dot>
                      {r.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{r.testCaseCode}</td>
                  <td className="py-3 px-3 font-medium text-white">{r.testTitle}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{r.durationMs}ms</td>
                  <td className="py-3 px-3 font-mono">Worker #{r.workerId}</td>
                  <td className="py-3 px-3 uppercase text-[11px]">{r.browser}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTestDetails(r);
                      }}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Test Details Side Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selectedTestResult?.testCaseCode || 'Test Details'}
        subtitle={selectedTestResult?.testTitle}
        width="2xl"
      >
        {selectedTestResult && (
          <div className="space-y-5 text-xs text-slate-300">
            {/* Drawer Tabs */}
            <Tabs
              tabs={[
                { id: 'overview', label: 'Step Timeline' },
                { id: 'screenshot', label: 'Captured Screenshot' },
                { id: 'logs', label: 'Console & Network' },
                { id: 'trace', label: 'Stack Trace' },
              ]}
              activeTab={drawerTab}
              onChange={setDrawerTab}
            />

            {/* Overview Tab */}
            {drawerTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400">Outcome:</span>
                    <Badge
                      variant={selectedTestResult.status === 'passed' ? 'success' : 'danger'}
                      size="sm"
                      className="ml-2"
                    >
                      {selectedTestResult.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="font-mono text-slate-400">Duration: {selectedTestResult.durationMs}ms</div>
                </div>

                {/* Steps Timeline */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                    Executed Step Log
                  </h4>
                  {selectedTestResult.stepLogs.map((step) => (
                    <div
                      key={step.stepNumber}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                        step.status === 'failed'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-emerald-400">0{step.stepNumber}</span>
                        <div>
                          <div className="font-medium text-slate-200">{step.action}</div>
                          {step.error && <div className="text-[11px] text-rose-400 mt-1 font-mono">{step.error}</div>}
                        </div>
                      </div>
                      <Badge variant={step.status === 'failed' ? 'danger' : 'success'} size="sm">
                        {step.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Quick Actions if Failed */}
                {selectedTestResult.status === 'failed' && (
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        closeDrawer();
                        navigate(`/projects/${projectId}/failures`);
                      }}
                      leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                      View AI Failure Diagnostics
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        closeDrawer();
                        navigate(`/projects/${projectId}/bugs`);
                      }}
                      leftIcon={<Bug className="w-4 h-4 text-rose-400" />}
                    >
                      File Jira Bug Ticket
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Screenshot Tab */}
            {drawerTab === 'screenshot' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                  Automated Viewport Capture at Assertion
                </h4>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={selectedTestResult.screenshotUrl || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80'}
                    alt="Viewport Screenshot"
                    className="w-full h-auto object-cover max-h-96"
                  />
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {drawerTab === 'logs' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider mb-2">
                    Browser Console Logs
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                    {selectedTestResult.consoleLogs?.map((c, idx) => (
                      <div key={idx} className={c.level === 'warn' ? 'text-amber-400' : 'text-slate-300'}>
                        [{c.timestamp}] [{c.level.toUpperCase()}] {c.message}
                      </div>
                    )) || <div className="text-slate-500">No console warnings recorded.</div>}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider mb-2">
                    Network Activity
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                    {selectedTestResult.networkLogs?.map((n, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300">
                        <span>{n.method} {n.url}</span>
                        <span className={n.status >= 400 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          HTTP {n.status} ({n.durationMs}ms)
                        </span>
                      </div>
                    )) || <div className="text-slate-500">No network entries available.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Stack Trace Tab */}
            {drawerTab === 'trace' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                  Playwright Stack Trace
                </h4>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-rose-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                  {selectedTestResult.stackTrace || 'No assertion failures recorded for this test.'}
                </pre>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
