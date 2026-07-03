import { useState } from "react";
import { db } from "@/lib/db";

export default function StarRating({ resourceId, initialRating }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hovered, setHovered] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleRate = async (star) => {
    const newRating = star === rating ? 0 : star; // clicking same star clears it
    setRating(newRating);
    setSaving(true);
    await db.entities.ResourceLink.update(resourceId, { rating: newRating || null });
    setSaving(false);
  };

  const display = hovered || rating;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          disabled={saving}
          className={`text-base leading-none transition-all duration-100 disabled:cursor-wait ${
            star <= display
              ? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
              : "text-white/15 hover:text-white/40"
          }`}
        >
          ★
        </button>
      ))}
      {rating > 0 && (
        <span className="font-mono-cyber text-xs text-yellow-400/50 ml-1">{rating}/5</span>
      )}
    </div>
  );
}
