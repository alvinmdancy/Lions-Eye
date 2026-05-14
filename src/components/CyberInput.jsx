export default function CyberInput({ label, value, onChange, placeholder, type = "text", min, max }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-orbitron text-xs font-semibold uppercase tracking-widest text-cyber-cyan/80">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full cyber-input rounded-lg px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
      />
    </div>
  );
}