# KaroStartup — Investment Thesis Generator

An AI-powered pitch deck analyser that generates VC-grade investment thesis reports.

## What it does
- Upload a PPTX pitch deck
- AI analyses it across 9 VC-grade categories
- Get a scored report with strengths, weaknesses and recommendations
- Download a PDF report

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- AI: OpenAI GPT-4o-mini
- Auth: JWT

## How to run this project

### 1. Clone the repo
git clone https://github.com/KruthiAnand04/investment-thesis-generator.git
cd investment-thesis-generator

### 2. Set up the Backend
cd backend
npm install

Then create a file called .env inside the backend folder and add:
PORT=4000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/investment_thesis
JWT_SECRET=any_random_secret_string
OPENAI_API_KEY=your_openai_api_key_here

Then run:
npm run migrate
npm run dev

### 3. Set up the Frontend
cd ../frontend
npm install

Then create a file called .env inside the frontend folder and add:
VITE_API_URL=http://localhost:4000

Then run:
npm run dev

### 4. Open the app
Go to http://localhost:5173 in your browser