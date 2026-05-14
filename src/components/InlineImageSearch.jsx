import { useState, useEffect } from "react";

// Uses Unsplash's source API to fetch relevant images by query (no API key needed)
// Falls back to a grid of 3 images per query

const UNSPLASH_BASE = "https://source.unsplash.com/featured/400x260/?";

export default function InlineImageSearch({ query }) {
  const [images, setImages] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Generate 3 deterministic-but-varied image URLs for the query
  useEffect(() => {
    const sanitized = encodeURIComponent(query.replace(/['"]/g, ""));
    // Append seed variants so Unsplash returns different images
    setImages([
      `${UNSPLASH_BASE}${sanitized}&sig=1`,
      `${UNSPLASH_BASE}${sanitized}&sig=2`,
      `${UNSPLASH_BASE}${sanitized}&sig=3`,
    ]);
  }, [query]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 my-3 px-3 py-2 rounded-lg border border-cyber-cyan/20 bg-cyber-cyan/5 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all group w-full text-left"
      >
        <span className="text-base">🖼️</span>
        <div className="flex-1 min-w-0">
          <span className="font-mono-cyber text-xs text-cyber-cyan/70 group-hover:text-cyber-cyan transition-colors">
            Visual reference: <span className="italic text-white/50">"{query}"</span>
          </span>
        </div>
        <span className="font-orbitron text-xs text-cyber-cyan/40 group-hover:text-cyber-cyan/70 transition-colors uppercase tracking-widest flex-shrink-0">
          Show Images →
        </span>
      </button>
    );
  }

  return (
    <div className="my-4 rounded-xl border border-cyber-cyan/20 bg-cyber-card/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-cyan/10">
        <span className="font-mono-cyber text-xs text-cyber-cyan/60">
          🖼️ <span className="italic">"{query}"</span>
        </span>
        <button
          onClick={() => setExpanded(false)}
          className="font-mono-cyber text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          hide ×
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1 p-2">
        {images.map((src, i) => (
          <a
            key={i}
            href={`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden aspect-video bg-cyber-card border border-white/5 hover:border-cyber-cyan/30 transition-all group relative"
          >
            <img
              src={src}
              alt={`${query} visual ${i + 1}`}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
              onError={(e) => {
                // Fallback: show a placeholder
                e.target.style.display = "none";
                e.target.parentElement.classList.add("flex", "items-center", "justify-center");
                e.target.parentElement.innerHTML = `<span class="font-mono-cyber text-xs text-white/20 p-2 text-center">${query}</span>`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-white/5">
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-cyber text-xs text-cyber-cyan/40 hover:text-cyber-cyan/70 transition-colors"
        >
          Search more on Google Images →
        </a>
      </div>
    </div>
  );
}