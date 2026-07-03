import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invokeLLM } from "@/lib/llm";

export default function QuizMode({ cfg }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
    setIsLoading(true);
    setAnswers({});
    setSubmitted(false);
    setQuestions([]);

    const prompt = `You are an expert IT instructor. Generate exactly 5 multiple-choice quiz questions about "${cfg.skill}" for a ${cfg.level || "beginner"} level learner${cfg.career_label ? ` targeting ${cfg.career_label}` : ""}.

Rules:
- Each question must test a distinct, practical concept relevant to ${cfg.skill}.
- Each question has exactly 4 options labeled A, B, C, D.
- Exactly one option is correct.
- Questions should be challenging but fair for the level.

Return ONLY valid JSON, no markdown, no extra text:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "A",
      "explanation": "Brief explanation of why this is correct."
    }
  ]
}`;

    try {
      const res = await invokeLLM(prompt);
      const clean = res.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuestions(parsed?.questions || []);
    } catch (err) {
      console.error("Quiz generation failed:", err);
      setQuestions([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    generateQuiz();
  }, [cfg.id]);

  const handleSelect = (qIndex, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  const scoreColor =
    score === 5 ? "text-green-400" :
      score >= 3 ? "text-cyber-cyan" :
        "text-red-400";

  const scoreBg =
    score === 5 ? "border-green-400/30 bg-green-400/10" :
      score >= 3 ? "border-cyber-cyan/30 bg-cyber-cyan/10" :
        "border-red-400/30 bg-red-400/10";

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-orbitron text-sm font-bold uppercase tracking-widest text-cyber-cyan">
            🧠 Quick Quiz
          </h2>
          <p className="font-inter text-xs text-white/35 mt-0.5">
            5 questions · {cfg.skill} · {cfg.level || "beginner"}
          </p>
        </div>
        {!isLoading && questions.length > 0 && (
          <button
            onClick={generateQuiz}
            className="cyber-button px-3 py-1.5 rounded-lg font-orbitron text-xs uppercase tracking-widest"
          >
            ↺ Regenerate
          </button>
        )}
      </div>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
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
            Generating quiz for {cfg.skill}…
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between ${scoreBg}`}
          >
            <div>
              <p className="font-orbitron text-xs uppercase tracking-widest text-white/40 mb-0.5">Your Score</p>
              <p className={`font-orbitron text-2xl font-black ${scoreColor}`}>{score} / 5</p>
              <p className="font-inter text-xs text-white/40 mt-0.5">
                {score === 5 ? "Perfect! Outstanding knowledge." :
                  score >= 4 ? "Great job! Almost there." :
                    score >= 3 ? "Good effort. Keep studying." :
                      "Keep practicing — you'll get it!"}
              </p>
            </div>
            <span className="text-4xl">
              {score === 5 ? "🏆" : score >= 3 ? "⚡" : "💪"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="space-y-5">
          {questions.map((q, qi) => {
            const userAnswer = answers[qi];
            const isCorrect = userAnswer === q.correct;

            return (
              <motion.div
                key={qi}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qi * 0.07 }}
                className="cyber-card rounded-xl p-5"
              >
                <div className="flex gap-3 mb-4">
                  <span className="font-orbitron text-xs font-bold text-cyber-cyan/60 flex-shrink-0 mt-0.5">
                    Q{qi + 1}
                  </span>
                  <p className="font-inter text-sm text-white/85 leading-relaxed">{q.question}</p>
                </div>

                <div className="space-y-2">
                  {["A", "B", "C", "D"].map((opt) => {
                    const isSelected = userAnswer === opt;
                    const isRight = submitted && opt === q.correct;
                    const isWrong = submitted && isSelected && !isCorrect;

                    let cls = "border-white/10 bg-white/3 text-white/50 hover:border-cyber-cyan/30 hover:text-white/70";
                    if (!submitted && isSelected) cls = "border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan";
                    if (isRight) cls = "border-green-400/50 bg-green-400/10 text-green-300";
                    if (isWrong) cls = "border-red-400/50 bg-red-400/10 text-red-300";

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(qi, opt)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all flex items-start gap-3 ${cls} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <span className="font-orbitron text-xs font-bold flex-shrink-0 mt-0.5">{opt}</span>
                        <span className="font-inter text-sm leading-relaxed">{q.options[opt]}</span>
                        {isRight && <span className="ml-auto flex-shrink-0 text-green-400">✓</span>}
                        {isWrong && <span className="ml-auto flex-shrink-0 text-red-400">✗</span>}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-white/5"
                    >
                      <p className="font-mono-cyber text-xs text-white/30 mb-0.5">Explanation</p>
                      <p className="font-inter text-xs text-white/55 leading-relaxed">{q.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && questions.length > 0 && !submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-3 rounded-xl font-orbitron text-sm font-bold uppercase tracking-widest transition-all ${allAnswered
              ? "cyber-button-primary shadow-glow-purple"
              : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
              }`}
          >
            {allAnswered ? "Submit Answers →" : `Answer all questions (${Object.keys(answers).length}/5)`}
          </button>
        </motion.div>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
          <button
            onClick={generateQuiz}
            className="w-full py-3 rounded-xl cyber-button-primary font-orbitron text-sm font-bold uppercase tracking-widest"
          >
            ↺ Try a New Quiz
          </button>
        </motion.div>
      )}
    </div>
  );
}
