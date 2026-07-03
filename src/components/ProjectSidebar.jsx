import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";

const COLOR_MAP = {
  cyan:   { pill: "border-cyan-400/40 bg-cyan-400/10 text-cyan-400",   dot: "bg-cyan-400" },
  purple: { pill: "border-purple-400/40 bg-purple-400/10 text-purple-400", dot: "bg-purple-400" },
  pink:   { pill: "border-pink-400/40 bg-pink-400/10 text-pink-400",   dot: "bg-pink-400" },
  green:  { pill: "border-green-400/40 bg-green-400/10 text-green-400", dot: "bg-green-400" },
  yellow: { pill: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400", dot: "bg-yellow-400" },
  orange: { pill: "border-orange-400/40 bg-orange-400/10 text-orange-400", dot: "bg-orange-400" },
};
const COLORS = Object.keys(COLOR_MAP);
const DEFAULT_ICONS = ["🚀", "🎯", "📜", "🔐", "☁️", "⚙️", "🌐", "🖥️", "🏅", "🧪"];

export default function ProjectSidebar({ projects, selectedProjectId, onSelectProject, onProjectsChange, configCounts }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("🚀");
  const [newColor, setNewColor] = useState("cyan");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const created = await db.entities.Project.create({
      name: newName.trim(),
      description: newDesc.trim(),
      icon: newIcon,
      color: newColor,
    });
    onProjectsChange([...projects, created]);
    setNewName(""); setNewDesc(""); setNewIcon("🚀"); setNewColor("cyan");
    setShowCreate(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await db.entities.Project.delete(id);
    onProjectsChange(projects.filter((p) => p.id !== id));
    if (selectedProjectId === id) onSelectProject(null);
    setDeletingId(null);
  };

  return (
    <div className="cyber-card rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/50">Projects</p>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="font-mono-cyber text-xs text-cyber-cyan/60 hover:text-cyber-cyan transition-colors"
        >
          {showCreate ? "✕ Cancel" : "+ New"}
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pb-3 border-b border-white/5 mb-3">
              <div className="flex gap-2">
                {/* Icon picker */}
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="cyber-input rounded-lg px-2 py-1.5 text-sm w-16 flex-shrink-0 focus:outline-none"
                >
                  {DEFAULT_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Project name…"
                  className="flex-1 cyber-input rounded-lg px-3 py-1.5 text-xs focus:outline-none font-inter"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Goal or description (optional)"
                className="w-full cyber-input rounded-lg px-3 py-1.5 text-xs focus:outline-none font-inter"
              />
              {/* Color picker */}
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-5 h-5 rounded-full transition-all ${COLOR_MAP[c].dot} ${newColor === c ? "ring-2 ring-white/40 ring-offset-1 ring-offset-cyber-bg scale-110" : "opacity-50 hover:opacity-80"}`}
                  />
                ))}
              </div>
              <button
                onClick={handleCreate}
                disabled={saving || !newName.trim()}
                className="w-full py-2 rounded-lg cyber-button-primary font-orbitron text-xs uppercase tracking-widest disabled:opacity-40"
              >
                {saving ? "Creating…" : "Create Project"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Roadmaps option */}
      <button
        onClick={() => onSelectProject(null)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border font-mono-cyber text-xs transition-all ${
          selectedProjectId === null
            ? "border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan"
            : "border-white/10 bg-white/3 text-white/40 hover:text-white/60 hover:border-white/20"
        }`}
      >
        <span>◈</span>
        <span className="flex-1 text-left">All Roadmaps</span>
        <span className="opacity-40">{configCounts.__total__ || 0}</span>
      </button>

      {/* Unassigned */}
      <button
        onClick={() => onSelectProject("__unassigned__")}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border font-mono-cyber text-xs transition-all ${
          selectedProjectId === "__unassigned__"
            ? "border-white/40 bg-white/10 text-white/80"
            : "border-white/10 bg-white/3 text-white/30 hover:text-white/50 hover:border-white/20"
        }`}
      >
        <span>📁</span>
        <span className="flex-1 text-left">Unassigned</span>
        <span className="opacity-40">{configCounts.__unassigned__ || 0}</span>
      </button>

      {/* Projects */}
      {projects.map((p) => {
        const colors = COLOR_MAP[p.color] || COLOR_MAP.cyan;
        const isSelected = selectedProjectId === p.id;
        return (
          <div key={p.id} className="group relative">
            <button
              onClick={() => onSelectProject(p.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border font-mono-cyber text-xs transition-all ${
                isSelected
                  ? colors.pill
                  : "border-white/10 bg-white/3 text-white/40 hover:text-white/60 hover:border-white/20"
              }`}
            >
              <span>{p.icon || "📁"}</span>
              <span className="flex-1 text-left truncate">{p.name}</span>
              <span className="opacity-40">{configCounts[p.id] || 0}</span>
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              disabled={deletingId === p.id}
              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-base leading-none px-1"
            >
              ×
            </button>
          </div>
        );
      })}

      {projects.length === 0 && !showCreate && (
        <p className="font-mono-cyber text-xs text-white/20 text-center py-2">No projects yet</p>
      )}
    </div>
  );
}
