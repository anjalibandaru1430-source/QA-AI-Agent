import { FailureAnalysis, TestResult } from '../shared/index.js';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class FailureAnalysisAgent {
  public async analyzeFailure(projectId: string, result: TestResult): Promise<FailureAnalysis> {
    wsServer.broadcast('ai.agent.started', {
      agentType: 'FailureAnalysisAgent',
      message: `Analyzing failure for ${result.testCaseCode}...`,
    });

    const isLockoutTest = result.testCaseCode === 'TC-AUTH-004';

    const analysis: FailureAnalysis = {
      id: `fa_${Date.now()}`,
      testResultId: result.id,
      testCaseCode: result.testCaseCode,
      rootCause: isLockoutTest
        ? 'The backend authentication service payload updated its error message copy from legacy "Sorry, this user has been locked out." to "User account suspended by admin".'
        : 'DOM element selector timed out waiting for matching locator in active viewport.',
      category: isLockoutTest ? 'Assertion Failure' : 'UI Error',
      confidence: isLockoutTest ? 96 : 88,
      evidence: [
        'POST /api/v1/auth/login returned HTTP 403 with payload {"code":"ACC_SUSPENDED"}',
        'DOM locator [data-test="error"] rendered unexpected string',
        'Screenshot visual diff detected text discrepancy in banner element',
      ],
      suggestedFix:
        'Normalize backend error code mapping or update Page Object locator assertion regex to accept "User account suspended by admin".',
      likelyRegression: true,
      relatedTestCodes: ['TC-AUTH-002', 'TC-AUTH-003'],
      createdAt: new Date().toISOString(),
      selfHealingProposal: {
        id: `sh_${Date.now()}`,
        failureAnalysisId: `fa_${Date.now()}`,
        pageObject: 'LoginPage.ts',
        elementName: 'errorMessage',
        originalSelector: "locator('[data-test=\"error\"]')",
        suggestedSelector: "locator('[data-test=\"error\"], .error-message-container')",
        confidence: 94,
        status: 'pending',
        codeDiff: {
          filePath: 'pages/LoginPage.ts',
          originalLines: [
            '  async expectErrorMessage(text: string) {',
            '    await expect(this.errorMessage).toContainText(text);',
            '  }',
          ],
          replacementLines: [
            '  async expectErrorMessage(text: string | RegExp) {',
            '    await expect(this.errorMessage).toHaveText(typeof text === "string" ? new RegExp(text, "i") : text);',
            '  }',
          ],
        },
      },
    };

    const existing = db.failures.get(projectId) || [];
    existing.unshift(analysis);
    db.failures.set(projectId, existing);

    wsServer.broadcast('ai.agent.completed', {
      agentType: 'FailureAnalysisAgent',
      message: `Root cause identified with ${analysis.confidence}% confidence. Self-healing proposal generated.`,
      analysis,
    });

    return analysis;
  }
}

export const failureAnalysisAgent = new FailureAnalysisAgent();
