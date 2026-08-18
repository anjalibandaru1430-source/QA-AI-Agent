# QAgent — AI-Powered Quality Engineering Platform

> **From Product Requirements to Automated Tests — Automatically.**

**QAgent** is a commercial-grade, developer-first AI-Powered Quality Engineering SaaS platform built for high-velocity engineering and QA automation teams. It transforms unstructured Product Requirements Documents (PRDs) into comprehensive test cases, emits enterprise Page Object Model Playwright test suites, orchestrates multi-worker test runs in real time, diagnoses assertion and selector failures with AI, provides interactive self-healing code diffs, automatically creates Jira bug tickets, and generates stakeholder delivery reports with one-click email distribution.

---

## 🚀 Key Highlights & Capabilities

- **Automated PRD Ingestion & AI Analysis**: Drag-and-drop or paste requirements in PDF, DOCX, TXT, or Markdown. The AI agent pipeline extracts user journeys, acceptance criteria, risk ratings, and boundary conditions.
- **Categorized Test Scenarios**: Generates Functional, Negative, Boundary, Security, Performance, and Accessibility scenarios.
- **32+ Detailed Test Cases with AI Quality Scores**: Evaluates requirement coverage, edge-case resilience, selector stability, and assertion quality (0–100 scale).
- **Playwright TypeScript Code Generator with Monaco**: Page Object Models (`LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutPage.ts`) with explicit auto-waiting assertions and resilient selectors.
- **Real-Time Live Execution Center**:
  - Live SauceDemo browser preview streaming test actions.
  - Streaming xterm.js terminal with color-coded ANSI output.
  - 4 parallel worker visualization grid.
  - Test inspection drawer with step logs, screenshots, console logs, and network requests.
- **AI Failure Diagnostics & Self-Healing Engine**: Isolates API payload mismatches and selector shifts with 96% confidence, generating interactive side-by-side code diffs with 1-click **Apply Fix**.
- **Jira Integration**: 1-click defect synchronization creating Jira issues with formatted reproduction steps, stack traces, and screenshots.
- **Executive Delivery Reports & Email Dispatch**: Summary metrics, requirement coverage matrix, downloadable PDF, CSV/JSON exports, and Nodemailer email delivery with live HTML previews.
- **AI Agent React Flow Topology**: Interactive visual pipeline graph tracking all 8 AI agents in real time.
- **Global Command Palette (`Ctrl+K`) & Universal Search**: Lightning-fast keyboard navigation across all entities.

---

## 🛠 Tech Stack

### Frontend (`apps/web`)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design System tokens (Linear / Vercel dark theme)
- **State Management**: Zustand + TanStack Query
- **Animations**: Framer Motion
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Terminal**: xterm.js (`@xterm/xterm` + `@xterm/addon-fit`)
- **Charts & Visuals**: Recharts + Lucide Icons + Canvas-Confetti
- **Document Export**: jsPDF + HTML Canvas

### Backend (`apps/server`)
- **Runtime**: Node.js + TypeScript (ESM) + Express
- **Real-Time Streaming**: WebSockets (`ws`)
- **Automation Runner**: Playwright Test Engine & Simulator
- **Integrations**: Atlassian Jira REST API + Nodemailer SMTP Transporter
- **Validation**: Zod Schemas

---

## 📂 Project Structure

```text
qagent/
├── apps/
│   ├── web/                     # React Vite Frontend Application
│   │   ├── src/
│   │   │   ├── components/      # Common UI components, Modals, Drawers, Layout
│   │   │   ├── features/        # Landing, Dashboard, PRD, Scenarios, Test Cases,
│   │   │   │                    # CodeGen, Execution, Failures, Bugs, Reports, Agents
│   │   │   ├── stores/          # Zustand stores (project, execution, notifications, theme)
│   │   │   ├── services/        # REST API & WebSocket Client
│   │   │   ├── App.tsx          # App Routes
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   └── server/                  # Node.js Express & WebSocket Backend
│       ├── src/
│       │   ├── agents/          # RequirementAgent, ScenarioAgent, TestCaseAgent,
│       │   │                    # CodeGenAgent, FailureAgent, SelfHealingAgent, BugAgent
│       │   ├── automation/      # PlaywrightRunner & Parallel Dispatcher
│       │   ├── database/        # In-Memory DB pre-seeded with SauceDemo QA Project
│       │   ├── integrations/    # Jira REST Client & Nodemailer Email Service
│       │   ├── routes/          # Express API Router
│       │   ├── websocket/       # WebSocket Server for Real-Time Streaming
│       │   └── app.ts           # Server Entrypoint
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared TypeScript types, Zod schemas, Sample PRD
│       ├── src/
│       └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Dev Server (Frontend + Backend)
```bash
npm run dev
```
- **Web UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **WebSocket Stream**: `ws://localhost:4000/ws`

---

## 🎬 Hackathon Demo Flow (3–5 Minutes)

1. **Landing Page**: Open `http://localhost:5173` → Click **Start Testing**.
2. **Dashboard**: Inspect the 8 KPI stat cards, Recharts execution trends, and failure categories for **SauceDemo QA Project**.
3. **PRD Ingestion**: Navigate to **PRD Ingestion** → Click **Load Sample SauceDemo PRD** → Click **Analyze with AI** → Watch the 5-step milestone timeline.
4. **Test Scenarios**: Review the 12 categorized scenarios (Functional, Security, Negative, Boundary) → Click **Approve All**.
5. **Test Cases**: Inspect 32 detailed test cases with AI Quality Scores (92-99/100) → Click **Export CSV** or click a row to view steps in the side drawer.
6. **Playwright Code Generation**: Open **Code Generation** → Inspect `LoginPage.ts` & `auth.spec.ts` in Monaco Editor → Click **AI Optimize** / **AI Explain**.
7. **Live Execution Center**: Navigate to **Execution Center** → Click **Run All Tests (32)** → Watch live parallel execution across 4 workers, interactive browser viewport simulation, and streaming terminal logs.
8. **Failure Diagnostics & Self-Healing**: Open **Failure Analysis** → Inspect root cause for `TC-AUTH-004` (lockout message mismatch) → Click **Apply Self-Healing Fix** to review the code diff.
9. **Jira Bug Tracking**: Open **Jira Bugs** → Click **Create Jira Issue** → Confirm issue key `QA-1042` generated and linked.
10. **Delivery Reports**: Open **Execution Reports** → Review executive summary and coverage matrix → Click **Download PDF** → Click **Email Executive Report** and dispatch via Nodemailer.
11. **AI Agents Pipeline**: Open **AI Agents Pipeline** to inspect the active 8-agent topology.
