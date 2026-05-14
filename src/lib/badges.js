// Badge definitions — id, name, icon, description, category, and a check(configs, resources) => boolean
export const ALL_BADGES = [
  // ── Milestone badges (roadmap configs saved)
  {
    id: "first_config",
    name: "First Boot",
    icon: "⚡",
    description: "Save your first roadmap config",
    category: "milestone",
    check: (configs) => configs.length >= 1,
  },
  {
    id: "five_configs",
    name: "Skill Seeker",
    icon: "🔭",
    description: "Save 5 roadmap configs",
    category: "milestone",
    check: (configs) => configs.length >= 5,
  },
  {
    id: "ten_configs",
    name: "Path Builder",
    icon: "🗺️",
    description: "Save 10 roadmap configs",
    category: "milestone",
    check: (configs) => configs.length >= 10,
  },
  {
    id: "twenty_configs",
    name: "Knowledge Architect",
    icon: "🏗️",
    description: "Save 20 roadmap configs",
    category: "milestone",
    check: (configs) => configs.length >= 20,
  },

  // ── Proficiency badges (high self-confidence ratings)
  {
    id: "first_mastery",
    name: "Confidence Unlocked",
    icon: "💪",
    description: "Rate any skill at max confidence (5/5)",
    category: "proficiency",
    check: (configs) => configs.some((c) => c.proficiency === 5),
  },
  {
    id: "three_mastery",
    name: "Multi-Skilled",
    icon: "🎯",
    description: "Reach max confidence in 3 skills",
    category: "proficiency",
    check: (configs) => configs.filter((c) => c.proficiency === 5).length >= 3,
  },
  {
    id: "all_levels_high",
    name: "Full Stack Mind",
    icon: "🧠",
    description: "Have a high-confidence config at Junior, Mid, and Senior level",
    category: "proficiency",
    check: (configs) => {
      const highConfidence = configs.filter((c) => c.proficiency >= 4);
      return (
        highConfidence.some((c) => c.skill_level === "junior") &&
        highConfidence.some((c) => c.skill_level === "mid") &&
        highConfidence.some((c) => c.skill_level === "senior")
      );
    },
  },

  // ── Category breadth badges
  {
    id: "multi_category",
    name: "Cross-Trainer",
    icon: "🔀",
    description: "Have configs in 3 different IT categories",
    category: "dedication",
    check: (configs) => new Set(configs.map((c) => c.category).filter(Boolean)).size >= 3,
  },
  {
    id: "all_categories",
    name: "IT Generalist",
    icon: "🌐",
    description: "Cover all 5 IT categories (DevOps, Cloud, Networking, Security, SysAdmin)",
    category: "mastery",
    check: (configs) => {
      const cats = new Set(configs.map((c) => c.category).filter(Boolean));
      return ["devops", "cloud", "networking", "security", "sysadmin"].every((c) => cats.has(c));
    },
  },

  // ── Prompt type diversity badges
  {
    id: "all_prompt_types",
    name: "Versatile Learner",
    icon: "🎓",
    description: "Use all 4 prompt types (Learning Path, Concept, Lab, Interview)",
    category: "dedication",
    check: (configs) => {
      const types = new Set(configs.map((c) => c.prompt_type).filter(Boolean));
      return ["learning_path", "concept_explainer", "lab_exercise", "interview_prep"].every((t) => types.has(t));
    },
  },
  {
    id: "lab_lover",
    name: "Lab Rat",
    icon: "🧪",
    description: "Save 3 lab exercise configs",
    category: "dedication",
    check: (configs) => configs.filter((c) => c.prompt_type === "lab_exercise").length >= 3,
  },
  {
    id: "interview_ready",
    name: "Interview Ready",
    icon: "🎤",
    description: "Save 3 interview prep configs",
    category: "dedication",
    check: (configs) => configs.filter((c) => c.prompt_type === "interview_prep").length >= 3,
  },

  // ── Senior track
  {
    id: "first_senior",
    name: "Senior Aspirant",
    icon: "🏆",
    description: "Save your first Senior-level config",
    category: "milestone",
    check: (configs) => configs.some((c) => c.skill_level === "senior"),
  },
  {
    id: "senior_mastery",
    name: "Tech Lead",
    icon: "👑",
    description: "Have 3 Senior configs with high confidence",
    category: "mastery",
    check: (configs) => configs.filter((c) => c.skill_level === "senior" && c.proficiency >= 4).length >= 3,
  },

  // ── Resource / library badges
  {
    id: "first_resource",
    name: "Bookmarker",
    icon: "🔖",
    description: "Save your first resource to the library",
    category: "dedication",
    check: (configs, resources) => resources.length >= 1,
  },
  {
    id: "ten_resources",
    name: "Resource Hunter",
    icon: "📚",
    description: "Save 10 resources to the library",
    category: "dedication",
    check: (configs, resources) => resources.length >= 10,
  },
  {
    id: "top_rater",
    name: "Quality Filter",
    icon: "⭐",
    description: "Give 5-star ratings to 3 resources",
    category: "dedication",
    check: (configs, resources) => resources.filter((r) => r.rating === 5).length >= 3,
  },

  // ── Notes / engagement
  {
    id: "note_taker",
    name: "Note Taker",
    icon: "📝",
    description: "Add personal notes to any study config",
    category: "dedication",
    check: (configs) => configs.some((c) => c.notes && c.notes.trim().length > 10),
  },
];