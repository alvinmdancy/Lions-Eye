import { useState, useRef, useEffect } from "react";
import { invokeLLM } from "@/lib/llm";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AITutor({ skill, careerLevel, currentContent }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm your AI tutor for **${skill}**. Ask me anything about the topic — I can clarify concepts, explain things differently, answer follow-up questions, or dive deeper into specific areas. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const prompt = `You are an expert AI tutor for IT and DevOps topics. The student is learning about "${skill}"${careerLevel ? ` at the ${careerLevel} level` : ""}.

Context from their study material:
${currentContent ? currentContent.slice(0, 2000) : "No specific content provided"}

Answer their questions clearly, provide examples where helpful, and adapt your explanations to their skill level. Be conversational and encouraging.

Student question: ${userMessage}`;

      const response = await invokeLLM(prompt);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-cyber-card/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${msg.role === "user"
                ? "bg-cyber-cyan/20 text-white/90 border border-cyber-cyan/30"
                : "bg-cyber-purple/10 text-white/70 border border-cyber-purple/20"
                }`}
            >
              <ReactMarkdown className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-white prose-code:text-cyber-cyan prose-code:bg-cyber-bg prose-code:px-1 prose-code:py-0.5">
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-cyber-purple/10 text-white/50 px-4 py-3 rounded-lg border border-cyber-purple/20 flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs font-mono-cyber">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-cyber-purple/20 p-4 bg-cyber-card/50 backdrop-blur-xl">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask a question…"
            disabled={loading}
            className="flex-1 cyber-input rounded-lg px-3 py-2.5 text-xs font-inter text-white/70 placeholder:text-white/20 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 hover:bg-cyber-cyan/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}