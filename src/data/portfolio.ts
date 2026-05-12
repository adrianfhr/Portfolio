export const PROFILE = {
  name:     'Adrian Fahri Affandi',
  role:     'AI Engineer · Backend Infrastructure',
  location: 'Bekasi, West Java, Indonesia',
  status:   'Open to opportunities · 2026',
  email:    'adrianfhrr@gmail.com',
  blurb:
    'Software Engineer specializing in AI integration and backend infrastructure. I take ML models from experimentation to production — edge AI systems, RAG pipelines, and the microservices backbone that keeps them running reliably in Go and Python.',
} as const;

export type Profile = typeof PROFILE;

export interface Metric {
  k: string;
  v: string;
}

export interface Project {
  id:      string;
  year:    string;
  name:    string;
  tagline: string;
  role:    string;
  summary: string;
  bullets: string[];
  stack:   string[];
  metrics: Metric[];
}

export const PROJECTS: Project[] = [
  {
    id:      '01',
    year:    '2025',
    name:    'Seismic Risk',
    tagline: 'CV pipeline for building typology classification — ITB thesis',
    role:    'Solo engineer, end-to-end',
    summary:
      'Microservices backend for geospatial seismic risk assessment. YOLOv11 models classify building typologies; an integrated annotation platform replaced third-party tools and cut manual labeling effort by 40%+.',
    bullets: [
      'Microservices backend with FastAPI + PostgreSQL/PostGIS for geospatial data management',
      'Trained and deployed YOLOv11-based CV models for building typology classification',
      'Custom MLOps workflow with model versioning and rollback support for reproducible experiments',
      'Integrated annotation platform with pre-annotation that reduced manual labeling by 40%+',
      'AI predictions fed into a seismic risk simulation covering 10,000+ buildings region-wide',
    ],
    stack:   ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'YOLOv11', 'PyTorch', 'Docker'],
    metrics: [
      { k: 'buildings',   v: '10k+'    },
      { k: 'labeling ↓',  v: '40%+'    },
      { k: 'model',       v: 'YOLOv11' },
    ],
  }
];

export interface StackGroup {
  group: string;
  items: string[];
}

export const STACK: StackGroup[] = [
  { group: 'Languages', items: ['Go', 'Python', 'TypeScript', 'Java', 'SQL', 'C++'] },
  { group: 'AI / ML',   items: ['PyTorch', 'YOLOv11', 'LangGraph', 'RAG / LLM', 'Hailo AI', 'OpenCV'] },
  { group: 'Backend',   items: ['FastAPI', 'NestJS', 'gRPC', 'PostgreSQL', 'MySQL', 'Redis'] },
  { group: 'Infra',     items: ['Docker', 'Kubernetes', 'CI/CD', 'Raspberry Pi', 'WebRTC (LiveKit)'] },
];

export interface WritingItem {
  date:  string;
  title: string;
  tag:   string;
}

export const WRITING: WritingItem[] = [
  { date: '2026.04', title: 'Building a Multi-Agent LLM Ecosystem for Internal Support',  tag: 'post'  },
  { date: '2026.02', title: 'Edge AI with Hailo: Getting 20 FPS Face Detection on Pi 5',  tag: 'post'  },
  { date: '2025.11', title: 'YOLOv11 for Building Typology — Lessons from a Thesis',      tag: 'notes' },
  { date: '2025.08', title: 'What I Learned Moving from Backend Intern to AI Engineer',   tag: 'notes' },
];

export interface ExperienceItem {
  period:     string;
  duration:   string;
  company:    string;
  location:   string;
  role:       string;
  type:       string;
  current?:   boolean;
  summary:    string;
  highlights: string[];
  tags:       string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    period:   'Oct 2025 — Now',
    duration: '8 mo',
    company:  'Synapsis',
    location: 'Indonesia',
    role:     'AI Engineer',
    type:     'Full-time',
    current:  true,
    summary:
      'Architected and deployed production AI systems — from edge-to-cloud face recognition for enterprise attendance to a multi-agent LLM ecosystem for internal support.',
    highlights: [
      'Deployed Edge-to-Cloud Multi-Face Recognition with Raspberry Pi 5 + Hailo AI accelerators for 750+ employee attendance',
      'Increased video processing throughput 150% (8 FPS → 20 FPS) by decoupling AI inference via multi-threading',
      'Built production-grade multi-agent LLM ecosystem with a centralized master agent for dynamic query routing',
      'Developed advanced RAG pipeline with Perplexity-style inline citations, boosting document traceability',
    ],
    tags: ['Python', 'Go', 'Raspberry Pi', 'Hailo AI', 'RAG', 'LangGraph', 'FastAPI'],
  },
  {
    period:   'Dec 2024 — Aug 2025',
    duration: '9 mo',
    company:  'Synapsis',
    location: 'Indonesia',
    role:     'Backend Developer',
    type:     'Full-time',
    summary:
      'Built and maintained Go/PostgreSQL microservices for core product features — clean architecture, DDD, and high test coverage were the baseline.',
    highlights: [
      'Developed REST/gRPC APIs in Go + PostgreSQL, following Clean Architecture and Domain-Driven Design',
      'Resolved N+1 query issues and added indexes, measurably improving slow endpoint performance',
      'Achieved 80%+ test coverage on assigned modules through comprehensive unit and integration tests',
      'Delivered API endpoints on time in Agile sprints, resolving cross-service integration issues',
    ],
    tags: ['Go', 'PostgreSQL', 'gRPC', 'Clean Architecture', 'DDD', 'Docker'],
  },
  {
    period:   'Jun 2024 — Aug 2024',
    duration: '3 mo',
    company:  'Telkom Indonesia',
    location: 'Indonesia',
    role:     'Back End Developer',
    type:     'Internship',
    summary:
      "Internship at Indonesia's national telco — built endpoints and services, fixed bugs, and containerized deployment workflows.",
    highlights: [
      'Developed endpoints and services using NestJS, Go, and PostgreSQL',
      'Identified and resolved bugs to guarantee robust and reliable software performance',
      'Streamlined development and deployment via Docker containerization',
      'Facilitated data exchange and collaboration by integrating APIs with partner systems',
    ],
    tags: ['NestJS', 'Go', 'PostgreSQL', 'Docker'],
  },
];
