import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function CyberHeader() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <header className="relative border-b border-cyber-purple/20 bg-cyber-card/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center shadow-glow-purple">
            <span className="font-orbitron text-white font-black text-sm">IT</span>
          </div>
          <div>
            <h1 className="font-orbitron font-black text-sm uppercase tracking-widest text-glow-cyan" style={{ color: '#06B6D4' }}>
              Lion's Eye
            </h1>
            <p className="font-mono-cyber text-xs text-white/30">AI Prompt Engine</p>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest transition-all ${pathname === "/"
              ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40"
              : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
          >
            ⚡ Prompt Engine
          </Link>
          <Link
            to="/library"
            className={`px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest transition-all ${pathname === "/library"
              ? "bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/40"
              : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
          >
            📚 Library
          </Link>
          <Link
            to="/roadmap"
            className={`px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest transition-all ${pathname === "/roadmap"
              ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40"
              : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
          >
            🗺️ Roadmap
          </Link>
        </nav>

        {/* Status + Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            <span className="font-mono-cyber text-xs text-white/40 hidden sm:block">SYSTEM ONLINE</span>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg font-orbitron text-xs uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-400/10 border border-white/10 hover:border-red-400/30 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
