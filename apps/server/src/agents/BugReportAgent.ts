import { BugReport, TestResult, FailureAnalysis } from '@qagent/shared';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class BugReportAgent {
  public async createBugReport(
    projectId: string,
    testResult: TestResult,
    analysis?: FailureAnalysis
  ): Promise<BugReport> {
    const existingBugs = db.bugs.get(projectId) || [];
    const bugCode = `BUG-${String(existingBugs.length + 1).padStart(3, '0')}`;

    const newBug: BugReport = {
      id: `bug_${Date.now()}`,
      projectId,
      bugCode,
      title: `[SauceDemo] ${testResult.testTitle} - ${analysis?.category || 'Assertion Failure'}`,
      description: `Automated Playwright execution detected failure during step execution for ${testResult.testCaseCode}.\n\nAI Diagnostics: ${analysis?.rootCause || 'Unexpected error banner text mismatch'}`,
      severity: 'high',
      priority: 'high',
      status: 'detected',
      testCaseCode: testResult.testCaseCode,
      stepsToReproduce: testResult.stepLogs.map((s) => `${s.stepNumber}. ${s.action}`),
      expectedResult: 'All assertions pass and expected navigation finishes within SLA.',
      actualResult: testResult.stepLogs.find((s) => s.status === 'failed')?.error || 'Assertion failed',
      environment: 'Demo Staging',
      browser: testResult.browser,
      aiRootCause: analysis?.rootCause || 'API response mismatch with UI assertion criteria',
      screenshotUrl: testResult.screenshotUrl,
      stackTrace: testResult.stackTrace,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    existingBugs.unshift(newBug);
    db.bugs.set(projectId, existingBugs);

    wsServer.broadcast('ai.agent.completed', {
      agentType: 'BugReportAgent',
      message: `Generated bug report ${bugCode} with reproduction steps and stack trace.`,
      bug: newBug,
    });

    return newBug;
  }
}

export const bugReportAgent = new BugReportAgent();
