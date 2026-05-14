import { useState } from "react";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";

export default function ExportRoadmapPDF({ configs, resources }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 48;
      const contentW = pageW - margin * 2;
      let y = margin;

      const addText = (text, fontSize, color, bold = false) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, contentW);
        lines.forEach((line) => {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += fontSize * 1.5;
        });
        y += fontSize * 0.4;
      };

      const addDivider = () => {
        doc.setDrawColor(100, 80, 180);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageW - margin, y);
        y += 12;
      };

      // Header
      addText("Lion's Eye — Career Roadmap Export", 18, [6, 182, 212], true);
      addText(`Generated: ${new Date().toLocaleDateString()}`, 9, [120, 120, 150]);
      y += 8;
      addDivider();

      // Configs by level
      const byLevel = { junior: [], mid: [], senior: [] };
      configs.forEach((cfg) => {
        const level = cfg.skill_level || "junior";
        if (byLevel[level]) byLevel[level].push(cfg);
      });

      for (const [level, items] of Object.entries(byLevel)) {
        if (items.length === 0) continue;

        const levelLabel = { junior: "Junior Engineer", mid: "Mid-Level Engineer", senior: "Senior / Architect" }[level];
        addText(`${levelLabel}`, 14, [6, 182, 212], true);
        y += 4;

        items.forEach((cfg) => {
          addText(`• ${cfg.skill} (${cfg.name})`, 11, [220, 220, 230]);
          if (cfg.goal) addText(`  Goal: ${cfg.goal}`, 9, [180, 180, 200]);
          if (cfg.notes) addText(`  Notes: ${cfg.notes}`, 9, [160, 160, 190]);
          y += 4;
        });

        y += 8;
        addDivider();
      }

      // Resources
      if (resources.length > 0) {
        addText("Resource Library", 14, [6, 182, 212], true);
        y += 4;

        const byType = {};
        resources.forEach((r) => {
          if (!byType[r.type]) byType[r.type] = [];
          byType[r.type].push(r);
        });

        for (const [type, items] of Object.entries(byType)) {
          addText(type.charAt(0).toUpperCase() + type.slice(1), 11, [124, 58, 237], true);
          items.forEach((r) => {
            addText(`• ${r.title}`, 10, [220, 220, 230]);
            addText(`  ${r.url}`, 8, [180, 180, 200]);
            if (r.skill) addText(`  Skill: ${r.skill}`, 8, [160, 160, 190]);
            if (r.rating) addText(`  Rating: ${"★".repeat(r.rating)}`, 8, [160, 160, 190]);
            y += 3;
          });
          y += 4;
        }
      }

      const filename = `lions-eye-roadmap-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || configs.length === 0}
      className="px-4 py-2 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan/70 hover:text-cyber-cyan hover:border-cyber-cyan/60 hover:bg-cyber-cyan/10 font-orbitron text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <Download className="w-3 h-3" />
      {isExporting ? "Exporting..." : "Export PDF"}
    </button>
  );
}