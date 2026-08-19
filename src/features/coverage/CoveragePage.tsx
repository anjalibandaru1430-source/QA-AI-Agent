import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ListTree,
  CheckSquare,
  Activity,
  Flame,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useProjectStore } from '../../stores/useProjectStore';

export const CoveragePage: React.FC = () => {
  const { currentProject } = useProjectStore();

  const [expandedReq, setExpandedReq] = useState<string | null>('REQ-001');

  const traceabilityData = [
    {
      reqCode: 'REQ-001',
      title: 'User Authentication & Access Control',
      priority: 'critical',
      risk: 'high',
      scenarios: [
        {
          code: 'SC-AUTH-001',
          title: 'Valid Authentication Workflow for Standard Users',
          testCases: [
            { code: 'TC-AUTH-001', title: 'Standard user login with valid credentials', status: 'passed' },
          ],
        },
        {
          code: 'SC-AUTH-002',
          title: 'Invalid & Locked User Authentication Boundaries',
          testCases: [
            { code: 'TC-AUTH-002', title: 'Login attempt with empty username', status: 'passed' },
            { code: 'TC-AUTH-003', title: 'Login attempt with empty password', status: 'passed' },
            { code: 'TC-AUTH-004', title: 'Locked-out user login rejection', status: 'failed' },
          ],
        },
      ],
    },
    {
      reqCode: 'REQ-002',
      title: 'Product Catalog, Filtering & Sorting',
      priority: 'high',
      risk: 'medium',
      scenarios: [
        {
          code: 'SC-CAT-001',
          title: 'Product Catalog Sorting Integrity',
          testCases: [
            { code: 'TC-CAT-001', title: 'Default inventory page loads 6 items', status: 'passed' },
            { code: 'TC-CAT-002', title: 'Sort products Name: A to Z', status: 'passed' },
            { code: 'TC-CAT-004', title: 'Sort products Price: Low to High', status: 'passed' },
          ],
        },
      ],
    },
    {
      reqCode: 'REQ-003',
      title: 'Shopping Cart Management',
      priority: 'critical',
      risk: 'high',
      scenarios: [
        {
          code: 'SC-CART-001',
          title: 'Cart Mutations & Real-time Badge Synchronization',
          testCases: [
            { code: 'TC-CART-001', title: 'Add single item to cart', status: 'passed' },
            { code: 'TC-CART-002', title: 'Add multiple items to cart', status: 'passed' },
          ],
        },
      ],
    },
    {
      reqCode: 'REQ-004',
      title: 'Multi-Step Checkout & Tax Calculation',
      priority: 'critical',
      risk: 'critical',
      scenarios: [
        {
          code: 'SC-CHK-001',
          title: 'End-to-End Single & Multi-Item Checkout Flow',
          testCases: [
            { code: 'TC-CHK-001', title: 'Complete single-item checkout journey', status: 'passed' },
            { code: 'TC-CHK-005', title: '8% Tax and Subtotal arithmetic calculation', status: 'passed' },
          ],
        },
      ],
    },
  ];

  const riskHeatmapData = [
    { module: 'Checkout & Tax Calculation', criticality: 'Critical', complexity: 'High', failureHistory: '0 Failures', coverage: '98%', riskScore: 'Low (Well Guarded)' },
    { module: 'User Authentication', criticality: 'Critical', complexity: 'Medium', failureHistory: '1 Mismatch (Lockout)', coverage: '96%', riskScore: 'High (Action Required)' },
    { module: 'Shopping Cart Mutation', criticality: 'High', complexity: 'Medium', failureHistory: '0 Failures', coverage: '95%', riskScore: 'Low' },
    { module: 'Product Catalog Sorting', criticality: 'High', complexity: 'Low', failureHistory: '0 Failures', coverage: '94%', riskScore: 'Low' },
    { module: 'Sidebar & Session Reset', criticality: 'Medium', complexity: 'Low', failureHistory: '0 Failures', coverage: '93%', riskScore: 'Low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          End-to-End Traceability & Risk Heatmap
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Full traceability chain from PRD requirements to test scenarios, Playwright automation cases, and live execution statuses.
        </p>
      </div>

      {/* Traceability Tree */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Requirement → Scenario → Test Case Traceability Matrix
        </div>

        <div className="space-y-3">
          {traceabilityData.map((req) => {
            const isExp = expandedReq === req.reqCode;

            return (
              <div key={req.reqCode} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div
                  onClick={() => setExpandedReq(isExp ? null : req.reqCode)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {req.reqCode}
                    </span>
                    <span className="text-sm font-semibold text-white">{req.title}</span>
                    <Badge variant={req.priority === 'critical' ? 'danger' : 'warning'} size="sm">
                      {req.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{req.scenarios.length} Scenarios</span>
                </div>

                {isExp && (
                  <div className="pl-4 border-l-2 border-slate-800 space-y-3 pt-2">
                    {req.scenarios.map((sc) => (
                      <div key={sc.code} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <ListTree className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-mono text-emerald-400 font-bold">{sc.code}:</span>
                          <span className="text-slate-200 font-medium">{sc.title}</span>
                        </div>

                        <div className="pl-6 space-y-1.5">
                          {sc.testCases.map((tc) => (
                            <div
                              key={tc.code}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-mono text-slate-300 font-bold">{tc.code}</span>
                                <span className="text-slate-300">{tc.title}</span>
                              </div>
                              <Badge variant={tc.status === 'passed' ? 'success' : 'danger'} size="sm" dot>
                                {tc.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Risk Analysis Heatmap */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Multi-Factor Risk Assessment Heatmap</span>
          </div>
          <Badge variant="purple" size="sm">5 Key Vectors</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Feature Domain</th>
                <th className="py-2.5 px-3">Business Criticality</th>
                <th className="py-2.5 px-3">Complexity</th>
                <th className="py-2.5 px-3">Defect History</th>
                <th className="py-2.5 px-3">Test Coverage</th>
                <th className="py-2.5 px-3">Overall Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {riskHeatmapData.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{r.module}</td>
                  <td className="py-3 px-3">{r.criticality}</td>
                  <td className="py-3 px-3 text-slate-400">{r.complexity}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{r.failureHistory}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{r.coverage}</td>
                  <td className="py-3 px-3">
                    <Badge variant={r.riskScore.includes('High') ? 'danger' : 'success'} size="sm">
                      {r.riskScore}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
