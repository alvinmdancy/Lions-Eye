import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function PromptOutput({ rawPrompt, aiResponse, isLoading }) {
  const [activeTab, setActiveTab] = useState("ai");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = activeTab === "ai" ? aiResponse : rawPrompt;
    if (!text) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-purple/20">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 rounded-md font-orbitron text-xs uppercase tracking-widest transition-all ${activeTab === "ai"
              ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40"
              : "text-white/40 hover:text-white/70"
              }`}
          >
            ◈ AI Response
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-4 py-2 rounded-md font-orbitron text-xs uppercase tracking-widest transition-all ${activeTab === "raw"
              ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40"
              : "text-white/40 hover:text-white/70"
              }`}
          >
            ◈ Raw Prompt
          </button>
        </div>
        <button
          onClick={handleCopy}
          className={`cyber-button px-4 py-2 rounded-md text-xs flex items-center gap-2 transition-all ${copied ? "border-green-400/50 text-green-400" : ""
            }`}
        >
          {copied ? <>✓ Copied</> : <>⎘ Copy</>}
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/80 z-10">
            <div className="text-center space-y-3">
              <div className="flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="font-mono-cyber text-cyber-cyan text-sm">Generating response...</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "ai" ? (
            <motion.div
              key="ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 max-h-[80vh] overflow-y-auto prompt-output rounded-b-xl"
            >
              {aiResponse ? (
                <ReactMarkdown
                  className="prose prose-invert prose-sm max-w-none
                    prose-headings:font-orbitron prose-headings:text-cyber-cyan prose-headings:tracking-wide
                    prose-h2:text-base prose-h3:text-sm
                    prose-p:text-white/75 prose-p:leading-relaxed
                    prose-li:text-white/70
                    prose-strong:text-cyber-cyan prose-strong:font-semibold
                    prose-code:text-cyber-pink prose-code:bg-cyber-purple/10 prose-code:px-1 prose-code:rounded
                    prose-blockquote:border-cyber-purple prose-blockquote:text-white/50
                    prose-hr:border-cyber-purple/30"
                >
                  {aiResponse}
                </ReactMarkdown>
              ) : (
                <p className="text-white/30 text-sm font-mono-cyber">
                  // AI response will appear here after generation...
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 max-h-[80vh] overflow-y-auto"
            >
              {rawPrompt ? (
                <pre className="whitespace-pre-wrap text-sm font-mono-cyber text-cyber-cyan/80 leading-relaxed">
                  {rawPrompt}
                </pre>
              ) : (
                <p className="text-white/30 text-sm font-mono-cyber">
                  // Generated prompt will appear here...
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
