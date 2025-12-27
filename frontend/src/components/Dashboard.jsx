import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import logo from '../assets/logo.png';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Dashboard({ token, onLogout }) {
  const [socket, setSocket] = useState(null);
  const [telemetry, setTelemetry] = useState({ distance: 0, status: 'N/A', detections: [] });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Rover');
      addLog('System Online');
    });

    newSocket.on('telemetry', (data) => {
      setTelemetry(data);
    });

    newSocket.on('log', (data) => {
      addLog(data.msg);
    });

    return () => newSocket.close();
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const sendCommand = (cmd) => {
    if(socket) socket.emit('control', { command: cmd });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') sendCommand('forward');
      if (e.key === 'ArrowDown') sendCommand('backward');
      if (e.key === 'ArrowLeft') sendCommand('left');
      if (e.key === 'ArrowRight') sendCommand('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [socket]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 pattern-grid">

      {/* Navbar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center z-50 relative shadow-2xl animate-slide-down">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-agri-green-500 to-agri-green-600 p-2.5 rounded-xl shadow-glow-green animate-pulse">
             <img src={logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Krushi<span className="gradient-text">Nova</span>
            </h2>
            <p className="text-[10px] text-agri-green-400/70 uppercase tracking-[0.2em] font-semibold">Autonomous Rover System</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="group flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 rounded-xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-red-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
          </svg>
          <span className="text-sm font-bold">Logout</span>
        </button>
      </header>

      {/* Main Content Dashboard */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Panel: Video Feed & Status */}
          <div className="lg:col-span-2 space-y-6">

            {/* Video Viewport */}
            <div className="relative group rounded-2xl overflow-hidden border border-agri-green-500/20 shadow-2xl shadow-agri-green-900/10 bg-black neon-border">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/90 to-transparent z-10 pointer-events-none"></div>

              <img
                src={`${SOCKET_URL}/video_feed`}
                alt="Rover Feed"
                className="w-full aspect-video object-cover"
                onError={(e) => {
                  console.error("Video Feed Error:", e);
                }}
              />

              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <div className="flex items-center gap-2 glass-card px-3 py-2 border-agri-green-500/30">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                  <span className="text-xs font-bold text-white tracking-wider">LIVE FEED</span>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="glass-card text-[10px] text-agri-green-400 px-3 py-1.5 font-mono border-agri-green-500/30">{SOCKET_URL}</span>
              </div>

              {/* Corner Accents - Enhanced */}
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-agri-green-500/60 rounded-tr-xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-agri-green-500/60 rounded-bl-xl animate-pulse" style={{animationDelay: '1s'}}></div>

              {/* Agricultural overlay icons */}
              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <div className="glass-card px-2 py-1 text-xs font-mono text-agri-green-400 border-agri-green-500/30">
                  <span className="opacity-60">Field View</span>
                </div>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TelemetryCard label="Distance Sensor" value={telemetry.distance.toFixed(1)} unit="cm" icon="📏" color="text-sky-blue-400" />
              <TelemetryCard label="Vision Status" value={telemetry.detections.length > 0 ? "Detected" : "Scanning"} unit="" icon="👁" color="text-purple-400" />
              <TelemetryCard label="System Health" value="Optimal" unit="" icon="💚" color="text-agri-green-400" />
              <TelemetryCard label="Connection" value="Stable" unit="" icon="📡" color="text-amber-400" />
            </div>

             {/* Logs Console */}
             <div className="glass-card p-5 h-52 overflow-hidden flex flex-col font-mono text-sm relative border-agri-green-500/20">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-agri-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs text-agri-green-400 uppercase tracking-widest font-bold">System Logs</span>
                  </div>
                  <div className="badge-success px-2 py-1 text-[10px]">Active</div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {logs.length === 0 && (
                    <div className="flex items-center gap-2 text-slate-600 italic text-xs">
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-pulse"></div>
                      <span>Awaiting system events...</span>
                    </div>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 items-start animate-slide-down text-xs hover:bg-white/5 p-1.5 rounded transition-colors">
                      <span className="text-agri-green-500/60 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-slate-300">{log}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Right Panel: Controls */}
          <div className="space-y-6 flex flex-col">
             <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden border-agri-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-agri-green-500/5 to-transparent pointer-events-none"></div>

                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <svg className="w-5 h-5 text-agri-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <h3 className="text-white font-bold text-lg uppercase tracking-widest">
                      Manual Control
                    </h3>
                  </div>

                  {/* Enhanced D-Pad */}
                  <div className="grid grid-cols-3 gap-3 p-6 bg-black/30 rounded-2xl border border-agri-green-500/20 shadow-inner-glow mb-6">
                     <div></div>
                     <ControlButton icon="▲" onClick={() => sendCommand('forward')} label="FWD" />
                     <div></div>
                     <ControlButton icon="◀" onClick={() => sendCommand('left')} label="LEFT" />
                     <ControlButton icon="⏹" onClick={() => sendCommand('stop')} variant="stop" label="STOP" />
                     <ControlButton icon="▶" onClick={() => sendCommand('right')} label="RIGHT" />
                     <div></div>
                     <ControlButton icon="▼" onClick={() => sendCommand('backward')} label="BACK" />
                     <div></div>
                  </div>

                  <div className="glass-card p-4 text-center border-agri-green-500/20">
                    <p className="text-xs text-agri-green-400 font-semibold mb-2 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Control Method
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      Keyboard Arrow Keys or Click
                    </p>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function TelemetryCard({ label, value, unit, icon, color }) {
  return (
    <div className="glass-card p-4 rounded-xl hover:bg-white/10 hover:border-agri-green-500/40 transition-all duration-300 group cursor-pointer transform hover:scale-105">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
        <span className="grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100 text-xl">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${color} group-hover:text-glow transition-all`}>
        {value} {unit && <span className="text-xs text-white/40 font-normal ml-1">{unit}</span>}
      </div>
      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')} opacity-50 group-hover:opacity-100 transition-all`} style={{width: '75%'}}></div>
      </div>
    </div>
  );
}

function ControlButton({ icon, onClick, variant = 'default', label }) {
    const baseStyles = "w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-2xl shadow-lg transition-all active:scale-95 active:shadow-inner font-bold relative group";
    const variants = {
        default: "bg-gradient-to-b from-slate-700 to-slate-800 hover:from-agri-green-600 hover:to-agri-green-700 text-white border border-slate-600 hover:border-agri-green-500 active:translate-y-1 shadow-agri-green-900/0 hover:shadow-agri-green-900/50",
        stop: "bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-800 hover:border-red-400 active:translate-y-1 shadow-red-900/50"
    }

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]}`}
        >
            <span className="group-hover:scale-110 transition-transform">{icon}</span>
            {label && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}
              </span>
            )}
        </button>
    )
}
