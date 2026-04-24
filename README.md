# 🚀 KaroStartup – Automated Investment Thesis Generator

> Upload a startup pitch deck → Get a structured AI-powered investment thesis PDF.

---

## 📁 Repository Structure

```
karostartup-thesis-gen/
├── frontend/        ← React 18 web app (your task)
├── backend/         ← Node.js + Express API server
├── shared/          ← Shared types/constants between frontend & backend
└── README.md
```

## 👥 Team Split

| Folder | Owner | Tech |
|--------|-------|------|
| `frontend/` | Frontend Dev | React 18, TailwindCSS |
| `backend/` | Backend Dev | Node.js 20, Express 4, Python 3.11, PostgreSQL 15 |

---

## 🔧 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+

### Clone
```bash
git clone https://github.com/YOUR_ORG/karostartup-thesis-gen.git
cd karostartup-thesis-gen
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env        # fill in VITE_API_URL
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env        # fill in all secrets
npm run dev
```

---

## 🌿 Git Branching Convention

```
main              ← stable, deployable
develop           ← integration branch (merge PRs here)
feature/frontend-* ← all frontend work
feature/backend-*  ← all backend work
```

**Always open a PR to `develop`, never push directly to `main`.**

---

## 📄 License
Internal use only – KaroStartup © 2025
