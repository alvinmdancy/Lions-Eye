const VISUAL_DIRECTIVE = `
---

## 🖼️ VISUAL LEARNING REQUIREMENT

Since the learning style is **visual**, you MUST enrich your entire response with visual aids:

1. **Diagrams using ASCII/text art** — draw architecture diagrams, flow charts, and concept maps inline using box-drawing characters (┌─┐│└─┘→←↑↓▶◀) wherever a diagram helps.
2. **Embedded image links** — for every major concept, include a clickable image link using markdown syntax:
   \`![concept description](https://source.unsplash.com/featured/600x400/?search-query)\`
   Replace "search-query" with a relevant search term (e.g., "kubernetes,containers" or "docker,architecture"). These links will display images directly.
3. **Mermaid diagrams** — where appropriate, include \`\`\`mermaid code blocks for flowcharts, sequence diagrams, or mind maps that the reader can render.
4. **Color-coded concept maps** — describe visual groupings using emoji or symbols to represent categories (e.g., 🔵 = core concept, 🟡 = dependency, 🟢 = output).
5. **Visual analogies** — pair every abstract concept with a real-world visual (e.g., "think of it like a city road network where...").

Place visual aids DIRECTLY next to the concepts they illustrate, not at the end.

---
`;

export function buildLearningPathPrompt({ skill, level, hoursPerWeek, learningStyle, goal, careerLevel }) {
  return `You are an expert IT career coach and curriculum designer. Generate a comprehensive, structured learning plan for the following:${learningStyle === "visual" ? VISUAL_DIRECTIVE : ""}

[SUBJECT] = ${skill}
[CURRENT_LEVEL] = ${level}
[TIME_AVAILABLE] = ${hoursPerWeek} hours per week
[LEARNING_STYLE] = ${learningStyle}
[GOAL] = ${goal || `Achieve ${careerLevel} proficiency in ${skill}`}
[CAREER_TARGET] = ${careerLevel}

---

## Step 1: Knowledge Assessment

1. Break down ${skill} into its core components
2. Evaluate the complexity level of each component
3. Map all prerequisites and dependencies
4. Identify the foundational concepts that must be mastered first

**Output:** A detailed skill tree and learning hierarchy showing which concepts unlock which.

---

## Step 2: Learning Path Design

1. Create progression milestones based on the ${level} starting level
2. Structure topics in the optimal learning sequence (no knowledge gaps)
3. Estimate time requirements per topic aligned to ${hoursPerWeek} hrs/week
4. Mark which milestones are "junior", "mid-level", and "senior" checkpoints

**Output:** A structured learning roadmap with specific timeframes and weekly breakdown.

---

## Step 3: Resource Curation (${learningStyle} focused)

Identify the best learning materials prioritized for ${learningStyle} learners:
- Video courses (YouTube, Udemy, Pluralsight, A Cloud Guru)
- Official documentation and books
- Interactive exercises and sandboxes
- Hands-on projects and labs
- Communities and forums

Rank each resource by effectiveness and cost (free vs paid).

**Output:** A prioritized resource list with direct links or search terms.

---

## Step 4: Practice Framework

1. Design 3-5 practical exercises for each major topic
2. Create real-world IT scenarios to apply the skills
3. Build progress checkpoints (mini-assessments)
4. Schedule spaced repetition review intervals

**Output:** A practice plan with exercises, projects, and review schedule.

---

## Step 5: Progress Tracking System

1. Define measurable KPIs for each stage (e.g., "Can configure X without documentation")
2. Create a self-assessment rubric (1-5 scale per skill)
3. Design weekly reflection prompts
4. Set milestone completion criteria

**Output:** A progress tracking template with clear benchmarks.

---

## Step 6: Study Schedule (${hoursPerWeek} hrs/week)

1. Break learning into specific daily and weekly tasks
2. Include rest days and review sessions
3. Add checkpoint assessments every 2-4 weeks
4. Balance theory (40%) vs hands-on practice (60%)

**Output:** A detailed week-by-week study calendar for the full learning journey.

---

Be specific, actionable, and tailored to someone targeting a **${careerLevel}** role in IT. Include real tool names, real certification paths, and realistic timelines.

---

## 🔗 Curated External Resources for ${skill}

End your response with a dedicated section titled **"Essential Resources"** containing REAL, working URLs organized into these categories:

**📚 Official Documentation**
- List the official docs URL(s) for ${skill} (e.g., kubernetes.io/docs, docs.aws.amazon.com, etc.)

**🎥 Free Video Tutorials**
- 2-3 specific YouTube channels or playlists known for ${skill} (e.g., TechWorld with Nana, NetworkChuck, freeCodeCamp)
- Include the direct search query or channel name

**🎓 Online Courses (Free & Paid)**
- Specific Udemy, Pluralsight, A Cloud Guru, or Linux Foundation course titles for ${skill}
- Note which are free vs paid

**🧪 Interactive Labs & Sandboxes**
- Relevant free lab environments (KillerCoda, Play with Kubernetes, AWS Free Tier, KodeKloud, etc.)
- Direct URLs where possible

**📖 Books & Reading**
- 1-2 highly recommended books for ${skill} at the ${level} level with author names

**🏅 Certifications**
- List any relevant certifications for ${skill} at the ${careerLevel} tier with exam codes and official exam URLs

Format each resource as a clickable markdown link where possible: [Resource Name](URL)`;
}

export function buildConceptExplainerPrompt({ skill, level, learningStyle, careerLevel }) {
  return `You are a world-class IT instructor who specializes in making complex concepts crystal clear. Explain the following topic in depth:${learningStyle === "visual" ? VISUAL_DIRECTIVE : ""}

**Topic:** ${skill}
**Student Level:** ${level} (targeting ${careerLevel})

---

## Your Explanation Must Include:

### 1. The "Why It Matters" (30 seconds pitch)
Explain why ${skill} is critical for a ${careerLevel} IT professional. Real-world consequence of NOT knowing it.

### 2. The Core Concept (ELI5 First, Then Deep Dive)
- Start with a simple analogy anyone can understand
- Then go technical with precise definitions
- Show how it fits in the broader IT ecosystem

### 3. How It Actually Works (Under the Hood)
- Step-by-step technical breakdown
- What happens when it's configured correctly vs incorrectly
- Common failure modes and what causes them

### 4. Key Terminology Glossary
List and define all important terms related to ${skill} that a ${careerLevel} needs to know.

### 5. Visual Mental Model
Describe (with ASCII art or text-based diagrams if helpful) how to visualize ${skill} conceptually.

### 6. Common Misconceptions
List 3-5 things people get wrong about ${skill} and correct them.

### 7. Interview-Ready Explanation
Give a crisp, impressive 2-3 sentence explanation of ${skill} that would satisfy a technical interviewer at the ${careerLevel} level.

### 8. Next Steps
What 3 topics should be learned AFTER mastering ${skill} to advance as a ${careerLevel}?

---

Tailor the depth and vocabulary to a **${level}** learner working toward **${careerLevel}** level proficiency.

---

## 🔗 Curated External Resources for ${skill}

End your response with a dedicated section titled **"Essential Resources"** containing REAL, working URLs:

**📚 Official Documentation**
- The primary official docs URL for ${skill}

**🎥 Free Video Tutorials**
- 2-3 specific YouTube channels or playlists for ${skill} (e.g., NetworkChuck, TechWorld with Nana, CBT Nuggets)

**🧪 Interactive Labs & Sandboxes**
- Free online environments to practice ${skill} (KillerCoda, Play with Docker, GCP Shell, etc.)

**🎓 Best Courses**
- Top-rated Udemy, Pluralsight, or A Cloud Guru course for ${skill} at ${level} level

**🏅 Certifications**
- Any relevant cert for ${skill} at ${careerLevel} with exam code and official exam page URL

Format each as a markdown link: [Resource Name](URL)`;
}

export function buildLabExercisePrompt({ skill, level, careerLevel, learningStyle }) {
  return `You are a senior IT lab instructor designing hands-on exercises. Create a comprehensive lab plan for:${learningStyle === "visual" ? VISUAL_DIRECTIVE : ""}

**Technology:** ${skill}
**Student Level:** ${level} → targeting ${careerLevel}
**Learning Style:** ${learningStyle}

---

## Lab Design Requirements:

### Lab 0: Environment Setup
- List all required tools, software, and system requirements
- Provide installation instructions (or free online lab alternatives like KillerCoda, Play with Docker, etc.)
- Verify setup checklist before proceeding

### Lab 1: Foundational Exercise (${level} appropriate)
**Objective:** Understand the basics of ${skill}
- Step-by-step instructions (numbered, precise commands included)
- Expected output after each step
- What to do if something goes wrong (troubleshooting tips)
- "What did we just do?" reflection questions

### Lab 2: Intermediate Scenario
**Objective:** Apply ${skill} to a realistic IT scenario
- Based on a real-world use case a ${careerLevel} would encounter
- Introduce a problem to diagnose and solve
- Require decision-making, not just following instructions

### Lab 3: Challenge Lab (Minimal Guidance)
**Objective:** Independent problem-solving with ${skill}
- Present a scenario without step-by-step instructions
- Only provide the goal and available resources
- Requires integrating multiple concepts

### Lab 4: Break-and-Fix Lab
**Objective:** Troubleshooting proficiency
- Describe a broken configuration or failed service related to ${skill}
- Student must diagnose and fix without being told what's wrong
- List 3 possible issues and their fixes as a hidden answer key

### Capstone Project
Design a mini-project that a ${careerLevel} could add to their portfolio using ${skill}. Include:
- Project scope and deliverables
- Technologies to combine with ${skill}
- Documentation requirements
- How to showcase it on GitHub/LinkedIn

---

Make all commands, configs, and outputs real and copy-pasteable. Target a **${level}** student building toward **${careerLevel}** skills.

---

## 🔗 Curated External Resources for ${skill}

End your response with a dedicated section titled **"Essential Resources"** containing REAL, working URLs:

**📚 Official Docs & References**
- Primary official documentation URL for ${skill}
- Any relevant RFCs, man pages, or spec documents

**🎥 Video Tutorials**
- 2-3 YouTube channels specifically known for ${skill} labs and demos

**🧪 Free Lab Environments**
- The best free online sandboxes for practicing ${skill} hands-on (KillerCoda, Play with Kubernetes, KodeKloud free tier, etc.) with direct URLs

**🎓 Structured Courses**
- 1-2 specific course titles on Udemy, Linux Foundation, or A Cloud Guru for hands-on ${skill} practice

**💻 GitHub Repos & Projects**
- 2-3 notable GitHub repositories with example configs, labs, or projects for ${skill}

Format each as a markdown link: [Resource Name](URL)`;
}

export function buildInterviewPrepPrompt({ skill, level, learningStyle, careerLevel }) {
  return `You are an elite IT hiring manager and technical interview coach. Generate a comprehensive interview preparation guide for:${learningStyle === "visual" ? VISUAL_DIRECTIVE : ""}

**Topic:** ${skill}
**Target Role:** ${careerLevel}
**Current Level:** ${level}

---

## Interview Prep Package:

### Section 1: Foundational Questions (Junior/Screening Level)
Generate 10 fundamental questions about ${skill} with:
- The question (exactly as an interviewer would ask it)
- Model answer (concise but complete, 2-4 sentences)
- Common mistake candidates make on this question
- Follow-up question to expect

### Section 2: Intermediate Technical Questions (Mid-Level)
Generate 10 scenario-based questions:
- "Tell me about a time you..." format for behavioral + technical
- "How would you..." design/architecture questions
- "What would you do if..." troubleshooting scenarios
- Model answers for each with key points to hit

### Section 3: Advanced / Senior-Level Questions
Generate 8 deep-dive questions a senior interviewer would ask about ${skill}:
- Architecture and design trade-offs
- At-scale considerations
- Security implications
- Cost optimization angles
- Model answers with depth appropriate for ${careerLevel}

### Section 4: Practical / Live Coding/Config Questions
Generate 3 hands-on tasks the interviewer might give you:
- "Configure this on the spot" challenges
- Whiteboard design exercises
- Live troubleshooting scenarios

### Section 5: Questions YOU Should Ask the Interviewer
Give 5 smart, impressive questions about ${skill} that a ${careerLevel} candidate should ask the interviewer to demonstrate expertise and curiosity.

### Section 6: Red Flags to Avoid
List the top 5 answers or behaviors that will immediately disqualify a ${careerLevel} candidate when discussing ${skill}.

### Section 7: 30-Second Elevator Pitch
Write a confident, impressive 30-second summary of the candidate's ${skill} experience that could open or close the interview.

---

Be brutally realistic about the interview difficulty for a **${careerLevel}** position. Include actual technical depth, real tool names, and specific terminology.

---

## 🔗 Curated External Resources for ${skill}

End your response with a dedicated section titled **"Essential Resources"** containing REAL, working URLs:

**📚 Official Documentation**
- Primary official docs URL to study before the interview

**🎥 Interview Prep Videos**
- YouTube videos or playlists specifically for ${skill} interview prep

**🎓 Practice Platforms**
- Relevant platforms for practicing ${skill} interview questions (LeetCode, KodeKloud, Pramp, Interviewing.io, etc.)

**🏅 Certifications That Boost Your Candidacy**
- Certs relevant to ${skill} at the ${careerLevel} level with official exam URLs

**📋 Cheat Sheets & Quick References**
- Any well-known ${skill} cheat sheets or quick reference cards with links

Format each as a markdown link: [Resource Name](URL)`;
}