import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import officeParser from "officeparser";
import authRoutes from "./src/routes/auth.js";
import reportRoutes from "./src/routes/reports.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.get("/", (req, res) => res.send("Backend is running"));

const upload = multer({ dest: "uploads/" });

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing from .env");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/analyse", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: "No file uploaded" });

    // Extract real text from PPTX/PDF
    let extractedText = "";
    try {
      extractedText = await officeParser.parseOfficeAsync(filePath);
    } catch (parseErr) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ error: "Could not read file. Please upload a valid PPTX or PDF." });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ error: "File appears to be empty or unreadable." });
    }

    const prompt = `
You are a senior venture capital analyst. Analyze this startup pitch deck text and return STRICT JSON only — no explanation, no markdown.

Pitch deck content:
"""
${extractedText.slice(0, 6000)}
"""

Return this exact JSON structure:
{
  "startup_name": "string (guess from content or use 'Unknown')",
  "overall_score": number (0-100),
  "recommendation": "Buy" | "Hold" | "Pass",
  "confidence": number (0-100, based on how complete the pitch is),
  "categories": [
    { "name": "Problem Statement", "score": number (0-10), "weight": 10, "comment": "string" },
    { "name": "Solution / Product", "score": number (0-10), "weight": 15, "comment": "string" },
    { "name": "Market Size", "score": number (0-10), "weight": 15, "comment": "string" },
    { "name": "Business Model", "score": number (0-10), "weight": 15, "comment": "string" },
    { "name": "Traction", "score": number (0-10), "weight": 15, "comment": "string" },
    { "name": "Team", "score": number (0-10), "weight": 10, "comment": "string" },
    { "name": "Financials", "score": number (0-10), "weight": 10, "comment": "string" },
    { "name": "Competition", "score": number (0-10), "weight": 5, "comment": "string" },
    { "name": "Exit Strategy", "score": number (0-10), "weight": 5, "comment": "string" }
  ],
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "actionable_advice": ["string", "string", "string"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    let parsed;
    try {
      parsed = JSON.parse(response.choices[0].message.content);
    } catch {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    fs.unlink(filePath, () => {});
    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.post("/download-pdf", async (req, res) => {
  const report = req.body;
  const PDFDocument = (await import("pdfkit")).default;
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${report.startup || "report"}-thesis.pdf"`);
  doc.pipe(res);

  // Title
  doc.fontSize(24).font("Helvetica-Bold").text("Investment Thesis Report", { align: "center" });
  doc.fontSize(14).font("Helvetica").text(report.startup || "Unknown Startup", { align: "center" });
  doc.moveDown();

  // Summary
  doc.fontSize(12).font("Helvetica-Bold").text(`Overall Score: ${report.overall}/100`);
  doc.font("Helvetica").text(`Recommendation: ${report.recommendation}`);
  doc.text(`Confidence: ${report.confidence}%`);
  doc.moveDown();

  // Categories
  doc.fontSize(14).font("Helvetica-Bold").text("Category Breakdown");
  doc.moveDown(0.5);
  (report.categories || []).forEach(c => {
    doc.fontSize(11).font("Helvetica-Bold").text(`${c.name}: ${c.score}/10 (${c.weight})`);
    doc.fontSize(10).font("Helvetica").text(c.feedback || "", { color: "grey" });
    doc.moveDown(0.5);
  });

  // Strengths
  doc.addPage();
  doc.fontSize(14).font("Helvetica-Bold").text("Strengths");
  doc.moveDown(0.5);
  (report.strengths || []).forEach(s => {
    doc.fontSize(10).font("Helvetica").text(`• ${s}`);
  });
  doc.moveDown();

  // Weaknesses
  doc.fontSize(14).font("Helvetica-Bold").text("Weaknesses");
  doc.moveDown(0.5);
  (report.weaknesses || []).forEach(w => {
    doc.fontSize(10).font("Helvetica").text(`• ${w}`);
  });
  doc.moveDown();

  // Recommendations
  doc.fontSize(14).font("Helvetica-Bold").text("Recommendations");
  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").text(report.recommendations || "");

  doc.end();
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));