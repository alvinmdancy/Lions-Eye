export default function CyberSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-orbitron text-xs font-semibold uppercase tracking-widest text-cyber-cyan/80">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cyber-select rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none pr-10"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 7L11 1" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}