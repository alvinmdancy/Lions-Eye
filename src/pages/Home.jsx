import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invokeLLM } from "@/lib/llm";
import { PROMPT_TYPES, LEARNING_STYLES, EXPERIENCE_LEVELS } from "@/data/skills";
import {
  buildLearningPathPrompt,
  buildConceptExplainerPrompt,
  buildLabExercisePrompt,
  buildInterviewPrepPrompt,
} from "@/lib/prompts";
import CyberHeader from "@/components/CyberHeader";
import SkillSelector from "@/components/SkillSelector";
import PromptTypeCard from "@/components/PromptTypeCard";
import CyberSelect from "@/components/CyberSelect";
import CyberInput from "@/components/CyberInput";
import PromptOutput from "@/components/PromptOutput";
import SavedConfigs from "@/components/SavedConfigs";
import PowerPrompts from "@/components/PowerPrompts";
import ResourceSummary from "@/components/ResourceSummary";
import WeeklyActivityChart from "@/components/WeeklyActivityChart";

export default function Home() {
  const [selectedSkillData, setSelectedSkillData] = useState(null);
  const [promptType, setPromptType] = useState("learning_path");
  const [level, setLevel] = useState("beginner");
  const [learningStyle, setLearningStyle] = useState("hands-on");
  const [hoursPerWeek, setHoursPerWeek] = useState("10");
  const [goal, setGoal] = useState("");
  const [rawPrompt, setRawPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleSkillSelect = (data) => {
    setSelectedSkillData(data);
    setHasGenerated(false);
    setRawPrompt("");
    setAiResponse("");
  };

  const buildPrompt = () => {
    if (!selectedSkillData) return "";
    const params = {
      skill: selectedSkillData.skill,
      level,
      hoursPerWeek,
      learningStyle,
      goal,
      careerLevel: selectedSkillData.careerLabel,
    };
    switch (promptType) {
      case "learning_path": return buildLearningPathPrompt(params);
      case "concept_explainer": return buildConceptExplainerPrompt({ ...params, learningStyle });
      case "lab_exercise": return buildLabExercisePrompt(params);
      case "interview_prep": return buildInterviewPrepPrompt({ ...params, learningStyle });
      default: return buildLearningPathPrompt(params);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSkillData) return;
    const prompt = buildPrompt();
    setRawPrompt(prompt);
    setHasGenerated(true);
    setIsLoading(true);
    setAiResponse("");
    try {
      const res = await invokeLLM(prompt);
      setAiResponse(res);
    } catch (err) {
      setAiResponse(`Error: ${err.message}`);
    }
    setIsLoading(false);
  };

  const canGenerate = !!selectedSkillData;

  const handlePowerPrompt = async (pp) => {
    setRawPrompt(pp.prompt);
    setHasGenerated(true);
    setIsLoading(true);
    setAiResponse("");
    try {
      const res = await invokeLLM(pp.prompt);
      setAiResponse(res);
    } catch (err) {
      setAiResponse(`Error: ${err.message}`);
    }
    setIsLoading(false);
  };

  const handleLoadConfig = (cfg) => {
    setSelectedSkillData(cfg.selectedSkillData);
    setPromptType(cfg.promptType);
    setLevel(cfg.level);
    setLearningStyle(cfg.learningStyle);
    setHoursPerWeek(cfg.hoursPerWeek || "10");
    setGoal(cfg.goal || "");
    setHasGenerated(false);
    setRawPrompt("");
    setAiResponse("");
  };

  return (
    <div className="min-h-screen cyber-grid relative" style={{ background: '#050A1F' }}>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/8 rounded-full blur-3xl pointer-events-none" />

      <CyberHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="font-mono-cyber text-xs text-cyber-cyan uppercase tracking-widest">
              Powered by Advanced AI
            </span>
          </div>
          <h1 className="font-orbitron font-black text-3xl md:text-5xl uppercase tracking-wider mb-3">
            <span className="text-white">IT Skills</span>{" "}
            <span style={{ color: '#06B6D4', textShadow: '0 0 30px rgba(6,182,212,0.5)' }}>Prompt</span>{" "}
            <span style={{ color: '#7C3AED', textShadow: '0 0 30px rgba(124,58,237,0.5)' }}>Engine</span>
          </h1>
          <p className="font-inter text-white/40 text-sm md:text-base max-w-xl mx-auto">
            Generate expert AI prompts for any IT skill — from Junior to Senior level in DevOps, Cloud, Networking & more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="cyber-card rounded-xl p-5">
              <SkillSelector
                selectedCategory={selectedSkillData?.category}
                selectedLevel={selectedSkillData?.level}
                selectedSkill={selectedSkillData?.skill}
                onSelect={handleSkillSelect}
              />
              {selectedSkillData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5"
                >
                  <p className="font-mono-cyber text-xs text-cyber-cyan/70">Selected:</p>
                  <p className="font-orbitron text-sm text-cyber-cyan mt-0.5">{selectedSkillData.skill}</p>
                  <p className="font-inter text-xs text-white/40 mt-0.5">{selectedSkillData.careerLabel}</p>
                </motion.div>
              )}
            </div>

            <div className="cyber-card rounded-xl p-5">
              <label className="font-orbitron text-xs font-semibold uppercase tracking-widest text-cyber-cyan/80 block mb-3">
                Prompt Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PROMPT_TYPES.map((type) => (
                  <PromptTypeCard
                    key={type.id}
                    type={type}
                    selected={promptType === type.id}
                    onClick={() => setPromptType(type.id)}
                  />
                ))}
              </div>
            </div>

            <div className="cyber-card rounded-xl p-5 space-y-4">
              <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/60">
                ⚙ Parameters
              </h3>
              <CyberSelect
                label="Current Knowledge Level"
                value={level}
                onChange={setLevel}
                options={EXPERIENCE_LEVELS}
              />
              <CyberSelect
                label="Learning Style"
                value={learningStyle}
                onChange={setLearningStyle}
                options={LEARNING_STYLES}
              />
              {promptType === "learning_path" && (
                <CyberInput
                  label="Hours Per Week"
                  type="number"
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  placeholder="e.g. 10"
                  min="1"
                  max="80"
                />
              )}
              <CyberInput
                label="Specific Goal (optional)"
                value={goal}
                onChange={setGoal}
                placeholder="e.g. Pass CKA exam in 3 months"
              />
            </div>

            <PowerPrompts onSelect={handlePowerPrompt} />
            <SavedConfigs
              canSave={canGenerate}
              currentConfig={{ selectedSkillData, promptType, level, learningStyle, hoursPerWeek, goal }}
              onLoad={handleLoadConfig}
            />

            <WeeklyActivityChart />

            <ResourceSummary />

            <motion.button
              whileHover={{ scale: canGenerate ? 1.02 : 1 }}
              whileTap={{ scale: canGenerate ? 0.98 : 1 }}
              onClick={handleGenerate}
              disabled={!canGenerate || isLoading}
              className={`w-full py-4 rounded-xl font-orbitron text-sm font-bold uppercase tracking-widest transition-all duration-300 ${canGenerate && !isLoading
                ? "cyber-button-primary shadow-glow-purple"
                : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">◈</span> Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ◈ Generate Prompt
                </span>
              )}
            </motion.button>

            {!canGenerate && (
              <p className="text-center font-mono-cyber text-xs text-white/25">
                ↑ Select a skill to begin
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {hasGenerated ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <PromptOutput
                    rawPrompt={rawPrompt}
                    aiResponse={aiResponse}
                    isLoading={isLoading}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="cyber-card rounded-xl flex flex-col items-center justify-center py-24 px-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full border border-cyber-purple/20 flex items-center justify-center mb-6 relative">
                    <span className="text-3xl">⚡</span>
                    <div className="absolute inset-0 rounded-full border border-cyber-cyan/10 animate-pulse" />
                  </div>
                  <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-white/40 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="font-inter text-xs text-white/25 max-w-xs">
                    Select an IT skill from the panel on the left, choose your prompt type, and hit Generate.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
                    {PROMPT_TYPES.map((t) => (
                      <div key={t.id} className="p-3 rounded-lg border border-white/5 bg-white/2 text-center">
                        <span className="text-lg">{t.icon}</span>
                        <p className="font-orbitron text-xs text-white/30 mt-1 uppercase tracking-wide">{t.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-12 text-center border-t border-cyber-purple/10 pt-6">
          <p className="font-mono-cyber text-xs text-white/20">
            SkillForge IT Prompt Engine • DevOps • Cloud • Networking • Security • SysAdmin
          </p>
        </div>
      </main>
    </div>
  );
}