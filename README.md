<div align="center">

# 🌍 WiggleWorld

### **Turning screen time into active playtime.**

[![Platform](https://img.shields.io/badge/Platform-Web-blue.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-ff69b4.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%20%7C%20WebSockets-orange.svg)](#)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Docker%20%7C%20K8s%20%7C%20GitHub%20Actions-black.svg)](#)
[![Version](https://img.shields.io/badge/Version-1.0.0-yellow.svg)](#)

*A collaborative trip-planning platform where friends create shared itineraries, pin places on interactive maps, split expenses, and keep all travel details organized in one place.*

[🌐 Live Demo](#demo--screenshots) • [🚀 Features](#-features) • [📖 Docs](#-documentation) • [🤝 Contributing](#-contributing-guidelines)

</div>

---

## Overview
WiggleWorld is a kid-friendly **exergame** that blends interactive cartoons with real-time **pose detection**. While a video plays, the game recognizes simple movements (jump, squat, clap, raise hand) to let kids “answer” questions with their bodies. Parents can assign homework (preset videos + questions), and the app tracks basic activity counts and scores.

**Highlights**
- Browser-based (Next.js) with **MediaPipe Pose Landmarker (WASM)** for on-device CV.
- Spring Boot + MySQL backend with clean **OpenAPI** docs for easy integration.
- Kid-centric UI (mascots, big buttons, bright colors), parent dashboard for assignments.

---

## Features
- 🎥 **Interactive Video Gameplay** — pause at key timestamps; detect a move; resume.
- 🧒 **Kid-robust Gestures** — jump, squat, clap, raise left/right hand.
- ✅ **One-Shot Demo Flow** — first pause shows **“Jump detected!”**, increments **jump** and **score**, then continues.
- 📚 **Homework Assignments** — parents assign preset videos and questions.
- 📈 **Progress Tracking** — counts for jumps/squats/claps; simple scoring.
- 🔐 **Typed APIs** — single source of truth via `exergame-openapi.yaml`.

> Minimal game demo behavior per hackathon scope: after the **first question timestamp**, the video pauses for **5 seconds**, shows **Jump detected!** (updates jump + score), then continues with no further UI changes.

---

## Tech Stack
**Frontend**
- **Next.js (App Router)**, **React**, **TypeScript**
- **Tailwind CSS**, **lucide-react**
- **YouTube IFrame API** (embedded video)
- **@mediapipe/tasks-vision** (Pose Landmarker WASM)

**Backend**
- **Spring Boot** (Java 17)
- **MySQL 8**
- **Spring Data JPA/Hibernate**
- **OpenAPI 3** (`project/docs/apis/exergame-openapi.yaml`)

**Dev/Infra**
- Maven, Node.js ≥ 18

## Installation Guide
Download the zip file posted on Devpost. Then use the following command:
Step 1) Download and install Node
```bash
npm install
```
Step 2) run the front end (it will run on **port 3000**)
```bash
npm run dev
```
Step 3) run the backend (make sure to run **Docker Desktop** before this command)
```bash
docker compose up
```
## 🏗️ Architecture Overview

**High-Level Flow:**

* **Web (React/TS)** → **REST + WebSockets (Spring Boot)** → **PostgreSQL** / **Redis (cache)**  
* **Dockerized services** → **Kubernetes (GKE)** → **CI/CD with GitHub Actions**  

> **Diagram**: See [`/docs/architecture.png`] (placeholder) and [`/docs/docs.md`] for deeper details.

---

## 🛠️ Tech Stack

**Frontend**: React, TypeScript, React Router, Tailwind CSS  
**Backend**: Spring Boot, REST, WebSockets, JWT/OAuth2  
**Datastores**: PostgreSQL, Redis (cache & session)  
**DevOps**: Docker, Kubernetes, GitHub Actions  
**Integrations**: Google Maps/Places API, Currency API  

---

## ⚡ Getting Started / Installation

```bash
# clone
git clone https://github.com/your-username/travelmate.git
cd travelmate

# frontend setup
cd frontend
npm install
npm run dev
```
Project layout (recommended):
```
travelmate/
├── frontend/            # React + TS app
│   ├── src/
│   │   ├── api/        # axios client
│   │   ├── components/ # UI components
│   │   ├── pages/      # TripBoard, Map, Itinerary, Expenses
│   │   └── store/      # state management
│   └── public/
├── backend/             # Spring Boot service
└── docs/                # docs.md, ERD, diagrams
```

---

## 🔑 Environment Variables

Create a `.env` inside `frontend/` (Vite uses `VITE_` prefix):

```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=InterviewPrep.io
```

*(Backend secrets—`DB_URL`, `REDIS_URL`, `JWT_SECRET`, etc.—will live in `backend/.env` or your K8s secrets.)*

---

## ▶️ Usage / Quick Start

1. Start the frontend: `npm run dev` and open **[http://localhost:5173](http://localhost:5173)**.
2. By default, the app uses **mocked API** responses for booking, room, and feedback.
3. When the backend is ready, set `VITE_API_BASE_URL` and toggle `useMock=false` in the API client.

**Sample Flows (MVP):**

* **Book a Slot** → pick a time → confirm → see it under *My Sessions*.
* **Join Room** → coding editor opens → chat appears → timer starts.
* **Submit Feedback** → rubric scores + notes → stored locally/mock persisted.

---

## 📖 API Documentation

* Placeholder OpenAPI spec: \[`/docs/openapi.yaml`] *(to be generated when backend is scaffolded)*
* Core endpoints (planned):

  * `POST /auth/login`, `POST /auth/register`
  * `GET /slots`, `POST /bookings`, `GET /bookings/:id`
  * `GET /rooms/:id` (WS handshake), `POST /feedback`

---

## 🗄️ Database Schema / ER Diagram

Entities (planned): **User, Slot, Booking, Room, Message, Feedback, Rubric**

* ERD placeholder: \[`/docs/erd.png`]
* Migrations (planned): Flyway or Liquibase in `/backend`.

---

## 🧪 Testing

**Frontend**: Jest + React Testing Library, Playwright for E2E.

**Backend (planned)**: JUnit, Mockito, Spring MockMvc.

---

## 🚀 Deployment Instructions

* **Frontend**: build with `npm run build`, deploy static assets to Vercel/Netlify or Nginx.
* **Backend**: containerize, push to **GCR**, deploy to **GKE** with Helm/Kustomize.
* **CI/CD**: GitHub Actions workflows for lint/test/build/deploy.

---

## 🔒 Security Notes

* Role‑based access control (candidate/interviewer)
* JWT access tokens; refresh tokens; secure cookie options in production
* CSRF protection for non‑idempotent routes; strict CORS
* Rate limiting on auth and booking endpoints
* WebSocket auth via token on connect

---

## 📊 Performance & Observability

* Redis caching for slot lookups and session presence
* Zipkin for distributed tracing across API calls & WS events
* Prometheus metrics: latency, error rate, WS connections, queue depth
* Frontend Web Vitals reporting (CLS/LCP/TTI)

---

## 🗺️ Roadmap / Future Work

* [x] Frontend MVP with mocks
* [x] Spring Boot backend with REST + WS
* [ ] CI/CD pipelines (Actions)
* [ ] GKE deployment with autoscaling
* [ ] Interviewer dashboards & analytics
* [ ] Calendar sync (Google/Microsoft)
* [ ] Payments (Stripe) for premium features

---

## 🤝 Contributing Guidelines

Pull requests are welcome! For major changes, open an issue first to discuss scope/design.

**Branching**: `feat/*`, `fix/*`, `chore/*`
**Commit style**: Conventional Commits
**PR checklist**: tests, docs, accessible UI, screenshots for UI changes

---
## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 **Bug Reports**: Found a bug? [Open an issue](https://github.com/SteveRogersBD/ExerGame-Kiro/issues)
- 💡 **Feature Requests**: Have an idea? [Start a discussion](https://github.com/SteveRogersBD/ExerGame-Kiro/discussions)
- 🔧 **Code Contributions**: Submit pull requests for bug fixes or new features
- 📖 **Documentation**: Help improve our docs and tutorials
---

## 👤 Contact / Author Info

**Aniruddha Biswas**

* GitHub: [https://github.com/SteveRogersBD](https://github.com/SteveRogersBD)
* LinkedIn: [https://linkedin.com/in/your-profile](https://www.linkedin.com/in/aniruddha-biswas-atanu-16b708228)
* Email: [cd43641@truman.edu](mailto:cd43641@truman.edu)
</div>
