import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invokeLLM } from "@/lib/llm";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import {
  buildLearningPathPrompt,
  buildConceptExplainerPrompt,
  buildLabExercisePrompt,
  buildInterviewPrepPrompt,
} from "@/lib/prompts";
import ProficiencyBar from "@/components/ProficiencyBar";
import QuizMode from "@/components/QuizMode";
import InlineImageSearch from "@/components/InlineImageSearch";
import AITutor from "@/components/AITutor";

const PROMPT_TYPE_ICONS = {
  learning_path: "🗺️",
  concept_explainer: "💡",
  lab_exercise: "🧪",
  interview_prep: "🎯",
};

function buildPrompt(cfg) {
  const params = {
    skill: cfg.skill,
    level: cfg.level || "beginner",
    hoursPerWeek: cfg.hours_per_week || "10",
    learningStyle: cfg.learning_style || "hands-on",
    goal: cfg.goal || "",
    careerLevel: cfg.career_label || cfg.skill_level || "",
  };
  switch (cfg.prompt_type) {
    case "concept_explainer": return buildConceptExplainerPrompt(params);
    case "lab_exercise": return buildLabExercisePrompt(params);
    case "interview_prep": return buildInterviewPrepPrompt(params);
    default: return buildLearningPathPrompt(params);
  }
}

function extractText(children) {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children?.props?.children) return extractText(children.props.children);
  return "";
}

export default function StudySession({ cfg, onClose }) {
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rawPrompt] = useState(() => buildPrompt(cfg));
  const [view, setView] = useState("ai");
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState(cfg.notes || "");

  // Notes autosave is disabled until Supabase DB is wired up
  const handleNotesChange = (val) => {
    setNotes(val);
  };

  useEffect(() => {
    setIsLoading(true);
    setAiResponse("");
    invokeLLM(rawPrompt)
      .then((res) => {
        setAiResponse(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setAiResponse(`Error: ${err.message}`);
        setIsLoading(false);
      });
  }, [cfg.id]);

  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    const contentW = pageW - margin * 2;
    let y = margin;

    const addText = (text, fontSize, color, bold = false) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, contentW);
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += fontSize * 1.5;
      });
      y += fontSize * 0.4;
    };

    const addDivider = () => {
      doc.setDrawColor(100, 80, 180);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 12;
    };

    addText("Lion's Eye — Study Session Export", 18, [6, 182, 212], true);
    addText(`Skill: ${cfg.skill}`, 12, [180, 180, 220]);
    if (cfg.career_label) addText(`Level: ${cfg.career_label}`, 10, [150, 150, 180]);
    if (cfg.prompt_type) addText(`Type: ${cfg.prompt_type.replace(/_/g, " ")}`, 10, [150, 150, 180]);
    addText(`Exported: ${new Date().toLocaleDateString()}`, 9, [120, 120, 150]);
    y += 8;
    addDivider();

    addText("AI-Generated Content", 14, [6, 182, 212], true);
    y += 4;
    if (aiResponse) {
      const plain = aiResponse
        .replace(/#{1,6}\s+/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`{1,3}([\s\S]*?)`{1,3}/g, "$1")
        .replace(/^\s*[-*+]\s+/gm, "• ")
        .replace(/^\s*\d+\.\s+/gm, (m) => m.trim() + " ");
      addText(plain, 10, [220, 220, 230]);
    }

    if (notes.trim()) {
      y += 8;
      addDivider();
      addText("My Personal Notes", 14, [124, 58, 237], true);
      y += 4;
      addText(notes, 10, [220, 220, 230]);
    }

    const filename = `lions-eye-${cfg.skill.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;
    doc.save(filename);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(view === "ai" ? aiResponse : rawPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#050A1F" }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-cyber-purple/20 bg-cyber-card/60 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow flex-shrink-0" />
          <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-cyber-cyan hidden sm:block">
            Study Session
          </span>
          <span className="text-white/20 hidden sm:block">◈</span>
          <span className="font-mono-cyber text-sm text-white/70 truncate">{cfg.skill}</span>
          <span className="font-mono-cyber text-xs text-white/30 hidden md:block">
            {PROMPT_TYPE_ICONS[cfg.prompt_type]} {cfg.prompt_type?.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex rounded-lg border border-white/10 overflow-hidden">
            {[
              { id: "ai", label: "⚡ AI Response", active: "bg-cyber-cyan/20 text-cyber-cyan" },
              { id: "quiz", label: "🧠 Quiz", active: "bg-cyber-pink/20 text-cyber-pink" },
              { id: "tutor", label: "💬 Tutor", active: "bg-cyber-green/20 text-cyber-cyan" },
              { id: "prompt", label: "◈ Raw Prompt", active: "bg-cyber-purple/20 text-cyber-purple" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-3 py-1.5 font-orbitron text-xs uppercase tracking-widest transition-all ${view === v.id ? v.active : "text-white/30 hover:text-white/50"
                  }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {(view === "ai" || view === "prompt") && (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-white/10 font-mono-cyber text-xs text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          )}

          <button
            onClick={handleExportPDF}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg border border-cyber-purple/30 bg-cyber-purple/10 font-orbitron text-xs text-cyber-purple/70 hover:text-cyber-purple hover:border-cyber-purple/60 transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ↓ PDF
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 font-orbitron text-xs text-red-400/70 hover:text-red-400 hover:border-red-400/40 transition-all uppercase tracking-widest"
          >
            ✕ Exit
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 lg:w-72 flex-shrink-0 border-r border-cyber-purple/15 overflow-y-auto p-5 space-y-5 hidden md:block">
          <div>
            <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest mb-2">Current Step</p>
            <p className="font-orbitron text-sm font-bold text-white/90 mb-1">{cfg.name}</p>
            <p className="font-mono-cyber text-base text-cyber-cyan">{cfg.skill}</p>
            {cfg.career_label && (
              <p className="font-inter text-xs text-white/35 mt-1">{cfg.career_label}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest">Details</p>
            <div className="flex flex-wrap gap-1.5">
              {cfg.skill_level && (
                <span className={`px-2 py-0.5 rounded border text-xs font-mono-cyber ${cfg.skill_level === "junior" ? "text-green-400 border-green-400/30 bg-green-400/10" :
                  cfg.skill_level === "mid" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
                    "text-red-400 border-red-400/30 bg-red-400/10"
                  }`}>
                  {cfg.skill_level}
                </span>
              )}
              {cfg.level && (
                <span className="px-2 py-0.5 rounded border text-xs font-mono-cyber bg-white/5 text-white/40 border-white/10">
                  {cfg.level}
                </span>
              )}
              {cfg.learning_style && (
                <span className="px-2 py-0.5 rounded border text-xs font-mono-cyber bg-cyber-purple/10 text-cyber-purple/70 border-cyber-purple/20">
                  {cfg.learning_style}
                </span>
              )}
              {cfg.hours_per_week && (
                <span className="px-2 py-0.5 rounded border text-xs font-mono-cyber bg-white/5 text-white/35 border-white/10">
                  {cfg.hours_per_week}h/wk
                </span>
              )}
            </div>
          </div>

          {cfg.goal && (
            <div>
              <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest mb-1.5">Goal</p>
              <p className="font-inter text-xs text-white/50 leading-relaxed">{cfg.goal}</p>
            </div>
          )}

          <div>
            <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest mb-1">Confidence</p>
            <ProficiencyBar configId={cfg.id} initialValue={cfg.proficiency} />
          </div>

          <div>
            <p className="font-orbitron text-xs text-white/25 uppercase tracking-widest mb-1.5">My Notes</p>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Type your personal notes here…"
              rows={6}
              className="w-full cyber-input rounded-lg px-3 py-2.5 text-xs font-inter text-white/70 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-lg border border-cyber-cyan/10 bg-cyber-cyan/5">
            <p className="font-mono-cyber text-xs text-cyber-cyan/40 leading-relaxed">
              Press <span className="text-cyber-cyan/60">Esc</span> to exit the session at any time.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-48 gap-4"
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
                <p className="font-mono-cyber text-xs text-white/30 animate-pulse">
                  Generating your study content for {cfg.skill}…
                </p>
              </motion.div>
            ) : view === "quiz" ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto"
              >
                <QuizMode cfg={cfg} />
              </motion.div>
            ) : view === "tutor" ? (
              <motion.div
                key="tutor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <AITutor skill={cfg.skill} careerLevel={cfg.career_label} currentContent={aiResponse} />
              </motion.div>
            ) : view === "ai" ? (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-y-auto p-5 md:p-8"
              >
                <ReactMarkdown
                  className="prose prose-invert prose-sm max-w-none
                    prose-headings:font-orbitron prose-headings:uppercase prose-headings:tracking-widest
                    prose-h1:text-cyber-cyan prose-h2:text-cyber-cyan/80 prose-h3:text-white/70
                    prose-p:text-white/60 prose-p:leading-relaxed prose-p:font-inter
                    prose-li:text-white/55 prose-li:font-inter
                    prose-code:text-cyber-cyan prose-code:bg-cyber-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono-cyber prose-code:text-xs
                    prose-pre:bg-cyber-card prose-pre:border prose-pre:border-cyber-purple/20 prose-pre:rounded-xl
                    prose-strong:text-white/80
                    prose-a:text-cyber-cyan prose-a:no-underline hover:prose-a:underline
                    prose-hr:border-cyber-purple/20"
                  components={{
                    blockquote({ children }) {
                      const text = extractText(children);
                      const match = text.match(/🔍\s*\*?\*?Image search:\*?\*?\s*[""](.+?)[""]/i)
                        || text.match(/🔍\s*Image search:\s*[""]?(.+?)[""]?\s*$/i);
                      if (match) {
                        return <InlineImageSearch query={match[1]} />;
                      }
                      return <blockquote className="border-l-2 border-cyber-cyan/30 pl-4 text-white/50 italic">{children}</blockquote>;
                    },
                  }}
                >
                  {aiResponse}
                </ReactMarkdown>
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-y-auto p-5 md:p-8"
              >
                <pre className="prompt-output rounded-xl p-6 text-xs leading-relaxed whitespace-pre-wrap">
                  {rawPrompt}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}