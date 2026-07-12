import { motion, AnimatePresence } from "framer-motion";
import { PROMPT_TYPES, LEARNING_STYLES, EXPERIENCE_LEVELS } from "@/data/skills";
import { useGeneration } from "@/lib/GenerationContext";
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
  const {
    selectedSkillData,
    promptType,
    level,
    learningStyle,
    hoursPerWeek,
    goal,
    rawPrompt,
    aiResponse,
    isLoading,
    hasGenerated,
    step,
    canGenerate,
    setLevel,
    setLearningStyle,
    setHoursPerWeek,
    setGoal,
    handleSkillSelect,
    handlePromptTypeSelect,
    handleBack,
    handleGenerate,
    handlePowerPrompt,
    handleLoadConfig,
    handleClear,
  } = useGeneration();

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
            <AnimatePresence mode="wait">
              {step === "skill" && (
                <motion.div
                  key="step-skill"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="cyber-card rounded-xl p-5"
                >
                  <SkillSelector
                    selectedCategory={selectedSkillData?.category}
                    selectedLevel={selectedSkillData?.level}
                    selectedSkill={selectedSkillData?.skill}
                    onSelect={handleSkillSelect}
                  />
                </motion.div>
              )}

              {step === "type" && (
                <motion.div
                  key="step-type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="cyber-card rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-orbitron text-xs font-semibold uppercase tracking-widest text-cyber-cyan/80">
                      Prompt Type
                    </label>
                    <button
                      onClick={handleBack}
                      className="font-mono-cyber text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                  {selectedSkillData && (
                    <div className="mb-4 p-3 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5">
                      <p className="font-mono-cyber text-xs text-cyber-cyan/70">Selected:</p>
                      <p className="font-orbitron text-sm text-cyber-cyan mt-0.5">{selectedSkillData.skill}</p>
                      <p className="font-inter text-xs text-white/40 mt-0.5">{selectedSkillData.careerLabel}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    {PROMPT_TYPES.map((type) => (
                      <PromptTypeCard
                        key={type.id}
                        type={type}
                        selected={promptType === type.id}
                        onClick={() => handlePromptTypeSelect(type.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "params" && (
                <motion.div
                  key="step-params"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="cyber-card rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/60">
                      ⚙ Parameters
                    </h3>
                    <button
                      onClick={handleBack}
                      className="font-mono-cyber text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      ← Back
                    </button>
                  </div>

                  {selectedSkillData && (
                    <div className="p-3 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <p className="font-mono-cyber text-xs text-cyber-cyan/70">Skill:</p>
                        <p className="font-orbitron text-sm text-cyber-cyan">{selectedSkillData.skill}</p>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <p className="font-mono-cyber text-xs text-cyber-cyan/70">Level:</p>
                        <p className="font-inter text-xs text-white/50">{selectedSkillData.careerLabel}</p>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <p className="font-mono-cyber text-xs text-cyber-cyan/70">Prompt Type:</p>
                        <p className="font-inter text-xs text-white/50">
                          {PROMPT_TYPES.find((t) => t.id === promptType)?.label || promptType}
                        </p>
                      </div>
                    </div>
                  )}

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

                  {/* Live selection summary — reflects current level/style/hours/goal as you adjust them */}
                  <div className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-1">
                    <p className="font-orbitron text-xs uppercase tracking-widest text-white/40 mb-1.5">Your Selections</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono-cyber">
                        {selectedSkillData?.skill}
                      </span>
                      <span className="px-2 py-1 rounded border border-cyber-purple/30 bg-cyber-purple/5 text-cyber-purple text-xs font-mono-cyber">
                        {PROMPT_TYPES.find((t) => t.id === promptType)?.label || promptType}
                      </span>
                      <span className="px-2 py-1 rounded border border-white/15 bg-white/5 text-white/50 text-xs font-mono-cyber">
                        {(EXPERIENCE_LEVELS.find((l) => l.value === level)?.label || level).split(/[—(]/)[0].trim()}
                      </span>
                      <span className="px-2 py-1 rounded border border-white/15 bg-white/5 text-white/50 text-xs font-mono-cyber">
                        {(LEARNING_STYLES.find((s) => s.value === learningStyle)?.label || learningStyle).split(/[—(]/)[0].trim()}
                      </span>
                      {promptType === "learning_path" && (
                        <span className="px-2 py-1 rounded border border-white/15 bg-white/5 text-white/50 text-xs font-mono-cyber">
                          {hoursPerWeek} hrs/wk
                        </span>
                      )}
                      {goal && (
                        <span className="px-2 py-1 rounded border border-white/15 bg-white/5 text-white/50 text-xs font-mono-cyber">
                          Goal: {goal}
                        </span>
                      )}
                    </div>
                  </div>

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

                  {hasGenerated && (
                    <button
                      onClick={handleClear}
                      className="w-full py-2 rounded-lg font-orbitron text-xs uppercase tracking-widest border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                    >
                      Clear Response
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <PowerPrompts onSelect={handlePowerPrompt} />
            <SavedConfigs
              canSave={canGenerate}
              currentConfig={{ selectedSkillData, promptType, level, learningStyle, hoursPerWeek, goal }}
              onLoad={handleLoadConfig}
            />

            <WeeklyActivityChart />

            <ResourceSummary />

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
