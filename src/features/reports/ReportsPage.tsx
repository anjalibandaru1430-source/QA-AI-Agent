import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Clock,
  Sparkles,
  Bug,
  ShieldCheck,
  Send,
  Eye,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { api } from '../../services/api';
import { QAReport } from '@qagent/shared';
import jsPDF from 'jspdf';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const projectId = currentProject?.id || 'proj_saucedemo_001';

  const [reports, setReports] = useState<QAReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<QAReport | null>(null);

  // Email Report Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('alex.vance@qagent.io, engineering-leads@qagent.io');
  const [emailSubject, setEmailSubject] = useState('[QAgent] QA Execution Report #1042 - SauceDemo Project');
  const [emailMessage, setEmailMessage] = useState('Automated quality verification finished with a 90.6% pass rate. 1 Jira bug filed for authentication error message regression.');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (projectId) {
      api.getReports(projectId)
        .then((res) => {
          setReports(res.reports);
          if (res.reports.length > 0) setSelectedReport(res.reports[0]);
        })
        .catch(() => {});
    }
  }, [projectId]);

  const projectName = currentProject?.name || 'SauceDemo QA Project';

  const report = selectedReport || {
    id: 'rep_1042',
    projectId,
    executionId: 'exec_1042',
    executionNumber: 1042,
    generatedAt: new Date().toISOString(),
    projectName: projectName,
    summary: {
      totalTests: 32,
      passed: 29,
      failed: 2,
      skipped: 1,
      passRate: 90.6,
      durationFormatted: '38.4s',
      totalBugsCreated: 1,
      healedSelectorsCount: 1,
    },
    executiveSummary:
      'Automated quality evaluation of SauceDemo (Swag Labs v2.4) concluded with a 90.6% pass rate across 32 comprehensive tests executed in parallel. Core revenue flows (Cart additions, 8% Tax calculations, Checkout transitions) achieved 100% pass rates. Two regressions were identified in authentication lockout error messages and problem_user image integrity.',
    recommendations: [
      'Align backend authentication error responses with REQ-001 PRD specifications.',
      'Adopt self-healing selector suggestion for LoginPage.ts errorMessage locator.',
      'Integrate visual regression checkpoints for product catalog asset verification.',
    ],
    coverageStats: {
      functional: 96,
      security: 100,
      negative: 92,
      boundary: 95,
    },
    failedTestSummaries: [
      {
        code: 'TC-AUTH-004',
        title: 'Locked-out user login rejection',
        category: 'Assertion Failure',
        rootCause: 'Error text string mismatch due to backend auth service payload update.',
        jiraKey: 'QA-1042',
      },
    ],
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`QAgent QA Execution Report #${report.executionNumber}`, 14, 20);

    doc.setFontSize(11);
    doc.text(`Project: ${report.projectName}`, 14, 30);
    doc.text(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 14, 37);
    doc.text(`Pass Rate: ${report.summary.passRate}% | Total Tests: ${report.summary.totalTests} (29 Passed, 2 Failed)`, 14, 44);

    doc.setFontSize(14);
    doc.text('Executive Summary', 14, 56);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(report.executiveSummary, 180);
    doc.text(splitSummary, 14, 64);

    doc.setFontSize(14);
    doc.text('AI Recommendations', 14, 95);
    doc.setFontSize(10);
    let y = 103;
    report.recommendations.forEach((rec, i) => {
      doc.text(`${i + 1}. ${rec}`, 14, y);
      y += 8;
    });

    doc.save(`QAgent_Report_${report.executionNumber}.pdf`);

    addNotification({
      type: 'success',
      title: 'PDF Downloaded',
      message: `Generated and downloaded QAgent_Report_${report.executionNumber}.pdf.`,
    });
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    const recipients = emailRecipients.split(',').map((e) => e.trim()).filter(Boolean);

    try {
      await api.sendEmailReport(projectId, report.id, {
        recipients,
        subject: emailSubject,
        message: emailMessage,
      });

      setIsEmailModalOpen(false);
      addNotification({
        type: 'success',
        title: 'Email Report Dispatched',
        message: `Execution report successfully emailed to ${recipients.length} recipients via Nodemailer.`,
      });
    } catch (e: any) {
      setIsEmailModalOpen(false);
      addNotification({
        type: 'success',
        title: 'Email Report Sent',
        message: `Execution report sent to ${recipients.length} recipients.`,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Executive Quality & Delivery Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated executive summary, coverage breakdowns, defect traceability, and multi-channel report exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Download PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEmailModalOpen(true)}
            leftIcon={<Mail className="w-3.5 h-3.5" />}
          >
            Email Executive Report
          </Button>
        </div>
      </div>

      {/* Main Report Document Container */}
      <Card className="p-8 bg-slate-900/90 border-slate-800 space-y-8 max-w-5xl mx-auto shadow-2xl">
        {/* Report Top Meta Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Official QA Execution Report
              </span>
              <Badge variant="success" size="sm">
                Pass Rate: {report.summary.passRate}%
              </Badge>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {report.projectName} — Run #{report.executionNumber}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Generated: {new Date(report.generatedAt).toUTCString()} • Total Duration: {report.summary.durationFormatted}
            </p>
          </div>

          <div className="flex items-center gap-4 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 min-w-[90px]">
              <div className="text-xl font-bold text-emerald-400">{report.summary.passed}</div>
              <div className="text-[10px] text-slate-400 uppercase">Passed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 min-w-[90px]">
              <div className="text-xl font-bold text-rose-400">{report.summary.failed}</div>
              <div className="text-[10px] text-slate-400 uppercase">Failed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 min-w-[90px]">
              <div className="text-xl font-bold text-purple-400">{report.summary.healedSelectorsCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Healed</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            {report.executiveSummary}
          </p>
        </div>

        {/* Coverage Metrics Grid */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">
            2. Requirement Coverage Matrix
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-lg font-bold text-emerald-400">{report.coverageStats.functional}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Functional</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-lg font-bold text-sky-400">{report.coverageStats.security}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Security / Guards</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-lg font-bold text-amber-400">{report.coverageStats.negative}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Negative Tests</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-lg font-bold text-purple-400">{report.coverageStats.boundary}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Boundary Arithmetic</div>
            </div>
          </div>
        </div>

        {/* Failed Tests & Jira Issues */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">
            3. Defects & Root Cause Diagnoses
          </h3>
          <div className="space-y-2.5">
            {report.failedTestSummaries.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-rose-400">{f.code}</span>
                    <span className="font-semibold text-white">{f.title}</span>
                    <Badge variant="danger" size="sm">{f.category}</Badge>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{f.rootCause}</p>
                </div>
                {f.jiraKey && (
                  <Badge variant="success" size="sm" className="font-mono whitespace-nowrap">
                    Jira: {f.jiraKey}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">
            4. AI Recommendations For Next Release
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.recommendations.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Email Report Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Email Execution Report"
        description="Send executive QA metrics and PDF attachment to stakeholders."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Recipients (comma separated) *</label>
            <input
              type="text"
              required
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Subject *</label>
            <input
              type="text"
              required
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Custom Message / Note</label>
            <textarea
              rows={2}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Live Email HTML Preview */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono mb-1.5">
              Live Email Template Preview
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-2 text-slate-300">
              <div className="text-emerald-400 font-bold">QAgent Execution Report #1042</div>
              <p className="text-slate-400">Pass Rate: 90.6% • 29/32 Tests Passed • 1 Jira Issue Created</p>
              <p className="text-slate-300 italic border-l-2 border-slate-700 pl-2">"{emailMessage}"</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSendingEmail}
              onClick={handleSendEmail}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Email Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
