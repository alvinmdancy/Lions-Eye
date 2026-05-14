import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_ICONS = {
  documentation: "📚", video: "🎥", course: "🎓", lab: "🧪",
  book: "📖", certification: "🏅", github: "💻", cheatsheet: "📋", other: "🔗",
};

export default function ExportResources({ resources, filterSkill, filterTag, search }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  const topic = filterSkill || filterTag || search || "My Resources";

  // Build shareable URL — encodes current filters into query params
  const buildShareableLink = () => {
    const params = new URLSearchParams();
    if (filterSkill) params.set("skill", filterSkill);
    if (filterTag)   params.set("tag", filterTag);
    if (search)      params.set("q", search);
    const base = `${window.location.origin}/library`;
    return params.toString() ? `${base}?${params.toString()}` : base;
  };

  // Build markdown export
  const buildMarkdown = () => {
    const lines = [
      `# 📚 Study Resources: ${topic}`,
      `> Exported from SkillForge on ${new Date().toLocaleDateString()}`,
      "",
    ];
    const byType = {};
    resources.forEach((r) => {
      const t = r.type || "other";
      if (!byType[t]) byType[t] = [];
      byType[t].push(r);
    });
    for (const [type, items] of Object.entries(byType)) {
      lines.push(`## ${TYPE_ICONS[type] || "🔗"} ${type.charAt(0).toUpperCase() + type.slice(1)}`);
      items.forEach((r) => {
        lines.push(`- [${r.title}](${r.url})${r.is_free ? " *(Free)*" : ""}${r.rating ? ` ⭐ ${r.rating}/5` : ""}${r.notes ? `  \n  > ${r.notes}` : ""}`);
      });
      lines.push("");
    }
    return lines.join("\n");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buildShareableLink());
    setCopied("link");
    setTimeout(() => setCopied(""), 2500);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(buildMarkdown());
    setCopied("md");
    setTimeout(() => setCopied(""), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([buildMarkdown()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillforge-${topic.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (resources.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="cyber-button px-4 py-2.5 rounded-xl font-orbitron text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
      >
        <span>↗</span> Share / Export
        {resources.length > 0 && (
          <span className="font-mono-cyber text-xs opacity-50">({resources.length})</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 cyber-card rounded-xl p-4 border border-cyber-cyan/20 shadow-glow-cyan"
            >
              <p className="font-orbitron text-xs font-bold uppercase tracking-widest text-cyber-cyan mb-1">
                Export: {topic}
              </p>
              <p className="font-mono-cyber text-xs text-white/30 mb-4">
                {resources.length} resource{resources.length !== 1 ? "s" : ""} in current view
              </p>

              <div className="space-y-2">
                {/* Shareable link */}
                <div className="p-3 rounded-lg border border-white/10 bg-white/3">
                  <p className="font-orbitron text-xs text-white/50 uppercase tracking-widest mb-1.5">🔗 Shareable Link</p>
                  <p className="font-mono-cyber text-xs text-white/25 truncate mb-2">{buildShareableLink()}</p>
                  <button
                    onClick={handleCopyLink}
                    className={`w-full py-1.5 rounded-lg border font-orbitron text-xs uppercase tracking-widest transition-all ${
                      copied === "link"
                        ? "border-green-400/40 bg-green-400/10 text-green-400"
                        : "border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan hover:bg-cyber-cyan/15"
                    }`}
                  >
                    {copied === "link" ? "✓ Copied!" : "Copy Link"}
                  </button>
                </div>

                {/* Markdown */}
                <div className="p-3 rounded-lg border border-white/10 bg-white/3">
                  <p className="font-orbitron text-xs text-white/50 uppercase tracking-widest mb-1.5">📋 Markdown Export</p>
                  <p className="font-inter text-xs text-white/25 mb-2">Formatted list with titles, URLs, ratings & notes</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyMarkdown}
                      className={`flex-1 py-1.5 rounded-lg border font-orbitron text-xs uppercase tracking-widest transition-all ${
                        copied === "md"
                          ? "border-green-400/40 bg-green-400/10 text-green-400"
                          : "border-cyber-purple/30 bg-cyber-purple/5 text-cyber-purple hover:bg-cyber-purple/15"
                      }`}
                    >
                      {copied === "md" ? "✓ Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownloadMarkdown}
                      className="flex-1 py-1.5 rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 text-cyber-purple hover:bg-cyber-purple/15 font-orbitron text-xs uppercase tracking-widest transition-all"
                    >
                      ↓ Download
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}