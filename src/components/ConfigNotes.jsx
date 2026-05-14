import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import { ChevronDown } from "lucide-react";

export default function ConfigNotes({ configId, initialNotes }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState(null);

  const handleNotesChange = (value) => {
    setNotes(value);
    
    // Clear previous timer
    if (saveTimer) clearTimeout(saveTimer);
    
    // Auto-save after 800ms of inactivity
    const timer = setTimeout(async () => {
      setSaving(true);
      await db.entities.SavedConfig.update(configId, { notes: value });
      setSaving(false);
    }, 800);
    
    setSaveTimer(timer);
  };

  return (
    <div className="mt-3 border-t border-white/5 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all group"
      >
        <span className="font-orbitron text-xs text-white/40 uppercase tracking-widest">
          📝 My Notes
        </span>
        <div className="flex items-center gap-1">
          {saving && (
            <span className="font-mono-cyber text-xs text-white/30">saving…</span>
          )}
          <ChevronDown
            className={`w-3 h-3 text-white/30 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Jot down your observations, key takeaways, or anything you want to remember…"
              rows={4}
              className="w-full mt-2 cyber-input rounded-lg px-3 py-2.5 text-xs font-inter text-white/70 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}