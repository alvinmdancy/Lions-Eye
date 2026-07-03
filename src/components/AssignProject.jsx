import { useState } from "react";
import { db } from "@/lib/db";

const COLOR_MAP = {
  cyan:   "text-cyan-400",
  purple: "text-purple-400",
  pink:   "text-pink-400",
  green:  "text-green-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
};

export default function AssignProject({ configId, currentProjectId, projects, onAssigned }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const current = projects.find((p) => p.id === currentProjectId);

  const handleAssign = async (projectId) => {
    setSaving(true);
    await db.entities.SavedConfig.update(configId, { project_id: projectId || null });
    onAssigned(configId, projectId || null);
    setOpen(false);
    setSaving(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 font-mono-cyber text-xs transition-colors hover:text-white/60"
        style={{ color: current ? undefined : "rgba(255,255,255,0.2)" }}
      >
        <span>{current ? current.icon : "📁"}</span>
        <span className={current ? (COLOR_MAP[current.color] || "text-white/60") : "text-white/20"}>
          {current ? current.name : "Assign project"}
        </span>
        <span className="text-white/20">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 w-48 cyber-card rounded-xl border border-white/10 py-1 shadow-glow-purple overflow-hidden">
            <button
              onClick={() => handleAssign(null)}
              className="w-full flex items-center gap-2 px-3 py-2 font-mono-cyber text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              <span>📁</span> Unassigned
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAssign(p.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 font-mono-cyber text-xs hover:bg-white/5 transition-all ${
                  currentProjectId === p.id ? "text-white/80" : "text-white/40 hover:text-white/70"
                }`}
              >
                <span>{p.icon || "📁"}</span>
                <span className="flex-1 text-left truncate">{p.name}</span>
                {currentProjectId === p.id && <span className="text-white/30">✓</span>}
              </button>
            ))}
            {projects.length === 0 && (
              <p className="px-3 py-2 font-mono-cyber text-xs text-white/20">No projects yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
