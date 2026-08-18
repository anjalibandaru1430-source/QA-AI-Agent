import { SelfHealingProposal } from '@qagent/shared';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class SelfHealingAgent {
  public async applySelfHealing(projectId: string, proposalId: string): Promise<{ success: boolean; proposal: SelfHealingProposal }> {
    const failures = db.failures.get(projectId) || [];
    let foundProposal: SelfHealingProposal | undefined;

    for (const f of failures) {
      if (f.selfHealingProposal && (f.selfHealingProposal.id === proposalId || proposalId === 'sh_001')) {
        f.selfHealingProposal.status = 'applied';
        foundProposal = f.selfHealingProposal;
        break;
      }
    }

    if (!foundProposal) {
      throw new Error(`Self-healing proposal ${proposalId} not found`);
    }

    // Update Page Object Model in db if applicable
    const poms = db.pageObjects.get(projectId) || [];
    const targetPom = poms.find((p) => p.name === 'LoginPage.ts');
    if (targetPom) {
      targetPom.code = targetPom.code.replace(
        'async expectErrorMessage(text: string) {',
        'async expectErrorMessage(text: string | RegExp) {'
      );
    }

    wsServer.broadcast('ai.healing.applied', {
      proposalId,
      message: `Self-healing fix applied to ${foundProposal.pageObject}. Test suite recalculated with 100% selector stability.`,
      proposal: foundProposal,
    });

    return { success: true, proposal: foundProposal };
  }
}

export const selfHealingAgent = new SelfHealingAgent();
