import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";

const RESOURCE_TYPES = [
  { value: "documentation", label: "📚 Documentation" },
  { value: "video", label: "🎥 Video Tutorial" },
  { value: "course", label: "🎓 Course" },
  { value: "lab", label: "🧪 Lab / Sandbox" },
  { value: "book", label: "📖 Book" },
  { value: "certification", label: "🏅 Certification" },
  { value: "github", label: "💻 GitHub Repo" },
  { value: "cheatsheet", label: "📋 Cheat Sheet" },
  { value: "other", label: "🔗 Other" },
];

export default function AddResourceModal({ onClose, onSaved, prefill }) {
  const [form, setForm] = useState({
    title: prefill?.title || "",
    url: prefill?.url || "",
    type: prefill?.type || "documentation",
    skill: prefill?.skill || "",
    category: prefill?.category || "",
    notes: prefill?.notes || "",
    is_free: prefill?.is_free ?? true,
    tags: prefill?.tags || [],
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (tag) => set("tags", form.tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) return;
    setSaving(true);
    const saved = await db.entities.ResourceLink.create(form);
    setSaving(false);
    onSaved(saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="cyber-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-cyber-cyan mb-5">
          Add Resource to Library
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan/80">Title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Kubernetes Official Docs"
              className="w-full cyber-input rounded-lg px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan/80">URL *</label>
            <input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://..."
              className="w-full cyber-input rounded-lg px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan/80">Type *</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full cyber-select rounded-lg px-3 py-3 text-sm appearance-none focus:outline-none"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan/80">Skill</label>
              <input
                value={form.skill}
                onChange={(e) => set("skill", e.target.value)}
                placeholder="e.g. Kubernetes"
                className="w-full cyber-input rounded-lg px-3 py-3 text-sm focus:outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan/80">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Why you saved this, key takeaways..."
              rows={2}
              className="w-full cyber-input rounded-lg px-4 py-3 text-sm focus:outline-none placeholder:text-white/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan/80">Tags (optional)</label>
            <div className="cyber-input rounded-lg px-3 py-2 flex flex-wrap gap-1.5 min-h-[44px]">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded border border-cyber-pink/40 bg-cyber-pink/10 text-cyber-pink font-mono-cyber text-xs">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-cyber-pink/50 hover:text-cyber-pink ml-0.5">×</button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput.trim() && addTag(tagInput)}
                placeholder={form.tags.length === 0 ? "e.g. Kubernetes, AWS — press Enter to add" : "Add another…"}
                className="bg-transparent text-cyber-cyan font-mono-cyber text-xs focus:outline-none flex-1 min-w-24 placeholder:text-white/20"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("is_free", !form.is_free)}
              className={`w-10 h-5 rounded-full transition-all relative ${form.is_free ? "bg-cyber-cyan/40 border border-cyber-cyan/60" : "bg-white/10 border border-white/20"}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all ${form.is_free ? "left-5 bg-cyber-cyan" : "left-0.5 bg-white/30"}`} />
            </div>
            <span className="font-mono-cyber text-xs text-white/60">Free resource</span>
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 font-orbitron text-xs uppercase tracking-widest hover:border-white/20 hover:text-white/60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim() || !form.url.trim() || saving}
            className={`flex-1 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest transition-all ${
              form.title.trim() && form.url.trim() && !saving
                ? "cyber-button-primary"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : "Add to Library"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
