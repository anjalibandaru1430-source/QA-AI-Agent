import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';
import { requirementAgent } from '../agents/RequirementAgent.js';
import { scenarioAgent } from '../agents/ScenarioAgent.js';
import { testCaseAgent } from '../agents/TestCaseAgent.js';
import { codeGenerationAgent } from '../agents/CodeGenerationAgent.js';
import { selfHealingAgent } from '../agents/SelfHealingAgent.js';
import { playwrightRunner } from '../automation/playwrightRunner.js';
import { jiraService } from '../integrations/jiraService.js';
import { emailService } from '../integrations/emailService.js';
import { SAUCE_DEMO_PRD_TEXT, CreateProjectSchema, EmailReportSchema, PRDDocument, Project } from '../shared/index.js';

export const apiRouter = Router();

const getParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0];
  return param || '';
};

// -------------------------------------------------------------
// Root API Overview
// -------------------------------------------------------------
apiRouter.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'QAgent REST API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/me'],
      projects: ['/api/projects', '/api/projects/:id', '/api/projects/:id/dashboard'],
      prd: ['/api/projects/:id/prd/sample', '/api/projects/:id/prd/analyze'],
      scenarios: ['/api/projects/:id/scenarios', '/api/projects/:id/scenarios/generate'],
      testCases: ['/api/projects/:id/test-cases', '/api/projects/:id/test-cases/generate'],
      codeGen: ['/api/projects/:id/code/generate', '/api/projects/:id/code/page-objects', '/api/projects/:id/code/test-scripts'],
      execution: ['/api/projects/:id/executions', '/api/projects/:id/executions/start'],
      failures: ['/api/projects/:id/failures', '/api/projects/:id/self-healing/:proposalId/apply'],
      bugs: ['/api/projects/:id/bugs', '/api/projects/:id/bugs/:bugId/jira'],
      reports: ['/api/projects/:id/reports', '/api/projects/:id/reports/:reportId/email'],
      agents: ['/api/agents/status'],
    },
    webDashboard: 'http://localhost:5173',
  });
});

// -------------------------------------------------------------
// Auth Routes
// -------------------------------------------------------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = Array.from(db.users.values())[0];
  res.json({
    token: 'jwt_mock_token_qagent_2026',
    user: {
      id: user.id,
      name: user.name,
      email: email || user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = Array.from(db.users.values())[0];
  res.json({ user });
});

// -------------------------------------------------------------
// Project Routes
// -------------------------------------------------------------
apiRouter.get('/projects', (req: Request, res: Response) => {
  const projects = Array.from(db.projects.values());
  res.json({ projects });
});

apiRouter.get('/projects/:id', (req: Request, res: Response) => {
  const project = db.projects.get(getParam(req.params.id));
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

apiRouter.post('/projects', (req: Request, res: Response) => {
  const parsed = CreateProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const projectId = `proj_${Date.now()}`;
  const newProject: Project = {
    id: projectId,
    name: parsed.data.name,
    description: parsed.data.description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      applicationUrl: parsed.data.applicationUrl,
      environment: 'demo',
      defaultBrowser: 'chromium',
      executionMode: 'local',
      parallelWorkers: 4,
      timeoutMs: 30000,
      viewportWidth: 1280,
      viewportHeight: 800,
      autoJiraOnFailure: true,
      selfHealingEnabled: true,
      jiraConfig: {
        baseUrl: 'https://qagent-demo.atlassian.net',
        email: 'qa-lead@qagent.io',
        projectKey: 'QA',
        issueType: 'Bug',
      },
      emailRecipients: ['qa-team@qagent.io'],
    },
    stats: {
      totalRequirements: 0,
      totalScenarios: 0,
      totalTestCases: 0,
      passRate: 100,
      lastExecutedAt: new Date().toISOString(),
      activeBugs: 0,
    },
  };

  db.projects.set(projectId, newProject);
  res.status(201).json({ project: newProject });
});

apiRouter.get('/projects/:id/dashboard', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const project = db.projects.get(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const executions = db.executions.get(projectId) || [];
  const failures = db.failures.get(projectId) || [];
  const bugs = db.bugs.get(projectId) || [];
  const testCases = db.testCases.get(projectId) || [];

  res.json({
    project,
    metrics: {
      totalTests: testCases.length,
      automatedTests: testCases.filter((t) => t.automationStatus === 'automated').length,
      passRate: 90.6,
      healedCount: 1,
      activeBugsCount: bugs.length,
      avgExecutionDuration: '38.4s',
      testHealthScore: 94,
    },
    recentExecutions: executions.slice(0, 5),
    failures: failures.slice(0, 5),
    bugs: bugs.slice(0, 5),
  });
});

// -------------------------------------------------------------
// PRD & Requirement Ingestion Routes
// -------------------------------------------------------------
apiRouter.post('/projects/:id/prd/sample', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const prd: PRDDocument = {
    id: `prd_${Date.now()}`,
    projectId,
    title: 'Swag Labs (SauceDemo) E-Commerce PRD v2.4',
    rawContent: SAUCE_DEMO_PRD_TEXT,
    fileName: 'SauceDemo_PRD_v2.4.md',
    fileSize: SAUCE_DEMO_PRD_TEXT.length,
    uploadedAt: new Date().toISOString(),
    version: '2.4.0',
    parsedSummary:
      'PRD for SauceDemo e-commerce platform covering Authentication, Catalog, Cart, Checkout, Sidebar Navigation, and Accessibility.',
    status: 'draft',
  };

  db.prds.set(prd.id, prd);
  res.json({ prd });
});

apiRouter.post('/projects/:id/prd/analyze', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const { content } = req.body;

  const prdText = content || SAUCE_DEMO_PRD_TEXT;
  const result = await requirementAgent.analyzePRD(projectId, prdText);

  res.json(result);
});

apiRouter.get('/projects/:id/requirements', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const requirements = db.requirements.get(projectId) || [];
  res.json({ requirements });
});

// -------------------------------------------------------------
// Scenario Routes
// -------------------------------------------------------------
apiRouter.post('/projects/:id/scenarios/generate', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const scenarios = await scenarioAgent.generateScenarios(projectId);
  res.json({ scenarios });
});

apiRouter.get('/projects/:id/scenarios', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const scenarios = db.scenarios.get(projectId) || [];
  res.json({ scenarios });
});

apiRouter.patch('/projects/:id/scenarios/bulk-approve', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const scenarios = db.scenarios.get(projectId) || [];
  scenarios.forEach((s) => (s.isApproved = true));
  db.scenarios.set(projectId, scenarios);
  res.json({ success: true, count: scenarios.length });
});

// -------------------------------------------------------------
// Test Cases Routes
// -------------------------------------------------------------
apiRouter.post('/projects/:id/test-cases/generate', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const testCases = await testCaseAgent.generateTestCases(projectId);
  res.json({ testCases });
});

apiRouter.get('/projects/:id/test-cases', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const testCases = db.testCases.get(projectId) || [];
  res.json({ testCases });
});

apiRouter.patch('/projects/:id/test-cases/bulk-approve', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const testCases = db.testCases.get(projectId) || [];
  testCases.forEach((t) => (t.isApproved = true));
  db.testCases.set(projectId, testCases);
  res.json({ success: true, count: testCases.length });
});

// -------------------------------------------------------------
// Code Generation Routes
// -------------------------------------------------------------
apiRouter.post('/projects/:id/code/generate', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const result = await codeGenerationAgent.generateCode(projectId);
  res.json(result);
});

apiRouter.get('/projects/:id/code/page-objects', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const pageObjects = db.pageObjects.get(projectId) || [];
  res.json({ pageObjects });
});

apiRouter.get('/projects/:id/code/test-scripts', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const testScripts = db.testScripts.get(projectId) || [];
  res.json({ testScripts });
});

apiRouter.post('/projects/:id/code/explain', async (req: Request, res: Response) => {
  const { code } = req.body;
  const explanation = await codeGenerationAgent.explainCode(code);
  res.json({ explanation });
});

apiRouter.post('/projects/:id/code/optimize', async (req: Request, res: Response) => {
  const { code } = req.body;
  const optimized = await codeGenerationAgent.optimizeCode(code);
  res.json({ optimizedCode: optimized });
});

// -------------------------------------------------------------
// Execution Routes
// -------------------------------------------------------------
apiRouter.post('/projects/:id/executions/start', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const { browser = 'chromium' } = req.body;

  const execution = await playwrightRunner.runExecution(projectId, browser);
  res.status(202).json({ execution });
});

apiRouter.get('/projects/:id/executions', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const executions = db.executions.get(projectId) || [];
  res.json({ executions });
});

apiRouter.post('/executions/:id/cancel', (req: Request, res: Response) => {
  const execId = getParam(req.params.id);
  playwrightRunner.cancelExecution(execId);
  res.json({ success: true });
});

// -------------------------------------------------------------
// Failure Analysis & Self-Healing Routes
// -------------------------------------------------------------
apiRouter.get('/projects/:id/failures', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const failures = db.failures.get(projectId) || [];
  res.json({ failures });
});

apiRouter.post('/projects/:id/self-healing/:proposalId/apply', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const proposalId = getParam(req.params.proposalId);
  const success = await selfHealingAgent.applySelfHealing(projectId, proposalId);
  res.json({ success });
});

// -------------------------------------------------------------
// Jira Bug Tracking Routes
// -------------------------------------------------------------
apiRouter.get('/projects/:id/bugs', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const bugs = db.bugs.get(projectId) || [];
  res.json({ bugs });
});

apiRouter.post('/projects/:id/bugs/:bugId/jira', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const bugId = getParam(req.params.bugId);

  const jiraResult = await jiraService.createJiraIssue(projectId, bugId);
  res.json(jiraResult);
});

// -------------------------------------------------------------
// Report & Email Routes
// -------------------------------------------------------------
apiRouter.get('/projects/:id/reports', (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const reports = db.reports.get(projectId) || [];
  res.json({ reports });
});

apiRouter.post('/projects/:id/reports/:reportId/email', async (req: Request, res: Response) => {
  const projectId = getParam(req.params.id);
  const reportId = getParam(req.params.reportId);
  const parsed = EmailReportSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const reports = db.reports.get(projectId) || [];
  const report = reports.find((r) => r.id === reportId) || reports[0];

  if (!report) return res.status(404).json({ error: 'Report not found' });

  const result = await emailService.sendReportEmail(
    parsed.data.recipients,
    parsed.data.subject,
    report,
    parsed.data.message
  );

  res.json(result);
});

// -------------------------------------------------------------
// Agent Topology Status
// -------------------------------------------------------------
apiRouter.get('/agents/status', (req: Request, res: Response) => {
  const agents = Array.from(db.agentStates.values());
  res.json({ agents });
});
