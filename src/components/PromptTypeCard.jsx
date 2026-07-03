import { motion } from "framer-motion";

export default function PromptTypeCard({ type, selected, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
        selected
          ? "border-cyber-cyan bg-cyber-cyan/10 shadow-glow-cyan"
          : "border-cyber-purple/30 bg-cyber-card/60 hover:border-cyber-purple/60"
      }`}
    >
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-cyber-purple/5" />
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{type.icon}</span>
          <span className={`font-orbitron text-xs font-bold uppercase tracking-widest ${
            selected ? "text-cyber-cyan" : "text-white/80"
          }`}>
            {type.label}
          </span>
          {selected && (
            <span className="ml-auto w-2 h-2 rounded-full bg-cyber-cyan animate-pulse-glow" />
          )}
        </div>
        <p className="text-xs text-white/40 font-inter leading-relaxed mt-1">
          {type.description}
        </p>
      </div>
    </motion.button>
  );
}
