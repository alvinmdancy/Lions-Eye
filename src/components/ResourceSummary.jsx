import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { Link } from "react-router-dom";

export default function ResourceSummary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.ResourceLink.list("-rating", 200).then((data) => {
      setResources(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (resources.length === 0) return null;

  // Top-rated: rating >= 4, sorted desc, max 4
  const topRated = resources
    .filter((r) => r.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // Tag counts
  const tagCounts = {};
  resources.forEach((r) => {
    (r.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const TYPE_ICONS = {
    documentation: "📚", video: "🎥", course: "🎓", lab: "🧪",
    book: "📖", certification: "🏅", github: "💻", cheatsheet: "📋", other: "🔗",
  };

  const maxTagCount = topTags[0]?.[1] || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="cyber-card rounded-xl p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-base">★</span>
          <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/70">
            Knowledge Vault Summary
          </h3>
        </div>
        <Link
          to="/library"
          className="font-mono-cyber text-xs text-cyber-cyan/50 hover:text-cyber-cyan transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Top Rated */}
      {topRated.length > 0 && (
        <div>
          <p className="font-orbitron text-xs text-white/30 uppercase tracking-widest mb-2.5">
            ★ Top Rated Resources
          </p>
          <div className="space-y-2">
            {topRated.map((r) => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-white/5 bg-white/2 hover:border-cyber-cyan/25 hover:bg-cyber-cyan/5 transition-all group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm flex-shrink-0">{TYPE_ICONS[r.type] || "🔗"}</span>
                  <span className="font-inter text-xs text-white/70 group-hover:text-white/90 transition-colors truncate">
                    {r.title}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={`text-xs ${s <= r.rating ? "text-yellow-400" : "text-white/10"}`}>★</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tag Counts */}
      {topTags.length > 0 && (
        <div>
          <p className="font-orbitron text-xs text-white/30 uppercase tracking-widest mb-2.5">
            ◈ Resources by Technology
          </p>
          <div className="space-y-1.5">
            {topTags.map(([tag, count]) => (
              <Link
                key={tag}
                to={`/library`}
                className="flex items-center gap-3 group"
              >
                <span className="font-mono-cyber text-xs text-cyber-pink/60 group-hover:text-cyber-pink transition-colors w-24 truncate flex-shrink-0">
                  #{tag}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxTagCount) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyber-purple/70 to-cyber-cyan/70"
                  />
                </div>
                <span className="font-mono-cyber text-xs text-white/30 w-6 text-right flex-shrink-0">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Total count pill */}
      <div className="pt-1 border-t border-white/5 flex items-center gap-3">
        <span className="font-mono-cyber text-xs text-white/25">
          {resources.length} total resource{resources.length !== 1 ? "s" : ""} saved
        </span>
        <span className="font-mono-cyber text-xs text-white/15">•</span>
        <span className="font-mono-cyber text-xs text-white/25">
          {resources.filter((r) => r.rating >= 4).length} highly rated
        </span>
      </div>
    </motion.div>
  );
}