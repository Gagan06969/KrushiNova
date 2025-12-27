import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard({ token, onLogout }) {
  const [socket, setSocket] = useState(null);
  const [telemetry, setTelemetry] = useState({ distance: 0, status: 'N/A', detections: [] });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Rover');
      addLog('System Connected');
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
    const handleKeyUp = (e) => {
        // Optional: send 'stop' on key up if you want momentary control
        // sendCommand('stop'); 
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [socket]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-green-400">Krushinova Command Center</h2>
        <button onClick={onLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-500">
          Disconnect
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-auto">
        
        {/* Left Column: Video & Status */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Video Feed */}
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 aspect-video relative group">
            <img 
              src={`${SOCKET_URL}/video_feed`} 
              alt="Rover Feed" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Video Feed Error:", e);
                // e.target.style.display='none'; 
                // e.target.nextSibling.style.display='flex'
              }} 
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500">
               Camera Offline
            </div>
            
            {/* Overlay UI */}
             <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs">
                LIVE
             </div>
          </div>

          {/* Telemetry Cards */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-xs uppercase tracking-wider">Distance Sensor</h3>
                <p className="text-3xl font-mono text-green-400">{telemetry.distance.toFixed(1)} <span className="text-sm">cm</span></p>
             </div>
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-xs uppercase tracking-wider">Vision Status</h3>
                <p className="text-lg font-medium text-white">
                  {telemetry.detections.length > 0 ? 
                    <span className="text-red-400 animate-pulse">{telemetry.detections.length} Targets</span> 
                    : "Clear"}
                </p>
             </div>
          </div>
        </div>

        {/* Right Column: Controls & Logs */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          
          {/* D-Pad Controls */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4">
            <h3 className="text-slate-400 text-sm uppercase">Manual Control</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div />
              <button 
                onMouseDown={() => sendCommand('forward')} 
                onMouseUp={() => sendCommand('stop')}
                className="w-16 h-16 bg-slate-700 rounded-lg hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-colors"
              >
                ▲
              </button>
              <div />
              
              <button 
                onMouseDown={() => sendCommand('left')} 
                onMouseUp={() => sendCommand('stop')}
                className="w-16 h-16 bg-slate-700 rounded-lg hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-colors"
              >
                ◀
              </button>
              <button 
                onMouseDown={() => sendCommand('stop')} 
                className="w-16 h-16 bg-red-900/50 rounded-full border border-red-500 hover:bg-red-600 flex items-center justify-center"
              >
                STOP
              </button>
              <button 
                onMouseDown={() => sendCommand('right')} 
                onMouseUp={() => sendCommand('stop')}
                className="w-16 h-16 bg-slate-700 rounded-lg hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-colors"
              >
                ▶
              </button>

              <div />
              <button 
                onMouseDown={() => sendCommand('backward')} 
                onMouseUp={() => sendCommand('stop')}
                className="w-16 h-16 bg-slate-700 rounded-lg hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-colors"
              >
                ▼
              </button>
              <div />
            </div>
            
            <p className="text-xs text-slate-500 mt-2">Use Arrow Keys or Buttons</p>
          </div>

          {/* Logs */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1 font-mono text-xs overflow-hidden">
             <h3 className="text-slate-500 mb-2 border-b border-slate-800 pb-1">System Logs</h3>
             <ul className="space-y-1">
               {logs.map((log, i) => (
                 <li key={i} className="text-slate-300">
                   <span className="text-green-500 opacity-50">[{new Date().toLocaleTimeString()}]</span> {log}
                 </li>
               ))}
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
