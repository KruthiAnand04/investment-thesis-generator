# Backend – Investment Thesis Generator

Node.js 20 + Express 4 REST API.

## Stack
- Node.js 20 + Express 4
- python-pptx (Python 3.11) for slide text extraction
- Tesseract 5.x for OCR
- xAI Grok 3 API for LLM analysis
- AWS S3 for file storage (AES-256, TTL 24h)
- PostgreSQL 15 for user data + analysis history
- pdfkit 0.8.x for PDF generation
- JWT (24h validity) for auth

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login → JWT |
| GET | `/auth/oauth/google` | No | Google OAuth |
| GET | `/auth/oauth/linkedin` | No | LinkedIn OAuth |
| POST | `/upload` | Yes | Upload PPTX |
| GET | `/report/:id` | Yes | Report status + link |
| GET | `/reports` | Yes | List user reports |

## Env Variables
```
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/karostartup
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=ap-south-1
GROK_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

## Commands
```bash
npm run dev      # nodemon dev server :4000
npm start        # production
npm run migrate  # run DB migrations
```

## Processing Pipeline
1. POST `/upload` → save to S3 (encrypted)
2. Spawn Python: python-pptx extracts text + metadata (≤30s)
3. Tesseract OCR on image slides
4. Grok 3 API: analyze + score 9 categories (≤240s)
5. pdfkit: generate A4 PDF (≤30s)
6. PDF stored in S3, link returned via `/report/:id`

## Rate Limits
5 uploads / user / hour
