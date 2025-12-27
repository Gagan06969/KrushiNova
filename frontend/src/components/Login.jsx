import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Debug: Show what URL we are hitting
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.token);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100 animate-fade-in">

       {/* Background Effects */}
       <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-agri-green-500/10 rounded-full blur-[120px] opacity-50 animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px] opacity-40 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-agri-green-400/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-agri-green-400/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-agri-green-400/25 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
       </div>

       {/* Main Container */}
       <div className="relative z-10 w-full flex flex-col md:flex-row shadow-2xl overflow-hidden">

          {/* Left Side: Branding (Hidden on mobile) */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 flex-col justify-between p-12 relative overflow-hidden">

             {/* Abstract Shapes */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-agri-green-500/8 via-transparent to-transparent animate-pulse-slow"></div>

             {/* Decorative agriculture icons */}
             <div className="absolute top-20 right-20 text-6xl opacity-5 animate-float">🌾</div>
             <div className="absolute bottom-32 right-32 text-5xl opacity-5 animate-float" style={{animationDelay: '2s'}}>🚜</div>

             <div className="relative z-10 animate-slide-down">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-green-500 to-agri-green-600 flex items-center justify-center shadow-glow-green">
                     <span className="font-bold text-white text-lg">K</span>
                   </div>
                   <span className="font-bold tracking-wider text-xl text-glow">KRUSHINOVA</span>
                </div>

                <h1 className="text-5xl font-extrabold leading-tight mb-6 animate-fade-in">
                   Autonomous <br/>
                   <span className="gradient-text">Agricultural</span> <br/>
                   Intelligence
                </h1>
                <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                   Connect to your rover fleet. Monitor telemetry, control navigation, and analyze crop health in real-time with cutting-edge AI technology.
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="badge-success">Real-time Monitoring</span>
                  <span className="badge-info">AI-Powered</span>
                  <span className="badge-warning">Autonomous</span>
                </div>
             </div>

             <div className="relative z-10 animate-fade-in">
                <div className="glass-card p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-agri-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-agri-green-400 font-semibold">System Status</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="text-slate-500">Uptime: <span className="text-slate-300">99.9%</span></div>
                    <div className="text-slate-500">Ver: <span className="text-slate-300">2.1.0</span></div>
                    <div className="text-slate-500">Sec: <span className="text-agri-green-400">✓</span></div>
                  </div>
                </div>
             </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-8 relative">
             {/* Subtle background pattern */}
             <div className="absolute inset-0 pattern-dots opacity-20"></div>

             <div className="w-full max-w-md space-y-8 relative z-10 animate-slide-up">

                <div className="text-center md:text-left">
                   <div className="inline-block md:hidden mb-6 bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl shadow-glow-green border border-agri-green-500/20">
                      <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                   </div>
                   <h2 className="text-4xl font-bold tracking-tight mb-2 gradient-text">Welcome Back, Farmer</h2>
                   <p className="text-slate-400 text-base">Enter your credentials to access your agricultural command center.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-agri-green-400 ml-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Rover ID
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        placeholder="Enter your rover ID"
                        required
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-agri-green-400 ml-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Access Key
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Enter your access key"
                        required
                      />
                   </div>

                   {error && (
                     <div className="badge-error px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-slide-down">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                     </div>
                   )}

                   <button
                     type="submit"
                     disabled={loading}
                     className="btn-primary w-full h-12 text-base font-bold flex items-center justify-center gap-2 group"
                   >
                     {loading ? (
                       <>
                         <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Authenticating...
                       </>
                     ) : (
                       <>
                         Connect to Rover
                         <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                         </svg>
                       </>
                     )}
                   </button>
                </form>

                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <div className="w-2 h-2 bg-agri-green-500 rounded-full animate-pulse"></div>
                      <p className="hover:text-slate-500 transition-colors font-mono">
                        Target: <span className="text-slate-400">{API_URL}</span>
                      </p>
                    </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}
