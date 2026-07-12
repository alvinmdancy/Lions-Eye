# Lion's Eye

An AI-powered IT skills learning platform. Generate structured study prompts, track your career progression from Junior to Senior, and build a personal resource library, all running on your own infrastructure.

---

## What It Does

**Prompt Engine** - A guided, three-step flow: pick an IT skill across five categories (DevOps, Cloud, Networking, Security, SysAdmin), choose a prompt type, then set your parameters. Four prompt types are available: Learning Path, Concept Explainer, Lab Exercise, and Interview Prep. The response streams in live as it generates, and a toast notification lets you know when it's done, even if you've navigated to another page while it was running. Your selections and the last response persist across navigation, page refreshes, and browser restarts, and clear on new generation, logout, or manual clear.

**Power Prompts** - Six pre-built expert prompts for common real-world scenarios (fixing server errors, Kubernetes debugging, incident response, CI/CD pipeline design, and more). Click one to generate instantly, no setup required.

**Career Roadmap** - Saved configurations organize into a visual Junior to Mid to Senior progression per category. Rate your confidence in each skill, take notes, assign configs to projects, and launch Study Sessions from the roadmap.

**Study Session** - A focused view for any saved config, including the AI-generated content, a built-in quiz, an AI tutor chat, and PDF export.

**Resource Library** - A personal knowledge vault for saving links to documentation, videos, courses, labs, books, and more. Resources can be tagged, rated, filtered by skill or type, and exported.

**Achievement Badges** - Awarded automatically as you progress. Badges track milestones (configs saved), proficiency (confidence ratings), category breadth, prompt type variety, and library engagement.

---

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ------------------------------------------------ |
| Frontend       | React, Vite, Tailwind CSS, Framer Motion         |
| State          | React Context (generation state survives navigation) |
| Auth           | Supabase Auth (GoTrue)                            |
| Database       | Supabase (PostgreSQL)                             |
| AI Proxy       | Supabase Edge Functions (Deno), streaming responses |
| AI Model       | Claude (Anthropic API)                            |
| Infrastructure | Docker Compose (self-hosted Supabase), nginx      |
| Network Access | Cloudflare Tunnel                                 |

---

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- A Cloudflare account with a domain added, and `cloudflared` installed on your host
- Anthropic API key

---

## Setup

### 1. Clone the repo

```
git clone https://github.com/alvinmdancy/Lions-Eye.git
cd Lions-Eye
```

### 2. Start Supabase

```
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
ENABLE_ANONYMOUS_USERS=false
SITE_URL=https://your-app-hostname.example.com
ADDITIONAL_REDIRECT_URLS=https://your-app-hostname.example.com/**
```

To generate keys:

```
sh ./utils/generate-keys.sh
```

Start the stack:

```
docker compose up -d
```

### 3. Create the database tables

```
docker compose exec db psql -U postgres -d postgres
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

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON public.saved_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON public.resource_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON public.badges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

Type `\q` to exit. To make your own account an admin, sign up through the app once, then run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 4. Configure the Edge Functions

Two files control the AI proxy, both under `infrastructure/supabase/docker/volumes/functions/`:

- `main/index.ts` - the routing layer all function calls pass through. Sets `workerTimeoutMs` (currently 5 minutes) and `memoryLimitMb` for each function invocation. Raise `workerTimeoutMs` if you increase `max_tokens` in `llm-proxy` and start seeing generations time out.
- `llm-proxy/index.ts` - proxies requests to the Anthropic API and streams the response back to the client as it generates, rather than waiting for the full response. Streaming is what keeps long generations from hitting Cloudflare's edge timeout on tunneled connections. Sets `max_tokens` (currently 16000) for how long a single response can run.

Make sure `ANTHROPIC_API_KEY` is set in the Supabase `.env` and passed through in `docker-compose.yml`:

```yaml
functions:
  environment:
    ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
```

Restart the functions container after any change to these files or the env:

```
docker compose restart functions
```

### 5. Configure the frontend

Create `.env` at the project root:

```
VITE_SUPABASE_URL=https://your-supabase-hostname.example.com
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Point this at whatever hostname you expose Supabase's API on, whether that is a Cloudflare Tunnel hostname or a local address.

### 6. Build and run with Docker

The app builds as a static site and serves through nginx in its own container.

```
docker compose up -d --build
```

This builds the Vite app, bakes in your `.env` values at build time, and serves the result on the port set in `docker-compose.yml`.

### 7. Expose it through Cloudflare Tunnel

Add an ingress rule to your `cloudflared` config pointing your chosen hostname at the container's published port, then route the DNS record:

```
cloudflared tunnel route dns <your-tunnel-name> <your-hostname>
sudo systemctl restart cloudflared
```

Do the same for your Supabase API hostname if it is not already tunneled. If you want the Supabase Studio dashboard reachable but private, put it behind a separate Cloudflare Access application scoped to that hostname, with path-based bypass rules for `/auth/v1/*`, `/rest/v1/*`, and `/storage/v1/*` so the app itself is not blocked by the login wall.

---

## How Generation State Persists

Prompt Engine state (selected skill, prompt type, parameters, and the current AI response) lives in a React Context (`src/lib/GenerationContext.jsx`) mounted once at the app root, above the router. This means:

- Navigating to Library or Roadmap while a response is still streaming does not stop it. The Context keeps running and updating in the background, and the response is still there when you come back.
- A toast notification fires when a response finishes, regardless of which page you are currently viewing.
- State also mirrors to `localStorage`, so it survives a full page refresh or browser restart, not just in-app navigation.
- State clears on new generation, logout, or the manual Clear Response button.

---

## Project Structure

```
src/
├── api/          # Supabase client
├── components/   # UI components
├── data/         # Skill definitions
├── lib/          # Auth context, generation context, DB wrapper, LLM wrapper, badge logic
└── pages/        # Home, Library, Roadmap

infrastructure/
└── supabase/
    └── docker/
        ├── docker-compose.yml
        ├── .env
        └── volumes/
            └── functions/
                ├── main/           # Routing layer, worker timeout and memory limits
                └── llm-proxy/      # Streams responses from the Anthropic API

Dockerfile          # Multi-stage build: Vite build, then nginx serves the static output
nginx.conf           # nginx config for the app container
docker-compose.yml   # Compose file for the app container itself
```

---

## Skill Coverage

**DevOps** - Linux, Docker, Kubernetes, Terraform, Ansible, CI/CD, Helm, service mesh, GitOps and more across Junior, Mid, and Senior tracks.

**Cloud** - AWS, Azure, GCP core services, serverless, cloud networking, cost optimization, multi-cloud architecture.

**Networking** - TCP/IP, DNS, routing, firewalls, VPNs, SDN, network automation, zero-trust architecture.

**Security** - Security fundamentals, vulnerability management, SIEM, IAM, compliance, penetration testing, DevSecOps.

**SysAdmin** - Windows Server, Active Directory, Linux administration, virtualization, backup, PowerShell, enterprise infrastructure.

---

## License

MIT
