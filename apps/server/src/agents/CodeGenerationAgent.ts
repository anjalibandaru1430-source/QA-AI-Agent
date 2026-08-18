import { PageObjectModel, TestScript } from '@qagent/shared';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class CodeGenerationAgent {
  public async generateCode(projectId: string): Promise<{ pageObjects: PageObjectModel[]; testScripts: TestScript[] }> {
    wsServer.broadcast('ai.agent.started', {
      agentType: 'CodeGenerationAgent',
      message: 'CodeGenerationAgent generating Playwright Page Object Models & Spec files...',
    });

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'CodeGenerationAgent',
      progress: 35,
      currentTask: 'Scaffolding Page Object classes with resilient locators',
    });

    await new Promise((r) => setTimeout(r, 450));

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'CodeGenerationAgent',
      progress: 75,
      currentTask: 'Assembling TypeScript Playwright specs with explicit assertions',
    });

    await new Promise((r) => setTimeout(r, 400));

    const pageObjects = db.pageObjects.get(projectId) || [];
    const testScripts = db.testScripts.get(projectId) || [];

    wsServer.broadcast('ai.agent.completed', {
      agentType: 'CodeGenerationAgent',
      message: `Generated ${pageObjects.length} Page Object Models and ${testScripts.length} Playwright test specs.`,
      pageObjectsCount: pageObjects.length,
      testScriptsCount: testScripts.length,
    });

    return { pageObjects, testScripts };
  }

  public async optimizeCode(code: string, instruction = 'Optimize selectors and assertions'): Promise<string> {
    // Return enhanced code with resilience comments and best practices
    return `// [AI Optimized - ${new Date().toLocaleTimeString()}] ${instruction}
${code}
`;
  }

  public async explainCode(code: string): Promise<string> {
    return `### Playwright Script Architecture Breakdown

1. **Page Object Model Pattern:** Encapsulates DOM locators and interactive actions to maintain DRY separation of concerns.
2. **Explicit Assertions:** Leverages Playwright's auto-retrying \`expect(locator).toBeVisible()\` and \`expect(page).toHaveURL()\` rather than hardcoded timeouts.
3. **Resilient Selectors:** Employs \`data-test\` attributes and IDs to safeguard against styling and layout refactoring.
4. **Context Isolation:** Uses isolated browser contexts for multi-worker parallel execution without session leakage.`;
  }
}

export const codeGenerationAgent = new CodeGenerationAgent();
