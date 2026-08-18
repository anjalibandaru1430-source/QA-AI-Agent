export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ScenarioCategory =
  | 'Functional'
  | 'Negative'
  | 'Boundary'
  | 'Security'
  | 'Performance'
  | 'Accessibility'
  | 'Integration'
  | 'Regression';

export type AutomationStatus = 'automated' | 'manual' | 'in_progress' | 'blocked';
export type ExecutionStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type TestStatus = 'passed' | 'failed' | 'skipped' | 'running' | 'queued' | 'blocked';

export type BrowserType = 'chromium' | 'firefox' | 'webkit' | 'all';
export type ExecutionMode = 'local' | 'saucelabs' | 'cloud';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'qa_lead' | 'automation_engineer' | 'product_manager' | 'developer';
  avatar?: string;
}

export interface ProjectSettings {
  applicationUrl: string;
  environment: 'development' | 'staging' | 'production' | 'demo';
  defaultBrowser: BrowserType;
  executionMode: ExecutionMode;
  parallelWorkers: number;
  timeoutMs: number;
  viewportWidth: number;
  viewportHeight: number;
  autoJiraOnFailure: boolean;
  selfHealingEnabled: boolean;
  jiraConfig?: {
    baseUrl: string;
    email: string;
    projectKey: string;
    issueType: string;
  };
  emailRecipients: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
  stats?: {
    totalRequirements: number;
    totalScenarios: number;
    totalTestCases: number;
    passRate: number;
    lastExecutedAt?: string;
    activeBugs: number;
  };
}

export interface PRDDocument {
  id: string;
  projectId: string;
  title: string;
  rawContent: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt: string;
  version: string;
  parsedSummary?: string;
  status: 'draft' | 'analyzing' | 'analyzed' | 'error';
}

export interface Requirement {
  id: string;
  projectId: string;
  reqCode: string; // e.g., 'REQ-001'
  title: string;
  category: string;
  userStory: string;
  acceptanceCriteria: string[];
  priority: Priority;
  riskLevel: RiskLevel;
  tags: string[];
  scenariosCount?: number;
  createdAt: string;
}

export interface TestScenario {
  id: string;
  projectId: string;
  requirementId: string;
  reqCode: string;
  scenarioCode: string; // e.g., 'SC-AUTH-001'
  title: string;
  description: string;
  category: ScenarioCategory;
  priority: Priority;
  risk: RiskLevel;
  coverage: number; // percentage
  isApproved: boolean;
  testCasesCount?: number;
  createdAt: string;
}

export interface TestStep {
  stepNumber: number;
  action: string;
  target?: string;
  inputData?: string;
  expectedResult: string;
}

export interface AIQualityScore {
  overall: number; // 0-100
  requirementCoverage: number; // 0-100
  edgeCaseCoverage: number; // 0-100
  assertionQuality: number; // 0-100
  selectorStability: number; // 0-100
  maintainability: number; // 0-100
}

export interface TestCase {
  id: string;
  projectId: string;
  scenarioId: string;
  requirementId: string;
  reqCode?: string;
  testCaseCode: string; // e.g. 'TC-AUTH-001'
  title: string;
  description: string;
  preconditions: string[];
  testData: Record<string, string>;
  steps: TestStep[];
  expectedResult: string;
  priority: Priority;
  severity: Priority;
  automationStatus: AutomationStatus;
  isApproved: boolean;
  qualityScore: AIQualityScore;
  tags: string[];
  lastExecutionStatus?: TestStatus;
  lastExecutionDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageObjectModel {
  id: string;
  projectId: string;
  name: string; // e.g., 'LoginPage.ts'
  path: string;
  code: string;
  selectors: Array<{ name: string; selector: string; description: string }>;
  methods: Array<{ name: string; description: string; signature: string }>;
}

export interface TestScript {
  id: string;
  projectId: string;
  testCaseId?: string;
  name: string; // e.g., 'auth.spec.ts'
  path: string;
  code: string;
  framework: 'playwright';
  language: 'typescript';
  version: number;
  versionHistory: Array<{
    version: number;
    code: string;
    createdAt: string;
    changeNote: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionStepLog {
  timestamp: string;
  stepNumber: number;
  action: string;
  status: 'passed' | 'failed' | 'running';
  durationMs?: number;
  screenshotUrl?: string;
  error?: string;
}

export interface TestResult {
  id: string;
  executionId: string;
  testCaseId: string;
  testCaseCode: string;
  testTitle: string;
  status: TestStatus;
  durationMs: number;
  workerId: number;
  browser: BrowserType;
  startedAt: string;
  completedAt?: string;
  stepLogs: ExecutionStepLog[];
  screenshotUrl?: string;
  videoUrl?: string;
  traceUrl?: string;
  consoleLogs: Array<{ level: 'info' | 'warn' | 'error' | 'debug'; message: string; timestamp: string }>;
  networkLogs: Array<{ url: string; method: string; status: number; durationMs: number }>;
  stackTrace?: string;
  failureAnalysisId?: string;
}

export interface WorkerState {
  workerId: number;
  status: 'idle' | 'running' | 'completed';
  currentTestCaseCode?: string;
  currentTestTitle?: string;
  currentStep?: string;
  progressPercent: number;
  browser: BrowserType;
  testsCompleted: number;
}

export interface Execution {
  id: string;
  projectId: string;
  executionNumber: number; // e.g. 1042
  status: ExecutionStatus;
  browser: BrowserType;
  environment: string;
  executionMode: ExecutionMode;
  totalTests: number;
  completedTests: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  runningCount: number;
  progressPercent: number;
  durationMs: number;
  startedAt: string;
  completedAt?: string;
  results: TestResult[];
  workers: WorkerState[];
  logs: string[];
}

export interface FailureAnalysis {
  id: string;
  testResultId: string;
  testCaseCode: string;
  rootCause: string;
  category: 'UI Error' | 'API Error' | 'Timeout' | 'Assertion Failure' | 'Authentication' | 'Network' | 'Selector Changed';
  confidence: number; // 0-100
  evidence: string[];
  suggestedFix: string;
  likelyRegression: boolean;
  relatedTestCodes: string[];
  createdAt: string;
  selfHealingProposal?: SelfHealingProposal;
}

export interface SelfHealingProposal {
  id: string;
  failureAnalysisId: string;
  pageObject: string;
  elementName: string;
  originalSelector: string;
  suggestedSelector: string;
  confidence: number;
  status: 'pending' | 'applied' | 'rejected';
  codeDiff: {
    filePath: string;
    originalLines: string[];
    replacementLines: string[];
  };
}

export interface BugReport {
  id: string;
  projectId: string;
  bugCode: string; // e.g., 'BUG-001'
  title: string;
  description: string;
  severity: Priority;
  priority: Priority;
  status: 'detected' | 'jira_pending' | 'jira_created' | 'resolved' | 'ignored';
  jiraIssueKey?: string; // e.g. 'QA-1042'
  jiraIssueUrl?: string;
  testCaseCode: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  environment: string;
  browser: BrowserType;
  aiRootCause: string;
  screenshotUrl?: string;
  stackTrace?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QAReport {
  id: string;
  projectId: string;
  executionId: string;
  executionNumber: number;
  generatedAt: string;
  projectName: string;
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
    durationFormatted: string;
    totalBugsCreated: number;
    healedSelectorsCount: number;
  };
  executiveSummary: string;
  recommendations: string[];
  coverageStats: {
    functional: number;
    security: number;
    negative: number;
    boundary: number;
  };
  failedTestSummaries: Array<{
    code: string;
    title: string;
    category: string;
    rootCause: string;
    jiraKey?: string;
  }>;
}

export type AIAgentType =
  | 'RequirementAgent'
  | 'ScenarioAgent'
  | 'TestCaseAgent'
  | 'CodeGenerationAgent'
  | 'ExecutionAgent'
  | 'FailureAnalysisAgent'
  | 'SelfHealingAgent'
  | 'BugReportAgent';

export interface AIAgentState {
  id: AIAgentType;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  currentTask?: string;
  tokensUsed: number;
  durationMs: number;
  lastActive?: string;
}

export interface AIAgentLog {
  id: string;
  agentType: AIAgentType;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  data?: Record<string, any>;
}

export interface WebSocketMessage<T = any> {
  event:
    | 'execution.started'
    | 'test.started'
    | 'test.step'
    | 'test.passed'
    | 'test.failed'
    | 'test.skipped'
    | 'execution.progress'
    | 'execution.log'
    | 'ai.agent.started'
    | 'ai.agent.progress'
    | 'ai.agent.completed'
    | 'ai.healing.proposed'
    | 'ai.healing.applied'
    | 'jira.issue.created'
    | 'execution.completed';
  data: T;
  timestamp: string;
}
