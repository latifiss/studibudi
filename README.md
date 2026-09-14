<div align="center">
  <img src="./app/icon0.svg" alt="Stidibudi logo" width="120" />

  # Stidibudi

  > Turn your study materials into interactive quizzes with AI.
</div>

[![Live Product](https://img.shields.io/badge/Live%20Product-stidibudi.com-111827?style=flat-square)](https://stidibudi.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

Stidibudi is an AI-powered learning platform that converts a learner's own notes and study materials into interactive quizzes. Upload a PDF, Word document, PowerPoint presentation, or other supported material, and Stidibudi uses AI to generate questions grounded in that content.

The product is designed around a simple learning loop: **upload → generate → practice → review → improve**.

## Product

**Live:** [stidibudi.com](https://stidibudi.com)

Stidibudi is built for students, professionals, and independent learners who want a faster way to turn existing study material into active practice.

### Why Stidibudi?

Traditional study materials are mostly passive. Stidibudi turns those materials into an interactive practice experience without requiring the learner to manually write questions and answers.

The generated quizzes are based on the content the learner uploads rather than generic questions unrelated to the source material.

## Features

### AI quiz generation

- Upload study material and generate quizzes from its contents.
- Questions are generated from the uploaded source rather than from a generic topic prompt.
- AI model selection is supported through the application's model/provider layer.
- Generated questions are persisted so learners can return to previous quizzes.

### Interactive learning experience

- Duolingo-inspired quiz interactions designed for fast, focused practice.
- Immediate feedback during a quiz session.
- Correct and incorrect answer states.
- Scores and completion results.
- Review of mistakes after completing a quiz.
- AI-powered explanations to help learners understand difficult questions.
- Sound, motion, and micro-interactions to make practice more engaging.

### Document processing

The application supports a document-to-learning pipeline for extracting usable content from uploaded material, including:

- PDF documents
- Word documents
- PowerPoint presentations
- Other structured study files supported by the application

Document processing is handled server-side before the content is passed into the AI generation workflow.

### Accounts and personalization

- User authentication and sessions.
- Google/social authentication support through the authentication layer.
- User onboarding and profile information.
- Saved quiz history.
- User preferences for AI provider/model selection.
- Notifications and account-level state.

### Billing

Stidibudi includes a production-oriented subscription architecture with Paddle integration for paid plans, subscription lifecycle state, and webhook event tracking.

### Product analytics

PostHog is integrated to understand product usage, activation, engagement, and conversion behavior while the application is being developed and operated as a real SaaS product.

## Product Architecture

At a high level, Stidibudi follows a full-stack application architecture:

```text
┌──────────────────────┐
│      Web Client      │
│   Next.js + React    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Next.js App/API    │
│ Auth · Uploads · AI  │
│ Quizzes · Billing    │
└───────┬───────┬──────┘
        │       │
        │       ├──────────────────────┐
        │       │                      │
        ▼       ▼                      ▼
┌────────────┐ ┌────────────────┐ ┌──────────────┐
│ PostgreSQL │ │ AI Providers   │ │ File Storage │
│ + Prisma   │ │ OpenAI /       │ │ S3-compatible│
│            │ │ OpenRouter     │ │ storage      │
└────────────┘ └────────────────┘ └──────────────┘
        │
        ├───────────────┐
        ▼               ▼
┌──────────────┐  ┌──────────────┐
│   Paddle     │  │   PostHog    │
│   Billing    │  │   Analytics  │
└──────────────┘  └──────────────┘
```

The repository separates application concerns across the Next.js app, reusable components, hooks, shared libraries, data/context layers, and Prisma persistence.

## AI Generation Flow

The core learning pipeline is designed as a sequence of controlled server-side operations:

```text
User uploads study material
          │
          ▼
   File validation
          │
          ▼
   Content extraction
          │
          ▼
   Source normalization
          │
          ▼
   AI quiz generation
          │
          ▼
 Structured question data
          │
          ▼
   Interactive quiz UI
          │
          ▼
 Results + mistakes + explanations
          │
          ▼
      Quiz history
```

This approach keeps the source material at the center of the generation process and makes the resulting quiz reproducible and persistable.

## Data Model

The application uses PostgreSQL with Prisma for relational persistence. The schema includes dedicated models for authentication, uploaded datasets, AI analyses, quizzes, conversations, subscriptions, preferences, and notifications.

Core entities include:

| Model | Responsibility |
| --- | --- |
| `User` | Account identity and user-level relationships |
| `Session` | Authenticated sessions |
| `Account` | OAuth/provider account information |
| `Profile` | User onboarding and profile information |
| `Dataset` | Uploaded study materials and processing state |
| `Analysis` | AI processing/generation records |
| `QuizHistory` | Persisted generated quizzes and results data |
| `ChatSession` | AI learning conversations associated with source material |
| `Message` | Conversation messages |
| `Subscription` | Paddle subscription state |
| `PaddleWebhookEvent` | Idempotent billing webhook tracking |
| `UserPreference` | Preferred AI provider/model |
| `Notification` | User notifications |

The schema also uses explicit status enums for dataset processing, AI analysis, message roles, subscription plans, and subscription states.

## Tech Stack

### Frontend

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Styled Components**
- **Framer Motion** for animation and interaction
- **Zustand** for client state
- **React Hook Form** for form state
- **React Dropzone** for file uploads
- **Sonner** for notifications
- **Lucide React / React Icons** for interface icons

### Backend

- **Next.js Route Handlers / server-side application logic**
- **Node.js**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** for validation
- **Better Auth** for authentication

### AI

- **OpenAI API**
- **OpenRouter** for model/provider flexibility
- **Vercel AI SDK** (`ai`)
- Configurable AI provider/model preferences at the user level

### Files and content processing

- **AWS S3 SDK** and S3-compatible storage support
- **unpdf** for PDF processing
- **Mammoth** for Word document extraction
- **XLSX** tooling for spreadsheet-oriented file processing

### Product infrastructure

- **Vercel** for application hosting
- **Paddle** for subscription billing
- **PostHog** for product analytics
- **Resend** for transactional email capabilities
- **Upstash Redis** integration available in the application stack
- **Inngest** for background/event-driven workflows

### Content and supporting services

- **Sanity** for structured content/CMS capabilities
- **Recharts** and **D3** for data visualization where required
- **Three.js / React Three Fiber** for interactive visual experiences

## Repository Structure

```text
studibudi/
├── app/                    # Next.js App Router pages and API routes
│   └── api/
│       ├── auth/           # Authentication endpoints
│       ├── billing/        # Billing operations
│       ├── generate-quiz/  # AI quiz generation
│       ├── models/         # AI model/provider operations
│       ├── onboarding/     # User onboarding
│       ├── paddle/         # Paddle webhook/integration routes
│       ├── quizzes/        # Quiz operations
│       ├── uploads/        # File upload operations
│       └── posthog-config/ # Analytics configuration
├── components/             # Reusable UI components
├── context/                # React application context
├── data/                   # Application data/configuration
├── hooks/                  # Reusable React hooks
├── lib/                    # Shared server/client utilities
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
├── .env.example            # Example environment configuration
├── next.config.ts          # Next.js configuration
└── package.json             # Dependencies and scripts
```

The API layer is organized around distinct domains such as authentication, billing, quiz generation, uploads, models, onboarding, and quizzes.

## Getting Started

### Prerequisites

Before running Stidibudi locally, make sure you have:

- Node.js 20+
- npm, pnpm, yarn, or Bun
- A PostgreSQL database
- Credentials for the external services required by the features you want to run locally

### 1. Clone the repository

```bash
git clone https://github.com/latifiss/studibudi.git
cd studibudi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

The repository includes a `.env.example` for local configuration.

Depending on the features you enable, additional environment variables are required for the database, authentication, AI providers, storage, billing, email, analytics, and other integrations.

**Never commit production credentials, API keys, OAuth secrets, database credentials, or webhook secrets to Git.**

### 4. Configure PostgreSQL

Set the database connection required by Prisma in your local environment.

Then generate the Prisma client and apply the database schema/migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

For a production deployment, the project build script uses:

```bash
prisma migrate deploy && next build
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Apply production Prisma migrations and build the application |
| `npm run start` | Start the production Next.js server |
| `npm run lint` | Run ESLint |
| `npm run postinstall` | Generate the Prisma client |

## Environment Configuration

The application relies on external services for several production capabilities. A typical deployment requires configuration for areas such as:

```text
Database
├── PostgreSQL connection
└── Prisma configuration

Authentication
├── Better Auth
└── OAuth providers

AI
├── OpenAI
└── OpenRouter

Storage
└── S3-compatible object storage

Billing
└── Paddle

Analytics
└── PostHog

Email
└── Resend

Infrastructure / Jobs
├── Vercel
├── Upstash
└── Inngest
```

Only the variables necessary for enabled features should be configured in a local environment.

## Production Considerations

Stidibudi is structured as a SaaS application rather than a simple client-side demo. Several parts of the architecture are designed around production concerns:

- Server-side AI requests keep provider credentials away from the browser.
- Prisma provides structured persistence for users, source documents, quizzes, conversations, and subscriptions.
- Dataset and analysis records track processing state and failures.
- Paddle webhook events are persisted so billing events can be tracked and processed safely.
- User-level provider/model preferences allow the AI layer to evolve independently of the UI.
- PostHog provides product-level observability and usage analytics.
- API routes are organized by domain rather than placing all server logic in a single endpoint.

## Security Notes

When deploying your own instance:

1. Keep all secrets in your deployment platform's environment-variable manager.
2. Do not expose AI provider keys to client-side code.
3. Validate uploaded files before processing them.
4. Restrict upload size and supported file types according to your deployment requirements.
5. Validate authenticated access before reading or modifying user-owned datasets and quizzes.
6. Verify Paddle webhook authenticity before applying billing state changes.
7. Review CORS policy before exposing production API endpoints publicly.
8. Use HTTPS in production.

## Deployment

Stidibudi is designed to run well on Vercel with a managed PostgreSQL database and the external services described above.

A typical deployment flow is:

```text
Git push
   │
   ▼
Vercel build
   │
   ├── Install dependencies
   ├── Generate Prisma client
   ├── Deploy Prisma migrations
   └── Build Next.js application
   │
   ▼
Production deployment
```

Before deploying, configure the required environment variables and production database connection in your hosting environment.

## Product Metrics

Stidibudi is a live commercial SaaS product rather than a purely experimental project.

Current product signals include:

- **12+ paying users**
- **2,000+ quizzes generated per month**
- **1,800+ unique visitors over a recent 7-day period**
- **2,300+ sessions over a recent 7-day period**

These numbers are tracked through the product's analytics infrastructure and change over time.

## Design & Product Philosophy

Stidibudi was built around a few product principles:

### Start with the learner's material

The learner should not have to rewrite or reorganize their notes before they can practice. Their existing material is the source of the learning experience.

### Reduce friction between reading and practice

The path from document to quiz should be short enough that learners can generate a practice session without interrupting their study flow.

### Make feedback useful

A wrong answer should be more than a red state. Mistake review and explanations are part of the learning loop.

### Treat the product as a real SaaS

Authentication, persistence, billing, analytics, onboarding, notifications, and operational concerns are part of the product architecture rather than afterthoughts.

## Roadmap

Potential areas for continued development include:

- Smarter retrieval and source-grounding for larger documents
- More quiz formats and question types
- Adaptive difficulty based on learner performance
- Spaced repetition and review scheduling
- More detailed learning analytics
- Improved caching and background processing for high-volume generation
- Additional AI providers and model routing
- Expanded collaboration and sharing workflows
- Mobile-first learning experiences

## Development Notes

The project uses Next.js with the App Router and a server/client split appropriate for a full-stack SaaS application. File processing dependencies are configured for server-side document processing.

The repository also contains dedicated API domains for authentication, billing, quiz generation, model management, onboarding, uploads, and quiz history, making it possible to extend individual product capabilities without coupling the entire application to one endpoint.

## Contributing

Stidibudi is currently maintained as an independent product project. Contributions, ideas, and issue reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run linting and relevant checks locally.
5. Open a pull request with a clear description of the change.

## License

See the repository for the applicable license and usage terms.

## Author

Built by **Latif Issaka**.

- Portfolio: [latifissaka-seven.vercel.app](https://latifissaka-seven.vercel.app/)
- GitHub: [@latifiss](https://github.com/latifiss)
- Product: [stidibudi.com](https://stidibudi.com)

---

<div align="center">
  <strong>Stidibudi</strong> · Learn from what you already have.
</div>
