/**
 * Shared constants used by both frontend and backend.
 * Import from here instead of duplicating.
 */

const EVALUATION_CATEGORIES = [
  { id: "problem_statement",      label: "Problem Statement",     weight: 0.10 },
  { id: "solution_product",       label: "Solution / Product",    weight: 0.15 },
  { id: "market_opportunity",     label: "Market Opportunity",    weight: 0.20 },
  { id: "business_model",         label: "Business Model",        weight: 0.15 },
  { id: "competitive_landscape",  label: "Competitive Landscape", weight: 0.10 },
  { id: "team",                   label: "Team",                  weight: 0.15 },
  { id: "traction_milestones",    label: "Traction / Milestones", weight: 0.10 },
  { id: "financial_projections",  label: "Financial Projections", weight: 0.10 },
  { id: "clarity_presentation",   label: "Clarity & Presentation",weight: 0.05 },
];

const RECOMMENDATION = {
  STRONG_BUY: "Strong Buy",  // overall score >= 75
  HOLD: "Hold",              // overall score >= 50
  PASS: "Pass",              // overall score < 50
};

const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,
  ALLOWED_EXTENSIONS: [".ppt", ".pptx"],
  MIN_SLIDES: 5,
  MAX_SLIDES: 20,
  PROCESSING_TIMEOUT_MS: 300_000,
  RATE_LIMIT_UPLOADS_PER_HOUR: 5,
};

module.exports = { EVALUATION_CATEGORIES, RECOMMENDATION, UPLOAD_CONSTRAINTS };
