import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import CyberHeader from "@/components/CyberHeader";
import { Link } from "react-router-dom";
import ProficiencyBar from "@/components/ProficiencyBar";
import StudySession from "@/components/StudySession";
import BadgeSystem from "@/components/BadgeSystem";
import CategoryProgress from "@/components/CategoryProgress";
import ProjectSidebar from "@/components/ProjectSidebar";
import AssignProject from "@/components/AssignProject";
import ConfigNotes from "@/components/ConfigNotes";
import ExportRoadmapPDF from "@/components/ExportRoadmapPDF";

const CATEGORY_ICONS = {
  devops: "⚙️",
  cloud: "☁️",
  networking: "🌐",
  security: "🔐",
  sysadmin: "🖥️",
};

const LEVEL_ORDER = { junior: 0, mid: 1, senior: 2 };
const LEVEL_COLORS = {
  junior: {
    badge: "text-green-400 border-green-400/30 bg-green-400/10",
    glow: "shadow-green-500/20",
    connector: "bg-green-400/30",
    label: "JR",
  },
  mid: {
    badge: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    glow: "shadow-yellow-500/20",
    connector: "bg-yellow-400/30",
    label: "MID",
  },
  senior: {
    badge: "text-red-400 border-red-400/30 bg-red-400/10",
    glow: "shadow-red-500/20",
    connector: "bg-red-400/30",
    label: "SR",
  },
};

const PROMPT_TYPE_ICONS = {
  learning_path: "🗺️",
  concept_explainer: "💡",
  lab_exercise: "🧪",
  interview_prep: "🎯",
};

export default function Roadmap() {
  const [configs, setConfigs] = useState([]);
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState(null); // null=all, "__unassigned__", or project id
  const [studyConfig, setStudyConfig] = useState(null);

  useEffect(() => {
    Promise.all([
      db.entities.SavedConfig.list("-created_date", 200),
      db.entities.ResourceLink.list("-created_date", 200),
      db.entities.Project.list("-created_date", 100),
    ]).then(([configData, resourceData, projectData]) => {
      setConfigs(configData);
      setResources(resourceData);
      setProjects(projectData);
      setLoading(false);
    });
  }, []);

  const handleAssignProject = (configId, projectId) => {
    setConfigs((prev) => prev.map((c) => c.id === configId ? { ...c, project_id: projectId } : c));
  };

  const handleDelete = async (id) => {
    await db.entities.SavedConfig.delete(id);
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  // Project-filtered configs
  const projectFilteredConfigs = selectedProjectId === null
    ? configs
    : selectedProjectId === "__unassigned__"
    ? configs.filter((c) => !c.project_id)
    : configs.filter((c) => c.project_id === selectedProjectId);

  // Config counts per project for sidebar
  const configCounts = { __total__: configs.length, __unassigned__: configs.filter((c) => !c.project_id).length };
  projects.forEach((p) => { configCounts[p.id] = configs.filter((c) => c.project_id === p.id).length; });

  // Group by category → then by skill_level (junior, mid, senior)
  const categories = [...new Set(projectFilteredConfigs.map((c) => c.category).filter(Boolean))];

  const filteredCategories =
    selectedCategory === "all" ? categories : categories.filter((c) => c === selectedCategory);

  const grouped = {};
  for (const cat of filteredCategories) {
    const catConfigs = projectFilteredConfigs.filter((c) => c.category === cat);
    grouped[cat] = {
      junior: catConfigs.filter((c) => c.skill_level === "junior").sort((a, b) => a.skill?.localeCompare(b.skill)),
      mid: catConfigs.filter((c) => c.skill_level === "mid").sort((a, b) => a.skill?.localeCompare(b.skill)),
      senior: catConfigs.filter((c) => c.skill_level === "senior").sort((a, b) => a.skill?.localeCompare(b.skill)),
    };
  }

  // Configs with no category or skill_level — show in "Uncategorized"
  const uncategorized = projectFilteredConfigs.filter((c) => !c.category || !c.skill_level);

  return (
    <>
    <AnimatePresence>
      {studyConfig && (
        <StudySession cfg={studyConfig} onClose={() => setStudyConfig(null)} />
      )}
    </AnimatePresence>
    <div className="min-h-screen cyber-grid relative" style={{ background: "#050A1F" }}>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/8 rounded-full blur-3xl pointer-events-none" />

      <CyberHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
        {/* Project Sidebar */}
        {!loading && (
          <div className="w-52 flex-shrink-0 hidden lg:block">
            <ProjectSidebar
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onProjectsChange={setProjects}
              configCounts={configCounts}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="font-mono-cyber text-xs text-cyber-cyan uppercase tracking-widest">Career Roadmap</span>
            </div>
            <ExportRoadmapPDF configs={configs} resources={resources} />
          </div>
          <h1 className="font-orbitron font-black text-2xl md:text-4xl uppercase tracking-wider mb-2">
            <span className="text-white">Career </span>
            <span style={{ color: "#06B6D4", textShadow: "0 0 30px rgba(6,182,212,0.5)" }}>Roadmap</span>
          </h1>
          <p className="font-inter text-white/40 text-sm">
            Your saved prompt configs, organized by career progression — Junior → Mid → Senior.
          </p>
          {/* Active project pill */}
          {selectedProjectId && selectedProjectId !== "__unassigned__" && (() => {
            const p = projects.find((x) => x.id === selectedProjectId);
            return p ? (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-purple/30 bg-cyber-purple/10">
                <span>{p.icon}</span>
                <span className="font-orbitron text-xs text-cyber-purple uppercase tracking-widest">{p.name}</span>
                {p.description && <span className="font-inter text-xs text-white/30">— {p.description}</span>}
                <button onClick={() => setSelectedProjectId(null)} className="text-white/20 hover:text-white/50 ml-1">×</button>
              </div>
            ) : null;
          })()}
          {/* Mobile project selector */}
          <div className="lg:hidden mt-4">
            <ProjectSidebar
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onProjectsChange={setProjects}
              configCounts={configCounts}
            />
          </div>
        </motion.div>

        {/* Category Progress */}
        {!loading && configs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <CategoryProgress configs={configs} />
          </motion.div>
        )}

        {/* Badge System */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <BadgeSystem configs={configs} resources={resources} />
          </motion.div>
        )}

        {/* Category filter */}
        {!loading && configs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg border font-mono-cyber text-xs transition-all ${
                selectedCategory === "all"
                  ? "border-cyber-cyan/60 bg-cyber-cyan/15 text-cyber-cyan"
                  : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              ◈ All Tracks
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border font-mono-cyber text-xs transition-all ${
                  selectedCategory === cat
                    ? "border-cyber-purple/60 bg-cyber-purple/15 text-cyber-purple"
                    : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                }`}
              >
                {CATEGORY_ICONS[cat] || "◈"} {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && configs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-card rounded-xl py-28 text-center">
            <p className="text-5xl mb-5">🗺️</p>
            <h3 className="font-orbitron text-sm text-white/40 uppercase tracking-widest mb-2">No Roadmap Yet</h3>
            <p className="font-inter text-xs text-white/25 max-w-xs mx-auto mb-6">
              Save prompt configurations from the Prompt Engine and they'll appear here as a career progression roadmap.
            </p>
            <Link
              to="/"
              className="inline-block cyber-button px-5 py-2.5 rounded-lg font-orbitron text-xs uppercase tracking-widest"
            >
              ⚡ Go to Prompt Engine
            </Link>
          </motion.div>
        )}

        {/* Roadmap tracks */}
        {!loading && filteredCategories.map((cat, catIdx) => {
          const g = grouped[cat];
          const hasAny = g.junior.length + g.mid.length + g.senior.length > 0;
          if (!hasAny) return null;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="mb-12"
            >
              {/* Track header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{CATEGORY_ICONS[cat] || "◈"}</span>
                <h2 className="font-orbitron text-lg font-black uppercase tracking-widest text-white/90 capitalize">{cat}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-purple/40 to-transparent" />
                <span className="font-mono-cyber text-xs text-white/25">
                  {g.junior.length + g.mid.length + g.senior.length} configs
                </span>
              </div>

              {/* Timeline lanes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Connecting arrow overlay (decorative, desktop only) */}
                <div className="hidden md:flex absolute top-8 left-0 right-0 items-center pointer-events-none" style={{ zIndex: 0 }}>
                  <div className="flex-1" />
                  <div className="w-1/3 flex justify-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-green-400/20 via-yellow-400/20 to-red-400/20" />
                  </div>
                  <div className="flex-1" />
                </div>

                {["junior", "mid", "senior"].map((lvl) => {
                  const items = g[lvl];
                  const colors = LEVEL_COLORS[lvl];
                  const levelLabels = { junior: "Junior Engineer", mid: "Mid-Level Engineer", senior: "Senior / Architect" };

                  return (
                    <div key={lvl} className="relative" style={{ zIndex: 1 }}>
                      {/* Level header */}
                      <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg border ${colors.badge} bg-opacity-10`}>
                        <span className={`font-orbitron text-xs font-black px-2 py-0.5 rounded border ${colors.badge}`}>
                          {colors.label}
                        </span>
                        <span className="font-inter text-xs text-white/50">{levelLabels[lvl]}</span>
                        <span className="ml-auto font-mono-cyber text-xs text-white/25">{items.length}</span>
                      </div>

                      {items.length === 0 ? (
                        <div className="border border-dashed border-white/10 rounded-xl p-6 text-center">
                          <p className="font-mono-cyber text-xs text-white/20">No configs saved</p>
                          <Link to="/" className="font-mono-cyber text-xs text-cyber-cyan/40 hover:text-cyber-cyan/70 transition-colors mt-1 block">
                            + Add one →
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {items.map((cfg, i) => (
                            <motion.div
                              key={cfg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className="cyber-card rounded-xl p-4 group hover:border-cyber-cyan/30 transition-all relative"
                            >
                              {/* Step number */}
                              <div className="absolute -left-2 top-4 w-4 h-4 rounded-full border border-cyber-purple/40 bg-cyber-bg flex items-center justify-center">
                                <span className="font-mono-cyber text-xs text-white/30">{i + 1}</span>
                              </div>

                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="font-mono-cyber text-xs text-white/30">{PROMPT_TYPE_ICONS[cfg.prompt_type] || "◈"} {cfg.prompt_type?.replace(/_/g, " ")}</span>
                                <button
                                  onClick={() => handleDelete(cfg.id)}
                                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-base leading-none"
                                >
                                  ×
                                </button>
                              </div>

                              <p className="font-orbitron text-xs font-bold text-white/90 mb-0.5 truncate">{cfg.name}</p>
                              <p className="font-mono-cyber text-sm text-cyber-cyan mb-1 truncate">{cfg.skill}</p>
                              <div className="mb-2">
                                <AssignProject
                                  configId={cfg.id}
                                  currentProjectId={cfg.project_id}
                                  projects={projects}
                                  onAssigned={handleAssignProject}
                                />
                              </div>

                              {cfg.goal && (
                                <p className="font-inter text-xs text-white/30 line-clamp-2 border-t border-white/5 pt-2 mb-2">
                                  {cfg.goal}
                                </p>
                              )}

                              <div className="flex gap-1.5 flex-wrap">
                                {cfg.level && (
                                  <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber bg-white/5 text-white/35 border border-white/10">
                                    {cfg.level}
                                  </span>
                                )}
                                {cfg.learning_style && (
                                  <span className="px-1.5 py-0.5 rounded text-xs font-mono-cyber bg-cyber-purple/10 text-cyber-purple/70 border border-cyber-purple/20">
                                    {cfg.learning_style}
                                  </span>
                                )}
                              </div>

                              <ProficiencyBar configId={cfg.id} initialValue={cfg.proficiency} />

                              <ConfigNotes configId={cfg.id} initialNotes={cfg.notes} />

                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => setStudyConfig(cfg)}
                                  className="flex-1 py-2 rounded-lg cyber-button-primary font-orbitron text-xs uppercase tracking-widest text-center"
                                >
                                  ▶ Study Session
                                </button>
                                <Link
                                  to="/"
                                  className="px-3 py-2 rounded-lg cyber-button font-orbitron text-xs uppercase tracking-widest text-center"
                                >
                                  Load →
                                </Link>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Uncategorized */}
        {!loading && uncategorized.length > 0 && (selectedCategory === "all") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">📁</span>
              <h2 className="font-orbitron text-sm font-black uppercase tracking-widest text-white/50">Uncategorized</h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {uncategorized.map((cfg) => (
                <div key={cfg.id} className="cyber-card rounded-xl p-4 group hover:border-cyber-cyan/30 transition-all">
                  <p className="font-orbitron text-xs font-bold text-white/80 truncate mb-0.5">{cfg.name}</p>
                  <p className="font-mono-cyber text-sm text-cyber-cyan truncate">{cfg.skill}</p>
                  <ProficiencyBar configId={cfg.id} initialValue={cfg.proficiency} />
                  <div className="flex items-center justify-between mt-3">
                    <Link to="/" className="cyber-button px-3 py-1.5 rounded-lg text-xs font-orbitron uppercase tracking-widest">
                      Load →
                    </Link>
                    <button
                      onClick={() => handleDelete(cfg.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-lg"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center border-t border-cyber-purple/10 pt-6">
          <p className="font-mono-cyber text-xs text-white/20">
            Lion's Eye • Track your progression from Junior to Senior
          </p>
        </div>
        </div>{/* end flex-1 */}
        </div>{/* end flex gap-6 */}
      </main>
    </div>
    </>
  );
}