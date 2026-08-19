import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bot,
  Globe,
  Mail,
  CheckCircle2,
  Lock,
  Server,
  Save,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';

export const SettingsPage: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const [jiraUrl, setJiraUrl] = useState('https://qagent-demo.atlassian.net');
  const [jiraEmail, setJiraEmail] = useState('qa-lead@qagent.io');
  const [jiraToken, setJiraToken] = useState('••••••••••••••••••••••••••••••••');
  const [jiraProjectKey, setJiraProjectKey] = useState('QA');
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiModel, setAiModel] = useState('gpt-4o');
  const [sauceUser, setSauceUser] = useState('qagent_demo_user');
  const [sauceKey, setSauceKey] = useState('••••••••••••••••');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Jira API, AI provider, and cloud execution credentials saved securely.',
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          Project Settings & Cloud Integrations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage Jira defect synchronization, AI engine models, Sauce Labs execution grid, and email alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Jira REST API Configuration */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                JIRA
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Atlassian Jira REST Integration</h3>
                <p className="text-xs text-slate-400">Automate bug creation and ticket lifecycle tracking</p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>Connected</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Jira Base URL</label>
              <input
                type="url"
                value={jiraUrl}
                onChange={(e) => setJiraUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Service Account Email</label>
              <input
                type="email"
                value={jiraEmail}
                onChange={(e) => setJiraEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Jira API Token</label>
              <input
                type="password"
                value={jiraToken}
                onChange={(e) => setJiraToken(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Project Key</label>
              <input
                type="text"
                value={jiraProjectKey}
                onChange={(e) => setJiraProjectKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase"
              />
            </div>
          </div>
        </Card>

        {/* AI Provider & Models */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">AI Engine & Model Selection</h3>
                <p className="text-xs text-slate-400">Underlying LLM pipeline provider</p>
              </div>
            </div>
            <Badge variant="purple" size="sm">Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Provider</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                <option value="gemini">Google (Gemini 1.5 Pro)</option>
                <option value="ollama">Local Ollama / Llama 3</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Model Name</label>
              <input
                type="text"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Sauce Labs Cloud Grid */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Sauce Labs Real Device Cloud</h3>
                <p className="text-xs text-slate-400">Cross-browser and mobile cloud infrastructure</p>
              </div>
            </div>
            <Badge variant="outline" size="sm">Optional</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Sauce Username</label>
              <input
                type="text"
                value={sauceUser}
                onChange={(e) => setSauceUser(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Access Key</label>
              <input
                type="password"
                value={sauceKey}
                onChange={(e) => setSauceKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};
