import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import CyberHeader from "@/components/CyberHeader";
import AddResourceModal from "@/components/AddResourceModal";
import StarRating from "@/components/StarRating";
import ExportResources from "@/components/ExportResources";
import { Link } from "react-router-dom";

const TYPE_META = {
  documentation: { icon: "📚", label: "Docs", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  video:         { icon: "🎥", label: "Video", color: "text-red-400 border-red-400/30 bg-red-400/10" },
  course:        { icon: "🎓", label: "Course", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  lab:           { icon: "🧪", label: "Lab", color: "text-green-400 border-green-400/30 bg-green-400/10" },
  book:          { icon: "📖", label: "Book", color: "text-purple-400 border-purple-400/30 bg-purple-400/10" },
  certification: { icon: "🏅", label: "Cert", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  github:        { icon: "💻", label: "GitHub", color: "text-white/70 border-white/20 bg-white/5" },
  cheatsheet:    { icon: "📋", label: "Cheatsheet", color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" },
  other:         { icon: "🔗", label: "Other", color: "text-white/50 border-white/10 bg-white/5" },
};

const ALL_TYPES = ["all", ...Object.keys(TYPE_META)];

export default function Library() {
  const [resources, setResources] = useState([]);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterSkill, setFilterSkill] = useState(() => new URLSearchParams(window.location.search).get("skill") || "");
  const [filterTag, setFilterTag] = useState(() => new URLSearchParams(window.location.search).get("tag") || "");
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [selected, setSelected] = useState(new Set());
  const [bulkActionType, setBulkActionType] = useState("delete"); // "delete" or skill name for "move"

  const fetchResources = async () => {
    setLoading(true);
    const [resourceData, configData] = await Promise.all([
      db.entities.ResourceLink.list("-created_date", 200),
      db.entities.SavedConfig.list("-created_date", 200),
    ]);
    setResources(resourceData);
    setSavedConfigs(configData);
    setLoading(false);
  };

  useEffect(() => { fetchResources(); }, []);

  const handleDelete = async (id) => {
    await db.entities.ResourceLink.delete(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaved = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
    setShowAdd(false);
  };

  const toggleSelected = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} resource${selected.size !== 1 ? "s" : ""}?`)) return;
    await Promise.all(Array.from(selected).map((id) => db.entities.ResourceLink.delete(id)));
    setResources((prev) => prev.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
  };

  const handleBulkMove = async (skill) => {
    await Promise.all(
      Array.from(selected).map((id) =>
        db.entities.ResourceLink.update(id, { skill })
      )
    );
    setResources((prev) =>
      prev.map((r) => (selected.has(r.id) ? { ...r, skill } : r))
    );
    setSelected(new Set());
  };

  const q = search.toLowerCase();

  const allTags = [...new Set(resources.flatMap((r) => r.tags || []))].sort();

  const filtered = resources.filter((r) => {
    const matchType = filterType === "all" || r.type === filterType;
    const matchSkill = !filterSkill || r.skill?.toLowerCase().includes(filterSkill.toLowerCase());
    const matchTag = !filterTag || (r.tags || []).includes(filterTag);
    const matchSearch = !q ||
      r.title.toLowerCase().includes(q) ||
      r.url.toLowerCase().includes(q) ||
      r.skill?.toLowerCase().includes(q) ||
      r.notes?.toLowerCase().includes(q) ||
      (r.tags || []).some((t) => t.toLowerCase().includes(q));
    return matchType && matchSkill && matchTag && matchSearch;
  });

  const filteredConfigs = search
    ? savedConfigs.filter((c) =>
        c.skill?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.goal?.toLowerCase().includes(q) ||
        c.career_label?.toLowerCase().includes(q)
      )
    : [];

  // Unique skills for filter suggestions
  const allSkills = [...new Set(resources.map((r) => r.skill).filter(Boolean))].sort();

  const typeCount = (type) => type === "all" ? resources.length : resources.filter((r) => r.type === type).length;

  return (
    <div className="min-h-screen cyber-grid relative" style={{ background: "#050A1F" }}>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/8 rounded-full blur-3xl pointer-events-none" />

      <CyberHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="font-mono-cyber text-xs text-cyber-cyan uppercase tracking-widest">Resource Library</span>
            </div>
            <h1 className="font-orbitron font-black text-2xl md:text-4xl uppercase tracking-wider">
              <span className="text-white">Resource </span>
              <span style={{ color: "#06B6D4", textShadow: "0 0 30px rgba(6,182,212,0.5)" }}>Library</span>
            </h1>
            <p className="font-inter text-white/40 text-sm mt-1">
              {resources.length} resource{resources.length !== 1 ? "s" : ""} saved across all sessions
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
           <ExportResources
             resources={filtered}
             filterSkill={filterSkill}
             filterTag={filterTag}
             search={search}
           />
           {selected.size > 0 && (
             <div className="flex items-center gap-2">
               <span className="font-mono-cyber text-xs text-white/40">{selected.size} selected</span>
               <button
                 onClick={() => setBulkActionType("move")}
                 className="cyber-button px-3 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest"
               >
                 Move →
               </button>
               <button
                 onClick={handleBulkDelete}
                 className="border border-red-400/30 bg-red-400/5 text-red-400/70 hover:text-red-400 px-3 py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest transition-all"
               >
                 Delete
               </button>
             </div>
           )}
           <button
             onClick={() => setShowAdd(true)}
             className="cyber-button-primary px-5 py-3 rounded-xl font-orbitron text-xs uppercase tracking-widest whitespace-nowrap"
           >
             ⊕ Add Resource
           </button>
          </div>
        </motion.div>

        {/* Bulk Move Modal */}
        {selected.size > 0 && bulkActionType === "move" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="cyber-card rounded-xl p-4 mb-6 space-y-3 border border-cyber-cyan/30 bg-cyber-cyan/5"
          >
            <div className="flex items-center justify-between">
              <span className="font-orbitron text-xs uppercase tracking-widest text-cyber-cyan">Move {selected.size} resource{selected.size !== 1 ? "s" : ""} to skill:</span>
              <button
                onClick={() => setBulkActionType("delete")}
                className="text-white/30 hover:text-white/60 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    handleBulkMove(skill);
                    setBulkActionType("delete");
                  }}
                  className="px-3 py-1.5 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-all font-mono-cyber text-xs"
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="cyber-card rounded-xl p-4 mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-cyan/50 text-sm pointer-events-none">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword — e.g. 'Kubernetes', 'Firewall', 'Docker'..."
              className="w-full cyber-input rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Type filter pills */}
          <div className="flex gap-2 flex-wrap">
            {ALL_TYPES.map((type) => {
              const meta = type === "all" ? { icon: "◈", label: "All" } : TYPE_META[type];
              const count = typeCount(type);
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg border font-mono-cyber text-xs transition-all flex items-center gap-1.5 ${
                    filterType === type
                      ? "border-cyber-cyan/60 bg-cyber-cyan/15 text-cyber-cyan"
                      : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {meta.icon} {meta.label} <span className="opacity-50">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <span className="font-orbitron text-xs text-white/30 uppercase tracking-widest">Tags:</span>
              <button
                onClick={() => setFilterTag("")}
                className={`px-2.5 py-1 rounded text-xs font-mono-cyber transition-all border ${!filterTag ? "border-cyber-pink/60 text-cyber-pink bg-cyber-pink/10" : "border-white/10 text-white/30 hover:text-white/50"}`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag === filterTag ? "" : tag)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-cyber transition-all border ${filterTag === tag ? "border-cyber-pink/60 text-cyber-pink bg-cyber-pink/10" : "border-white/10 text-white/30 hover:text-white/50"}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Skill filter */}
          {allSkills.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <span className="font-orbitron text-xs text-white/30 uppercase tracking-widest">Skill:</span>
              <button
                onClick={() => setFilterSkill("")}
                className={`px-2.5 py-1 rounded text-xs font-mono-cyber transition-all border ${!filterSkill ? "border-cyber-purple/60 text-cyber-purple bg-cyber-purple/10" : "border-white/10 text-white/30 hover:text-white/50"}`}
              >
                All
              </button>
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setFilterSkill(skill === filterSkill ? "" : skill)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-cyber transition-all border ${filterSkill === skill ? "border-cyber-purple/60 text-cyber-purple bg-cyber-purple/10" : "border-white/10 text-white/30 hover:text-white/50"}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Resource Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-card rounded-xl py-24 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-orbitron text-sm text-white/40 uppercase tracking-widest">
              {resources.length === 0 ? "No resources saved yet" : "No resources match your filters"}
            </p>
            {resources.length === 0 && (
              <p className="font-inter text-xs text-white/25 mt-2">
                Generate prompts on the main page — the AI will suggest resources you can save here.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {/* Select All */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10">
              <input
                type="checkbox"
                checked={selected.size === filtered.length && filtered.length > 0}
                onChange={selectAll}
                className="w-4 h-4 cursor-pointer accent-cyber-cyan"
              />
              <span className="font-mono-cyber text-xs text-white/40">
                {selected.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((resource, i) => {
                const meta = TYPE_META[resource.type] || TYPE_META.other;
                const isSelected = selected.has(resource.id);
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                    className={`cyber-card rounded-xl p-4 flex flex-col gap-3 group hover:border-cyber-cyan/30 transition-all cursor-pointer relative ${isSelected ? "border-cyber-cyan/50 bg-cyber-cyan/10" : ""}`}
                    onClick={() => toggleSelected(resource.id)}
                  >
                    {/* Selection checkbox */}
                    <div className="absolute top-3 right-3 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(resource.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 cursor-pointer accent-cyber-cyan"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`px-2 py-0.5 rounded border text-xs font-mono-cyber flex-shrink-0 ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </span>
                        {resource.is_free && (
                          <span className="px-1.5 py-0.5 rounded border border-green-400/20 bg-green-400/5 text-green-400 text-xs font-mono-cyber flex-shrink-0">
                            FREE
                          </span>
                        )}
                      </div>
                      {!isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resource.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-xl leading-none flex-shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-orbitron text-sm text-white/90 hover:text-cyber-cyan transition-colors line-clamp-2 block"
                      >
                        {resource.title}
                      </a>
                      <p className="font-mono-cyber text-xs text-white/25 mt-1 truncate">{resource.url}</p>
                    </div>

                    {resource.skill && (
                      <span className="text-xs font-mono-cyber text-cyber-purple/70 border border-cyber-purple/20 bg-cyber-purple/5 px-2 py-0.5 rounded self-start">
                        {resource.skill}
                      </span>
                    )}

                    {resource.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setFilterTag(tag === filterTag ? "" : tag)}
                            className={`px-2 py-0.5 rounded border font-mono-cyber text-xs transition-all ${
                              filterTag === tag
                                ? "border-cyber-pink/60 bg-cyber-pink/20 text-cyber-pink"
                                : "border-cyber-pink/25 bg-cyber-pink/5 text-cyber-pink/60 hover:border-cyber-pink/50 hover:text-cyber-pink"
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    <StarRating resourceId={resource.id} initialRating={resource.rating} />

                    {resource.notes && (
                      <p className="font-inter text-xs text-white/35 leading-relaxed line-clamp-2 border-t border-white/5 pt-2">
                        {resource.notes}
                      </p>
                    )}

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto cyber-button px-3 py-2 rounded-lg text-xs text-center"
                    >
                      Open Resource →
                    </a>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Saved Configs (Past Prompts) — only shown when searching */}
        <AnimatePresence>
          {filteredConfigs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <h2 className="font-orbitron text-xs uppercase tracking-widest text-cyber-purple/80 mb-3 flex items-center gap-2">
                <span>◈</span> Past Prompt Configs matching "{search}"
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredConfigs.map((cfg) => (
                  <div key={cfg.id} className="cyber-card rounded-xl p-4 border border-cyber-purple/20 hover:border-cyber-purple/40 transition-all">
                    <p className="font-orbitron text-xs text-cyber-purple uppercase tracking-widest mb-1">{cfg.name}</p>
                    <p className="font-mono-cyber text-sm text-white/80">{cfg.skill}</p>
                    {cfg.career_label && <p className="font-inter text-xs text-white/35 mt-0.5">{cfg.career_label}</p>}
                    {cfg.goal && <p className="font-inter text-xs text-white/30 mt-2 line-clamp-2 border-t border-white/5 pt-2">{cfg.goal}</p>}
                    <Link
                      to="/"
                      className="mt-3 block text-center cyber-button px-3 py-1.5 rounded-lg text-xs"
                    >
                      Load in Prompt Engine →
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showAdd && <AddResourceModal onClose={() => setShowAdd(false)} onSaved={handleSaved} />}
      </AnimatePresence>
    </div>
  );
}
