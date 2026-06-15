import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Mail, Github, MessageSquare, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import demoVideo from './demo/teamsync-demo.mp4';
import splashVideo from './demo/spashscreen.mp4';
import logo from './elements/logo.png';
import story1 from './elements/story1.png';
import nonUsers from './elements/non-users.png';

interface MarketingLandingProps {
  onGetStarted: () => void;
}

export default function MarketingLanding({ onGetStarted }: MarketingLandingProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // Increased fallback to 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col relative overflow-x-hidden noise selection:bg-vivid-blue selection:text-black">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video 
              src={splashVideo}
              autoPlay 
              muted 
              playsInline
              className="max-w-full max-h-full object-contain"
              onEnded={() => setShowSplash(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-vivid-blue/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pale-blue/5 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full liquid-flare opacity-50" />
      </div>

      {/* Navigation Bar */}
      <nav className="h-20 w-full bg-black/60 backdrop-blur-2xl border-b border-white/10 px-8 md:px-16 flex items-center justify-between fixed top-0 z-50 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-5">
          <img src={logo} alt="Team Sync Logo" className="w-10 h-10 object-contain" />
          <span className="text-[13px] font-display font-bold uppercase tracking-[0.35em] text-white hidden sm:block">Team Sync</span>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          {[
            { name: 'Features', id: 'features' },
            { name: 'Who', id: 'who' },
            { name: 'Why', id: 'why' },
            { name: 'Demo', id: 'demo' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-vivid-blue transition-colors relative group"
            >
              {item.name}
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-vivid-blue transition-all group-hover:w-full" />
            </button>
          ))}
        </div>
        
        <button 
          onClick={onGetStarted}
          className="px-8 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.25em] transition-all active:scale-95"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center pt-48 pb-48 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col items-center"
        >
          <div className="text-center max-w-5xl px-8 mb-32">
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-[0.15em] mb-24 leading-[1.2] drop-shadow-[0_0_30px_rgba(125,249,255,0.15)] text-white pt-12 md:pt-20">
              Synchronize <br />
              Your Team
            </h1>
            
            <p className="text-white/60 text-xs md:text-lg font-bold uppercase tracking-[0.15em] max-w-3xl mx-auto leading-relaxed mb-48">
              Stop wasting hours on the meeting management puzzle <br className="hidden md:block" /> and start aligning in seconds.
            </p>

            {/* Features Section */}
            <div id="features" className="w-full max-w-4xl mx-auto mb-32 scroll-mt-48">
              <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.2em] text-white mb-24 text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass p-12 rounded-sm text-left border-l-2 border-l-vivid-blue/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-2.5 h-2.5 bg-vivid-blue rounded-full shadow-[0_0_10px_rgba(125,249,255,1)]" />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Simple Alignment</span>
                  </div>
                  <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                    Skip the back-and-forth. Visualize the entire team's availability in a single, high-fidelity matrix that does the thinking for you.
                  </p>
                </div>
                
                <div className="glass p-12 rounded-sm text-left border-l-2 border-l-vivid-blue/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-2.5 h-2.5 bg-vivid-blue rounded-full shadow-[0_0_10px_rgba(125,249,255,1)]" />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Fast Sync</span>
                  </div>
                  <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                    Built for teams that move fast. Instant updates across all devices ensure you never waste energy on stale scheduling data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Context Sections */}
          <div className="w-full mb-64 space-y-48 flex flex-col items-center">
            {/* Who should use section - FULL WIDTH */}
            <div id="who" className="relative w-full overflow-hidden p-12 md:p-32 text-left group min-h-[600px] flex items-center justify-center border-y border-white/5 scroll-mt-48">
              <div className="absolute inset-0 z-0">
                <img 
                  src={nonUsers} 
                  alt="Traditional Scheduling Friction" 
                  className="w-full h-full object-cover opacity-20 grayscale transition-all duration-1000 group-hover:opacity-40 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
              </div>
              <div className="relative z-20 space-y-12 max-w-5xl w-full px-8">
                <h2 className="text-2xl md:text-5xl font-display font-bold uppercase tracking-[0.2em] text-white">Who should use?</h2>
                <ul className="space-y-6 max-w-2xl">
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 bg-vivid-blue rounded-full mt-2 shadow-[0_0_8px_rgba(125,249,255,1)] shrink-0" />
                    <p className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      Engineering squads, product teams, and high-growth startups where time is the most precious resource.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 bg-vivid-blue rounded-full mt-2 shadow-[0_0_8px_rgba(125,249,255,1)] shrink-0" />
                    <p className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      Teams drowning in meeting requests and fragmented schedules looking to stop the mental drain.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 bg-vivid-blue rounded-full mt-2 shadow-[0_0_8px_rgba(125,249,255,1)] shrink-0" />
                    <p className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      Remote-first or hybrid organizations that need to keep everyone on the same pulse across time zones.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Why Should use section */}
            <div id="why" className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center text-left max-w-5xl px-8 scroll-mt-32">
              <div className="space-y-8">
                <h2 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-[0.2em] text-white">Why Should use?</h2>
                <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                  In a world of fragmented schedules and constant context switching, alignment has become a chore. 
                  Team Sync was designed to reclaim your mental energy by making availability visible and synchronization effortless. 
                  Stop fighting the calendar and start working in harmony.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-vivid-blue/10 blur-[60px] rounded-full" />
                <img 
                  src={story1} 
                  alt="Synchronization Narrative" 
                  className="relative w-full h-auto glass rounded-sm p-1.5 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center px-8">
            {/* Demo Video Section */}
            <div id="demo" className="w-full max-w-6xl mx-auto mb-64 scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.2em] text-white mb-24 text-center">Demo</h2>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="glass p-1.5 rounded-lg shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-vivid-blue/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-md overflow-hidden bg-zinc-950 border border-white/5">
                  <video 
                    src={demoVideo}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-auto opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-12"
            >
              <button 
                onClick={onGetStarted}
                className="group relative px-20 py-8 bg-white text-black font-black text-sm uppercase tracking-[0.6em] rounded-sm hover:invert transition-all flex items-center gap-5 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No Credit Card Required / Instant Initialization</p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer / Meet the Developer */}
      <footer className="w-full bg-black/60 backdrop-blur-3xl border-t border-white/10 py-32 px-8 md:px-16 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div className="flex items-center gap-5 mb-6">
               <div className="w-12 h-1 bg-vivid-blue" />
               <span className="text-[9px] font-black tracking-[0.35em] text-vivid-blue uppercase">Meet the Developer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display uppercase tracking-[0.35em] text-white">Moriarty</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.45em] mb-6">Connection</h3>
              <a href="mailto:sudosummonmoriarty@gmail.com" className="flex items-center gap-4 text-white/50 hover:text-white transition-colors group">
                <div className="p-3 bg-white/5 rounded-sm border border-white/5 group-hover:border-vivid-blue/30">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">Direct Mail</span>
              </a>
              <a href="https://github.com/MoriartyLink" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white/50 hover:text-white transition-colors group">
                <div className="p-3 bg-white/5 rounded-sm border border-white/5 group-hover:border-vivid-blue/30">
                  <Github className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">Source / GitHub</span>
              </a>
            </div>

            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.45em] mb-6">Feedback</h3>
              <a href="https://github.com/MoriartyLink/team-availability-matrix/issues" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white/50 hover:text-white transition-colors group">
                <div className="p-3 bg-white/5 rounded-sm border border-white/5 group-hover:border-vivid-blue/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">Issue Tracker</span>
              </a>
              <div className="pt-6">
                <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.25em] leading-loose">
                  © 2026 Team Sync App <br />
                  All Rights Reserved. <br />
                  Built with React + Supabase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
