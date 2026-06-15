import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './lib/utils';
import demoVideo from './demo/teamsync-demo.mp4';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-vivid-blue selection:text-black overflow-x-hidden noise">
      {/* Liquid Glass Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-vivid-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pale-blue/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full liquid-flare opacity-30" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="h-20 px-6 sm:px-12 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center">
            <h1 className="text-[11px] font-display font-bold uppercase tracking-[0.3em] text-white">Team Sync</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/login"
              className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup"
              className="px-5 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-vivid-blue transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-20 sm:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-vivid-blue animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Version 2.0 Out</span>
            </div>
            
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tight leading-tight mb-8 text-white">
              Stop Asking <br />
              "When are you free?"
            </h2>
            
            <p className="text-white/40 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Stop the scheduling drain. If Google Calendar isn't enough for team management, find the perfect window instantly. 
              Just check the app.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-vivid-blue hover:shadow-[0_0_30px_rgba(125,249,255,0.4)] transition-all flex items-center justify-center gap-3 group"
              >
                Join the Sync
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Demo Section */}
        <section className="px-6 py-20 bg-zinc-950/40 border-y border-white/5 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-vivid-blue/10 blur-[120px] rounded-full" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col items-center mb-16">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-vivid-blue uppercase mb-4">Operational Demo</h3>
              <h2 className="text-3xl font-display uppercase tracking-widest text-white">Visual Intelligence</h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-4xl mx-auto rounded-sm border border-white/10 bg-black/60 shadow-2xl relative group overflow-hidden"
            >
              <video 
                src={demoVideo} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Design Overlay Elements for Aesthetic */}
              <div className="absolute top-4 left-4 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
              </div>
              <div className="absolute top-4 right-4 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                System: 0x24F | Live Preview
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-32 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6 group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center group-hover:border-vivid-blue/50 transition-colors">
              <Users className="w-6 h-6 text-vivid-blue" />
            </div>
            <h4 className="text-xl font-display uppercase tracking-widest">Multi-User Sync</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              Real-time collaboration across timezones. See exactly who is available when, without the back-and-forth emails.
            </p>
          </div>
          
          <div className="space-y-6 group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center group-hover:border-vivid-blue/50 transition-colors">
              <Clock className="w-6 h-6 text-vivid-blue" />
            </div>
            <h4 className="text-xl font-display uppercase tracking-widest">Sync Intelligence</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              Our alignment engine automatically identifies the optimal synchronization windows for your entire squad.
            </p>
          </div>
          
          <div className="space-y-6 group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center group-hover:border-vivid-blue/50 transition-colors">
              <Shield className="w-6 h-6 text-vivid-blue" />
            </div>
            <h4 className="text-xl font-display uppercase tracking-widest">Encrypted Identity</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              Enterprise-grade security powered by Supabase. Your team's availability data is protected and private.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section id="auth" className="px-6 py-32 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            <h3 className="text-[10px] font-black tracking-[0.4em] text-vivid-blue uppercase">Finalize Synchronization</h3>
            <h2 className="text-4xl font-display uppercase tracking-widest text-white">Ready to align?</h2>
            <Link 
              to="/signup"
              className="px-12 py-6 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-vivid-blue transition-all"
            >
              Enter the Sync
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-20 border-t border-white/5 bg-black/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-vivid-blue">Meet the Developer</h3>
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Moriarty</p>
                <div className="flex gap-6 mt-2">
                  <a href="mailto:sudosummonmoriarty@gmail.com" className="text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> sudosummonmoriarty@gmail.com
                  </a>
                  <a href="https://github.com/MoriartyLink" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                    GitHub
                  </a>
                </div>
              </div>
              <p className="text-[10px] text-white/10 font-mono tracking-widest uppercase mt-4">
                Synchronized Productivity © 2026
              </p>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
              <a href="#" className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

