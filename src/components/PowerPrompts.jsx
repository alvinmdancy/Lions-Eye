import { motion } from "framer-motion";

export const POWER_PROMPTS = [
  {
    id: "fix_server_error",
    icon: "🔥",
    label: "Fix a Server Error",
    color: "from-red-500/20 to-orange-500/10 border-red-500/30",
    tagColor: "text-red-400",
    prompt: `You are a senior Linux/DevOps engineer. I have encountered a critical server error and need expert help diagnosing and resolving it.

TASK: Walk me through a systematic troubleshooting methodology for server errors.

Cover:
1. **Initial Triage** — First commands to run (uptime, top, dmesg, journalctl -xe, df -h, free -m)
2. **Log Analysis** — Where to look and how to read key log files (/var/log/syslog, /var/log/nginx/error.log, application logs)
3. **Common Root Causes** — OOM kills, disk full, runaway processes, network timeouts, permission issues, misconfigured services
4. **Fix Patterns** — For each cause, give the exact commands to resolve it
5. **Prevention** — Monitoring alerts and health checks to prevent recurrence

Format each section with clear headings, command examples in code blocks, and real-world context. Be concise but thorough.`,
  },
  {
    id: "cloud_cert",
    icon: "🏅",
    label: "Pass a Cloud Cert Exam",
    color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30",
    tagColor: "text-yellow-400",
    prompt: `You are a cloud certification expert who has helped hundreds of engineers pass AWS, Azure, and GCP exams.

TASK: Build me a high-impact, 4-week exam preparation plan for a cloud certification exam (e.g., AWS Solutions Architect Associate, AZ-104, or GCP ACE).

Include:
1. **Week-by-Week Study Plan** — Core topics to cover each week with daily time estimates
2. **High-Frequency Exam Topics** — The concepts that appear most often and tricky edge cases
3. **Practice Strategies** — How to use practice exams effectively, what score to aim for before booking
4. **Hands-On Labs** — Key services to get hands-on with so concepts stick
5. **Day-Before Checklist** — What to review, what to avoid, how to approach the exam format
6. **Key Mnemonics & Mental Models** — Memory tricks for tricky service comparisons

Be specific, actionable, and motivating. Output as a structured guide.`,
  },
  {
    id: "kubernetes_debug",
    icon: "🐳",
    label: "Debug a Kubernetes Cluster",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    tagColor: "text-blue-400",
    prompt: `You are a Kubernetes expert with deep experience running production clusters.

TASK: Teach me a complete Kubernetes debugging runbook I can use whenever things go wrong.

Cover these common failure modes with exact kubectl commands for each:
1. **Pod not starting** — CrashLoopBackOff, ImagePullBackOff, Pending, OOMKilled
2. **Service not reachable** — ClusterIP vs NodePort vs LoadBalancer, DNS resolution, endpoint health
3. **Node issues** — NotReady nodes, resource pressure, evictions
4. **Deployment stuck** — Rollout stuck, readiness probe failures, resource quota limits
5. **Networking problems** — CNI issues, NetworkPolicy blocking traffic
6. **Storage issues** — PVC stuck in Pending, volume mount failures

For each: explain the symptom, diagnostic commands with example output, and the fix. Include a quick-reference cheat sheet at the end.`,
  },
  {
    id: "security_breach",
    icon: "🔐",
    label: "Respond to a Security Breach",
    color: "from-pink-500/20 to-red-500/10 border-pink-500/30",
    tagColor: "text-pink-400",
    prompt: `You are a senior incident response engineer and cybersecurity expert.

TASK: Walk me through a complete Incident Response playbook for a suspected security breach in a Linux/cloud environment.

Structure it around the PICERL framework:
1. **Preparation** — Tools to have ready, access controls, communication channels, chain of custody
2. **Identification** — Indicators of compromise (IOCs), log sources to check, forensic commands to run
3. **Containment** — How to isolate affected systems without destroying evidence
4. **Eradication** — Removing malware, revoking compromised credentials, patching the entry point
5. **Recovery** — Restoring from clean backups, validation steps, gradual traffic restoration
6. **Lessons Learned** — Post-mortem template, timeline reconstruction, control improvements

Include real command examples and explain what to look for. Make it actionable.`,
  },
  {
    id: "ci_cd_pipeline",
    icon: "⚙️",
    label: "Build a CI/CD Pipeline",
    color: "from-purple-500/20 to-violet-500/10 border-purple-500/30",
    tagColor: "text-purple-400",
    prompt: `You are a DevOps architect specializing in modern CI/CD systems.

TASK: Guide me step-by-step in designing and implementing a production-grade CI/CD pipeline from scratch.

Cover the full pipeline lifecycle:
1. **Architecture Overview** — Stages: code commit → build → test → security scan → artifact publish → deploy → verify
2. **Tool Selection** — Compare GitHub Actions vs GitLab CI vs Jenkins vs ArgoCD for each stage
3. **Implementation** — Provide a working example pipeline config (GitHub Actions YAML) with Docker build, tests, SAST scan, deploy to staging, promote to production
4. **Branch Strategy** — GitFlow vs trunk-based, environment promotion strategy
5. **Secrets Management** — How to handle credentials securely (Vault, GitHub Secrets, OIDC)
6. **Observability** — Pipeline metrics, failure alerting, deployment tracking

Output working config snippets and explain the reasoning behind each design decision.`,
  },
  {
    id: "network_design",
    icon: "🌐",
    label: "Design a Secure Network",
    color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
    tagColor: "text-cyber-cyan",
    prompt: `You are a senior network architect with expertise in enterprise and cloud networking.

TASK: Guide me through designing a secure, scalable network architecture for a modern organization.

Cover:
1. **Network Segmentation** — VLANs, subnetting strategy, DMZ design, zero-trust micro-segmentation
2. **Perimeter Security** — Firewall placement, stateful vs stateless filtering, IDS/IPS positioning
3. **Access Control** — NAC, 802.1X, RBAC for network resources, VPN design
4. **Cloud Integration** — Hybrid connectivity, VPC/VNET design, security groups vs NACLs
5. **Monitoring & Visibility** — NetFlow, SNMP, SIEM integration, anomaly detection
6. **High Availability** — Redundant links, BGP failover, load balancer placement

Include a sample IP addressing scheme, example firewall rule sets, and a network diagram description. Make it enterprise-ready.`,
  },
];

export default function PowerPrompts({ onSelect }) {
  return (
    <div className="cyber-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyber-cyan">⚡</span>
        <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-cyber-cyan/80">
          Power Prompts
        </h3>
        <span className="ml-auto font-mono-cyber text-xs text-white/20">instant launch</span>
      </div>
      <p className="font-inter text-xs text-white/30 mb-4">
        Pre-built expert prompts for real-world IT scenarios. Click any to generate instantly.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {POWER_PROMPTS.map((pp, i) => (
          <motion.button
            key={pp.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(pp)}
            className={`w-full text-left px-4 py-3 rounded-lg border bg-gradient-to-r ${pp.color} transition-all hover:brightness-110 hover:scale-[1.01] active:scale-[0.99]`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg flex-shrink-0">{pp.icon}</span>
              <p className={`font-orbitron text-xs font-bold uppercase tracking-widest ${pp.tagColor}`}>
                {pp.label}
              </p>
              <span className="ml-auto text-white/20 text-xs font-mono-cyber flex-shrink-0">→</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}