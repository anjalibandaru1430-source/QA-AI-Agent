import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  PlayCircle,
  Percent,
  AlertTriangle,
  Bug,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useProjectStore } from '../../stores/useProjectStore';
import { useExecutionStore } from '../../stores/useExecutionStore';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { executions, fetchExecutions } = useExecutionStore();

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  useEffect(() => {
    if (projectId) {
      fetchExecutions(projectId);
    }
  }, [projectId, fetchExecutions]);

  // Chart Data
  const trendData = [
    { run: '#1038', passed: 24, failed: 4, skipped: 2 },
    { run: '#1039', passed: 26, failed: 3, skipped: 1 },
    { run: '#1040', passed: 27, failed: 3, skipped: 1 },
    { run: '#1041', passed: 28, failed: 2, skipped: 1 },
    { run: '#1042', passed: 29, failed: 2, skipped: 1 },
  ];

  const distributionData = [
    { name: 'Passed', value: 29, color: '#10b981' },
    { name: 'Failed', value: 2, color: '#f43f5e' },
    { name: 'Skipped', value: 1, color: '#94a3b8' },
  ];

  const durationData = [
    { run: '#1038', duration: 48 },
    { run: '#1039', duration: 44 },
    { run: '#1040', duration: 41 },
    { run: '#1041', duration: 39 },
    { run: '#1042', duration: 38.4 },
  ];

  const failureCategoriesData = [
    { category: 'Assertion Failure', count: 1 },
    { category: 'UI Error', count: 1 },
    { category: 'API Error', count: 0 },
    { category: 'Timeout', count: 0 },
    { category: 'Network', count: 0 },
    { category: 'Authentication', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Call to Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              {currentProject?.name || 'SauceDemo QA Project'}
            </h1>
            <Badge variant="success" size="sm">
              {currentProject?.settings.environment.toUpperCase() || 'DEMO'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Autonomous quality engineering pipeline active. 32 test cases mapped to 6 product requirements with 90.6% pass rate.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/prd`)}
          >
            Upload PRD
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/execution`)}
            leftIcon={<PlayCircle className="w-4 h-4" />}
          >
            Run All Playwright Tests
          </Button>
        </div>
      </div>

      {/* 8 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Projects"
          value="1"
          change="+100%"
          icon={<FolderKanban className="w-4 h-4" />}
          sparklineData={[0, 1, 1, 1, 1, 1]}
        />
        <StatCard
          title="Total Test Cases"
          value="32"
          change="+32 new"
          icon={<CheckSquare className="w-4 h-4" />}
          sparklineData={[10, 18, 24, 30, 32]}
        />
        <StatCard
          title="Tests Executed"
          value="160"
          change="+32 last run"
          icon={<PlayCircle className="w-4 h-4" />}
          sparklineData={[32, 64, 96, 128, 160]}
        />
        <StatCard
          title="Pass Rate"
          value="90.6%"
          change="+2.4%"
          isPositive={true}
          icon={<Percent className="w-4 h-4" />}
          sparklineData={[80, 84, 87, 88, 90.6]}
        />
        <StatCard
          title="Failed Tests"
          value="2"
          change="-1 improved"
          isPositive={true}
          icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
          sparklineData={[4, 3, 3, 2, 2]}
        />
        <StatCard
          title="Bugs Detected"
          value="2"
          change="AI Diagnosed"
          icon={<Bug className="w-4 h-4 text-amber-400" />}
          sparklineData={[1, 2, 2, 2, 2]}
        />
        <StatCard
          title="Jira Issues Created"
          value="1"
          change="QA-1042"
          icon={<Zap className="w-4 h-4 text-sky-400" />}
          sparklineData={[0, 0, 1, 1, 1]}
        />
        <StatCard
          title="AI Healing Rate"
          value="94%"
          change="Self-healing ready"
          icon={<Sparkles className="w-4 h-4 text-pink-400" />}
          sparklineData={[70, 80, 85, 90, 94]}
        />
      </div>

      {/* Analytics Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Execution Trend Line Chart */}
        <Card className="p-5 lg:col-span-2 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Test Execution Trend</h3>
              <p className="text-xs text-slate-400">Pass, fail, and skip trajectories across previous 5 runs</p>
            </div>
            <Badge variant="outline" size="sm" className="font-mono">
              Last 5 Runs
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="run" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Passed" />
                <Line type="monotone" dataKey="failed" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} name="Failed" />
                <Line type="monotone" dataKey="skipped" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" name="Skipped" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Test Distribution Donut Chart */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Test Distribution</h3>
              <span className="text-xs font-mono text-emerald-400">#1042</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Breakdown of latest execution status</p>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <div className="text-xl font-bold font-mono text-white">32</div>
                <div className="text-[10px] text-slate-400 uppercase">Tests</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
            <div>
              <div className="text-sm font-bold font-mono text-emerald-400">29</div>
              <div className="text-[10px] text-slate-400">Passed</div>
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-rose-400">2</div>
              <div className="text-[10px] text-slate-400">Failed</div>
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-slate-400">1</div>
              <div className="text-[10px] text-slate-400">Skipped</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Second Row: Execution Duration & Failure Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Execution Duration Bar */}
        <Card className="p-5 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Execution Duration (Seconds)</h3>
              <p className="text-xs text-slate-400">Parallel 4-worker runtime efficiency</p>
            </div>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="run" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="duration" fill="#10b981" radius={[4, 4, 0, 0]} name="Seconds" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Failure Categories Horizontal Bar */}
        <Card className="p-5 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Failure Root Cause Categories</h3>
              <p className="text-xs text-slate-400">AI diagnostics classification breakdown</p>
            </div>
            <Cpu className="w-4 h-4 text-rose-400" />
          </div>

          <div className="space-y-3">
            {failureCategoriesData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="font-mono text-slate-400">{item.count} issues</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / 2) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Executions Table */}
      <Card className="p-5 bg-slate-900/90 border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Test Executions</h3>
            <p className="text-xs text-slate-400">Detailed logs and artifacts for historical runs</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/execution`)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Execution Center
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Run #</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Pass Rate</th>
                <th className="py-2.5 px-3">Tests Passed / Total</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Browser</th>
                <th className="py-2.5 px-3">Triggered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr
                onClick={() => navigate(`/projects/${projectId}/execution`)}
                className="hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 font-mono font-bold text-white">#1042</td>
                <td className="py-3 px-3">
                  <Badge variant="success" size="sm" dot>
                    Completed
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-emerald-400">90.6%</td>
                <td className="py-3 px-3 font-mono">29 / 32</td>
                <td className="py-3 px-3 font-mono">38.4s</td>
                <td className="py-3 px-3">Chromium</td>
                <td className="py-3 px-3 text-slate-400">10 mins ago</td>
              </tr>
              <tr className="hover:bg-slate-800/50 cursor-pointer transition-colors text-slate-400">
                <td className="py-3 px-3 font-mono font-bold text-slate-300">#1041</td>
                <td className="py-3 px-3">
                  <Badge variant="success" size="sm">
                    Completed
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono">87.5%</td>
                <td className="py-3 px-3 font-mono">28 / 32</td>
                <td className="py-3 px-3 font-mono">39.0s</td>
                <td className="py-3 px-3">Chromium</td>
                <td className="py-3 px-3">1 hour ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
