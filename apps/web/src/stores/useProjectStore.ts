import { create } from 'zustand';
import { Project } from '@qagent/shared';
import { api } from '../services/api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  setCurrentProject: (project: Project) => void;
  selectProjectById: (id: string) => void;
  createProject: (data: any) => Promise<Project>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getProjects();
      set({
        projects: res.projects,
        currentProject: get().currentProject || res.projects[0] || null,
        isLoading: false,
      });
    } catch (err: any) {
      // Offline / fallback default demo project
      const fallbackProject: Project = {
        id: 'proj_saucedemo_001',
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
          emailRecipients: ['qa-lead@qagent.io'],
        },
        stats: {
          totalRequirements: 6,
          totalScenarios: 12,
          totalTestCases: 32,
          passRate: 90.6,
          activeBugs: 2,
        },
      };

      set({
        projects: [fallbackProject],
        currentProject: fallbackProject,
        isLoading: false,
      });
    }
  },

  setCurrentProject: (project: Project) => {
    set({ currentProject: project });
  },

  selectProjectById: (id: string) => {
    const found = get().projects.find((p) => p.id === id);
    if (found) {
      set({ currentProject: found });
    }
  },

  createProject: async (data: any) => {
    try {
      const res = await api.createProject(data);
      set((state) => ({
        projects: [res.project, ...state.projects],
        currentProject: res.project,
      }));
      return res.project;
    } catch (e: any) {
      // Fallback optimistic creation
      const localProj: Project = {
        id: `proj_${Date.now()}`,
        name: data.name,
        description: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          applicationUrl: data.applicationUrl || 'https://www.saucedemo.com/',
          environment: data.environment || 'demo',
          defaultBrowser: data.defaultBrowser || 'chromium',
          executionMode: data.executionMode || 'local',
          parallelWorkers: 4,
          timeoutMs: 30000,
          viewportWidth: 1280,
          viewportHeight: 800,
          autoJiraOnFailure: true,
          selfHealingEnabled: true,
          emailRecipients: ['qa-lead@qagent.io'],
        },
        stats: {
          totalRequirements: 0,
          totalScenarios: 0,
          totalTestCases: 0,
          passRate: 100,
          activeBugs: 0,
        },
      };
      set((state) => ({
        projects: [localProj, ...state.projects],
        currentProject: localProj,
      }));
      return localProj;
    }
  },
}));
