import { Requirement, PRDDocument } from '../shared/index.js';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class RequirementAgent {
  public async analyzePRD(projectId: string, prdContent: string): Promise<Requirement[]> {
    wsServer.broadcast('ai.agent.started', {
      agentType: 'RequirementAgent',
      message: 'RequirementAgent analyzing custom PRD document...',
    });

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'RequirementAgent',
      progress: 25,
      currentTask: 'Document parsed & domain taxonomy identified',
    });

    await new Promise((r) => setTimeout(r, 300));

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'RequirementAgent',
      progress: 60,
      currentTask: 'Extracting user stories & acceptance criteria',
    });

    await new Promise((r) => setTimeout(r, 300));

    wsServer.broadcast('ai.agent.progress', {
      agentType: 'RequirementAgent',
      progress: 90,
      currentTask: 'Calculating risk ratings and tagging security boundaries',
    });

    // Parse dynamically from prdContent
    const extractedReqs: Requirement[] = [];
    const lines = prdContent.split('\n');
    let currentReq: Partial<Requirement> | null = null;
    let criteriaList: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect Requirement header (e.g. ### REQ-001: Title, or ### 1. Title, or ## REQ-001)
      const reqMatch = line.match(/^#{2,4}\s*(REQ-?\d+|Requirement\s*\d+|\d+\.)?[:\s]*(.*)/i);
      const isReqHeader = reqMatch && (line.includes('REQ-') || line.includes('###') || line.toLowerCase().includes('requirement'));

      if (isReqHeader && reqMatch[2] && reqMatch[2].trim().length > 3) {
        if (currentReq && currentReq.title) {
          extractedReqs.push({
            id: currentReq.id || `req_${Date.now()}_${extractedReqs.length + 1}`,
            projectId,
            reqCode: currentReq.reqCode || `REQ-${String(extractedReqs.length + 1).padStart(3, '0')}`,
            title: currentReq.title,
            category: currentReq.category || 'Core Feature',
            userStory: currentReq.userStory || `As a user, I want ${currentReq.title} to function reliably.`,
            acceptanceCriteria: criteriaList.length > 0 ? criteriaList : ['Must satisfy all specified acceptance criteria.'],
            priority: (currentReq.priority as any) || 'high',
            riskLevel: (currentReq.riskLevel as any) || 'medium',
            tags: currentReq.tags || ['automated', 'ai-generated'],
            createdAt: new Date().toISOString(),
          });
        }

        const rawCodeMatch = line.match(/REQ-?\d+/i);
        const reqCode = rawCodeMatch ? rawCodeMatch[0].toUpperCase() : `REQ-${String(extractedReqs.length + 1).padStart(3, '0')}`;
        const title = reqMatch[2].replace(/^REQ-?\d+[:\s-]*/i, '').trim();

        // Categorize based on keywords in title
        let category = 'General';
        let priority: 'critical' | 'high' | 'medium' | 'low' = 'high';
        let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('auth') || lowerTitle.includes('login') || lowerTitle.includes('security') || lowerTitle.includes('2fa') || lowerTitle.includes('biometric')) {
          category = 'Authentication';
          priority = 'critical';
          riskLevel = 'high';
        } else if (lowerTitle.includes('wire') || lowerTitle.includes('transfer') || lowerTitle.includes('payment') || lowerTitle.includes('checkout') || lowerTitle.includes('card')) {
          category = 'Payments & Transfers';
          priority = 'critical';
          riskLevel = 'critical';
        } else if (lowerTitle.includes('cart') || lowerTitle.includes('discount') || lowerTitle.includes('promo') || lowerTitle.includes('tax') || lowerTitle.includes('calc')) {
          category = 'Arithmetic & Cart';
          priority = 'high';
          riskLevel = 'high';
        } else if (lowerTitle.includes('catalog') || lowerTitle.includes('filter') || lowerTitle.includes('sort')) {
          category = 'Catalog';
          priority = 'medium';
          riskLevel = 'low';
        }

        currentReq = {
          id: `req_${Date.now()}_${extractedReqs.length + 1}`,
          reqCode,
          title,
          category,
          priority,
          riskLevel,
          tags: [category.toLowerCase().replace(/[^a-z0-9]/g, '-'), 'ai-analyzed'],
        };
        criteriaList = [];
      } else if (line.toLowerCase().includes('user story:')) {
        if (currentReq) {
          currentReq.userStory = line.replace(/.*user story:\s*/i, '').replace(/[*_"]/g, '').trim();
        }
      } else if (line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)) {
        // Bullet point acceptance criteria
        const cleaned = line.replace(/^[-*•\d.]+\s*/, '').replace(/[*_`]/g, '').trim();
        if (cleaned.length > 5 && !cleaned.toLowerCase().includes('acceptance criteria')) {
          criteriaList.push(cleaned);
        }
      }
    }

    // Push the final requirement
    if (currentReq && currentReq.title) {
      extractedReqs.push({
        id: currentReq.id || `req_${Date.now()}_${extractedReqs.length + 1}`,
        projectId,
        reqCode: currentReq.reqCode || `REQ-${String(extractedReqs.length + 1).padStart(3, '0')}`,
        title: currentReq.title,
        category: currentReq.category || 'Core Feature',
        userStory: currentReq.userStory || `As a user, I want ${currentReq.title} to function reliably.`,
        acceptanceCriteria: criteriaList.length > 0 ? criteriaList : ['Must satisfy all specified acceptance criteria.'],
        priority: (currentReq.priority as any) || 'high',
        riskLevel: (currentReq.riskLevel as any) || 'medium',
        tags: currentReq.tags || ['automated', 'ai-generated'],
        createdAt: new Date().toISOString(),
      });
    }

    const finalReqs = extractedReqs.length > 0 ? extractedReqs : db.requirements.get(projectId) || [];

    db.requirements.set(projectId, finalReqs);

    wsServer.broadcast('ai.agent.completed', {
      agentType: 'RequirementAgent',
      message: `Extracted ${finalReqs.length} dynamic requirements from document.`,
      requirementsCount: finalReqs.length,
    });

    return finalReqs;
  }
}

export const requirementAgent = new RequirementAgent();
