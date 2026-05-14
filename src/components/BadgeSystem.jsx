import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import { ALL_BADGES } from "@/lib/badges";

// Toast notification for newly unlocked badge
function BadgeToast({ badge, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border border-yellow-400/40 bg-cyber-card/95 backdrop-blur-xl shadow-[0_0_30px_rgba(250,204,21,0.2)]"
    >
      <span className="text-2xl">{badge.icon}</span>
      <div>
        <p className="font-orbitron text-xs font-bold text-yellow-400 uppercase tracking-widest">Badge Unlocked!</p>
        <p className="font-inter text-sm text-white/80">{badge.name}</p>
        <p className="font-mono-cyber text-xs text-white/40">{badge.description}</p>
      </div>
      <button onClick={onDismiss} className="text-white/20 hover:text-white/50 text-lg ml-2">×</button>
    </motion.div>
  );
}

const CATEGORY_COLORS = {
  milestone:   "border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan",
  proficiency: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
  dedication:  "border-cyber-purple/40 bg-cyber-purple/10 text-cyber-purple",
  mastery:     "border-cyber-pink/40 bg-cyber-pink/10 text-cyber-pink",
};

export default function BadgeSystem({ configs, resources }) {
  const [earnedBadgeIds, setEarnedBadgeIds] = useState(new Set());
  const [newToast, setNewToast] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Load already-earned badges from DB
  useEffect(() => {
    db.entities.Badge.list("-created_date", 200).then((rows) => {
      setEarnedBadgeIds(new Set(rows.map((r) => r.badge_id)));
    });
  }, []);

  // Check & award new badges whenever configs/resources/earnedBadgeIds change
  const checkBadges = useCallback(async () => {
    for (const def of ALL_BADGES) {
      if (earnedBadgeIds.has(def.id)) continue;
      if (def.check(configs, resources)) {
        // Award it
        await db.entities.Badge.create({
          badge_id: def.id,
          name: def.name,
          description: def.description,
          icon: def.icon,
          category: def.category,
          earned_at: new Date().toISOString(),
        });
        setEarnedBadgeIds((prev) => new Set([...prev, def.id]));
        setNewToast(def);
        break; // show one toast at a time
      }
    }
  }, [configs, resources, earnedBadgeIds]);

  useEffect(() => {
    if (configs.length > 0 || resources.length > 0) checkBadges();
  }, [checkBadges, configs.length, resources.length]);

  const earned = ALL_BADGES.filter((b) => earnedBadgeIds.has(b.id));
  const locked = ALL_BADGES.filter((b) => !earnedBadgeIds.has(b.id));
  const displayLocked = showAll ? locked : locked.slice(0, 6);

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {newToast && (
          <BadgeToast key={newToast.id} badge={newToast} onDismiss={() => setNewToast(null)} />
        )}
      </AnimatePresence>

      {/* Badge Panel */}
      <div className="cyber-card rounded-xl p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏅</span>
            <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/70">
              Achievement Badges
            </h3>
          </div>
          <span className="font-mono-cyber text-xs text-cyber-cyan/60">
            {earned.length} / {ALL_BADGES.length}
          </span>
        </div>

        {/* XP progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono-cyber text-xs text-white/30">Progress</span>
            <span className="font-mono-cyber text-xs text-white/30">
              {Math.round((earned.length / ALL_BADGES.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earned.length / ALL_BADGES.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-cyber-purple to-cyber-cyan"
            />
          </div>
        </div>

        {/* Earned badges */}
        {earned.length > 0 && (
          <div>
            <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest mb-2.5">Unlocked</p>
            <div className="flex flex-wrap gap-2">
              {earned.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  title={badge.description}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono-cyber cursor-default ${CATEGORY_COLORS[badge.category]}`}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges (next goals) */}
        {locked.length > 0 && (
          <div>
            <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest mb-2.5">Next Goals</p>
            <div className="space-y-1.5">
              {displayLocked.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/5 bg-white/2 opacity-50"
                >
                  <span className="text-sm grayscale">{badge.icon}</span>
                  <div className="min-w-0">
                    <p className="font-mono-cyber text-xs text-white/40 truncate">{badge.name}</p>
                    <p className="font-inter text-xs text-white/20 truncate">{badge.description}</p>
                  </div>
                  <span className="ml-auto text-white/10 text-xs flex-shrink-0">🔒</span>
                </div>
              ))}
            </div>
            {locked.length > 6 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="mt-2 font-mono-cyber text-xs text-white/25 hover:text-white/50 transition-colors w-full text-center"
              >
                {showAll ? "Show less ↑" : `+${locked.length - 6} more goals ↓`}
              </button>
            )}
          </div>
        )}

        {earned.length === 0 && (
          <p className="font-inter text-xs text-white/25 text-center py-2">
            Start saving roadmap configs to earn your first badge!
          </p>
        )}
      </div>
    </>
  );
}