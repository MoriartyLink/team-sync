import { useState, useEffect, FormEvent } from 'react';
import { Settings as SettingsIcon, Users2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';
import { 
  adminDeleteUser,
  requestAdminPrivileges,
  checkAdminStatus,
  purgeAllGroupData,
  adminToggleUserVisibility,
  createTeamCode,
  deleteTeamCode,
  syncTeamCodes,
  syncAllUsers
} from './lib/supabaseService';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [error, setError] = useState('');
  const [teamCodes, setTeamCodes] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [showCodeManager, setShowCodeManager] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'passcode'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        const isAdmin = await checkAdminStatus();
        if (isAdmin) {
          setIsAuthorized(true);
        } else {
          setAuthStep('passcode');
        }
      }
      setIsVerifying(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const unsubCodes = syncTeamCodes(setTeamCodes);
      const unsubUsers = syncAllUsers(setAllUsers);
      return () => {
        unsubCodes();
        unsubUsers();
      };
    }
  }, [isAuthorized]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      
      setIsAuthenticated(true);
      const isAdmin = await checkAdminStatus();
      if (isAdmin) {
        setIsAuthorized(true);
      } else {
        setAuthStep('passcode');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAuthorize = async (e: FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    try {
      await requestAdminPrivileges(passcode);
      setIsAuthorized(true);
    } catch (err: any) {
      setError('Authorization Failed: ' + (err.message || 'Check access code'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId || isDeleting) return;
    
    if (window.confirm('TERMINATION PROTOCOL: Are you sure you want to delete this user and all their data? This cannot be undone.')) {
      setIsDeleting(userId);
      try {
        await adminDeleteUser(userId);
      } catch (err: any) {
        console.error("Admin Deletion Error:", err);
        alert("Deletion failed: " + (err.message || "Unknown error"));
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handlePurgeTeam = async (groupId: string) => {
    const confirmCode = window.prompt(`DANGER: Purge requested for team code ${groupId}. This will delete EVERY user in this cluster. Enter the MASTER OVERRIDE CODE to authorize (TALKWARE2026):`);
    
    if (confirmCode === 'TALKWARE2026') {
      if (!groupId) return alert("No Team Access Code identified.");
      
      setIsPurging(true);
      try {
        const stats: any = await purgeAllGroupData(groupId);
        alert(`PURGE COMPLETE: ${stats.usersRemoved} nodes deactivated. ${stats.recordsRemoved} records destroyed.`);
      } catch (err: any) {
        alert("Purge failed: " + err.message);
      } finally {
        setIsPurging(false);
      }
    } else if (confirmCode !== null) {
      alert("INCORRECT MASTER CODE. PURGE ABORTED.");
    }
  };

  const [isCreatingCode, setIsCreatingCode] = useState(false);

  const handleCreateCode = async () => {
    if (!newCode) return;
    setIsCreatingCode(true);
    setError('');
    try {
      await createTeamCode(newCode, "Authorized Team Access Code");
      setNewCode('');
    } catch (err: any) {
      setError('Creation Failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsCreatingCode(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center p-6 text-center overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-950/10 blur-[120px]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs w-full glass p-8 rounded-sm relative z-10 border-red-500/20"
        >
          <div className="flex justify-center mb-6 text-red-500 animate-pulse">
             <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-sm font-display uppercase tracking-[0.25em] text-white mb-6">
            {authStep === 'login' ? 'Admin Login' : 'Restricted / Secure'}
          </h2>
          
          <form onSubmit={authStep === 'login' ? handleLogin : handleAuthorize} className="space-y-4">
            {authStep === 'login' ? (
              <>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ADMIN EMAIL"
                  className="w-full p-3 bg-zinc-900/50 border border-white/10 rounded-sm focus:outline-none focus:border-red-500/50 text-xs text-white text-center tracking-widest"
                  autoFocus
                />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="w-full p-3 bg-zinc-900/50 border border-white/10 rounded-sm focus:outline-none focus:border-red-500/50 text-xs text-white text-center tracking-widest"
                />
              </>
            ) : (
              <input 
                type="password" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="ACCESS CODE"
                className="w-full p-3 bg-red-950/20 border border-white/10 rounded-sm focus:outline-none focus:border-red-500/50 text-xs text-white text-center tracking-widest"
                autoFocus
              />
            )}
            
            {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">{error}</p>}
            
            <button className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-white/90 transition-all">
              {authStep === 'login' ? 'Authenticate' : 'Initialize Admin'}
            </button>
            <button type="button" onClick={onBack} className="w-full py-3 text-white/40 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">
              Return to Terminal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col p-8 sm:p-16 overflow-hidden relative selection:bg-red-500 selection:text-white">
      <div className="absolute inset-0 pointer-events-none noise opacity-20" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-1 bg-red-600" />
             <span className="text-[10px] font-black tracking-[0.3em] text-red-600 uppercase">System Override</span>
          </div>
          <h1 className="text-3xl font-display uppercase tracking-[0.4em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Admin / Dashboard</h1>
          <p className="text-[11px] text-white/30 uppercase tracking-[0.25em] mt-3 font-bold">Node: {window.location.hostname} / Sec: Grade-A</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCodeManager(!showCodeManager)}
            className="px-8 py-3 border border-vivid-blue/50 bg-vivid-blue/5 text-vivid-blue text-[10px] font-bold uppercase tracking-widest hover:bg-vivid-blue hover:text-black transition-all rounded-sm backdrop-blur-3xl"
          >
            {showCodeManager ? 'User Grid' : 'Team Access Codes'}
          </button>
          <button 
            onClick={onBack}
            className="px-8 py-3 border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-3xl"
          >
            Exit Dashboard
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar relative z-10 pr-4">
        <AnimatePresence mode="wait">
          {showCodeManager ? (
            <motion.div 
              key="code-manager"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto w-full space-y-8 pb-32"
            >
              <div className="p-8 glass border-vivid-blue/20">
                <h3 className="text-sm font-display uppercase tracking-[0.3em] text-white mb-6">Authorize New Access Code</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                   <input 
                      value={newCode}
                      onChange={e => setNewCode(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="NEW-TEAM-CODE"
                      disabled={isCreatingCode}
                      className="flex-grow p-4 bg-black/40 border border-white/10 rounded-sm focus:border-vivid-blue/50 focus:outline-none text-xs font-mono uppercase tracking-[0.2em] text-white disabled:opacity-50"
                   />
                   <button 
                      onClick={handleCreateCode}
                      disabled={isCreatingCode}
                      className="px-12 py-4 bg-vivid-blue text-black font-black text-[10px] uppercase tracking-widest rounded-sm hover:invert transition-all disabled:opacity-50"
                   >
                     {isCreatingCode ? 'Authorizing...' : 'Authorize Code'}
                   </button>
                </div>
                {error && authStep === 'login' && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-4">{error}</p>}
                {error && isAuthorized && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-4">{error}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {teamCodes.map(code => (
                   <motion.div 
                      key={code.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-zinc-900/40 border border-white/5 rounded-sm flex flex-col justify-between group"
                   >
                      <div>
                         <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-vivid-blue shadow-[0_0_8px_rgba(125,249,255,0.5)]" />
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Authorized Path</span>
                         </div>
                         <h4 className="text-xl font-mono uppercase tracking-[0.2em] text-vivid-blue mb-2">{code.code}</h4>
                         <p className="text-[9px] text-white/30 uppercase font-black leading-relaxed">{code.description}</p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                         <span className="text-[9px] text-white/20 font-mono">ID: {code.id.slice(0, 8)}</span>
                         <button 
                            onClick={async () => {
                               if (window.confirm(`REVOKE ACCESS: Remove team code "${code.code}"? New users will no longer be able to use it.`)) {
                                  try {
                                    await deleteTeamCode(code.id);
                                  } catch (err: any) {
                                    alert('Revoke Failed: ' + (err.message || 'Unknown error'));
                                  }
                               }
                            }}
                            className="text-[9px] font-black uppercase text-red-500/50 hover:text-red-500 transition-colors"
                         >
                            Revoke
                         </button>
                      </div>
                   </motion.div>
                 ))}
                 {teamCodes.length === 0 && (
                   <div className="col-span-full py-20 text-center border border-white/5 bg-white/5 border-dashed rounded-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-6">No Authorized Team Access Codes Found</p>
                      <button 
                        onClick={async () => {
                          setError('');
                          try {
                            await createTeamCode('talkware2026', 'Primary Master Team Access Code');
                          } catch (err: any) {
                            setError('Master Registration Failed: ' + (err.message || 'Unknown error'));
                          }
                        }}
                        className="px-8 py-3 bg-vivid-blue/10 border border-vivid-blue/30 text-vivid-blue text-[10px] font-bold uppercase tracking-widest hover:bg-vivid-blue hover:text-black transition-all rounded-sm"
                      >
                        Register talkware2026 as Master Code
                      </button>
                   </div>
                 )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="user-grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {Object.entries(
                allUsers.reduce((acc, user) => {
                  const gId = user.groupId || 'unknown';
                  if (!acc[gId]) acc[gId] = { groupName: user.groupName || 'Unknown Team', users: [] };
                  acc[gId].users.push(user);
                  return acc;
                }, {} as Record<string, { groupName: string, users: any[] }>)
              ).map(([groupId, { groupName, users }]) => (
                <div key={groupId} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-display uppercase tracking-widest text-white/80">Cluster: {groupId}</h2>
                    <button 
                      onClick={() => handlePurgeTeam(groupId)}
                      disabled={isPurging}
                      className="px-6 py-2 border border-red-500/50 bg-red-500/5 text-red-500 text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-sm backdrop-blur-3xl disabled:opacity-50 disabled:cursor-wait"
                    >
                      Purge Team Data
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                      <motion.div 
                        key={user.id || user.uid}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="p-8 bg-zinc-900/40 border border-white/5 rounded-sm group hover:border-red-500/40 transition-all backdrop-blur-3xl relative"
                      >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                           <Users2 className="w-4 h-4 text-white" />
                        </div>
                        
                        <div className="flex items-center gap-5 mb-8">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20 group-hover:text-red-500 group-hover:border-red-500/20 transition-all">
                            <Users2 className="w-6 h-6" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-1">{user.name}</h3>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest font-black leading-none">{user.role} / Team Access Code: {user.groupId}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-white/5">
                           <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                              <span className="text-white/20">Ident:</span>
                              <span className="text-white/60 font-mono">{(user.id || user.uid || '').slice(0, 12)}</span>
                           </div>
                           <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                              <span className="text-white/20">Access:</span>
                              <span className={cn("font-black", user.isHidden ? "text-red-500" : "text-emerald-500")}>
                                {user.isHidden ? 'HIDDEN / OFFLINE' : 'VISIBLE / ACTIVE'}
                              </span>
                           </div>
                           
                           <div className="pt-6 flex flex-col gap-4">
                              <button 
                                onClick={() => adminToggleUserVisibility(user.id || user.uid, !user.isHidden)}
                                className={cn(
                                  "w-full py-4 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2",
                                  user.isHidden
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                    : "border-white/10 bg-white/5 text-white/50 hover:bg-white hover:text-black"
                                )}
                              >
                                {user.isHidden ? 'Restore To Team Sync' : 'Hide from Team Sync'}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id || user.uid)}
                                disabled={isDeleting === (user.id || user.uid)}
                                className={cn(
                                  "w-full py-4 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2",
                                  isDeleting === (user.id || user.uid) 
                                    ? "bg-red-600 border-red-600 text-white animate-pulse"
                                    : "border-red-500/20 bg-red-500/5 text-red-500/60 hover:bg-red-600 hover:text-white hover:border-red-600"
                                )}
                              >
                                {isDeleting === (user.id || user.uid) ? 'DELETING...' : 'Terminate Subject'}
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-[9px] text-white/10 uppercase tracking-[0.3em] font-bold border-t border-white/5 pt-8 flex items-center justify-between">
         <span>Total Active Nodes: {allUsers.length}</span>
         <span className="animate-pulse">System Stabilized // No Errors</span>
      </div>
    </div>
  );
}
