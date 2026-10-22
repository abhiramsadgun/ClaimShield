import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleQuickDemo = () => {
    setFormData({
      username: 'Review1_Judge',
      email: 'demo@claimshield.ai',
      password: 'password123'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.register(formData.username, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please check your credentials or backend status.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid relative overflow-hidden">
      
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-deep-700/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-deep-800 to-deep-750 border border-tan-400/30 shadow-glow-tan mb-3">
            <ShieldCheck className="w-9 h-9 text-tan-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Claim<span className="text-tan-400">Shield</span> AI
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Next-Gen Automated Verification & News Intelligence Engine
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel-glow rounded-2xl p-8 border border-tan-400/20 shadow-2xl">
          
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-deep-950/80 p-1 border border-deep-800 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                isLogin
                  ? 'bg-tan-500 text-deep-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                !isLogin
                  ? 'bg-tan-500 text-deep-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-deep-950/80 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-sm text-white placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="analyst@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-deep-950/80 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-deep-950/80 border border-deep-750 focus:border-tan-400 focus:ring-1 focus:ring-tan-400 text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-tan-500 to-tan-400 hover:from-tan-400 hover:to-tan-300 text-deep-950 font-extrabold text-sm tracking-wide shadow-glow-tan transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-deep-950 border-t-transparent"></div>
                  <span>Processing Authentication...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Access Verification Terminal' : 'Create Researcher Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Pre-fill for Live Presentation */}
          <div className="mt-6 pt-5 border-t border-deep-750/80 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="inline-flex items-center space-x-1.5 text-xs text-tan-400 hover:text-tan-300 font-semibold transition-colors bg-tan-500/10 px-3 py-1.5 rounded-lg border border-tan-400/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Academic Demo Credentials</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Academic Review-1 Live Prototype • JWT Secured & NewsAPI Ingested
        </p>

      </div>
    </div>
  );
};

export default Auth;
