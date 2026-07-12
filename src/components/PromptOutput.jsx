import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ReactDOMServer from "react-dom/server";

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

  const handleExportPDF = () => {
    if (!aiResponse) return;

    const contentHtml = ReactDOMServer.renderToStaticMarkup(
      <ReactMarkdown>{aiResponse}</ReactMarkdown>
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) return; // popup blocked

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Lion's Eye - AI Response</title>
        <style>
          body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          h1, h2, h3, h4 { color: #111; margin-top: 1.5em; }
          pre {
            background: #f4f4f4;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            white-space: pre-wrap;
            font-family: Consolas, Monaco, monospace;
            font-size: 0.85em;
          }
          code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: Consolas, Monaco, monospace;
          }
          pre code { background: none; padding: 0; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
          blockquote { border-left: 3px solid #ccc; padding-left: 14px; color: #555; margin-left: 0; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>${contentHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Small delay so the content fully renders before the print dialog opens
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const handleExportWord = () => {
    if (!aiResponse) return;

    const contentHtml = ReactDOMServer.renderToStaticMarkup(
      <ReactMarkdown>{aiResponse}</ReactMarkdown>
    );

    const fullHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Lion's Eye Response</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; }
          h1, h2, h3, h4 { color: #111; }
          pre, code { font-family: Consolas, monospace; background: #f4f4f4; }
          table { border-collapse: collapse; }
          th, td { border: 1px solid #999; padding: 4px 8px; }
          blockquote { border-left: 3px solid #ccc; padding-left: 12px; color: #555; }
        </style>
      </head>
      <body>${contentHtml}</body>
      </html>
    `;

    const blob = new Blob(["\ufeff", fullHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateStr = new Date().toISOString().split("T")[0];
    link.download = `lions-eye-response-${dateStr}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-purple/20 flex-wrap gap-2">
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`cyber-button px-4 py-2 rounded-md text-xs flex items-center gap-2 transition-all ${copied ? "border-green-400/50 text-green-400" : ""
              }`}
          >
            {copied ? <>✓ Copied</> : <>⎘ Copy</>}
          </button>
          {activeTab === "ai" && (
            <>
              <button
                onClick={handleExportPDF}
                disabled={!aiResponse}
                className="cyber-button px-4 py-2 rounded-md text-xs flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Opens a printable version — choose 'Save as PDF' in the print dialog"
              >
                📄 PDF
              </button>
              <button
                onClick={handleExportWord}
                disabled={!aiResponse}
                className="cyber-button px-4 py-2 rounded-md text-xs flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Downloads a Word-compatible document"
              >
                📝 Word
              </button>
            </>
          )}
        </div>
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
