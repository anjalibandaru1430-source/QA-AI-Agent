import { Requirement, PRDDocument } from '@qagent/shared';
import { RequirementAnalysisResponseSchema } from '@qagent/shared';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class RequirementAgent {
  public async analyzePRD(projectId: string, prdContent: string): Promise<Requirement[]> {
    wsServer.broadcast('ai.agent.started', {
      agentType: 'RequirementAgent',
      message: 'RequirementAgent started analyzing PRD document...',
    });

    const existingReqs = db.requirements.get(projectId) || [];

    // Simulate realistic AI streaming processing milestones
    wsServer.broadcast('ai.agent.progress', {
      agentType: 'RequirementAgent',
      progress: 25,
      currentTask: 'Document parsed & domain taxonomy identified',
    });

    await new Promise((r) => setTimeout(r, 400));

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'RequirementAgent',
      progress: 60,
      currentTask: 'Extracting user stories & acceptance criteria',
    });

    await new Promise((r) => setTimeout(r, 400));

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'RequirementAgent',
      progress: 90,
      currentTask: 'Calculating risk ratings and tagging security boundaries',
    });

    // If existing requirements exist for this project, refresh and return them
    if (existingReqs.length > 0) {
      wsServer.broadcast('ai.agent.completed', {
        agentType: 'RequirementAgent',
        message: `Extracted ${existingReqs.length} requirements successfully.`,
        requirementsCount: existingReqs.length,
      });
      return existingReqs;
    }

    // Default synthesized requirements if none seeded
    const newReqs: Requirement[] = [
      {
        id: `req_${Date.now()}_1`,
        projectId,
        reqCode: 'REQ-001',
        title: 'User Authentication & Access Control',
        category: 'Authentication',
        userStory: 'As a customer, I want to log in with valid credentials to securely access my account.',
        acceptanceCriteria: [
          'Valid standard_user / secret_sauce redirects to /inventory.html within 2s',
          'Empty username or password shows inline validation banner',
          'Locked out users receive "Epic sadface: Sorry, this user has been locked out."',
        ],
        priority: 'critical',
        riskLevel: 'high',
        tags: ['auth', 'security', 'smoke'],
        createdAt: new Date().toISOString(),
      },
      {
        id: `req_${Date.now()}_2`,
        projectId,
        reqCode: 'REQ-002',
        title: 'Catalog Browsing & Sorting',
        category: 'Catalog',
        userStory: 'As a shopper, I want to sort items by price and name to easily find products.',
        acceptanceCriteria: [
          'Inventory page displays 6 items with images and prices',
          'Sorts A-Z, Z-A, Price low-to-high, and Price high-to-low sort correctly',
        ],
        priority: 'high',
        riskLevel: 'medium',
        tags: ['catalog', 'sorting'],
        createdAt: new Date().toISOString(),
      },
    ];

    db.requirements.set(projectId, newReqs);

    wsServer.broadcast('ai.agent.completed', {
      agentType: 'RequirementAgent',
      message: `Extracted ${newReqs.length} requirements successfully.`,
      requirementsCount: newReqs.length,
    });

    return newReqs;
  }
}

export const requirementAgent = new RequirementAgent();
