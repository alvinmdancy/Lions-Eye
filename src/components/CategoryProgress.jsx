import { motion } from "framer-motion";

const CATEGORY_ICONS = {
  devops: "⚙️",
  cloud: "☁️",
  networking: "🌐",
  security: "🔐",
  sysadmin: "🖥️",
};

const LEVEL_WEIGHTS = { junior: 1, mid: 2, senior: 3 };
const MAX_SCORE_PER_CAT = 3 + 3 + 3; // 1 junior + 1 mid + 1 senior at max proficiency (5) = weighted

const CATEGORY_COLORS = {
  devops:     { bar: "from-cyber-cyan to-blue-400",   text: "text-cyber-cyan" },
  cloud:      { bar: "from-blue-400 to-indigo-400",   text: "text-blue-400" },
  networking: { bar: "from-green-400 to-cyber-cyan",  text: "text-green-400" },
  security:   { bar: "from-cyber-pink to-red-400",    text: "text-cyber-pink" },
  sysadmin:   { bar: "from-cyber-purple to-cyber-pink", text: "text-cyber-purple" },
};

function getCategoryCompletion(configs, category) {
  const catConfigs = configs.filter((c) => c.category === category);
  if (catConfigs.length === 0) return { pct: 0, score: 0, maxScore: 9, levelCounts: {} };

  // Score: sum of (proficiency or 1) * level_weight, capped per level
  const levels = ["junior", "mid", "senior"];
  let score = 0;
  const levelCounts = {};

  for (const lvl of levels) {
    const lvlConfigs = catConfigs.filter((c) => c.skill_level === lvl);
    levelCounts[lvl] = lvlConfigs.length;
    if (lvlConfigs.length > 0) {
      // best proficiency in this level
      const best = Math.max(...lvlConfigs.map((c) => c.proficiency || 1));
      score += LEVEL_WEIGHTS[lvl] * best;
    }
  }

  const maxScore = 3 * 5; // senior weight * max proficiency
  const pct = Math.min(100, Math.round((score / maxScore) * 100));
  return { pct, score, maxScore, levelCounts };
}

export default function CategoryProgress({ configs }) {
  const categories = [...new Set(configs.map((c) => c.category).filter(Boolean))];

  if (categories.length === 0) return null;

  // Sort by completion desc
  const catData = categories
    .map((cat) => ({ cat, ...getCategoryCompletion(configs, cat) }))
    .sort((a, b) => b.pct - a.pct);

  const overallPct = catData.length
    ? Math.round(catData.reduce((s, d) => s + d.pct, 0) / catData.length)
    : 0;

  return (
    <div className="cyber-card rounded-xl p-5 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/70">
            Category Completion
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-cyber text-xs text-white/30">Overall</span>
          <span className="font-orbitron text-sm font-black text-cyber-cyan">{overallPct}%</span>
        </div>
      </div>

      {/* Overall bar */}
      <div className="mb-5">
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyber-purple via-cyber-cyan to-green-400"
          />
        </div>
      </div>

      {/* Per-category bars */}
      <div className="space-y-3.5">
        {catData.map(({ cat, pct, levelCounts }, i) => {
          const colors = CATEGORY_COLORS[cat] || { bar: "from-white/30 to-white/10", text: "text-white/50" };
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{CATEGORY_ICONS[cat] || "◈"}</span>
                  <span className={`font-orbitron text-xs font-bold uppercase tracking-widest capitalize ${colors.text}`}>
                    {cat}
                  </span>
                  {/* Level pill counts */}
                  <div className="flex gap-1">
                    {levelCounts.junior > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber text-green-400/60 border border-green-400/15 bg-green-400/5">
                        {levelCounts.junior}JR
                      </span>
                    )}
                    {levelCounts.mid > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber text-yellow-400/60 border border-yellow-400/15 bg-yellow-400/5">
                        {levelCounts.mid}MID
                      </span>
                    )}
                    {levelCounts.senior > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber text-red-400/60 border border-red-400/15 bg-red-400/5">
                        {levelCounts.senior}SR
                      </span>
                    )}
                  </div>
                </div>
                <span className={`font-mono-cyber text-xs font-bold ${colors.text}`}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.07 }}
                  className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="font-mono-cyber text-xs text-white/20 mt-4 text-center">
        Score based on skill level coverage &amp; confidence ratings
      </p>
    </div>
  );
}
