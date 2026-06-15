import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear error when switching modes
    setError(null);
  }, [isSignUp]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let authError;
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        authError = error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        authError = error;
      }
      
      if (authError) throw authError;
      
      // On success, the session will be updated and App.tsx will handle the redirect via fUser change
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-vivid-blue selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden noise">
      {/* Liquid Glass Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-vivid-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pale-blue/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full liquid-flare opacity-30" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 sm:p-12 border-white/10 rounded-sm relative z-10 shadow-2xl backdrop-blur-3xl"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Landing
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-display uppercase tracking-[0.2em] text-white">
            {isSignUp ? 'Create Account' : 'Identity Verification'}
          </h1>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-xs font-medium uppercase tracking-widest leading-relaxed"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-white transition-all text-sm text-white placeholder:text-white/20"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-white transition-all text-sm text-white placeholder:text-white/20"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-vivid-blue transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-3"
          >
            {isLoading ? "Processing..." : (isSignUp ? <><UserPlus className="w-4 h-4" /> Sign Up</> : <><LogIn className="w-4 h-4" /> Sign In</>)}
          </button>

          <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Link 
              to={isSignUp ? "/login" : "/signup"}
              className="text-white text-xs font-bold uppercase tracking-widest hover:text-white/70 transition-colors"
            >
              {isSignUp ? "Log In Here" : "Create Account"}
            </Link>
          </div>
        </form>
      </motion.div>
      
      <div className="mt-12 text-[10px] text-white/20 font-mono tracking-widest uppercase relative z-10">
        Synchronized Productivity © 2026
      </div>
    </div>
  );
}
