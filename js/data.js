const PORTFOLIO_DATA = {
  meta: {
    name: "Siddhesh Desai",
    title: "AI & Data Engineer",
    tagline: "I build scalable data pipelines and multi-agent AI systems.",
    email: "siddheshdesai777@gmail.com",
    linkedin: "https://linkedin.com/in/thesiddheshdesai",
    github: "https://github.com/siddhesh-desai",
    twitter: "https://twitter.com/siddheshdesai_",
    resume: "assets/resume.pdf",
  },

  about: [
    'I\'m an engineer who specializes in building data infrastructure and AI systems that work at scale. Currently at <a href="https://www.data-axle.com/" target="_blank" rel="noopener">Data Axle</a>, I architect ETL pipelines processing millions of records on AWS and build synthetic data frameworks that unblock entire engineering teams.',
    'Previously, I\'ve designed multi-agent AI systems at <a href="#experience">Qest</a>, fine-tuned LLMs for clients like Apple at <a href="#experience">Turing</a>, and built NLP pipelines for customer intelligence at <a href="#experience">Coinbase</a>. I\'ve won multiple national-level hackathons including Smart India Hackathon (twice) and Citi Bank Hackathon.',
    'My focus is on the intersection of data engineering and AI - making models work in production, not just in notebooks. I care about clean pipelines, reliable inference, and systems that ship.',
  ],

  // image: optional path to thumbnail (e.g. "assets/img/company.png")
  // link: optional URL, makes the card clickable to open in new tab
  experience: [
    {
      role: "AI & Data Engineer",
      company: "Data Axle",
      date: "2025 - Present",
      image: null,
      link: null,
      bullets: [
        "Architecting scalable ETL/ELT pipelines on AWS using Spark, processing millions of records daily",
        "Built org-wide synthetic data generator framework, reducing data dependency bottlenecks by 40%",
        "Implemented unified authentication via Keycloak and automated Superset dashboards for cross-team analytics",
        "Managed CI/CD deployments on AWS with GitHub Actions, ECS, and ECR",
      ],
      tags: ["Python", "PySpark", "AWS", "Docker", "Airflow", "PostgreSQL"],
    },
    {
      role: "Generative AI Engineer Intern",
      company: "Qest",
      date: "2025",
      image: null,
      link: null,
      bullets: [
        "Designed backend framework for multi-agent AI systems and MCP Servers",
        "Built FastAPI-based microservices for autonomous agent deployment and orchestration",
        "Developed production-grade LangGraph workflows for complex reasoning tasks",
      ],
      tags: ["LangGraph", "FastAPI", "LLMs", "Multi-Agent", "Python"],
    },
    {
      role: "Data Analyst Intern",
      company: "Turing",
      date: "2024 - 2025",
      image: null,
      link: null,
      bullets: [
        "Fine-tuned LLMs using RLHF, SFT, and DPO techniques for high-profile clients including Apple",
        "Reduced model hallucinations in production systems through advanced NLP optimization",
        "Delivered measurable model quality improvements across Data Science and ML tasks",
      ],
      tags: ["LLMs", "RLHF", "NLP", "Python"],
    },
    {
      role: "Machine Learning Intern",
      company: "Coinbase",
      date: "2024",
      image: null,
      link: null,
      bullets: [
        "Built end-to-end LLM-powered pipeline for extracting customer and HR insights at scale",
        "Developed NLP-based topic clustering and categorization system for support data",
        "Delivered actionable intelligence from extensive datasets, improving operational efficiency",
      ],
      tags: ["LLMs", "NLP", "Python", "Machine Learning"],
    },
  ],

  leadership: [
    {
      role: "Research Ambassador",
      org: "Springer Nature",
      date: "2024 - Present",
      description: "Supporting researchers through publication strategies, contributing to the global research community.",
    },
    {
      role: "President",
      org: "Abhivriddhi - Student Training & Development, VIT Pune",
      date: "2023 - 2024",
      description: "Led 140+ members, driving 200% growth. Managed large-scale events impacting 1000+ students.",
    },
  ],

  featuredProjects: [
    {
      title: "citiGPT",
      description: "Personalized AI assistant providing real-time access to financial data and Citibank services. End-to-end LLM-powered financial intelligence platform.",
      tags: ["LLM", "RAG", "FastAPI", "React"],
      github: "https://github.com/siddhesh-desai/citiGPT",
      badge: "Citi Bank Hackathon Winner",
      image: null,
    },
    {
      title: "LadleVision",
      description: "Computer Vision based ladle tracking system for steel manufacturing plants. Real-time object detection and tracking pipeline for industrial automation.",
      tags: ["Computer Vision", "TensorFlow", "Python", "IoT"],
      github: "https://github.com/siddhesh-desai/LadleVision",
      badge: "SIH 2023 Winner",
      image: null,
    },
    {
      title: "SlideAI",
      description: "Automatic PowerPoint presentation maker using AI. Generates professional slides from plain text with smart layouts. 100+ stars on GitHub.",
      tags: ["Python", "LLM", "Automation"],
      github: "https://github.com/siddhesh-desai/SlideAI",
      badge: "100+ Stars",
      image: null,
    },
    {
      title: "Multi-Agent AI Framework",
      description: "Backend framework for orchestrating multi-agent AI systems with MCP Servers. Autonomous agent deployment via FastAPI microservices.",
      tags: ["LangGraph", "FastAPI", "MCP", "Multi-Agent"],
      github: null,
      badge: "Built at Qest",
      image: null,
    },
  ],

  archive: [
    { year: "2025", title: "Synthetic Data Generator", tags: ["Python", "PySpark", "AWS"], madeAt: "Data Axle", github: null, demo: null, badge: "Production" },
    { year: "2025", title: "Multi-Agent AI Framework", tags: ["LangGraph", "FastAPI", "MCP"], madeAt: "Qest", github: null, demo: null, badge: null },
    { year: "2024", title: "citiGPT", tags: ["LLM", "RAG", "FastAPI", "React"], madeAt: null, github: "https://github.com/siddhesh-desai/citiGPT", demo: null, badge: "Hackathon Winner" },
    { year: "2024", title: "LLM Insights Pipeline", tags: ["LLM", "NLP", "Python"], madeAt: "Coinbase", github: null, demo: null, badge: null },
    { year: "2023", title: "LadleVision", tags: ["Computer Vision", "TensorFlow", "IoT"], madeAt: null, github: "https://github.com/siddhesh-desai/LadleVision", demo: null, badge: "SIH Winner" },
    { year: "2023", title: "SlideAI", tags: ["Python", "LLM", "Automation"], madeAt: null, github: "https://github.com/siddhesh-desai/SlideAI", demo: null, badge: "100+ Stars" },
    { year: "2023", title: "WorkerConnect", tags: ["React", "Django", "PostgreSQL"], madeAt: null, github: "https://github.com/siddhesh-desai/Worker-Connect", demo: null, badge: null },
    { year: "2022", title: "SIH 2022 Project", tags: ["Python", "ML"], madeAt: null, github: null, demo: null, badge: "SIH Winner" },
  ],

  achievements: [
    { title: "Citi Bank Hackathon 2024 - Winners", description: "Built citiGPT, an AI financial assistant. Winning project among top engineering teams.", year: "2024", link: null, image: null },
    { title: "Smart India Hackathon 2023 - Winners", description: "Built LadleVision for steel plant automation. National-level, Government of India.", year: "2023", link: null, image: null },
    { title: "Smart India Hackathon 2022 - Winners", description: "Won the national-level SIH, competing against thousands of teams across India.", year: "2022", link: null, image: null },
    { title: "Unscript Rookies Hackathon - Winners", description: "Won with an innovative solution among hundreds of competing teams.", year: "2022", link: null, image: null },
    { title: "Coding Ninjas Founders Meet - Top 100", description: "Recognized among top 100 coders in the national challenge.", year: "2023", link: null, image: null },
    { title: "Electhon 2023 - Finalists", description: "Reached the finals of a competitive national-level hackathon.", year: "2023", link: null, image: null },
  ],

  neuralNet: {
    sections: ["about", "experience", "projects", "achievements"],
  },
};
