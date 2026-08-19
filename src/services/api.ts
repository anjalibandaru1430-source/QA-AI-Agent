import {
  Project,
  PRDDocument,
  Requirement,
  TestScenario,
  TestCase,
  PageObjectModel,
  TestScript,
  Execution,
  FailureAnalysis,
  BugReport,
  QAReport,
  AIAgentState,
  SAUCE_DEMO_PRD_TEXT,
} from '@qagent/shared';

const API_BASE = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api').replace(/\/+api$/, '/api');

// Helper for fetch with fallback support
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    // If backend is unreachable, throw so caller can handle or use fallback
    throw err;
  }
}

export const api = {
  // Auth
  login: async (email?: string, password?: string) => {
    return request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Projects
  getProjects: async () => {
    return request<{ projects: Project[] }>('/projects');
  },
  getProject: async (id: string) => {
    return request<{ project: Project }>(`/projects/${id}`);
  },
  createProject: async (data: any) => {
    return request<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PRD & Requirements
  getPRD: async (projectId: string) => {
    return request<{ prd: PRDDocument | null }>(`/projects/${projectId}/prd`);
  },
  uploadPRD: async (projectId: string, data: { title: string; rawContent: string; fileName?: string }) => {
    return request<{ prd: PRDDocument }>(`/projects/${projectId}/prd`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  analyzePRD: async (projectId: string, content?: string) => {
    return request<{ success: boolean; requirements: Requirement[] }>(`/projects/${projectId}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  getRequirements: async (projectId: string) => {
    return request<{ requirements: Requirement[] }>(`/projects/${projectId}/requirements`);
  },

  // Scenarios
  getScenarios: async (projectId: string) => {
    return request<{ scenarios: TestScenario[] }>(`/projects/${projectId}/scenarios`);
  },
  generateScenarios: async (projectId: string) => {
    return request<{ success: boolean; scenarios: TestScenario[] }>(`/projects/${projectId}/scenarios/generate`, {
      method: 'POST',
    });
  },
  approveAllScenarios: async (projectId: string) => {
    return request<{ success: boolean; scenarios: TestScenario[] }>(`/projects/${projectId}/scenarios/approve-all`, {
      method: 'POST',
    });
  },

  // Test Cases
  getTestCases: async (projectId: string) => {
    return request<{ testCases: TestCase[] }>(`/projects/${projectId}/test-cases`);
  },
  generateTestCases: async (projectId: string) => {
    return request<{ success: boolean; testCases: TestCase[] }>(`/projects/${projectId}/test-cases/generate`, {
      method: 'POST',
    });
  },
  approveAllTestCases: async (projectId: string) => {
    return request<{ success: boolean; testCases: TestCase[] }>(`/projects/${projectId}/test-cases/approve-all`, {
      method: 'POST',
    });
  },

  // Code Generation
  getCode: async (projectId: string) => {
    return request<{ pageObjects: PageObjectModel[]; testScripts: TestScript[] }>(`/projects/${projectId}/code`);
  },
  generateCode: async (projectId: string) => {
    return request<{ success: boolean; pageObjects: PageObjectModel[]; testScripts: TestScript[] }>(
      `/projects/${projectId}/code/generate`,
      { method: 'POST' }
    );
  },
  optimizeCode: async (projectId: string, code: string, instruction?: string) => {
    return request<{ success: boolean; code: string }>(`/projects/${projectId}/code/optimize`, {
      method: 'POST',
      body: JSON.stringify({ code, instruction }),
    });
  },
  explainCode: async (projectId: string, code: string) => {
    return request<{ success: boolean; explanation: string }>(`/projects/${projectId}/code/explain`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // Executions
  getExecutions: async (projectId: string) => {
    return request<{ executions: Execution[] }>(`/projects/${projectId}/executions`);
  },
  getExecution: async (executionId: string) => {
    return request<{ execution: Execution }>(`/executions/${executionId}`);
  },
  startExecution: async (projectId: string, browser = 'chromium') => {
    return request<{ success: boolean; execution: Execution }>(`/projects/${projectId}/executions`, {
      method: 'POST',
      body: JSON.stringify({ browser }),
    });
  },
  cancelExecution: async (executionId: string) => {
    return request<{ success: boolean }>(`/executions/${executionId}/cancel`, { method: 'POST' });
  },

  // Failures & Self-Healing
  getFailures: async (projectId: string) => {
    return request<{ failures: FailureAnalysis[] }>(`/projects/${projectId}/failures`);
  },
  applySelfHealing: async (projectId: string, proposalId: string) => {
    return request<{ success: boolean; proposal: any }>(`/projects/${projectId}/self-healing/${proposalId}/apply`, {
      method: 'POST',
    });
  },

  // Bugs & Jira
  getBugs: async (projectId: string) => {
    return request<{ bugs: BugReport[] }>(`/projects/${projectId}/bugs`);
  },
  createJiraIssue: async (projectId: string, bugId: string) => {
    return request<{ success: boolean; jiraKey: string; jiraUrl: string }>(`/projects/${projectId}/bugs/${bugId}/jira`, {
      method: 'POST',
    });
  },

  // Reports
  getReports: async (projectId: string) => {
    return request<{ reports: QAReport[] }>(`/projects/${projectId}/reports`);
  },
  sendEmailReport: async (projectId: string, reportId: string, data: { recipients: string[]; subject: string; message?: string }) => {
    return request<{ success: boolean; messageId: string }>(`/projects/${projectId}/reports/${reportId}/email`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Agents
  getAgentStatus: async () => {
    return request<{ agents: AIAgentState[] }>('/agents/status');
  },
};
