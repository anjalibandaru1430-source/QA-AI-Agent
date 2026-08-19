import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useProjectStore } from '../../stores/useProjectStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { Globe, Server, Monitor, Shield } from 'lucide-react';

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProjectStore();
  const { addNotification } = useNotificationStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('https://www.saucedemo.com/');
  const [environment, setEnvironment] = useState<'development' | 'staging' | 'production' | 'demo'>('demo');
  const [browser, setBrowser] = useState<'chromium' | 'firefox' | 'webkit' | 'all'>('chromium');
  const [executionMode, setExecutionMode] = useState<'local' | 'saucelabs' | 'cloud'>('local');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const proj = await createProject({
        name,
        description,
        applicationUrl,
        environment,
        defaultBrowser: browser,
        executionMode,
      });

      addNotification({
        type: 'success',
        title: 'Project Created',
        message: `Project "${proj.name}" was successfully configured.`,
      });

      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: err.message || 'Could not create project',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New QA Project"
      description="Configure your application target and AI test generation parameters."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-slate-300 mb-1.5">Project Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Swag Labs Storefront QA"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-300 mb-1.5">Description</label>
          <textarea
            rows={2}
            placeholder="Briefly describe the scope of automated QA testing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-300 mb-1.5">Application Target URL *</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              required
              placeholder="https://www.saucedemo.com/"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Environment</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="demo">Demo / Mock</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
              <option value="production">Production</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Default Browser</label>
            <select
              value={browser}
              onChange={(e) => setBrowser(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="chromium">Chromium (Chrome/Edge)</option>
              <option value="firefox">Firefox</option>
              <option value="webkit">WebKit (Safari)</option>
              <option value="all">All Browsers (Matrix)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-300 mb-1.5">Execution Engine Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'local', title: 'Local Playwright', desc: 'Parallel local workers' },
              { id: 'saucelabs', title: 'Sauce Labs Cloud', desc: 'Cross-browser grid' },
              { id: 'cloud', title: 'Managed Cloud', desc: 'Hosted runners' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setExecutionMode(m.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  executionMode === m.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-[11px]">{m.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
