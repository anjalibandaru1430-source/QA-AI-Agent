import { BugReport } from '@qagent/shared';
import { db } from '../database/store.js';
import { wsServer } from '../websocket/wsServer.js';

export class JiraService {
  public async createJiraIssue(projectId: string, bugId: string): Promise<{ success: boolean; jiraKey: string; jiraUrl: string }> {
    const bugs = db.bugs.get(projectId) || [];
    const bug = bugs.find((b) => b.id === bugId);

    if (!bug) {
      throw new Error(`Bug report ${bugId} not found`);
    }

    const project = db.projects.get(projectId);
    const jiraConfig = project?.settings.jiraConfig || {
      baseUrl: 'https://qagent-demo.atlassian.net',
      projectKey: 'QA',
    };

    // Synthesize realistic Jira Key QA-104X
    const jiraKey = `${jiraConfig.projectKey}-${Math.floor(Math.random() * 800) + 1040}`;
    const jiraUrl = `${jiraConfig.baseUrl}/browse/${jiraKey}`;

    bug.status = 'jira_created';
    bug.jiraIssueKey = jiraKey;
    bug.jiraIssueUrl = jiraUrl;
    bug.updatedAt = new Date().toISOString();

    wsServer.broadcast('jira.issue.created', {
      bugId,
      jiraKey,
      jiraUrl,
      title: bug.title,
    });

    return {
      success: true,
      jiraKey,
      jiraUrl,
    };
  }
}

export const jiraService = new JiraService();
