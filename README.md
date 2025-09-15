<div align="center">

![Alt text](smilling_mascot.png)
# WiggleWorld

### **Turning screen time into active playtime.**

[![Platform](https://img.shields.io/badge/Platform-Web-blue.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-ff69b4.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%20%7C%20WebSockets-orange.svg)](#)

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
- ** Play with YouTube videos: Kids watch YouTube videos and also answer the pop-up questions using gestures.
- ** Parent Control: Parents can create new games with just a video URL.
- ** Live Session Control: Parents can see if their kids are playing or not. If wanted they can put a lock in real time.
- ** AI insights: Get AI insights and feedback about your kid. Our integrated Gemini model, with the help of the youtube api fetches the related viedos for the kid.   

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
## Architecture Overview

**High-Level Flow:**

* **Web (React/TS)** → **REST + WebSockets (Spring Boot)** → **MySQL**   

> **Diagram**: See [`/docs/architecture.png`] (placeholder) and [`/docs/docs.md`] for deeper details.

---

## 🛠️ Tech Stack

**Frontend**: React, TypeScript, React Router, Tailwind CSS  
**Backend**: Spring Boot, REST, WebSockets, JWT/OAuth2  
**Datastores**: PostgreSQL, Redis (cache & session)  
**DevOps**: Docker, Kubernetes, GitHub Actions  
**Integrations**: Google Maps/Places API, Currency API  

---

## Project layout (recommended):
```
/
├── .kiro/                      # Kiro AI assistant configuration
├── app/                        # Next.js App Router pages
│   ├── api/                    # API routes
│   ├── auth-test/              # Authentication testing
│   ├── game/                   # Game-related pages
│   ├── parent/                 # Parent dashboard pages
│   ├── play/                   # Main game play page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout component
│   └── page.tsx                # Home page
├── components/                 # React components
│   ├── auth/                   # Authentication components
│   ├── dashboard/              # Dashboard components
│   ├── game/                   # Game-specific components
│   │   ├── InteractiveVideoGame.tsx
│   │   ├── PoseDetector.tsx
│   │   ├── ScoreBoard.tsx
│   │   ├── WebcamPermission.tsx
│   │   └── WebcamView.tsx
│   ├── providers/              # Context providers
│   ├── ui/                     # Reusable UI components
│   └── [various UI components] # Landing page components
├── contexts/                   # React contexts
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
├── public/                     # Static assets
├── styles/                     # Additional stylesheets
├── types/                      # TypeScript type definitions
├── __tests__/                  # Test files
├── docs/                       # Documentation
│   └── README.md               # This file
├── package.json                # Node.js dependencies
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 📖 API Documentation

* Placeholder OpenAPI spec: [`project/docs/apis/exergame-openapi.yaml`]
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
- **Bug Reports**: Found a bug? [Open an issue](https://github.com/SteveRogersBD/ExerGame-Kiro/issues)
- **Feature Requests**: Have an idea? [Start a discussion](https://github.com/SteveRogersBD/ExerGame-Kiro/discussions)
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Documentation**: Help improve our docs and tutorials
---

## Contact / Author Info

**Aniruddha Biswas**

* GitHub: [https://github.com/SteveRogersBD](https://github.com/SteveRogersBD)
* LinkedIn: [https://linkedin.com/in/Aniruddha Biswas Atanu](https://www.linkedin.com/in/aniruddha-biswas-atanu-16b708228)
* Email: [cd43641@truman.edu](mailto:cd43641@truman.edu)
</div>
