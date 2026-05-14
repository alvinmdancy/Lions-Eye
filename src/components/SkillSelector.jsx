import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES } from "@/data/skills";

export default function SkillSelector({ selectedCategory, selectedLevel, selectedSkill, onSelect }) {
  const [openCategory, setOpenCategory] = useState(selectedCategory || null);

  const handleCategoryClick = (catKey) => {
    setOpenCategory(openCategory === catKey ? null : catKey);
  };

  const handleSkillSelect = (catKey, levelKey, skill) => {
    const careerLabel = SKILL_CATEGORIES[catKey].levels[levelKey].label;
    onSelect({ category: catKey, level: levelKey, skill, careerLabel });
  };

  const levelColors = {
    junior: "text-green-400 border-green-400/30 bg-green-400/5",
    mid: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    senior: "text-red-400 border-red-400/30 bg-red-400/5",
  };

  const levelLabels = { junior: "JR", mid: "MID", senior: "SR" };

  return (
    <div className="space-y-2">
      <label className="font-orbitron text-xs font-semibold uppercase tracking-widest text-cyber-cyan/80">
        Select Skill
      </label>

      {Object.entries(SKILL_CATEGORIES).map(([catKey, category]) => (
        <div key={catKey} className="rounded-lg overflow-hidden border border-cyber-purple/20">
          {/* Category Header */}
          <button
            onClick={() => handleCategoryClick(catKey)}
            className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
              openCategory === catKey
                ? "bg-cyber-purple/20 border-b border-cyber-purple/30"
                : "bg-cyber-card/50 hover:bg-cyber-purple/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/80">
                {category.label}
              </span>
            </div>
            <span className={`text-cyber-cyan transition-transform duration-300 ${
              openCategory === catKey ? "rotate-90" : ""
            }`}>›</span>
          </button>

          {/* Levels & Skills */}
          <AnimatePresence>
            {openCategory === catKey && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden bg-cyber-bg/50"
              >
                {Object.entries(category.levels).map(([levelKey, levelData]) => (
                  <div key={levelKey} className="border-b border-cyber-purple/10 last:border-0">
                    <div className={`px-4 py-2 flex items-center gap-2`}>
                      <span className={`font-orbitron text-xs px-2 py-0.5 rounded border ${levelColors[levelKey]}`}>
                        {levelLabels[levelKey]}
                      </span>
                      <span className="text-xs text-white/50 font-inter">{levelData.label}</span>
                    </div>
                    <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                      {levelData.skills.map((skill) => {
                        const isSelected = selectedSkill === skill && selectedCategory === catKey && selectedLevel === levelKey;
                        return (
                          <button
                            key={skill}
                            onClick={() => handleSkillSelect(catKey, levelKey, skill)}
                            className={`px-2.5 py-1 rounded text-xs font-mono-cyber transition-all duration-200 border ${
                              isSelected
                                ? "bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/50 shadow-glow-sm-cyan"
                                : "bg-white/5 text-white/50 border-white/10 hover:border-cyber-purple/40 hover:text-white/70"
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}