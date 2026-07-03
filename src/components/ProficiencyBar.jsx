import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";

const LEVELS = [
  { value: 1, label: "Novice",    color: "bg-red-500",    glow: "shadow-red-500/40" },
  { value: 2, label: "Beginner",  color: "bg-orange-400", glow: "shadow-orange-400/40" },
  { value: 3, label: "Competent", color: "bg-yellow-400", glow: "shadow-yellow-400/40" },
  { value: 4, label: "Proficient",color: "bg-cyan-400",   glow: "shadow-cyan-400/40" },
  { value: 5, label: "Expert",    color: "bg-cyber-purple",glow: "shadow-purple-500/40" },
];

export default function ProficiencyBar({ configId, initialValue }) {
  const [value, setValue] = useState(initialValue || 0);
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;
  const activeLevel = LEVELS[active - 1];

  const handleSelect = async (v) => {
    setSaving(true);
    setValue(v);
    await db.entities.SavedConfig.update(configId, { proficiency: v });
    setSaving(false);
  };

  return (
    <div className="mt-3 border-t border-white/5 pt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-orbitron text-xs text-white/30 uppercase tracking-widest">Confidence</span>
        <span className={`font-mono-cyber text-xs transition-colors ${activeLevel ? "text-white/60" : "text-white/20"}`}>
          {activeLevel ? activeLevel.label : "Not set"}
          {saving && <span className="ml-1 text-white/20">…</span>}
        </span>
      </div>

      <div className="flex gap-1 items-center">
        {LEVELS.map((lvl) => {
          const filled = lvl.value <= active;
          return (
            <motion.button
              key={lvl.value}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHovered(lvl.value)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleSelect(lvl.value)}
              className="flex-1 h-2 rounded-full transition-all duration-150 relative overflow-hidden"
              style={{ background: filled ? undefined : "rgba(255,255,255,0.07)" }}
            >
              {filled && (
                <motion.div
                  layoutId={`fill-${configId}-${lvl.value}`}
                  className={`absolute inset-0 rounded-full ${lvl.color}`}
                  style={{ boxShadow: filled ? `0 0 6px var(--tw-shadow-color)` : "none" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}

        {value > 0 && (
          <button
            onClick={() => handleSelect(0)}
            className="ml-1 text-white/15 hover:text-white/40 text-sm leading-none transition-colors"
            title="Clear"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
