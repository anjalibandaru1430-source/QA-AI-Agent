import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Bot,
  PlayCircle,
  FileCode2,
  Bug,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    { title: '1. PRD Ingestion', desc: 'Upload PDF, Markdown, or paste PRD spec. AI parses user stories and acceptance criteria.' },
    { title: '2. AI Analysis', desc: 'Synthesizes functional, negative, security, and boundary test scenarios automatically.' },
    { title: '3. Test Cases', desc: 'Designs 30+ detailed step-by-step test cases with AI Quality Scores and assertions.' },
    { title: '4. Playwright Code', desc: 'Emits structured TypeScript Page Object Models and spec test suites in Monaco.' },
    { title: '5. Execution', desc: 'Dispatches tests across 4 parallel workers with live browser simulation and terminal logs.' },
    { title: '6. AI Healing', desc: 'Detects broken DOM locators and generates instant self-healing selector diffs.' },
    { title: '7. Jira Issues', desc: 'Formats actionable Jira bug tickets with repro steps, stack traces, and screenshots.' },
    { title: '8. Final Report', desc: 'Delivers executive summary, coverage matrix, PDF download, and Nodemailer email dispatch.' },
  ];

  const featureCards = [
    {
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      title: 'AI Test Generation',
      desc: 'Transforms ambiguous PRD documents into structured, traceable test scenarios with 98% domain coverage.',
    },
    {
      icon: <FileCode2 className="w-5 h-5 text-sky-400" />,
      title: 'Automated Playwright Code',
      desc: 'Generates Page Object Models and typed TypeScript tests following enterprise best practices.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Parallel Execution',
      desc: 'Runs test suites across multi-worker browser pools in Chromium, Firefox, and WebKit simultaneously.',
    },
    {
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      title: 'Real-Time Monitoring',
      desc: 'Streams live browser viewport states, xterm.js terminal output, and step progress via WebSockets.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: 'AI Failure Analysis',
      desc: 'Isolates root causes, regression indicators, and API payload discrepancies in milliseconds.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-pink-400" />,
      title: 'Self-Healing Tests',
      desc: 'Detects selector drift and proposes verified CSS/XPath replacements with interactive code diffs.',
    },
    {
      icon: <Bug className="w-5 h-5 text-rose-400" />,
      title: 'Jira Integration',
      desc: 'Automatically files Jira bug tickets complete with reproduction steps, logs, and screenshots.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      title: 'Advanced Analytics',
      desc: 'Interactive coverage matrix, multi-factor risk heatmap, and automated PDF/email executive reporting.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base shadow-sm">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">QAgent</span>
              <span className="text-[10px] text-slate-400 font-mono ml-2 border border-slate-800 px-1.5 py-0.5 rounded">
                v2.4 SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors">
              Sign In
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/projects/proj_saucedemo_001/dashboard')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Platform
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          From Product Requirements to Automated Tests — Automatically.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-tight"
        >
          Turn Product Requirements Into{' '}
          <span className="text-emerald-400">Automated Tests</span> With AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          AI analyzes your requirements, generates comprehensive test cases, writes Playwright scripts,
          executes them, analyzes failures, and creates actionable bug reports.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/projects/proj_saucedemo_001/dashboard')}
            leftIcon={<Zap className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Testing
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/projects/proj_saucedemo_001/execution')}
            leftIcon={<PlayCircle className="w-4 h-4 text-emerald-400" />}
          >
            View Live Demo Run
          </Button>
        </motion.div>

        {/* Live Product Preview Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 rounded-2xl bg-slate-900/90 border border-slate-800 p-3 shadow-2xl shadow-emerald-950/20 max-w-5xl mx-auto text-left"
        >
          <div className="h-9 px-4 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-300">qagent-engine // SauceDemo QA Execution #1042</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-emerald-400 font-medium text-[11px]">32 / 32 Completed (90.6%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs font-mono text-slate-400 uppercase">Extracted Requirements</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">6 REQs</div>
              <p className="text-[11px] text-emerald-400 mt-1">✓ 100% Acceptance Criteria Mapped</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs font-mono text-slate-400 uppercase">Test Suite Volume</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">32 Test Cases</div>
              <p className="text-[11px] text-sky-400 mt-1">✓ 5 Page Object Models Emitted</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs font-mono text-slate-400 uppercase">AI Self-Healing</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">94% Confidence</div>
              <p className="text-[11px] text-pink-400 mt-1">✓ 1 Jira Bug Automatically Filed</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Product Workflow */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="success" className="font-mono mb-3">
            End-To-End Autonomous Pipeline
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            How QAgent Automates Quality Engineering
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            From raw product specs to Playwright code generation, live browser orchestration, and Jira ticket creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => (
            <Card
              key={idx}
              hoverable
              onClick={() => setActiveWorkflowStep(idx)}
              className={`p-5 text-left transition-all ${
                activeWorkflowStep === idx
                  ? 'border-emerald-500/80 bg-slate-900 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold">
                  Step 0{idx + 1}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="purple" className="font-mono mb-3">
            Core Capabilities
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Architected For Enterprise Quality Teams
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Everything modern QA automation engineers need to eliminate manual test authoring and maintain continuous quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((feat, idx) => (
            <Card key={idx} hoverable className="p-5 bg-slate-900/60 border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center border-t border-slate-800/60">
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to Automate Your QA Pipeline?
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Experience the complete autonomous workflow with pre-configured SauceDemo test suites and AI self-healing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/projects/proj_saucedemo_001/dashboard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open QAgent Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-900 text-center text-xs text-slate-400 font-mono">
        QAgent Quality Engineering Platform © 2026. Built with React, Vite, Playwright, and Node.js.
      </footer>
    </div>
  );
};
