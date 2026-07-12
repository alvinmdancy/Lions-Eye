import { createContext, useContext, useState, useEffect } from "react";
import { invokeLLM } from "@/lib/llm";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { PROMPT_TYPES } from "@/data/skills";
import {
    buildLearningPathPrompt,
    buildConceptExplainerPrompt,
    buildLabExercisePrompt,
    buildInterviewPrepPrompt,
} from "@/lib/prompts";

const STORAGE_KEY = "lions-eye-ai-session";

function loadSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [selectedSkillData, setSelectedSkillData] = useState(() => loadSession()?.selectedSkillData ?? null);
    const [promptType, setPromptType] = useState(() => loadSession()?.promptType ?? "learning_path");
    const [level, setLevel] = useState(() => loadSession()?.level ?? "beginner");
    const [learningStyle, setLearningStyle] = useState(() => loadSession()?.learningStyle ?? "hands-on");
    const [hoursPerWeek, setHoursPerWeek] = useState(() => loadSession()?.hoursPerWeek ?? "10");
    const [goal, setGoal] = useState(() => loadSession()?.goal ?? "");
    const [rawPrompt, setRawPrompt] = useState(() => loadSession()?.rawPrompt ?? "");
    const [aiResponse, setAiResponse] = useState(() => loadSession()?.aiResponse ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(() => loadSession()?.hasGenerated ?? false);
    const [step, setStep] = useState(() => (loadSession()?.selectedSkillData ? "params" : "skill"));

    // Persist generation state to localStorage on every change so it survives
    // page refreshes, in addition to surviving navigation via this Context.
    useEffect(() => {
        const session = {
            selectedSkillData, promptType, level, learningStyle,
            hoursPerWeek, goal, rawPrompt, aiResponse, hasGenerated,
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        } catch {
            // localStorage full or unavailable — fail silently
        }
    }, [selectedSkillData, promptType, level, learningStyle, hoursPerWeek, goal, rawPrompt, aiResponse, hasGenerated]);

    // Clear all generation state when the user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            setSelectedSkillData(null);
            setPromptType("learning_path");
            setLevel("beginner");
            setLearningStyle("hands-on");
            setHoursPerWeek("10");
            setGoal("");
            setRawPrompt("");
            setAiResponse("");
            setHasGenerated(false);
            setStep("skill");
            localStorage.removeItem(STORAGE_KEY);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const handleSkillSelect = (data) => {
        setSelectedSkillData(data);
        setHasGenerated(false);
        setRawPrompt("");
        setAiResponse("");
        setStep("type");
    };

    const handlePromptTypeSelect = (typeId) => {
        setPromptType(typeId);
        setStep("params");
    };

    const handleBack = () => {
        if (step === "params") setStep("type");
        else if (step === "type") setStep("skill");
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
            await invokeLLM(prompt, (partial) => {
                setIsLoading(false);
                setAiResponse(partial);
            });
            toast({
                title: "Response ready",
                description: `${PROMPT_TYPES.find((t) => t.id === promptType)?.label || "Prompt"} for ${selectedSkillData.skill}`,
            });
        } catch (err) {
            setAiResponse(`Error: ${err.message}`);
            toast({
                title: "Generation failed",
                description: err.message,
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    const handlePowerPrompt = async (pp) => {
        setRawPrompt(pp.prompt);
        setHasGenerated(true);
        setIsLoading(true);
        setAiResponse("");
        try {
            await invokeLLM(pp.prompt, (partial) => {
                setIsLoading(false);
                setAiResponse(partial);
            });
            toast({
                title: "Response ready",
                description: pp.label || "Power prompt finished",
            });
        } catch (err) {
            setAiResponse(`Error: ${err.message}`);
            toast({
                title: "Generation failed",
                description: err.message,
                variant: "destructive",
            });
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
        setStep("params");
    };

    const handleClear = () => {
        setSelectedSkillData(null);
        setRawPrompt("");
        setAiResponse("");
        setHasGenerated(false);
        setStep("skill");
        localStorage.removeItem(STORAGE_KEY);
    };

    const canGenerate = !!selectedSkillData;

    return (
        <GenerationContext.Provider
            value={{
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
            }}
        >
            {children}
        </GenerationContext.Provider>
    );
};

export const useGeneration = () => {
    const context = useContext(GenerationContext);
    if (!context) throw new Error("useGeneration must be used within a GenerationProvider");
    return context;
};
