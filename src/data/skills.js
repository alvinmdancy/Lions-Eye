export const SKILL_CATEGORIES = {
  devops: {
    label: "DevOps",
    icon: "⚙️",
    color: "from-purple-600 to-cyan-500",
    levels: {
      junior: {
        label: "Junior DevOps Engineer",
        skills: [
          "Linux Fundamentals",
          "Bash Scripting",
          "Git & Version Control",
          "Docker Basics",
          "CI/CD Fundamentals",
          "Jenkins Basics",
          "YAML & Configuration Files",
          "Networking Basics (TCP/IP, DNS, HTTP)",
          "SSH & Remote Access",
          "Basic Monitoring with Grafana",
          "Nginx / Apache Web Server",
          "Package Managers (apt, yum, pip)",
          "Python Scripting for DevOps",
          "Agile & Scrum Basics",
          "Virtualization Basics (VirtualBox, VMware)",
        ]
      },
      mid: {
        label: "Mid-Level DevOps Engineer",
        skills: [
          "Docker Compose & Multi-Container Apps",
          "Kubernetes (K8s) Fundamentals",
          "Helm Charts",
          "Terraform Basics",
          "Ansible Automation",
          "GitLab CI/CD",
          "GitHub Actions",
          "Prometheus & Alerting",
          "ELK Stack (Elasticsearch, Logstash, Kibana)",
          "HashiCorp Vault",
          "Service Mesh (Istio Basics)",
          "Load Balancing & Reverse Proxy",
          "Infrastructure as Code Principles",
          "Database Administration Basics",
          "Security Scanning (Trivy, SonarQube)",
        ]
      },
      senior: {
        label: "Senior DevOps Engineer",
        skills: [
          "Advanced Kubernetes (RBAC, Network Policies, CRDs)",
          "Kubernetes Operators",
          "ArgoCD & GitOps",
          "Multi-Cloud Strategy",
          "Terraform Advanced (Modules, State Management)",
          "Chaos Engineering (Chaos Monkey, LitmusChaos)",
          "Advanced Observability (Jaeger, OpenTelemetry)",
          "Platform Engineering",
          "Developer Experience (DevEx) Design",
          "Cost Optimization & FinOps",
          "Zero-Trust Security Architecture",
          "Incident Management & SRE Practices",
          "Service Level Objectives (SLOs & SLAs)",
          "Advanced Networking (BGP, OSPF, SDN)",
          "DevSecOps Pipeline Design",
        ]
      }
    }
  },
  cloud: {
    label: "Cloud Engineering",
    icon: "☁️",
    color: "from-cyan-500 to-blue-600",
    levels: {
      junior: {
        label: "Junior Cloud Engineer",
        skills: [
          "Cloud Computing Fundamentals",
          "AWS Core Services (EC2, S3, VPC, IAM)",
          "Azure Fundamentals (AZ-900 level)",
          "GCP Fundamentals",
          "Cloud Storage Solutions",
          "Virtual Networks & Subnetting",
          "Cloud Security Basics (IAM, MFA)",
          "Route 53 / Azure DNS",
          "CloudWatch / Azure Monitor Basics",
          "RDS & Managed Databases",
          "Serverless Basics (Lambda, Azure Functions)",
          "Cloud Cost Management Basics",
          "CDN Concepts (CloudFront, Akamai)",
          "Backup & Disaster Recovery Basics",
          "Cloud CLI Tools (AWS CLI, Azure CLI, gcloud)",
        ]
      },
      mid: {
        label: "Mid-Level Cloud Engineer",
        skills: [
          "AWS Solutions Architect Associate",
          "Azure Administrator (AZ-104)",
          "GCP Associate Cloud Engineer",
          "Auto Scaling & Load Balancing",
          "Container Services (EKS, AKS, GKE)",
          "Serverless Architecture Patterns",
          "Event-Driven Architecture (SQS, SNS, EventBridge)",
          "Multi-Account AWS Organization",
          "Cloud Landing Zones",
          "Data Pipeline Services (Glue, Dataflow)",
          "Advanced Networking (Transit Gateway, VPC Peering)",
          "Cloud Security Hub & GuardDuty",
          "Terraform Cloud Provisioning",
          "API Gateway Design",
          "CloudFormation / ARM Templates",
        ]
      },
      senior: {
        label: "Senior Cloud Engineer / Architect",
        skills: [
          "AWS Solutions Architect Professional",
          "Azure Solutions Architect Expert (AZ-305)",
          "GCP Professional Cloud Architect",
          "Multi-Cloud Architecture Design",
          "Cloud Native Architecture Patterns",
          "Advanced Cloud Security (CSPM, CWPP)",
          "Well-Architected Framework Deep Dive",
          "FinOps & Cloud Cost Governance",
          "Hybrid Cloud & Edge Computing",
          "Global Infrastructure Design",
          "Microservices & Service Mesh at Scale",
          "Data Mesh Architecture",
          "ML/AI Platform Engineering on Cloud",
          "Cloud Governance & Compliance (SOC2, ISO27001)",
          "Disaster Recovery & Business Continuity Planning",
        ]
      }
    }
  },
  networking: {
    label: "Networking",
    icon: "🌐",
    color: "from-blue-500 to-indigo-600",
    levels: {
      junior: {
        label: "Junior Network Technician",
        skills: [
          "OSI Model",
          "TCP/IP Protocol Suite",
          "DHCP Configuration",
          "DNS Fundamentals",
          "Subnetting & CIDR",
          "VLANs & Trunking",
          "Switching Fundamentals (STP, RSTP)",
          "Routing Basics (Static, Default Routes)",
          "Firewall Basics",
          "Wi-Fi Standards (802.11)",
          "Cabling & Physical Layer",
          "Network Troubleshooting (ping, tracert, nslookup)",
          "CompTIA Network+ Preparation",
          "DHCP Scopes & Reservations",
          "NAT & PAT",
        ]
      },
      mid: {
        label: "Mid-Level Network Engineer",
        skills: [
          "OSPF Routing Protocol",
          "BGP Fundamentals",
          "EIGRP",
          "Advanced VLAN Design",
          "Network Security (ACLs, Zone-Based Firewall)",
          "VPN Technologies (IPSec, SSL VPN)",
          "QoS Configuration",
          "Network Monitoring (SNMP, NetFlow)",
          "Cisco IOS Deep Dive",
          "Load Balancers (F5, Citrix)",
          "SD-WAN Technologies",
          "Wireless Controller Management",
          "IPv6 Design & Implementation",
          "MPLS Fundamentals",
          "Cisco CCNP Preparation",
        ]
      },
      senior: {
        label: "Senior Network Architect",
        skills: [
          "Data Center Networking (EVPN, VXLAN)",
          "Software-Defined Networking (SDN)",
          "Network Function Virtualization (NFV)",
          "BGP Advanced (Route Policies, Communities)",
          "Cisco CCIE Preparation",
          "Network Automation (Python, Ansible, NAPALM)",
          "Intent-Based Networking",
          "Zero Trust Network Access (ZTNA)",
          "Cloud Networking Integration",
          "Network Security Architecture",
          "Service Provider Networks",
          "Segment Routing",
          "Network Digital Twin",
          "Multi-Vendor Environment Management",
          "5G & Edge Networking",
        ]
      }
    }
  },
  security: {
    label: "Cybersecurity",
    icon: "🔐",
    color: "from-red-500 to-pink-600",
    levels: {
      junior: {
        label: "Junior Security Analyst",
        skills: [
          "Security Fundamentals (CIA Triad)",
          "CompTIA Security+ Preparation",
          "Network Security Basics",
          "Vulnerability Scanning (Nessus, OpenVAS)",
          "SIEM Basics (Splunk, QRadar)",
          "Incident Response Fundamentals",
          "Phishing & Social Engineering Awareness",
          "Password Security & MFA",
          "Endpoint Security (EDR Basics)",
          "Log Analysis Basics",
          "Firewall Rule Management",
          "Security Awareness Training",
          "Basic Penetration Testing Concepts",
          "OWASP Top 10",
          "Risk Management Fundamentals",
        ]
      },
      mid: {
        label: "Mid-Level Security Engineer",
        skills: [
          "Penetration Testing (Kali Linux, Metasploit)",
          "SIEM Advanced (Correlation Rules, Dashboards)",
          "Threat Hunting",
          "Malware Analysis",
          "Digital Forensics",
          "Cloud Security (AWS Security, Azure Defender)",
          "Identity & Access Management (IAM, PAM)",
          "Application Security Testing (DAST, SAST)",
          "Security Automation & Orchestration (SOAR)",
          "Cryptography Fundamentals",
          "Zero Trust Architecture",
          "Compliance Frameworks (NIST, CIS)",
          "Bug Bounty Programs",
          "Threat Intelligence",
          "CEH / eJPT Certification Prep",
        ]
      },
      senior: {
        label: "Senior Security Architect / CISO Path",
        skills: [
          "Security Architecture Design",
          "CISSP Preparation",
          "Red Team Operations",
          "Purple Team Exercises",
          "Advanced Threat Modeling",
          "Security Program Management",
          "GRC (Governance, Risk, Compliance)",
          "SOC Design & Management",
          "Advanced Malware Analysis & Reverse Engineering",
          "Cloud-Native Security Architecture",
          "DevSecOps Leadership",
          "Security Metrics & KPIs",
          "Regulatory Compliance (GDPR, HIPAA, PCI-DSS)",
          "Crisis Management & Incident Command",
          "Executive Security Briefings",
        ]
      }
    }
  },
  sysadmin: {
    label: "Systems Administration",
    icon: "🖥️",
    color: "from-green-500 to-teal-600",
    levels: {
      junior: {
        label: "Junior Sysadmin",
        skills: [
          "Windows Server Basics",
          "Active Directory Fundamentals",
          "Linux Administration Basics",
          "File Systems & Storage",
          "User & Group Management",
          "Group Policy Objects (GPO)",
          "Basic PowerShell Scripting",
          "Backup Solutions",
          "Virtualization (Hyper-V, VMware Basics)",
          "Printer & Peripheral Management",
          "Help Desk & Ticketing Systems",
          "Email Server Basics (Exchange)",
          "DHCP & DNS on Windows Server",
          "Network File Sharing (SMB, NFS)",
          "CompTIA A+ Preparation",
        ]
      },
      mid: {
        label: "Mid-Level Sysadmin",
        skills: [
          "Advanced Active Directory (Trusts, Federation)",
          "Azure Active Directory / Entra ID",
          "PowerShell Advanced Scripting",
          "SCCM / Intune MDM",
          "Virtualization Advanced (vSphere, vCenter)",
          "Storage Administration (SAN, NAS)",
          "Exchange Server Administration",
          "Office 365 / Microsoft 365 Admin",
          "Certificate Authority & PKI",
          "Advanced GPO & Security Baselines",
          "Monitoring (SCOM, Zabbix)",
          "Linux Advanced (RHEL, CentOS)",
          "Database Basics (SQL Server, MySQL)",
          "Patch Management",
          "ITIL Framework",
        ]
      },
      senior: {
        label: "Senior Sysadmin / Infrastructure Lead",
        skills: [
          "Enterprise Architecture Design",
          "Hybrid Identity (AD + Azure AD)",
          "Zero Downtime Migration Strategies",
          "Advanced Virtualization (NSX, vSAN)",
          "Capacity Planning & Performance Tuning",
          "Disaster Recovery Architecture",
          "Cloud Migration Planning",
          "Infrastructure Automation (Ansible, Puppet)",
          "Enterprise Storage (NetApp, Pure Storage)",
          "Advanced Security Hardening",
          "ITIL Expert Level",
          "Budget & Vendor Management",
          "Documentation & Knowledge Management",
          "Team Leadership & Mentoring",
          "Microsoft 365 Architecture",
        ]
      }
    }
  }
};

export const PROMPT_TYPES = [
  {
    id: "learning_path",
    label: "Learning Path",
    icon: "🗺️",
    description: "Complete structured learning roadmap with milestones, resources, and schedule",
    color: "from-purple-600 to-cyan-500",
  },
  {
    id: "concept_explainer",
    label: "Concept Explainer",
    icon: "💡",
    description: "Deep-dive explanation of a specific concept tailored to your level",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "lab_exercise",
    label: "Lab / Hands-On",
    icon: "🧪",
    description: "Step-by-step lab scenarios and practical exercises to build real skills",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "interview_prep",
    label: "Interview Prep",
    icon: "🎯",
    description: "Role-specific interview questions with model answers and insider tips",
    color: "from-orange-500 to-pink-500",
  },
];

export const LEARNING_STYLES = [
  { value: "visual", label: "Visual (diagrams, videos, charts)" },
  { value: "hands-on", label: "Hands-On (labs, projects, building)" },
  { value: "reading", label: "Reading (docs, books, articles)" },
  { value: "auditory", label: "Auditory (podcasts, lectures, discussion)" },
];

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner — No prior knowledge" },
  { value: "intermediate", label: "Intermediate — Some experience" },
  { value: "advanced", label: "Advanced — Solid foundation" },
];
