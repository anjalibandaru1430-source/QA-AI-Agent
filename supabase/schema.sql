-- QAgent Supabase PostgreSQL Schema
-- Run this in your Supabase Project -> SQL Editor to initialize all tables

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb
);

-- 2. PRD Documents Table
CREATE TABLE IF NOT EXISTS prds (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  raw_content TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  version TEXT DEFAULT '1.0.0',
  parsed_summary TEXT,
  status TEXT DEFAULT 'draft'
);

-- 3. Requirements Table
CREATE TABLE IF NOT EXISTS requirements (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  req_code TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  user_story TEXT NOT NULL,
  acceptance_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority TEXT DEFAULT 'medium',
  risk_level TEXT DEFAULT 'medium',
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Test Scenarios Table
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  requirement_id TEXT,
  req_code TEXT NOT NULL,
  scenario_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  risk TEXT DEFAULT 'medium',
  coverage INT DEFAULT 100,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  scenario_id TEXT,
  requirement_id TEXT,
  req_code TEXT,
  test_case_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  preconditions JSONB DEFAULT '[]'::jsonb,
  test_data JSONB DEFAULT '{}'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  expected_result TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  severity TEXT DEFAULT 'medium',
  automation_status TEXT DEFAULT 'automated',
  is_approved BOOLEAN DEFAULT TRUE,
  quality_score JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Test Executions Table
CREATE TABLE IF NOT EXISTS executions (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  execution_number INT NOT NULL,
  status TEXT DEFAULT 'completed',
  browser TEXT DEFAULT 'chromium',
  environment TEXT DEFAULT 'demo',
  execution_mode TEXT DEFAULT 'local',
  total_tests INT DEFAULT 0,
  completed_tests INT DEFAULT 0,
  passed_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  skipped_count INT DEFAULT 0,
  running_count INT DEFAULT 0,
  progress_percent INT DEFAULT 100,
  duration_ms BIGINT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  results JSONB DEFAULT '[]'::jsonb,
  workers JSONB DEFAULT '[]'::jsonb,
  logs JSONB DEFAULT '[]'::jsonb
);

-- 7. Failure Analyses & Self-Healing Table
CREATE TABLE IF NOT EXISTS failures (
  id TEXT PRIMARY KEY,
  test_result_id TEXT,
  test_case_code TEXT NOT NULL,
  root_cause TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence INT DEFAULT 95,
  evidence JSONB DEFAULT '[]'::jsonb,
  suggested_fix TEXT,
  likely_regression BOOLEAN DEFAULT FALSE,
  related_test_codes JSONB DEFAULT '[]'::jsonb,
  self_healing_proposal JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bugs & Jira Issues Table
CREATE TABLE IF NOT EXISTS bugs (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  bug_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'high',
  priority TEXT DEFAULT 'high',
  status TEXT DEFAULT 'detected',
  jira_issue_key TEXT,
  jira_issue_url TEXT,
  test_case_code TEXT NOT NULL,
  steps_to_reproduce JSONB DEFAULT '[]'::jsonb,
  expected_result TEXT,
  actual_result TEXT,
  environment TEXT,
  browser TEXT,
  ai_root_cause TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QA Executive Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  execution_id TEXT,
  execution_number INT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  project_name TEXT NOT NULL,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  executive_summary TEXT,
  recommendations JSONB DEFAULT '[]'::jsonb,
  coverage_stats JSONB DEFAULT '{}'::jsonb,
  failed_test_summaries JSONB DEFAULT '[]'::jsonb
);
