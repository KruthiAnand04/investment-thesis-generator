# Frontend – Investment Thesis Generator

React 18 SPA.

## Stack
- React 18 + Vite + TailwindCSS
- React Router v6
- Axios for API calls

## Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | Hero + how it works |
| `/login` | AuthPage | Email/OAuth login |
| `/register` | AuthPage | Registration |
| `/dashboard` | Dashboard | Upload + history |
| `/report/:id` | ReportPage | View/download PDF |

## Key Components
- `FileUpload` – drag-and-drop PPTX, validates type + size (≤50MB)
- `ProgressTracker` – polls /report/:id for status
- `ScoreRadar` – 9-category score visualization
- `ReportCard` – past analysis summary

## Env Variables
```
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=
VITE_LINKEDIN_CLIENT_ID=
```

## Commands
```bash
npm run dev      # dev server :5173
npm run build    # production build → dist/
npm run lint     # ESLint
```
