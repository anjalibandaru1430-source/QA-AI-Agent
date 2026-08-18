import {
  User,
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
  AIAgentLog,
} from '@qagent/shared';
import { SAUCE_DEMO_PRD_TEXT } from '@qagent/shared';

// In-Memory Database with default SauceDemo QA Project data
export class DatabaseStore {
  public users: Map<string, User> = new Map();
  public projects: Map<string, Project> = new Map();
  public prds: Map<string, PRDDocument> = new Map();
  public requirements: Map<string, Requirement[]> = new Map(); // projectId -> Requirement[]
  public scenarios: Map<string, TestScenario[]> = new Map(); // projectId -> TestScenario[]
  public testCases: Map<string, TestCase[]> = new Map(); // projectId -> TestCase[]
  public pageObjects: Map<string, PageObjectModel[]> = new Map(); // projectId -> PageObjectModel[]
  public testScripts: Map<string, TestScript[]> = new Map(); // projectId -> TestScript[]
  public executions: Map<string, Execution[]> = new Map(); // projectId -> Execution[]
  public failures: Map<string, FailureAnalysis[]> = new Map(); // testResultId / projectId -> FailureAnalysis[]
  public bugs: Map<string, BugReport[]> = new Map(); // projectId -> BugReport[]
  public reports: Map<string, QAReport[]> = new Map(); // projectId -> QAReport[]
  public agentStates: Map<string, AIAgentState> = new Map();
  public agentLogs: AIAgentLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Default User
    const user: User = {
      id: 'usr_default',
      name: 'Alex Vance',
      email: 'alex.vance@qagent.io',
      role: 'qa_lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };
    this.users.set(user.id, user);

    // 2. Default Project
    const projectId = 'proj_saucedemo_001';
    const project: Project = {
      id: projectId,
      name: 'SauceDemo QA Project',
      description: 'E-Commerce end-to-end automated quality engineering suite for Swag Labs web platform.',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: new Date().toISOString(),
      settings: {
        applicationUrl: 'https://www.saucedemo.com/',
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
        emailRecipients: ['alex.vance@qagent.io', 'qa-team@qagent.io'],
      },
      stats: {
        totalRequirements: 6,
        totalScenarios: 12,
        totalTestCases: 32,
        passRate: 90.6,
        lastExecutedAt: new Date().toISOString(),
        activeBugs: 2,
      },
    };
    this.projects.set(projectId, project);

    // 3. PRD
    const prdId = 'prd_saucedemo_001';
    const prd: PRDDocument = {
      id: prdId,
      projectId,
      title: 'Swag Labs (SauceDemo) E-Commerce PRD v2.4',
      rawContent: SAUCE_DEMO_PRD_TEXT,
      fileName: 'SauceDemo_PRD_v2.4.md',
      fileSize: 4820,
      uploadedAt: '2026-08-05T09:00:00.000Z',
      version: '2.4.0',
      parsedSummary:
        'Comprehensive product requirements for Swag Labs e-commerce covering user authentication, inventory browsing, sorting algorithms, cart mutations, multi-step checkout calculations with 8% tax, and sliding drawer navigation.',
      status: 'analyzed',
    };
    this.prds.set(prdId, prd);

    // 4. Requirements
    const reqs: Requirement[] = [
      {
        id: 'req_001',
        projectId,
        reqCode: 'REQ-001',
        title: 'User Authentication & Access Control',
        category: 'Authentication',
        userStory: 'As an e-commerce customer, I want to authenticate using valid credentials so that my session is established securely.',
        acceptanceCriteria: [
          'Submitting valid credentials (standard_user / secret_sauce) navigates to /inventory.html within 2s',
          'Submitting empty username or password displays inline validation error banner',
          'Submitting invalid credentials displays "Epic sadface: Username and password do not match"',
          'Locked out users (locked_out_user) receive "Epic sadface: Sorry, this user has been locked out."',
          'Unauthorized direct access to /inventory.html redirects back to login',
        ],
        priority: 'critical',
        riskLevel: 'high',
        tags: ['auth', 'security', 'smoke'],
        scenariosCount: 3,
        createdAt: '2026-08-05T09:05:00.000Z',
      },
      {
        id: 'req_002',
        projectId,
        reqCode: 'REQ-002',
        title: 'Product Catalog, Filtering & Sorting',
        category: 'Catalog',
        userStory: 'As a customer, I want to browse products and sort them by price and name so that I can quickly find desired items.',
        acceptanceCriteria: [
          'Inventory page renders 6 standard catalog items with image, title, description, and price',
          'Sorting by Name (A to Z) sorts items alphabetically ascending',
          'Sorting by Name (Z to A) sorts items alphabetically descending',
          'Sorting by Price (low to high) sorts numeric prices ascending ($7.99 to $49.99)',
          'Sorting by Price (high to low) sorts numeric prices descending ($49.99 to $7.99)',
          'Clicking any item navigates to detailed item view',
        ],
        priority: 'high',
        riskLevel: 'medium',
        tags: ['catalog', 'sorting', 'ui'],
        scenariosCount: 2,
        createdAt: '2026-08-05T09:05:00.000Z',
      },
      {
        id: 'req_003',
        projectId,
        reqCode: 'REQ-003',
        title: 'Shopping Cart Management',
        category: 'Shopping Cart',
        userStory: 'As a customer, I want to add items to my cart, inspect badge counters, and manage items before checkout.',
        acceptanceCriteria: [
          'Clicking "Add to cart" increments cart badge and toggles button to "Remove"',
          'Clicking "Remove" decrements cart badge and toggles button back to "Add to cart"',
          'Cart selections persist across page navigation and item details view',
          'Cart page displays all selected items with correct quantities, individual prices, and descriptions',
          'Removing items inside cart page updates badge count immediately',
        ],
        priority: 'critical',
        riskLevel: 'high',
        tags: ['cart', 'state', 'e2e'],
        scenariosCount: 2,
        createdAt: '2026-08-05T09:05:00.000Z',
      },
      {
        id: 'req_004',
        projectId,
        reqCode: 'REQ-004',
        title: 'Multi-Step Checkout & Tax Calculation',
        category: 'Checkout',
        userStory: 'As a customer, I want to enter shipping details, review order pricing breakdown with tax, and complete order payment.',
        acceptanceCriteria: [
          'Submitting checkout step one with empty First Name, Last Name, or Zip Code displays validation error',
          'Valid postal code formats are accepted',
          'Overview page displays Payment info, Shipping info, Item subtotal, 8% Tax, and Total',
          'Calculated Total strictly equals Item subtotal + Math.round(subtotal * 0.08 * 100) / 100',
          'Clicking "Finish" navigates to /checkout-complete.html with "Thank you for your order!"',
        ],
        priority: 'critical',
        riskLevel: 'critical',
        tags: ['checkout', 'payment', 'revenue-critical'],
        scenariosCount: 3,
        createdAt: '2026-08-05T09:05:00.000Z',
      },
      {
        id: 'req_005',
        projectId,
        reqCode: 'REQ-005',
        title: 'Navigation, Sidebar Menu & Logout',
        category: 'Navigation',
        userStory: 'As a user, I want a persistent sliding menu to access app links, reset state, and safely logout.',
        acceptanceCriteria: [
          'Hamburger icon expands sidebar with All Items, About, Logout, and Reset App State',
          'Logout terminates session and returns user to login page',
          'Reset App State empties current shopping cart',
        ],
        priority: 'medium',
        riskLevel: 'low',
        tags: ['navigation', 'session'],
        scenariosCount: 1,
        createdAt: '2026-08-05T09:05:00.000Z',
      },
      {
        id: 'req_006',
        projectId,
        reqCode: 'REQ-006',
        title: 'Accessibility & Responsive Viewports',
        category: 'Accessibility',
        userStory: 'As an inclusive platform, the interface must comply with WCAG 2.1 AA standards and support mobile viewports.',
        acceptanceCriteria: [
          'All interactive buttons and inputs have valid data-test or id attributes',
          'Form inputs support keyboard Tab navigation and submit on Enter keypress',
          'Contrast ratio of text elements meets 4.5:1 minimum threshold',
        ],
        priority: 'medium',
        riskLevel: 'medium',
        tags: ['a11y', 'wcag', 'mobile'],
        scenariosCount: 1,
        createdAt: '2026-08-05T09:05:00.000Z',
      },
    ];
    this.requirements.set(projectId, reqs);

    // 5. Scenarios
    const scenarios: TestScenario[] = [
      {
        id: 'sc_001',
        projectId,
        requirementId: 'req_001',
        reqCode: 'REQ-001',
        scenarioCode: 'SC-AUTH-001',
        title: 'Valid Authentication Workflow for Standard Users',
        description: 'Verify standard user can log in with valid credentials and reach inventory page.',
        category: 'Functional',
        priority: 'critical',
        risk: 'high',
        coverage: 100,
        isApproved: true,
        testCasesCount: 4,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_002',
        projectId,
        requirementId: 'req_001',
        reqCode: 'REQ-001',
        scenarioCode: 'SC-AUTH-002',
        title: 'Invalid & Locked User Authentication Boundaries',
        description: 'Verify proper error messaging for empty credentials, invalid passwords, and locked-out users.',
        category: 'Negative',
        priority: 'high',
        risk: 'high',
        coverage: 100,
        isApproved: true,
        testCasesCount: 4,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_003',
        projectId,
        requirementId: 'req_001',
        reqCode: 'REQ-001',
        scenarioCode: 'SC-AUTH-003',
        title: 'Unauthorized Route Access & Session Guarding',
        description: 'Verify unauthenticated requests to protected pages are bounced to login.',
        category: 'Security',
        priority: 'critical',
        risk: 'critical',
        coverage: 100,
        isApproved: true,
        testCasesCount: 2,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_004',
        projectId,
        requirementId: 'req_002',
        reqCode: 'REQ-002',
        scenarioCode: 'SC-CAT-001',
        title: 'Product Catalog Sorting Integrity',
        description: 'Verify all 4 dropdown sorting orders (A-Z, Z-A, Low-High, High-Low) order products correctly.',
        category: 'Functional',
        priority: 'high',
        risk: 'medium',
        coverage: 100,
        isApproved: true,
        testCasesCount: 4,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_005',
        projectId,
        requirementId: 'req_002',
        reqCode: 'REQ-002',
        scenarioCode: 'SC-CAT-002',
        title: 'Product Details Navigation & Consistency',
        description: 'Verify clicking product cards opens item details matching title and price.',
        category: 'Functional',
        priority: 'medium',
        risk: 'low',
        coverage: 100,
        isApproved: true,
        testCasesCount: 2,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_006',
        projectId,
        requirementId: 'req_003',
        reqCode: 'REQ-003',
        scenarioCode: 'SC-CART-001',
        title: 'Cart Mutations & Real-time Badge Synchronization',
        description: 'Verify adding and removing single and multiple items updates header badge dynamically.',
        category: 'Functional',
        priority: 'critical',
        risk: 'high',
        coverage: 100,
        isApproved: true,
        testCasesCount: 4,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_007',
        projectId,
        requirementId: 'req_003',
        reqCode: 'REQ-003',
        scenarioCode: 'SC-CART-002',
        title: 'Cart State Persistence & Item Removal in Cart View',
        description: 'Verify cart contents remain intact across navigation and can be removed directly on cart page.',
        category: 'Regression',
        priority: 'high',
        risk: 'medium',
        coverage: 100,
        isApproved: true,
        testCasesCount: 3,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_008',
        projectId,
        requirementId: 'req_004',
        reqCode: 'REQ-004',
        scenarioCode: 'SC-CHK-001',
        title: 'End-to-End Single & Multi-Item Checkout Flow',
        description: 'Complete full purchasing flow from cart to order confirmation page.',
        category: 'Functional',
        priority: 'critical',
        risk: 'critical',
        coverage: 100,
        isApproved: true,
        testCasesCount: 4,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_009',
        projectId,
        requirementId: 'req_004',
        reqCode: 'REQ-004',
        scenarioCode: 'SC-CHK-002',
        title: 'Checkout Form Field Validation Boundaries',
        description: 'Test checkout step one with empty first name, missing last name, and missing postal code.',
        category: 'Boundary',
        priority: 'high',
        risk: 'medium',
        coverage: 100,
        isApproved: true,
        testCasesCount: 3,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_010',
        projectId,
        requirementId: 'req_004',
        reqCode: 'REQ-004',
        scenarioCode: 'SC-CHK-003',
        title: 'Tax & Subtotal Arithmetic Verification',
        description: 'Verify mathematical accuracy of 8% tax calculation across varying cart sums.',
        category: 'Functional',
        priority: 'critical',
        risk: 'high',
        coverage: 100,
        isApproved: true,
        testCasesCount: 2,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_011',
        projectId,
        requirementId: 'req_005',
        reqCode: 'REQ-005',
        scenarioCode: 'SC-NAV-001',
        title: 'Sidebar Navigation, App Reset & Secure Logout',
        description: 'Verify drawer menu options, cart state clearing, and session termination.',
        category: 'Functional',
        priority: 'medium',
        risk: 'low',
        coverage: 100,
        isApproved: true,
        testCasesCount: 2,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
      {
        id: 'sc_012',
        projectId,
        requirementId: 'req_006',
        reqCode: 'REQ-006',
        scenarioCode: 'SC-A11Y-001',
        title: 'Keyboard Navigation & WCAG 2.1 Contrast Audits',
        description: 'Verify Tab keyboard traversal and accessibility compliance.',
        category: 'Accessibility',
        priority: 'medium',
        risk: 'low',
        coverage: 100,
        isApproved: true,
        testCasesCount: 2,
        createdAt: '2026-08-05T09:10:00.000Z',
      },
    ];
    this.scenarios.set(projectId, scenarios);

    // 6. Detailed Test Cases (32 Test Cases)
    const testCases: TestCase[] = [
      {
        id: 'tc_001',
        projectId,
        scenarioId: 'sc_001',
        requirementId: 'req_001',
        testCaseCode: 'TC-AUTH-001',
        title: 'Standard user login with valid credentials',
        description: 'Verify standard_user can log in successfully with valid password and land on inventory page.',
        preconditions: ['Browser open on https://www.saucedemo.com/', 'No active session cookies'],
        testData: { username: 'standard_user', password: 'secret_sauce' },
        steps: [
          { stepNumber: 1, action: 'Navigate to https://www.saucedemo.com/', expectedResult: 'Login page is loaded with title "Swag Labs"' },
          { stepNumber: 2, action: 'Type "standard_user" into #user-name', target: '#user-name', inputData: 'standard_user', expectedResult: 'Username input contains "standard_user"' },
          { stepNumber: 3, action: 'Type "secret_sauce" into #password', target: '#password', inputData: 'secret_sauce', expectedResult: 'Password field masked' },
          { stepNumber: 4, action: 'Click #login-button', target: '#login-button', expectedResult: 'Redirects to https://www.saucedemo.com/inventory.html' },
          { stepNumber: 5, action: 'Assert .title text equals "Products"', target: '.title', expectedResult: 'Header displays "Products"' },
        ],
        expectedResult: 'User successfully lands on inventory page with product catalog rendered.',
        priority: 'critical',
        severity: 'critical',
        automationStatus: 'automated',
        isApproved: true,
        qualityScore: { overall: 96, requirementCoverage: 98, edgeCaseCoverage: 92, assertionQuality: 98, selectorStability: 96, maintainability: 96 },
        tags: ['auth', 'smoke', 'p0'],
        lastExecutionStatus: 'passed',
        lastExecutionDuration: 1240,
        createdAt: '2026-08-05T09:15:00.000Z',
        updatedAt: '2026-08-05T09:15:00.000Z',
      },
      {
        id: 'tc_002',
        projectId,
        scenarioId: 'sc_002',
        requirementId: 'req_001',
        testCaseCode: 'TC-AUTH-002',
        title: 'Login attempt with empty username',
        description: 'Verify proper error prompt when submitting form with empty username.',
        preconditions: ['Browser on login page'],
        testData: { username: '', password: 'secret_sauce' },
        steps: [
          { stepNumber: 1, action: 'Leave #user-name blank', target: '#user-name', expectedResult: 'Field remains empty' },
          { stepNumber: 2, action: 'Enter "secret_sauce" into #password', target: '#password', inputData: 'secret_sauce', expectedResult: 'Password entered' },
          { stepNumber: 3, action: 'Click #login-button', target: '#login-button', expectedResult: 'Form submission prevented' },
          { stepNumber: 4, action: 'Assert [data-test="error"] contains "Epic sadface: Username is required"', target: '[data-test="error"]', expectedResult: 'Error banner visible with exact text' },
        ],
        expectedResult: 'Inline validation error indicates username is required.',
        priority: 'high',
        severity: 'high',
        automationStatus: 'automated',
        isApproved: true,
        qualityScore: { overall: 94, requirementCoverage: 95, edgeCaseCoverage: 95, assertionQuality: 92, selectorStability: 94, maintainability: 94 },
        tags: ['auth', 'negative'],
        lastExecutionStatus: 'passed',
        lastExecutionDuration: 890,
        createdAt: '2026-08-05T09:15:00.000Z',
        updatedAt: '2026-08-05T09:15:00.000Z',
      },
      {
        id: 'tc_003',
        projectId,
        scenarioId: 'sc_002',
        requirementId: 'req_001',
        testCaseCode: 'TC-AUTH-003',
        title: 'Login attempt with empty password',
        description: 'Verify error when submitting valid username with empty password.',
        preconditions: ['Browser on login page'],
        testData: { username: 'standard_user', password: '' },
        steps: [
          { stepNumber: 1, action: 'Type "standard_user" into #user-name', target: '#user-name', inputData: 'standard_user', expectedResult: 'Username entered' },
          { stepNumber: 2, action: 'Leave #password blank', target: '#password', expectedResult: 'Password empty' },
          { stepNumber: 3, action: 'Click #login-button', target: '#login-button', expectedResult: 'Error banner is displayed' },
          { stepNumber: 4, action: 'Assert [data-test="error"] text is "Epic sadface: Password is required"', target: '[data-test="error"]', expectedResult: 'Exact error text matches' },
        ],
        expectedResult: 'Error banner displays "Password is required".',
        priority: 'high',
        severity: 'high',
        automationStatus: 'automated',
        isApproved: true,
        qualityScore: { overall: 93, requirementCoverage: 94, edgeCaseCoverage: 92, assertionQuality: 93, selectorStability: 93, maintainability: 93 },
        tags: ['auth', 'negative'],
        lastExecutionStatus: 'passed',
        lastExecutionDuration: 780,
        createdAt: '2026-08-05T09:15:00.000Z',
        updatedAt: '2026-08-05T09:15:00.000Z',
      },
      {
        id: 'tc_004',
        projectId,
        scenarioId: 'sc_002',
        requirementId: 'req_001',
        testCaseCode: 'TC-AUTH-004',
        title: 'Locked-out user login rejection',
        description: 'Verify locked_out_user credentials display the account lockout notification.',
        preconditions: ['Browser on login page'],
        testData: { username: 'locked_out_user', password: 'secret_sauce' },
        steps: [
          { stepNumber: 1, action: 'Enter "locked_out_user" into #user-name', target: '#user-name', inputData: 'locked_out_user', expectedResult: 'Username entered' },
          { stepNumber: 2, action: 'Enter "secret_sauce" into #password', target: '#password', inputData: 'secret_sauce', expectedResult: 'Password entered' },
          { stepNumber: 3, action: 'Click #login-button', target: '#login-button', expectedResult: 'Login rejected' },
          { stepNumber: 4, action: 'Assert [data-test="error"] text equals "Epic sadface: Sorry, this user has been locked out."', target: '[data-test="error"]', expectedResult: 'Exact lockout error banner visible' },
        ],
        expectedResult: 'Account lockout message displayed and user remains on login view.',
        priority: 'critical',
        severity: 'high',
        automationStatus: 'automated',
        isApproved: true,
        qualityScore: { overall: 95, requirementCoverage: 96, edgeCaseCoverage: 96, assertionQuality: 94, selectorStability: 94, maintainability: 95 },
        tags: ['auth', 'negative', 'security'],
        lastExecutionStatus: 'failed',
        lastExecutionDuration: 1120,
        createdAt: '2026-08-05T09:15:00.000Z',
        updatedAt: '2026-08-05T09:15:00.000Z',
      },
      {
        id: 'tc_022',
        projectId,
        scenarioId: 'sc_008',
        requirementId: 'req_004',
        testCaseCode: 'TC-CHK-001',
        title: 'Complete single-item checkout journey',
        description: 'Verify purchasing Sauce Labs Backpack end-to-end with valid shipping information.',
        preconditions: ['Backpack added to cart'],
        testData: { firstName: 'Jane', lastName: 'Doe', postalCode: '94105' },
        steps: [
          { stepNumber: 1, action: 'Navigate to /cart.html and click [data-test="checkout"]', target: '[data-test="checkout"]', expectedResult: 'Navigates to /checkout-step-one.html' },
          { stepNumber: 2, action: 'Enter "Jane" in #first-name', target: '#first-name', inputData: 'Jane', expectedResult: 'First name entered' },
          { stepNumber: 3, action: 'Enter "Doe" in #last-name', target: '#last-name', inputData: 'Doe', expectedResult: 'Last name entered' },
          { stepNumber: 4, action: 'Enter "94105" in #postal-code', target: '#postal-code', inputData: '94105', expectedResult: 'Postal code entered' },
          { stepNumber: 5, action: 'Click [data-test="continue"]', target: '[data-test="continue"]', expectedResult: 'Navigates to /checkout-step-two.html' },
          { stepNumber: 6, action: 'Click [data-test="finish"]', target: '[data-test="finish"]', expectedResult: 'Navigates to /checkout-complete.html' },
          { stepNumber: 7, action: 'Assert .complete-header text is "Thank you for your order!"', target: '.complete-header', expectedResult: 'Order confirmed' },
        ],
        expectedResult: 'Order completed and thank you banner displayed.',
        priority: 'critical',
        severity: 'critical',
        automationStatus: 'automated',
        isApproved: true,
        qualityScore: { overall: 98, requirementCoverage: 99, edgeCaseCoverage: 96, assertionQuality: 98, selectorStability: 98, maintainability: 98 },
        tags: ['checkout', 'smoke', 'revenue-critical'],
        lastExecutionStatus: 'passed',
        lastExecutionDuration: 2150,
        createdAt: '2026-08-05T09:15:00.000Z',
        updatedAt: '2026-08-05T09:15:00.000Z',
      },
    ];
    this.testCases.set(projectId, testCases);

    // 7. Page Object Models
    const poms: PageObjectModel[] = [
      {
        id: 'pom_001',
        projectId,
        name: 'LoginPage.ts',
        path: 'pages/LoginPage.ts',
        code: `import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('.error-button');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
    await expect(this.page).toHaveTitle(/Swag Labs/);
  }

  async login(username: string, password: string) {
    if (username) await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(text: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(text);
  }

  async dismissError() {
    await this.errorDismissButton.click();
    await expect(this.errorMessage).not.toBeVisible();
  }
}`,
        selectors: [
          { name: 'usernameInput', selector: '#user-name', description: 'Username text field' },
          { name: 'passwordInput', selector: '#password', description: 'Password masked text field' },
          { name: 'loginButton', selector: '#login-button', description: 'Submit login button' },
          { name: 'errorMessage', selector: '[data-test="error"]', description: 'Error notification banner' },
        ],
        methods: [
          { name: 'goto', description: 'Navigate to base login URL', signature: 'goto(): Promise<void>' },
          { name: 'login', description: 'Fill credentials and submit', signature: 'login(username: string, password: string): Promise<void>' },
          { name: 'expectErrorMessage', description: 'Assert error message contains expected text', signature: 'expectErrorMessage(text: string): Promise<void>' },
        ],
      },
    ];
    this.pageObjects.set(projectId, poms);

    // 8. Test Scripts
    const scripts: TestScript[] = [
      {
        id: 'script_001',
        projectId,
        name: 'auth.spec.ts',
        path: 'tests/auth/auth.spec.ts',
        framework: 'playwright',
        language: 'typescript',
        version: 1,
        code: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-AUTH-001: Standard user valid login', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
  });
});`,
        versionHistory: [],
        createdAt: '2026-08-05T09:30:00.000Z',
        updatedAt: '2026-08-05T09:30:00.000Z',
      },
    ];
    this.testScripts.set(projectId, scripts);

    // 9. Historical Executions (Execution #1042)
    const exec1042: Execution = {
      id: 'exec_1042',
      projectId,
      executionNumber: 1042,
      status: 'completed',
      browser: 'chromium',
      environment: 'demo',
      executionMode: 'local',
      totalTests: 32,
      completedTests: 32,
      passedCount: 29,
      failedCount: 2,
      skippedCount: 1,
      runningCount: 0,
      progressPercent: 100,
      durationMs: 38400,
      startedAt: new Date(Date.now() - 360000).toISOString(),
      completedAt: new Date(Date.now() - 321600).toISOString(),
      results: [
        {
          id: 'res_001',
          executionId: 'exec_1042',
          testCaseId: 'tc_001',
          testCaseCode: 'TC-AUTH-001',
          testTitle: 'Standard user login with valid credentials',
          status: 'passed',
          durationMs: 1240,
          workerId: 1,
          browser: 'chromium',
          startedAt: new Date(Date.now() - 360000).toISOString(),
          completedAt: new Date(Date.now() - 358760).toISOString(),
          stepLogs: [
            { timestamp: '12:31:02', stepNumber: 1, action: 'Navigating to https://www.saucedemo.com/', status: 'passed', durationMs: 420 },
            { timestamp: '12:31:02', stepNumber: 2, action: 'Entering username "standard_user"', status: 'passed', durationMs: 180 },
            { timestamp: '12:31:03', stepNumber: 3, action: 'Entering password "••••••••"', status: 'passed', durationMs: 160 },
            { timestamp: '12:31:03', stepNumber: 4, action: 'Clicking #login-button', status: 'passed', durationMs: 290 },
            { timestamp: '12:31:03', stepNumber: 5, action: 'Asserting page title equals "Products"', status: 'passed', durationMs: 190 },
          ],
          screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          consoleLogs: [
            { level: 'info', message: 'Page loaded successfully in 420ms', timestamp: '12:31:02' },
          ],
          networkLogs: [
            { url: 'https://www.saucedemo.com/inventory.html', method: 'GET', status: 200, durationMs: 195 },
          ],
        },
        {
          id: 'res_004',
          executionId: 'exec_1042',
          testCaseId: 'tc_004',
          testCaseCode: 'TC-AUTH-004',
          testTitle: 'Locked-out user login rejection',
          status: 'failed',
          durationMs: 1120,
          workerId: 2,
          browser: 'chromium',
          startedAt: new Date(Date.now() - 355000).toISOString(),
          completedAt: new Date(Date.now() - 353880).toISOString(),
          stepLogs: [
            { timestamp: '12:31:10', stepNumber: 1, action: 'Navigating to https://www.saucedemo.com/', status: 'passed', durationMs: 380 },
            { timestamp: '12:31:10', stepNumber: 2, action: 'Entering username "locked_out_user"', status: 'passed', durationMs: 170 },
            { timestamp: '12:31:11', stepNumber: 3, action: 'Entering password "secret_sauce"', status: 'passed', durationMs: 150 },
            { timestamp: '12:31:11', stepNumber: 4, action: 'Clicking #login-button', status: 'passed', durationMs: 210 },
            { timestamp: '12:31:11', stepNumber: 5, action: 'Asserting [data-test="error"] exact text matches', status: 'failed', durationMs: 210, error: 'Expected "Epic sadface: Sorry, this user has been locked out." but received "Epic sadface: User account suspended by admin"' },
          ],
          screenshotUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80',
          consoleLogs: [
            { level: 'warn', message: 'API POST /api/v1/auth/login returned HTTP 403 Forbidden with custom error code ACC_SUSPENDED', timestamp: '12:31:11' },
          ],
          networkLogs: [
            { url: 'https://www.saucedemo.com/api/v1/auth/login', method: 'POST', status: 403, durationMs: 210 },
          ],
          stackTrace: `AssertionError: Timed out 5000ms waiting for expect(locator).toHaveText(expected)\n  Locator: locator('[data-test="error"]')\n  Expected: "Epic sadface: Sorry, this user has been locked out."\n  Received: "Epic sadface: User account suspended by admin"`,
          failureAnalysisId: 'fa_001',
        },
      ],
      workers: [
        { workerId: 1, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
        { workerId: 2, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
        { workerId: 3, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
        { workerId: 4, status: 'completed', browser: 'chromium', progressPercent: 100, testsCompleted: 8 },
      ],
      logs: [
        '[12:31:00] [Execution #1042] Initializing Playwright test runner with 4 parallel workers...',
        '[12:31:03] [Worker 1] PASS TC-AUTH-001 (1240ms)',
        '[12:31:11] [Worker 2] FAIL TC-AUTH-004 (1120ms) - AssertionError: Error banner text mismatch',
        '[12:31:38] [Execution #1042] Test Run Completed in 38.4s. 29 Passed, 2 Failed, 1 Skipped.',
      ],
    };
    this.executions.set(projectId, [exec1042]);

    // 10. Failure Analysis & Self-Healing
    const fa1: FailureAnalysis = {
      id: 'fa_001',
      testResultId: 'res_004',
      testCaseCode: 'TC-AUTH-004',
      rootCause:
        'The backend authentication microservice updated its lockout error message payload from legacy copy ("Sorry, this user has been locked out.") to modern account status copy ("User account suspended by admin").',
      category: 'Assertion Failure',
      confidence: 96,
      evidence: [
        'POST /api/v1/auth/login returned HTTP 403 with response {"code":"ACC_SUSPENDED","message":"User account suspended by admin"}',
        'DOM inspection confirms [data-test="error"] container renders text: "Epic sadface: User account suspended by admin"',
        'Screenshot visual OCR confirms exact red banner string',
      ],
      suggestedFix:
        'Update LoginPage.ts and auth.spec.ts assertion regex to accept both legacy and suspended admin status strings, or normalize backend error mapping.',
      likelyRegression: true,
      relatedTestCodes: ['TC-AUTH-002', 'TC-AUTH-003'],
      createdAt: '2026-08-05T09:40:00.000Z',
      selfHealingProposal: {
        id: 'sh_001',
        failureAnalysisId: 'fa_001',
        pageObject: 'LoginPage.ts',
        elementName: 'errorMessage',
        originalSelector: 'locator(\'[data-test="error"]\')',
        suggestedSelector: 'locator(\'[data-test="error"], .error-message-container\')',
        confidence: 94,
        status: 'pending',
        codeDiff: {
          filePath: 'pages/LoginPage.ts',
          originalLines: [
            '  async expectErrorMessage(text: string) {',
            '    await expect(this.errorMessage).toBeVisible();',
            '    await expect(this.errorMessage).toContainText(text);',
            '  }',
          ],
          replacementLines: [
            '  async expectErrorMessage(text: string | RegExp) {',
            '    await expect(this.errorMessage).toBeVisible();',
            '    await expect(this.errorMessage).toHaveText(typeof text === "string" ? new RegExp(text, "i") : text);',
            '  }',
          ],
        },
      },
    };
    this.failures.set(projectId, [fa1]);

    // 11. Jira Bugs
    const bugs: BugReport[] = [
      {
        id: 'bug_001',
        projectId,
        bugCode: 'BUG-001',
        title: '[SauceDemo] Locked-out user error message returns unexpected suspended copy',
        description:
          'When attempting to log in with locked_out_user, the displayed error banner text changed unexpectedly to "User account suspended by admin" instead of the approved PRD specification copy.',
        severity: 'high',
        priority: 'high',
        status: 'jira_created',
        jiraIssueKey: 'QA-1042',
        jiraIssueUrl: 'https://qagent-demo.atlassian.net/browse/QA-1042',
        testCaseCode: 'TC-AUTH-004',
        stepsToReproduce: [
          'Navigate to https://www.saucedemo.com/',
          'Enter "locked_out_user" in username input',
          'Enter "secret_sauce" in password input',
          'Click Login button',
          'Inspect error notification text in banner',
        ],
        expectedResult: 'Banner displays: "Epic sadface: Sorry, this user has been locked out."',
        actualResult: 'Banner displays: "Epic sadface: User account suspended by admin"',
        environment: 'Demo Staging',
        browser: 'chromium',
        aiRootCause:
          'Backend auth service returned ACC_SUSPENDED causing front-end string mismatch against PRD acceptance criteria REQ-001.',
        screenshotUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80',
        stackTrace: 'AssertionError: Timed out 5000ms waiting for expect(locator).toHaveText(expected)',
        createdAt: '2026-08-05T09:42:00.000Z',
        updatedAt: '2026-08-05T09:42:00.000Z',
      },
      {
        id: 'bug_002',
        projectId,
        bugCode: 'BUG-002',
        title: '[SauceDemo] Problem user triggers broken product image asset 404s',
        description: 'Logging in with problem_user causes 4 of 6 product images to return 404 sl-404.jpg placeholder assets.',
        severity: 'medium',
        priority: 'medium',
        status: 'detected',
        testCaseCode: 'TC-CAT-001',
        stepsToReproduce: [
          'Log in as problem_user',
          'Inspect network requests for .inventory_item_img img',
        ],
        expectedResult: 'Distinct JPEG assets render for every product card.',
        actualResult: 'Duplicate placeholder /static/media/sl-404.168b33ce.jpg loaded for all items.',
        environment: 'Demo Staging',
        browser: 'chromium',
        aiRootCause: 'User mock profile "problem_user" deliberately injects broken image asset URLs in catalog payload.',
        createdAt: '2026-08-05T09:45:00.000Z',
        updatedAt: '2026-08-05T09:45:00.000Z',
      },
    ];
    this.bugs.set(projectId, bugs);

    // 12. QA Report
    const report: QAReport = {
      id: 'rep_1042',
      projectId,
      executionId: 'exec_1042',
      executionNumber: 1042,
      generatedAt: '2026-08-05T09:50:00.000Z',
      projectName: 'SauceDemo QA Project',
      summary: {
        totalTests: 32,
        passed: 29,
        failed: 2,
        skipped: 1,
        passRate: 90.6,
        durationFormatted: '38.4s',
        totalBugsCreated: 1,
        healedSelectorsCount: 1,
      },
      executiveSummary:
        'Automated quality evaluation of SauceDemo (Swag Labs v2.4) concluded with a 90.6% pass rate across 32 comprehensive tests executed in parallel. Core revenue flows (Cart additions, 8% Tax calculations, Checkout transitions) achieved 100% pass rates. Two regressions were identified in authentication lockout error messages and problem_user image integrity.',
      recommendations: [
        'Align backend authentication error responses with REQ-001 PRD specifications.',
        'Adopt self-healing selector suggestion for LoginPage.ts errorMessage locator.',
        'Integrate visual regression checkpoints for product catalog asset verification.',
      ],
      coverageStats: {
        functional: 96,
        security: 100,
        negative: 92,
        boundary: 95,
      },
      failedTestSummaries: [
        {
          code: 'TC-AUTH-004',
          title: 'Locked-out user login rejection',
          category: 'Assertion Failure',
          rootCause: 'Error text string mismatch due to backend auth service payload update.',
          jiraKey: 'QA-1042',
        },
      ],
    };
    this.reports.set(projectId, [report]);

    // 13. AI Agent Initial States
    const agentTypes: AIAgentState[] = [
      { id: 'RequirementAgent', name: 'Requirement Analyzer', description: 'Extracts user journeys, acceptance criteria, and risk areas from PRD', status: 'completed', progress: 100, tokensUsed: 2450, durationMs: 1820 },
      { id: 'ScenarioAgent', name: 'Scenario Generator', description: 'Synthesizes categorized functional, negative, and boundary scenarios', status: 'completed', progress: 100, tokensUsed: 3120, durationMs: 2150 },
      { id: 'TestCaseAgent', name: 'Test Case Designer', description: 'Generates detailed step-by-step test cases with AI Quality Scores', status: 'completed', progress: 100, tokensUsed: 6840, durationMs: 3420 },
      { id: 'CodeGenerationAgent', name: 'Playwright Code Generator', description: 'Produces typed Page Object Models and spec test suites', status: 'completed', progress: 100, tokensUsed: 8910, durationMs: 4120 },
      { id: 'ExecutionAgent', name: 'Execution Dispatcher', description: 'Orchestrates parallel worker pool and real-time event streaming', status: 'completed', progress: 100, tokensUsed: 1200, durationMs: 38400 },
      { id: 'FailureAnalysisAgent', name: 'Failure Diagnostics Agent', description: 'Isolates root causes, regression indicators, and stack trace insights', status: 'completed', progress: 100, tokensUsed: 2100, durationMs: 1450 },
      { id: 'SelfHealingAgent', name: 'Self-Healing Engine', description: 'Generates robust selector replacements and verified code diffs', status: 'completed', progress: 100, tokensUsed: 1940, durationMs: 1320 },
      { id: 'BugReportAgent', name: 'Jira Bug Generator', description: 'Formats Jira tickets with reproducibility steps, logs, and artifacts', status: 'completed', progress: 100, tokensUsed: 1650, durationMs: 980 },
    ];
    agentTypes.forEach((a) => this.agentStates.set(a.id, a));
  }
}

export const db = new DatabaseStore();
