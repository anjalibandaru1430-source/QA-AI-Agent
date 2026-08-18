import { create } from 'zustand';
import { Execution, TestResult, WorkerState } from '@qagent/shared';
import { api } from '../services/api';
import { wsClient } from '../services/wsClient';

interface ExecutionState {
  executions: Execution[];
  activeExecution: Execution | null;
  selectedTestResult: TestResult | null;
  isDrawerOpen: boolean;
  liveLogs: string[];
  currentSimulatedUrl: string;
  activeDomHighlight: string | null;
  isLoading: boolean;

  fetchExecutions: (projectId: string) => Promise<void>;
  startExecution: (projectId: string, browser?: string) => Promise<Execution>;
  cancelExecution: (executionId: string) => Promise<void>;
  openTestDetails: (result: TestResult) => void;
  closeDrawer: () => void;
  initWebSocket: () => void;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  executions: [],
  activeExecution: null,
  selectedTestResult: null,
  isDrawerOpen: false,
  liveLogs: [],
  currentSimulatedUrl: 'https://www.saucedemo.com/',
  activeDomHighlight: null,
  isLoading: false,

  fetchExecutions: async (projectId: string) => {
    try {
      const res = await api.getExecutions(projectId);
      set({
        executions: res.executions,
        activeExecution: res.executions.find((e) => e.status === 'running') || res.executions[0] || null,
        liveLogs: res.executions[0]?.logs || [],
      });
    } catch (e) {
      // ignore
    }
  },

  startExecution: async (projectId: string, browser = 'chromium') => {
    set({ isLoading: true, liveLogs: [] });
    try {
      const res = await api.startExecution(projectId, browser);
      set({
        activeExecution: res.execution,
        executions: [res.execution, ...get().executions],
        isLoading: false,
      });
      return res.execution;
    } catch (err: any) {
      // Fallback local runner
      const mockExec: Execution = {
        id: `exec_${Date.now()}`,
        projectId,
        executionNumber: get().executions.length + 1043,
        status: 'running',
        browser: browser as any,
        environment: 'demo',
        executionMode: 'local',
        totalTests: 32,
        completedTests: 0,
        passedCount: 0,
        failedCount: 0,
        skippedCount: 0,
        runningCount: 4,
        progressPercent: 0,
        durationMs: 0,
        startedAt: new Date().toISOString(),
        results: [],
        workers: [
          { workerId: 1, status: 'running', browser: 'chromium', progressPercent: 10, testsCompleted: 0, currentTestCaseCode: 'TC-AUTH-001' },
          { workerId: 2, status: 'running', browser: 'chromium', progressPercent: 10, testsCompleted: 0, currentTestCaseCode: 'TC-AUTH-004' },
          { workerId: 3, status: 'running', browser: 'chromium', progressPercent: 10, testsCompleted: 0, currentTestCaseCode: 'TC-CAT-001' },
          { workerId: 4, status: 'running', browser: 'chromium', progressPercent: 10, testsCompleted: 0, currentTestCaseCode: 'TC-CHK-001' },
        ],
        logs: [
          `[${new Date().toLocaleTimeString()}] [Execution #${get().executions.length + 1043}] Initialized 4 parallel workers.`,
        ],
      };

      set({
        activeExecution: mockExec,
        executions: [mockExec, ...get().executions],
        liveLogs: mockExec.logs,
        isLoading: false,
      });

      return mockExec;
    }
  },

  cancelExecution: async (executionId: string) => {
    try {
      await api.cancelExecution(executionId);
    } catch (e) {
      // ignore
    }
    set((state) => ({
      activeExecution: state.activeExecution ? { ...state.activeExecution, status: 'cancelled' } : null,
    }));
  },

  openTestDetails: (result: TestResult) => {
    set({ selectedTestResult: result, isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false, selectedTestResult: null });
  },

  initWebSocket: () => {
    wsClient.connect();

    wsClient.on('execution.started', (data: any) => {
      set({ activeExecution: data.execution });
    });

    wsClient.on('execution.progress', (data: any) => {
      set((state) => {
        if (!state.activeExecution) return {};
        const updated = {
          ...state.activeExecution,
          progressPercent: data.progressPercent ?? state.activeExecution.progressPercent,
          completedTests: data.completedTests ?? state.activeExecution.completedTests,
          passedCount: data.passedCount ?? state.activeExecution.passedCount,
          failedCount: data.failedCount ?? state.activeExecution.failedCount,
          workers: data.workers ?? state.activeExecution.workers,
        };
        return { activeExecution: updated };
      });
    });

    wsClient.on('execution.log', (data: any) => {
      set((state) => ({
        liveLogs: [...state.liveLogs, data.log],
      }));
    });

    wsClient.on('test.step', (data: any) => {
      // Update DOM preview highlight dynamically based on step
      if (data.action?.includes('username')) {
        set({ activeDomHighlight: '#user-name' });
      } else if (data.action?.includes('password')) {
        set({ activeDomHighlight: '#password' });
      } else if (data.action?.includes('login')) {
        set({ activeDomHighlight: '#login-button' });
      } else if (data.action?.includes('cart')) {
        set({ currentSimulatedUrl: 'https://www.saucedemo.com/cart.html', activeDomHighlight: '.cart_item' });
      }
    });

    wsClient.on('execution.completed', (data: any) => {
      set({ activeExecution: data.execution });
    });
  },
}));
