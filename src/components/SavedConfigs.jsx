import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";

export default function SavedConfigs({ currentConfig, onLoad, canSave }) {
  const [configs, setConfigs] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showList, setShowList] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    const data = await db.entities.SavedConfig.list("-created_date", 50);
    setConfigs(data);
    setLoading(false);
  };

  useEffect(() => {
    if (showList) fetchConfigs();
  }, [showList]);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    setSaving(true);
    await db.entities.SavedConfig.create({
      name: saveName.trim(),
      skill: currentConfig.selectedSkillData.skill,
      category: currentConfig.selectedSkillData.category,
      skill_level: currentConfig.selectedSkillData.level,
      career_label: currentConfig.selectedSkillData.careerLabel,
      prompt_type: currentConfig.promptType,
      level: currentConfig.level,
      learning_style: currentConfig.learningStyle,
      hours_per_week: currentConfig.hoursPerWeek,
      goal: currentConfig.goal,
    });
    setSaving(false);
    setShowSaveModal(false);
    setSaveName("");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await db.entities.SavedConfig.delete(id);
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoad = (cfg) => {
    onLoad({
      selectedSkillData: {
        skill: cfg.skill,
        category: cfg.category,
        level: cfg.skill_level,
        careerLabel: cfg.career_label,
      },
      promptType: cfg.prompt_type,
      level: cfg.level,
      learningStyle: cfg.learning_style,
      hoursPerWeek: cfg.hours_per_week,
      goal: cfg.goal || "",
    });
    setShowList(false);
  };

  return (
    <div className="flex gap-2">
      {/* Save button */}
      <button
        onClick={() => canSave && setShowSaveModal(true)}
        disabled={!canSave}
        className={`flex-1 py-2 px-3 rounded-lg border font-orbitron text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 ${
          canSave
            ? "border-cyber-purple/50 bg-cyber-purple/10 text-cyber-purple hover:bg-cyber-purple/20 hover:border-cyber-purple/80"
            : "border-white/10 bg-white/5 text-white/20 cursor-not-allowed"
        }`}
      >
        ⊕ Save Config
      </button>

      {/* Load button */}
      <button
        onClick={() => setShowList(true)}
        className="flex-1 py-2 px-3 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan font-orbitron text-xs uppercase tracking-widest hover:bg-cyber-cyan/10 hover:border-cyber-cyan/60 transition-all duration-200 flex items-center justify-center gap-1.5"
      >
        ◫ Load Config
      </button>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="cyber-card rounded-xl p-6 w-full max-w-sm"
            >
              <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-cyber-cyan mb-4">
                Save Configuration
              </h3>
              <p className="font-inter text-xs text-white/40 mb-4">
                Saving: <span className="text-cyber-cyan/80">{currentConfig?.selectedSkillData?.skill}</span>
              </p>
              <input
                autoFocus
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="Give this config a name..."
                className="w-full cyber-input rounded-lg px-4 py-3 text-sm focus:outline-none placeholder:text-white/20 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 font-orbitron text-xs uppercase tracking-widest hover:border-white/20 hover:text-white/60 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim() || saving}
                  className={`flex-1 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest transition-all ${
                    saveName.trim() && !saving
                      ? "cyber-button-primary"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Modal */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowList(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="cyber-card rounded-xl p-6 w-full max-w-md max-h-[80vh] flex flex-col"
            >
              <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-cyber-cyan mb-4">
                Saved Configurations
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : configs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-mono-cyber text-xs text-white/30">No saved configurations yet.</p>
                  <p className="font-inter text-xs text-white/20 mt-1">Configure a prompt and click "Save Config".</p>
                </div>
              ) : (
                <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                  {configs.map((cfg) => (
                    <motion.div
                      key={cfg.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleLoad(cfg)}
                      className="p-4 rounded-lg border border-cyber-purple/20 bg-cyber-card/60 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-orbitron text-xs font-bold text-white/90 truncate">{cfg.name}</p>
                          <p className="font-mono-cyber text-xs text-cyber-cyan/70 mt-0.5 truncate">{cfg.skill}</p>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber bg-cyber-purple/20 text-cyber-purple/80 border border-cyber-purple/20">
                              {cfg.prompt_type?.replace("_", " ")}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber bg-white/5 text-white/40 border border-white/10">
                              {cfg.level}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDelete(cfg.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-lg leading-none flex-shrink-0 mt-0.5"
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowList(false)}
                className="mt-4 w-full py-2 rounded-lg border border-white/10 text-white/40 font-orbitron text-xs uppercase tracking-widest hover:border-white/20 hover:text-white/60 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}