import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { PrdPage } from './features/prd/PrdPage';
import { ScenariosPage } from './features/scenarios/ScenariosPage';
import { TestCasesPage } from './features/testCases/TestCasesPage';
import { CodeGenPage } from './features/codeGen/CodeGenPage';
import { ExecutionPage } from './features/execution/ExecutionPage';
import { FailuresPage } from './features/failures/FailuresPage';
import { BugsPage } from './features/bugs/BugsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { AgentsPage } from './features/agents/AgentsPage';
import { CoveragePage } from './features/coverage/CoveragePage';
import { SettingsPage } from './features/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Quick Redirects */}
          <Route path="/dashboard" element={<Navigate to="/projects/proj_saucedemo_001/dashboard" replace />} />
          <Route path="/projects" element={<Navigate to="/projects/proj_saucedemo_001/dashboard" replace />} />

          {/* Authenticated Project App Shell */}
          <Route path="/projects/:projectId" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="prd" element={<PrdPage />} />
            <Route path="scenarios" element={<ScenariosPage />} />
            <Route path="test-cases" element={<TestCasesPage />} />
            <Route path="code" element={<CodeGenPage />} />
            <Route path="execution" element={<ExecutionPage />} />
            <Route path="failures" element={<FailuresPage />} />
            <Route path="self-healing" element={<FailuresPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="coverage" element={<CoveragePage />} />
            <Route path="bugs" element={<BugsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
export default App;
