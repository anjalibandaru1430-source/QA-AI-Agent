import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, Eye, EyeOff, Lock, Mail, ArrowRight, GitBranch, UserCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useUserStore } from '../../stores/useUserStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { currentUser, login } = useUserStore();

  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      login(email);
      setIsLoading(false);

      const localName = email.split('@')[0].replace(/[._\d-]+/g, ' ');
      const formattedName = localName.charAt(0).toUpperCase() + localName.slice(1);

      addNotification({
        type: 'success',
        title: `Welcome, ${formattedName}!`,
        message: 'Successfully authenticated to QAgent Platform.',
      });
      navigate('/projects/proj_saucedemo_001/dashboard');
    }, 450);
  };

  const handleQuickDemoFill = (demoEmail = 'anjalibandaru1430@gmail.com') => {
    setEmail(demoEmail);
    setPassword('secret_qa_pass_2026');
    login(demoEmail, 'Anjali Bandaru');
    addNotification({
      type: 'info',
      title: 'Welcome, Anjali Bandaru',
      message: 'Signed in as QA Lead.',
    });
    navigate('/projects/proj_saucedemo_001/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-emerald-950/20"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4 shadow-sm">
            <Layers className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to QAgent</h1>
          <p className="text-xs text-slate-400 mt-1">Autonomous AI Quality Engineering Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <span className="text-[11px] text-emerald-400">Any password accepted for testing</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-950"
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In with My Account
          </Button>
        </form>

        {/* 1-Click Fast Sign-In */}
        <div className="mt-5 pt-5 border-t border-slate-800 space-y-2.5">
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={() => handleQuickDemoFill('anjalibandaru1430@gmail.com')}
            className="w-full text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30"
          >
            ⚡ 1-Click Sign-in as Anjali Bandaru (QA Lead)
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('anjalibandaru1430@gmail.com')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('anjalibandaru1430@gmail.com')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <span className="font-bold text-xs text-emerald-400">G</span>
              <span>Google</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 text-center text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
};
