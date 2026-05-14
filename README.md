# Lion's Eye

An AI-powered IT skills learning platform. Generate structured study prompts, track your career progression from Junior to Senior, and build a personal resource library — all running locally on your own infrastructure.

---

## What It Does

**Prompt Engine** — Select an IT skill across five categories (DevOps, Cloud, Networking, Security, SysAdmin) and generate AI-powered prompts tailored to your experience level and learning style. Four prompt types are available: Learning Path, Concept Explainer, Lab Exercise, and Interview Prep.

**Career Roadmap** — Saved configurations are organized into a visual Junior → Mid → Senior progression per category. Rate your confidence in each skill, take notes, assign configs to projects, and launch Study Sessions directly from the roadmap.

**Study Session** — A focused view for any saved config that includes the AI-generated content, a built-in quiz, an AI tutor chat, and PDF export.

**Resource Library** — A personal knowledge vault for saving links to documentation, videos, courses, labs, books, and more. Resources can be tagged, rated, filtered by skill or type, and exported.

**Achievement Badges** — Automatically awarded as you progress. Badges track milestones (configs saved), proficiency (confidence ratings), category breadth, prompt type variety, and library engagement.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Auth | Supabase Auth (GoTrue) |
| Database | Supabase (PostgreSQL) |
| AI Proxy | Supabase Edge Functions (Deno) |
| AI Model | Claude (Anthropic API) |
| Infrastructure | Docker Compose (self-hosted Supabase) |
| Network Access | Tailscale |

---

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Tailscale (for network access)
- Anthropic API key

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/alvinmdancy/Lions-Eye.git
cd Lions-Eye
```

### 2. Start Supabase

```bash
cd infrastructure/supabase/docker
cp .env.example .env
```

Edit `.env` and set your secrets. At minimum configure:

```
POSTGRES_PASSWORD=
JWT_SECRET=
ANON_KEY=
SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ENABLE_EMAIL_AUTOCONFIRM=true
```

To generate keys:

```bash
sh ./utils/generate-keys.sh
```

Start the stack:

```bash
docker compose up -d
```

### 3. Create the database tables

```bash
docker exec -it supabase-db psql -U postgres -d postgres
```

```sql
CREATE TABLE public.saved_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  skill TEXT, category TEXT, skill_level TEXT, career_label TEXT,
  prompt_type TEXT, level TEXT, learning_style TEXT, hours_per_week TEXT,
  goal TEXT, proficiency INTEGER DEFAULT 0, notes TEXT, project_id UUID,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.resource_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, url TEXT NOT NULL, type TEXT DEFAULT 'other',
  skill TEXT, tags TEXT[] DEFAULT '{}', rating INTEGER DEFAULT 0,
  notes TEXT, is_free BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, description TEXT, icon TEXT DEFAULT '🚀',
  color TEXT DEFAULT 'cyan',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_id TEXT NOT NULL UNIQUE, name TEXT, description TEXT,
  icon TEXT, category TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON public.saved_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON public.resource_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON public.badges FOR ALL USING (true) WITH CHECK (true);
```

Type `\q` to exit.

### 4. Configure the Edge Function

The LLM proxy is already in `infrastructure/supabase/docker/volumes/functions/llm-proxy/`. Make sure `ANTHROPIC_API_KEY` is set in the Supabase `.env` and that the functions service has it in `docker-compose.yml`:

```yaml
functions:
  environment:
    ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
```

Restart the functions container after any env change:

```bash
docker compose up -d functions
```

### 5. Configure the frontend

Create `.env` at the project root:

```
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For Tailscale access, replace `localhost` with your Tailscale IP (`tailscale ip -4`).

### 6. Install and run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Anyone on your Tailscale network can access it at `http://<tailscale-ip>:5173`.

---

## Project Structure

```
src/
├── api/          # Supabase client
├── components/   # UI components
├── data/         # Skill definitions
├── lib/          # Auth context, DB wrapper, LLM wrapper, badge logic
└── pages/        # Home, Library, Roadmap

infrastructure/
└── supabase/
    └── docker/
        ├── docker-compose.yml
        ├── .env
        └── volumes/
            └── functions/
                └── llm-proxy/   # Edge function — Anthropic API proxy
```

---

## Skill Coverage

**DevOps** — Linux, Docker, Kubernetes, Terraform, Ansible, CI/CD, Helm, service mesh, GitOps and more across Junior, Mid, and Senior tracks.

**Cloud** — AWS, Azure, GCP core services, serverless, cloud networking, cost optimization, multi-cloud architecture.

**Networking** — TCP/IP, DNS, routing, firewalls, VPNs, SDN, network automation, zero-trust architecture.

**Security** — Security fundamentals, vulnerability management, SIEM, IAM, compliance, penetration testing, DevSecOps.

**SysAdmin** — Windows Server, Active Directory, Linux administration, virtualization, backup, PowerShell, enterprise infrastructure.

---

## License

MIT