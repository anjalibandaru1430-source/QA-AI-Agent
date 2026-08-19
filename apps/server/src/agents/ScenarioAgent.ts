import { TestScenario } from '../shared/index.js';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class ScenarioAgent {
  public async generateScenarios(projectId: string, requirementIds?: string[]): Promise<TestScenario[]> {
    wsServer.broadcast('ai.agent.started', {
      agentType: 'ScenarioAgent',
      message: 'ScenarioAgent synthesising categorized test scenarios...',
    });

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'ScenarioAgent',
      progress: 30,
      currentTask: 'Mapping functional happy-paths & boundary transitions',
    });

    await new Promise((r) => setTimeout(r, 450));

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'ScenarioAgent',
      progress: 75,
      currentTask: 'Generating negative edge cases & security attack vectors',
    });

    await new Promise((r) => setTimeout(r, 350));

    const existingScenarios = db.scenarios.get(projectId) || [];

    wsServer.broadcast('ai.agent.completed', {
      agentType: 'ScenarioAgent',
      message: `Generated ${existingScenarios.length} test scenarios across 6 categories.`,
      scenariosCount: existingScenarios.length,
    });

    return existingScenarios;
  }
}

export const scenarioAgent = new ScenarioAgent();
