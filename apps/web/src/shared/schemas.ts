import { z } from 'zod';

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);
export const ScenarioCategorySchema = z.enum([
  'Functional',
  'Negative',
  'Boundary',
  'Security',
  'Performance',
  'Accessibility',
  'Integration',
  'Regression',
]);

export const RequirementSchema = z.object({
  reqCode: z.string(),
  title: z.string().min(3),
  category: z.string(),
  userStory: z.string().min(10),
  acceptanceCriteria: z.array(z.string().min(3)).min(1),
  priority: PrioritySchema,
  riskLevel: RiskLevelSchema,
  tags: z.array(z.string()),
});

export const RequirementAnalysisResponseSchema = z.object({
  summary: z.string(),
  domain: z.string(),
  requirements: z.array(RequirementSchema),
  userJourneys: z.array(
    z.object({
      name: z.string(),
      steps: z.array(z.string()),
    })
  ),
  riskAreas: z.array(z.string()),
});

export const ScenarioSchema = z.object({
  scenarioCode: z.string(),
  reqCode: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  category: ScenarioCategorySchema,
  priority: PrioritySchema,
  risk: RiskLevelSchema,
  coverage: z.number().min(0).max(100),
});

export const ScenarioGenerationResponseSchema = z.object({
  scenarios: z.array(ScenarioSchema),
});

export const TestStepSchema = z.object({
  stepNumber: z.number(),
  action: z.string(),
  target: z.string().optional(),
  inputData: z.string().optional(),
  expectedResult: z.string(),
});

export const AIQualityScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  requirementCoverage: z.number().min(0).max(100),
  edgeCaseCoverage: z.number().min(0).max(100),
  assertionQuality: z.number().min(0).max(100),
  selectorStability: z.number().min(0).max(100),
  maintainability: z.number().min(0).max(100),
});

export const TestCaseSchema = z.object({
  testCaseCode: z.string(),
  scenarioCode: z.string(),
  reqCode: z.string(),
  title: z.string().min(5),
  description: z.string(),
  preconditions: z.array(z.string()),
  testData: z.record(z.string()),
  steps: z.array(TestStepSchema).min(1),
  expectedResult: z.string().min(5),
  priority: PrioritySchema,
  severity: PrioritySchema,
  qualityScore: AIQualityScoreSchema,
  tags: z.array(z.string()),
});

export const TestCaseGenerationResponseSchema = z.object({
  testCases: z.array(TestCaseSchema),
});

export const CodeGenerationResponseSchema = z.object({
  pageObjects: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      code: z.string(),
      selectors: z.array(
        z.object({
          name: z.string(),
          selector: z.string(),
          description: z.string(),
        })
      ),
      methods: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          signature: z.string(),
        })
      ),
    })
  ),
  testFiles: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      code: z.string(),
      testCaseCodes: z.array(z.string()),
    })
  ),
});

export const FailureAnalysisResponseSchema = z.object({
  rootCause: z.string(),
  category: z.enum([
    'UI Error',
    'API Error',
    'Timeout',
    'Assertion Failure',
    'Authentication',
    'Network',
    'Selector Changed',
  ]),
  confidence: z.number().min(0).max(100),
  evidence: z.array(z.string()),
  suggestedFix: z.string(),
  likelyRegression: z.boolean(),
  relatedTestCodes: z.array(z.string()),
  selfHealingProposal: z
    .object({
      pageObject: z.string(),
      elementName: z.string(),
      originalSelector: z.string(),
      suggestedSelector: z.string(),
      confidence: z.number(),
      codeDiff: z.object({
        filePath: z.string(),
        originalLines: z.array(z.string()),
        replacementLines: z.array(z.string()),
      }),
    })
    .optional(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().default(''),
  applicationUrl: z.string().url('Must be a valid URL').default('https://www.saucedemo.com/'),
  environment: z.enum(['development', 'staging', 'production', 'demo']).default('demo'),
  defaultBrowser: z.enum(['chromium', 'firefox', 'webkit', 'all']).default('chromium'),
  executionMode: z.enum(['local', 'saucelabs', 'cloud']).default('local'),
});

export const EmailReportSchema = z.object({
  recipients: z.array(z.string().email('Invalid email address')).min(1),
  subject: z.string().min(3),
  message: z.string().optional(),
  attachPdf: z.boolean().default(true),
});
