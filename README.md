# Staff Fullstack Engineer Portfolio

A production-oriented monorepo showcasing modern full-stack engineering, 
cloud-native architecture, DevOps automation, testing strategy, IaC, and 
scalable frontend/backend applications.

**9+ Years of Professional Software Engineering Experience**

### Live Demo
[portfolio-link.com] <!-- Apnar deploy link bosaben -->

### Tech Stack
**Frontend**: React, Vite, Next.js, TypeScript, Tailwind  
**Backend**: Node.js, Python, Django, FastAPI  
**Database**: PostgreSQL, Prisma, Redis  
**Cloud & DevOps**: Docker, Kubernetes, Terraform, AWS, GitHub Actions  
**Testing**: Playwright, Jest, E2E, Integration, Unit  
**Other**: WebSockets, REST, GraphQL, CI/CD, Security Scanning

### Repository Highlights
| Area | What’s Inside |
| --- | --- |
| **Infrastructure** | `infra/k8s/` - K8s manifests, `infra/terraform/` - IaC |
| **Automation** | `.github/workflows/` - CI, CD, Security Scan, Lighthouse, SDK Gen |
| **Frontend** | `src/features/` - Modular, Component-driven architecture |
| **Backend** | `packages/prisma/` - Shared DB layer, API validation |
| **Testing** | `tests/` - Unit, Integration, E2E with Playwright |
| **Case Studies** | `src/features/caseStudies/` - Real-world scaling problems & solutions |

### Engineering Principles
1.  **Clean Architecture** - Separation of Concerns
2.  **Infrastructure as Code** - Everything versioned
3.  **Security First** - Automated security scans in CI
4.  **Quality Gates** - Lint, Test, Lighthouse before deploy
5.  **Scalability** - Built for 50K+ RPM

### Engineering Workflow
`Develop` → `Test` → `Lint` → `Security Scan` → `Lighthouse` → `Build` → `Deploy`

### Core Expertise
- Full Stack Engineering: React, Next.js, Django, FastAPI, Node.js
- System Design & Performance Engineering
- Cloud-Native: Docker & Kubernetes
- DevOps & Automation: Terraform, CI/CD
- Testing & Quality Engineering

### Professional Experience
9+ years designing production-ready applications, modular frontend systems, 
scalable backend services, infrastructure automation, and cloud-native deployments.

### License
MIT


Portfolio/
|.github/
└── workflows/
|    ├── platform-orchestrator.yml 
|    │
|    ├── ci.yml
|    ├── cd.yml
|    ├── security-scan.yml
|    ├── lighthouse.yml
|    └── sdk-generation-prerelease.yml
├── infra/
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   └── kustomization.yaml
│   │
│   ├── terraform/
│   │   ├── backend.tf
│   │   └── main.tf
│   │
│   └── Orchestrator.mk
│
├── packages/
│   └── prisma/
│       ├── api response/
│       │   ├── index.js
│       │   └── validation.js
│       │
│       ├── UnifiedPersistenceFabric.js
│       ├── client.js
│       └── index.js
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── scripts/
│   ├── apex-orchestrator.sh
│   ├── deploy.sh
│   ├── seed.ts
│   └── setup.sh
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── features/
│   │   │   │
│   │   │   ├── caseStudies/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ArchitectureBreakdown.jsx
│   │   │   │   │   ├── CaseStudyCard.jsx
│   │   │   │   │   ├── CaseStudyDetails.jsx
│   │   │   │   │   ├── LessonsLearned.jsx
│   │   │   │   │   ├── ProblemStatement.jsx
│   │   │   │   │   ├── ScalingStrategy.jsx
│   │   │   │   │   ├── SolutionOverview.jsx
│   │   │   │   │   └── TradeOffAnalysis.jsx
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── ApiClient.js
│   │   │   │   │   ├── CacheManager.js
│   │   │   │   │   └── TelemetryEngine.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── useAsyncPipeline.js
│   │   │   │   │   ├── useDebounceState.js
│   │   │   │   │   └── useEventStream.js
│   │   │   │   │
│   │   │   │   ├── CaseStudiesHyperscaleOperationalEngine.jsx
│   │   │   │   └── CaseStudiesPage.jsx
│   │   │   │
│   │   │   ├── certifications/
│   │   │   │   ├── components/
│   │   │   │   │   ├── CertificateViewer.jsx
│   │   │   │   │   ├── CertificationCard.jsx
│   │   │   │   │   ├── CertificationDetails.jsx
│   │   │   │   │   ├── SkillsFromCertification.jsx
│   │   │   │   │   └── VerificationLink.jsx
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useClusterMatrix.js
│   │   │   │   │   ├── useQuantumDebounce.js
│   │   │   │   │   ├── useTelemetryPipeline.js
│   │   │   │   │   └── useVirtualScrollManager.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── EdgeCacheTelemetry.service.js
│   │   │   │   │   ├── LoggerConsole.service.js
│   │   │   │   │   ├── MultiTenantInversion.service.js
│   │   │   │   │   ├── SecurityAuthority.service.js
│   │   │   │   │   └── certification.manifest.json
│   │   │   │   │
│   │   │   │   ├── CertificationsHyperscaleEnterpriseRouter.jsx
│   │   │   │   └── CertificationsPage.jsx
│   │   │   │
│   │   │   ├── experience/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AchievementList.jsx
│   │   │   │   │   ├── ExperienceCard.jsx
│   │   │   │   │   ├── ExperienceTimeline.jsx
│   │   │   │   │   ├── ImpactMetrics.jsx
│   │   │   │   │   ├── RoleDetails.jsx
│   │   │   │   │   └── TechUsed.jsx
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useExperience.js
│   │   │   │   │   └── useExperienceFilter.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── experienceAPI.js
│   │   │   │   │   ├── experienceData.json
│   │   │   │   │   └── experienceTelemetry.js
│   │   │   │   │
│   │   │   │   ├── ExperienceDashboard.jsx
│   │   │   │   └── ExperiencePage.jsx
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProjectArchitecture.jsx
│   │   │   │   │   ├── ProjectCard.jsx
│   │   │   │   │   ├── ProjectDetails.jsx
│   │   │   │   │   ├── ProjectFilters.jsx
│   │   │   │   │   ├── ProjectGallery.jsx
│   │   │   │   │   ├── ProjectGitHub.jsx
│   │   │   │   │   ├── ProjectGrid.jsx
│   │   │   │   │   ├── ProjectLiveDemo.jsx
│   │   │   │   │   ├── ProjectMetrics.jsx
│   │   │   │   │   ├── ProjectSearch.jsx
│   │   │   │   │   └── ProjectTechStack.jsx
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useProjects.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   └── projectAPI.js
│   │   │   │   │
│   │   │   │   ├── ProjectsOperationalFabric.jsx
│   │   │   │   └── ProjectsPage.jsx
│   │   │   │
│   │   │   └── skills/
│   │   │       ├── components/
│   │   │       │   ├── LearningTimeline.jsx
│   │   │       │   ├── SkillCard.jsx
│   │   │       │   ├── SkillCategory.jsx
│   │   │       │   ├── SkillGraph.jsx
│   │   │       │   ├── SkillProgress.jsx
│   │   │       │   └── TechStackVisualizer.jsx
│   │   │       │
│   │   │       ├── hooks/
│   │   │       │   └── usePrismaProfiler.js
│   │   │       │
│   │   │       ├── services/
│   │   │       │   ├── RegistryIngress.js
│   │   │       │   └── SchemaValidator.js
│   │   │       │
│   │   │       ├── SkillsPage.jsx
│   │   │       └── SkillsQuantumOperationalMatrix.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── footer.jsx
│   │   │   ├── layout-kernel-injector.sh
│   │   │   ├── navbar.jsx
│   │   │   └── sidebar.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── card.jsx
│   │   │   ├── contact.jsx
│   │   │   ├── dialog.jsx
│   │   │   └── input.jsx
│   │   │
│   │   ├── DockerFile
│   │   ├── button.jsx
│   │   ├── next.config.js
│   │   ├── server.js
│   │   ├── tsconfig.json
│   │   └── workspace-core-injector.sh
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── tests/
│   ├── e2e/
│   │   ├── AuthenticationMocks.ts
│   │   └── playwright.config.js
│   │
│   ├── integration/
│   │   ├── NodeExpressIngress.spec.ts
│   │   ├── PostgresConnectionPool.spec.ts
│   │   └── PrismaInfraPipeline.spec.ts
│   │
│   ├── unit/
│   │   ├── ReduxGlobalSlices.test.ts
│   │   └── RegistryIngress.test.js
│   │
│   └── UnifiedEnterpriseCluster.spec.ts
│
├── .docker-compose.yml
├── .env.example.js
├── .gitignore
├── .oxlintrc.json
├── .pnpm-workspace.yaml
├── .turbo.json
├── CaseStudyDetails.jsx
├── README.md
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js 
