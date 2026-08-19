import { Execution, TestResult, WorkerState } from '../shared/index.js';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';
import { failureAnalysisAgent } from '../agents/FailureAnalysisAgent.js';
import { bugReportAgent } from '../agents/BugReportAgent.js';

export class PlaywrightRunner {
  private activeExecutions: Map<string, boolean> = new Map();

  public async runExecution(projectId: string, browser = 'chromium'): Promise<Execution> {
    const project = db.projects.get(projectId);
    const testCases = db.testCases.get(projectId) || [];
    const executionId = `exec_${Date.now()}`;
    const executionNumber = (db.executions.get(projectId)?.length || 0) + 1043;

    const initialWorkers: WorkerState[] = [
      { workerId: 1, status: 'idle', browser: 'chromium', progressPercent: 0, testsCompleted: 0 },
      { workerId: 2, status: 'idle', browser: 'chromium', progressPercent: 0, testsCompleted: 0 },
      { workerId: 3, status: 'idle', browser: 'chromium', progressPercent: 0, testsCompleted: 0 },
      { workerId: 4, status: 'idle', browser: 'chromium', progressPercent: 0, testsCompleted: 0 },
    ];

    const execution: Execution = {
      id: executionId,
      projectId,
      executionNumber,
      status: 'running',
      browser: browser as any,
      environment: project?.settings.environment || 'demo',
      executionMode: project?.settings.executionMode || 'local',
      totalTests: testCases.length || 32,
      completedTests: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      runningCount: 4,
      progressPercent: 0,
      durationMs: 0,
      startedAt: new Date().toISOString(),
      results: [],
      workers: initialWorkers,
      logs: [
        `[${new Date().toLocaleTimeString()}] [Execution #${executionNumber}] Initializing Playwright test runner with 4 parallel workers...`,
        `[${new Date().toLocaleTimeString()}] [Worker 1] Launched Chromium v124.0.6367.60`,
        `[${new Date().toLocaleTimeString()}] [Worker 2] Launched Chromium v124.0.6367.60`,
        `[${new Date().toLocaleTimeString()}] [Worker 3] Launched Chromium v124.0.6367.60`,
        `[${new Date().toLocaleTimeString()}] [Worker 4] Launched Chromium v124.0.6367.60`,
      ],
    };

    const existing = db.executions.get(projectId) || [];
    existing.unshift(execution);
    db.executions.set(projectId, existing);

    this.activeExecutions.set(executionId, true);

    // Broadcast execution started
    wsServer.broadcast('execution.started', { execution });

    // Run execution in background async loop so API returns immediately and WebSocket streams progress
    this.streamExecutionProgress(execution, testCases).catch((err) => {
      console.error('Execution stream error:', err);
    });

    return execution;
  }

  public cancelExecution(executionId: string): boolean {
    if (this.activeExecutions.has(executionId)) {
      this.activeExecutions.set(executionId, false);
      return true;
    }
    return false;
  }

  private async streamExecutionProgress(execution: Execution, testCases: any[]) {
    const total = testCases.length || 32;
    const workerCount = 4;
    const startTime = Date.now();

    // Map test cases into worker batches
    for (let i = 0; i < total; i++) {
      if (!this.activeExecutions.get(execution.id)) {
        execution.status = 'cancelled';
        wsServer.broadcast('execution.progress', { execution });
        return;
      }

      const tc = testCases[i] || {
        id: `tc_${i}`,
        testCaseCode: `TC-GEN-${String(i + 1).padStart(3, '0')}`,
        title: `Test case #${i + 1}`,
      };

      const workerIndex = i % workerCount;
      const worker = execution.workers[workerIndex];

      worker.status = 'running';
      worker.currentTestCaseCode = tc.testCaseCode;
      worker.currentTestTitle = tc.title;
      worker.currentStep = 'Navigating to application view';

      const isFailure = tc.testCaseCode === 'TC-AUTH-004' || i === 12; // Controlled realistic failure

      const logPrefix = `[${new Date().toLocaleTimeString()}] [Worker ${worker.workerId}]`;
      const startLog = `${logPrefix} RUNS ${tc.testCaseCode} ${tc.title}`;
      execution.logs.push(startLog);
      wsServer.broadcast('execution.log', { log: startLog, executionId: execution.id });

      // Simulate step-by-step actions
      const stepDuration = Math.floor(Math.random() * 150) + 120;
      await new Promise((r) => setTimeout(r, stepDuration));

      const step1Log = `${logPrefix} > Step 1: Navigating to target view`;
      execution.logs.push(step1Log);
      wsServer.broadcast('test.step', {
        testCaseCode: tc.testCaseCode,
        step: 1,
        action: 'Navigating to URL',
        status: 'passed',
      });

      await new Promise((r) => setTimeout(r, stepDuration));

      if (isFailure) {
        execution.failedCount++;
        const failLog = `${logPrefix} FAIL ${tc.testCaseCode} - AssertionError: Expected banner mismatch`;
        execution.logs.push(failLog);
        wsServer.broadcast('test.failed', {
          testCaseCode: tc.testCaseCode,
          error: 'AssertionError: Expected text "Sorry, this user has been locked out." but received "User account suspended by admin"',
        });

        const failedResult: TestResult = {
          id: `res_${Date.now()}_${i}`,
          executionId: execution.id,
          testCaseId: tc.id,
          testCaseCode: tc.testCaseCode,
          testTitle: tc.title,
          status: 'failed',
          durationMs: 1120,
          workerId: worker.workerId,
          browser: 'chromium',
          startedAt: new Date(Date.now() - 1120).toISOString(),
          completedAt: new Date().toISOString(),
          stepLogs: [
            { timestamp: new Date().toLocaleTimeString(), stepNumber: 1, action: 'Navigate to login', status: 'passed' },
            { timestamp: new Date().toLocaleTimeString(), stepNumber: 2, action: 'Enter credentials', status: 'passed' },
            { timestamp: new Date().toLocaleTimeString(), stepNumber: 3, action: 'Assert error message', status: 'failed', error: 'Banner text mismatch' },
          ],
          screenshotUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80',
          consoleLogs: [
            { level: 'warn', message: 'API POST /api/v1/auth/login returned HTTP 403 Forbidden with custom error code ACC_SUSPENDED', timestamp: new Date().toLocaleTimeString() },
          ],
          networkLogs: [
            { url: 'https://www.saucedemo.com/api/v1/auth/login', method: 'POST', status: 403, durationMs: 210 },
          ],
          stackTrace: 'AssertionError: Timed out waiting for expect(locator).toHaveText()',
        };

        execution.results.push(failedResult);

        // Auto trigger Failure Analysis & Jira Bug
        failureAnalysisAgent.analyzeFailure(execution.projectId, failedResult).then((fa) => {
          bugReportAgent.createBugReport(execution.projectId, failedResult, fa);
        });
      } else {
        execution.passedCount++;
        const passLog = `${logPrefix} PASS ${tc.testCaseCode} (${stepDuration * 2}ms)`;
        execution.logs.push(passLog);
        wsServer.broadcast('test.passed', { testCaseCode: tc.testCaseCode, durationMs: stepDuration * 2 });

        const passedResult: TestResult = {
          id: `res_${Date.now()}_${i}`,
          executionId: execution.id,
          testCaseId: tc.id,
          testCaseCode: tc.testCaseCode,
          testTitle: tc.title,
          status: 'passed',
          durationMs: stepDuration * 2,
          workerId: worker.workerId,
          browser: 'chromium',
          startedAt: new Date(Date.now() - stepDuration * 2).toISOString(),
          completedAt: new Date().toISOString(),
          stepLogs: [
            { timestamp: new Date().toLocaleTimeString(), stepNumber: 1, action: 'Navigate to target', status: 'passed' },
            { timestamp: new Date().toLocaleTimeString(), stepNumber: 2, action: 'Perform interaction', status: 'passed' },
            { timestamp: new Date().toLocaleTimeString(), stepNumber: 3, action: 'Verify assertions', status: 'passed' },
          ],
          screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          consoleLogs: [{ level: 'info', message: 'Assertion successful', timestamp: new Date().toLocaleTimeString() }],
          networkLogs: [{ url: 'https://www.saucedemo.com/inventory.html', method: 'GET', status: 200, durationMs: 45 }],
        };

        execution.results.push(passedResult);
      }

      execution.completedTests++;
      worker.testsCompleted++;
      worker.progressPercent = Math.round((worker.testsCompleted / (total / workerCount)) * 100);
      execution.progressPercent = Math.round((execution.completedTests / total) * 100);
      execution.durationMs = Date.now() - startTime;

      wsServer.broadcast('execution.progress', {
        executionId: execution.id,
        progressPercent: execution.progressPercent,
        completedTests: execution.completedTests,
        passedCount: execution.passedCount,
        failedCount: execution.failedCount,
        workers: execution.workers,
      });
    }

    // Finalize execution
    execution.status = 'completed';
    execution.completedAt = new Date().toISOString();
    execution.runningCount = 0;
    execution.workers.forEach((w) => {
      w.status = 'completed';
      w.progressPercent = 100;
    });

    const completionLog = `[${new Date().toLocaleTimeString()}] [Execution #${execution.executionNumber}] Finished in ${(execution.durationMs / 1000).toFixed(1)}s. ${execution.passedCount} Passed, ${execution.failedCount} Failed, ${execution.skippedCount} Skipped.`;
    execution.logs.push(completionLog);

    wsServer.broadcast('execution.completed', { execution });
    this.activeExecutions.delete(execution.id);
  }
}

export const playwrightRunner = new PlaywrightRunner();
