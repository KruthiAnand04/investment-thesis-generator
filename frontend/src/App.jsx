import React, { useState, useRef, useEffect, useCallback } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand:      #1A1A2E;
    --brand-mid:  #16213E;
    --accent:     #E94560;
    --accent2:    #F5A623;
    --teal:       #0FB8B8;
    --bg:         #F7F6F2;
    --surface:    #FFFFFF;
    --muted:      #6B6A66;
    --border:     rgba(0,0,0,0.08);
    --radius:     14px;
    --serif:      'Instrument Serif', Georgia, serif;
    --sans:       'DM Sans', system-ui, sans-serif;
  }

  body { font-family: var(--sans); background: var(--bg); color: var(--brand); }

  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .navbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px; background: var(--brand);
    position: sticky; top: 0; z-index: 100;
  }
  .logo { font-family: var(--serif); font-size: 1.4rem; color: #fff; letter-spacing: -0.02em; }
  .logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 1.5rem; align-items: center; }
  .nav-btn {
    font-family: var(--sans); font-size: 0.85rem; font-weight: 500;
    padding: 0.45rem 1.1rem; border-radius: 8px; cursor: pointer; transition: all .15s;
    border: 1.5px solid transparent;
  }
  .nav-ghost { background: transparent; color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.2); }
  .nav-ghost:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .nav-solid { background: var(--accent); color: #fff; border-color: var(--accent); }
  .nav-solid:hover { background: #d63552; }

  .hero {
    background: var(--brand); color: #fff;
    padding: 5rem 2rem 4rem;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 60% 0%, rgba(233,69,96,0.25) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 80%, rgba(15,184,184,0.15) 0%, transparent 50%);
    pointer-events: none;
  }
  .hero-eyebrow {
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--teal); margin-bottom: 1.2rem;
  }
  .hero-title {
    font-family: var(--serif); font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.1;
    font-weight: 400; max-width: 720px; margin-bottom: 1.2rem;
  }
  .hero-title em { color: var(--accent); font-style: italic; }
  .hero-sub { font-size: 1.05rem; color: rgba(255,255,255,0.65); max-width: 520px; line-height: 1.7; margin-bottom: 2.4rem; }
  .hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .btn-primary {
    padding: 0.75rem 2rem; background: var(--accent); color: #fff;
    border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
    cursor: pointer; transition: transform .15s, box-shadow .15s; font-family: var(--sans);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(233,69,96,0.4); }
  .btn-secondary {
    padding: 0.75rem 2rem; background: transparent; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.25); border-radius: 10px;
    font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all .15s; font-family: var(--sans);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.5); }

  .section { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
  .section-tag {
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.6rem;
  }
  .section-title { font-family: var(--serif); font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 400; color: var(--brand); margin-bottom: 2.5rem; }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
  .step-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 1.5rem; position: relative; overflow: hidden;
  }
  .step-card::before {
    content: attr(data-num); position: absolute; top: -0.5rem; right: 0.75rem;
    font-family: var(--serif); font-size: 5rem; color: rgba(26,26,46,0.05); font-weight: 400; line-height: 1;
  }
  .step-icon { font-size: 1.5rem; margin-bottom: 0.8rem; }
  .step-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.4rem; }
  .step-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

  .auth-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1rem; }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 2.5rem; width: 100%; max-width: 420px;
  }
  .auth-title { font-family: var(--serif); font-size: 1.9rem; font-weight: 400; margin-bottom: 0.3rem; }
  .auth-sub { font-size: 0.88rem; color: var(--muted); margin-bottom: 2rem; }
  .form-group { margin-bottom: 1.1rem; }
  .form-label { font-size: 0.82rem; font-weight: 500; display: block; margin-bottom: 0.4rem; color: var(--brand); }
  .form-input {
    width: 100%; padding: 0.65rem 0.9rem; border: 1.5px solid var(--border);
    border-radius: 10px; font-size: 0.9rem; font-family: var(--sans); background: var(--bg);
    transition: border-color .15s; outline: none;
  }
  .form-input:focus { border-color: var(--accent); background: #fff; }
  .form-btn {
    width: 100%; padding: 0.78rem; background: var(--brand); color: #fff;
    border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
    font-family: var(--sans); cursor: pointer; margin-top: 0.5rem; transition: background .15s;
  }
  .form-btn:hover { background: var(--brand-mid); }
  .divider { display: flex; align-items: center; gap: 0.8rem; margin: 1.2rem 0; color: var(--muted); font-size: 0.8rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .oauth-btn {
    width: 100%; padding: 0.65rem; background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 10px; font-family: var(--sans); font-size: 0.88rem; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    margin-bottom: 0.7rem; transition: background .15s;
  }
  .oauth-btn:hover { background: #eeeee8; }
  .auth-switch { text-align: center; font-size: 0.85rem; margin-top: 1.5rem; color: var(--muted); }
  .auth-switch a { color: var(--accent); cursor: pointer; text-decoration: none; font-weight: 500; }

  .dash-layout { flex: 1; display: flex; }
  .sidebar {
    width: 220px; min-height: calc(100vh - 64px); background: var(--surface);
    border-right: 1px solid var(--border); padding: 1.5rem 1rem; flex-shrink: 0;
  }
  .sidebar-item {
    display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.75rem;
    border-radius: 8px; font-size: 0.88rem; font-weight: 500; cursor: pointer;
    color: var(--muted); transition: all .12s; margin-bottom: 0.3rem;
  }
  .sidebar-item:hover { background: var(--bg); color: var(--brand); }
  .sidebar-item.active { background: rgba(233,69,96,0.08); color: var(--accent); }
  .dash-main { flex: 1; padding: 2rem; max-width: 900px; }
  .dash-greeting { font-family: var(--serif); font-size: 1.8rem; font-weight: 400; margin-bottom: 0.3rem; }
  .dash-sub { font-size: 0.88rem; color: var(--muted); margin-bottom: 2rem; }

  .upload-zone {
    border: 2px dashed var(--border); border-radius: var(--radius); padding: 3rem 2rem;
    text-align: center; cursor: pointer; transition: all .2s; background: var(--surface);
    margin-bottom: 2rem; position: relative;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(233,69,96,0.03); }
  .upload-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
  .upload-title { font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem; }
  .upload-hint { font-size: 0.82rem; color: var(--muted); }
  .upload-constraint { font-size: 0.75rem; color: var(--muted); margin-top: 0.5rem; }
  .file-chosen {
    display: flex; align-items: center; gap: 0.8rem; background: rgba(15,184,184,0.07);
    border: 1.5px solid rgba(15,184,184,0.3); border-radius: 10px; padding: 0.9rem 1rem;
    margin-top: 1rem; text-align: left;
  }
  .file-name { font-weight: 500; font-size: 0.9rem; flex: 1; }
  .file-size { font-size: 0.8rem; color: var(--muted); }
  .upload-submit {
    padding: 0.75rem 2.5rem; background: var(--accent); color: #fff;
    border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
    font-family: var(--sans); cursor: pointer; transition: all .15s; display: block; margin: 1rem auto 0;
  }
  .upload-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(233,69,96,0.35); }
  .upload-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .progress-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; }
  .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .progress-title { font-weight: 600; font-size: 0.95rem; }
  .progress-pct { font-size: 0.9rem; font-weight: 600; color: var(--accent); }
  .progress-bar-bg { height: 6px; background: var(--bg); border-radius: 99px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 99px; transition: width .5s ease; }
  .progress-steps { display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; }
  .p-step {
    font-size: 0.75rem; padding: 0.3rem 0.7rem; border-radius: 99px; font-weight: 500;
    background: var(--bg); color: var(--muted);
  }
  .p-step.done { background: rgba(15,184,184,0.12); color: #0a8a8a; }
  .p-step.active { background: rgba(233,69,96,0.1); color: var(--accent); }

  .history-title { font-weight: 600; font-size: 1rem; margin-bottom: 1rem; color: var(--brand); }
  .report-list { display: flex; flex-direction: column; gap: 0.8rem; }
  .report-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 1rem 1.2rem; display: flex; align-items: center; gap: 1rem;
    cursor: pointer; transition: border-color .15s;
  }
  .report-card:hover { border-color: rgba(233,69,96,0.3); }
  .report-score-badge {
    width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center;
    justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0;
  }
  .badge-green { background: rgba(15,184,184,0.12); color: #0a8a8a; }
  .badge-amber { background: rgba(245,166,35,0.12); color: #a06a00; }
  .badge-red { background: rgba(233,69,96,0.1); color: var(--accent); }
  .report-info { flex: 1; }
  .report-name { font-weight: 600; font-size: 0.92rem; }
  .report-meta { font-size: 0.78rem; color: var(--muted); margin-top: 0.2rem; }
  .report-rec { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.7rem; border-radius: 99px; }
  .rec-buy { background: rgba(15,184,184,0.12); color: #0a8a8a; }
  .rec-hold { background: rgba(245,166,35,0.12); color: #a06a00; }
  .rec-pass { background: rgba(233,69,96,0.1); color: var(--accent); }

  .report-view { flex: 1; padding: 2rem; max-width: 860px; margin: 0 auto; width: 100%; }
  .report-header { margin-bottom: 2rem; }
  .report-view-title { font-family: var(--serif); font-size: 2rem; font-weight: 400; margin-bottom: 0.3rem; }
  .report-view-meta { font-size: 0.85rem; color: var(--muted); }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 1.2rem; text-align: center;
  }
  .stat-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.5rem; }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--brand); }
  .stat-sub { font-size: 0.78rem; color: var(--muted); margin-top: 0.2rem; }
  .rec-pill { display: inline-block; padding: 0.35rem 1rem; border-radius: 99px; font-weight: 700; font-size: 1rem; margin-top: 0.4rem; }

  .categories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.2rem; }
  .cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
  .cat-name { font-weight: 600; font-size: 0.88rem; }
  .cat-score-wrap { display: flex; align-items: center; gap: 0.5rem; }
  .cat-score { font-weight: 700; font-size: 1.1rem; color: var(--brand); }
  .cat-weight { font-size: 0.72rem; color: var(--muted); background: var(--bg); padding: 0.15rem 0.5rem; border-radius: 99px; }
  .cat-bar-bg { height: 5px; background: var(--bg); border-radius: 99px; overflow: hidden; }
  .cat-bar-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }
  .cat-feedback { font-size: 0.8rem; color: var(--muted); line-height: 1.6; margin-top: 0.5rem; }

  .sw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .sw-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.2rem; }
  .sw-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.4rem; }
  .sw-list { list-style: none; }
  .sw-list li { font-size: 0.82rem; color: var(--muted); line-height: 1.6; padding: 0.3rem 0; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 0.5rem; }
  .sw-list li:last-child { border-bottom: none; }
  .sw-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }

  .reco-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; }
  .reco-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.7rem; color: var(--brand); }
  .reco-text { font-size: 0.88rem; color: var(--muted); line-height: 1.8; }

  .dl-btn {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.8rem;
    background: var(--brand); color: #fff; border: none; border-radius: 10px;
    font-family: var(--sans); font-size: 0.92rem; font-weight: 600; cursor: pointer;
    transition: background .15s;
  }
  .dl-btn:hover { background: var(--brand-mid); }

  @media (max-width: 600px) {
    .categories-grid, .sw-grid, .summary-grid { grid-template-columns: 1fr; }
    .sidebar { display: none; }
  }
`;

const scoreColor = (s) => s >= 7 ? "#0FB8B8" : s >= 5 ? "#F5A623" : "#E94560";
const recClass = (r) => r === "Strong Buy" ? "rec-buy" : r === "Hold" ? "rec-hold" : "rec-pass";
const badgeClass = (s) => s >= 70 ? "badge-green" : s >= 50 ? "badge-amber" : "badge-red";

const PROCESSING_STEPS = ["Uploading", "Extracting text", "Running OCR", "LLM analysis", "Generating PDF"];

function Navbar({ page, setPage, loggedIn, setLoggedIn }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setPage("landing")} style={{ cursor: "pointer" }}>
        Karo<span>Startup</span>
      </div>
      <div className="nav-links">
        {loggedIn ? (
          <>
            <button className="nav-btn nav-ghost" onClick={() => setPage("dashboard")}>Dashboard</button>
            <button className="nav-btn nav-ghost" onClick={() => { setLoggedIn(false); setPage("landing"); }}>Sign out</button>
          </>
        ) : (
          <>
            <button className="nav-btn nav-ghost" onClick={() => setPage("login")}>Sign in</button>
            <button className="nav-btn nav-solid" onClick={() => setPage("register")}>Get started</button>
          </>
        )}
      </div>
    </nav>
  );
}

function LandingPage({ setPage }) {
  const steps = [
    { num: "01", icon: "📂", title: "Upload your deck", desc: "Drag and drop any PPTX up to 50 MB. Supported: Microsoft PowerPoint 2007+." },
    { num: "02", icon: "🤖", title: "AI analysis", desc: "Our LLM evaluates 9 categories — problem, market, team, financials and more — against VC-grade criteria." },
    { num: "03", icon: "📊", title: "Scored report", desc: "Receive a weighted score from 0–100 with category breakdowns, strengths, weaknesses and actionable advice." },
    { num: "04", icon: "⬇️", title: "Download PDF", desc: "Get a professionally formatted A4 PDF delivered to your dashboard and inbox within 5 minutes." },
  ];

  return (
    <div>
      <section className="hero">
        <p className="hero-eyebrow">AI-Powered Pitch Analysis</p>
        <h1 className="hero-title">Know if your startup <em>deserves</em> the investment</h1>
        <p className="hero-sub">Upload your pitch deck. Get a structured investment thesis in under 5 minutes — scored across 9 VC-grade categories.</p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => setPage("register")}>Analyse my deck →</button>
          <button className="btn-secondary" onClick={() => setPage("report")}>See sample report</button>
        </div>
      </section>
      <div className="section">
        <p className="section-tag">How it works</p>
        <h2 className="section-title">From deck to thesis in four steps</h2>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.num} className="step-card" data-num={s.num}>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#1A1A2E", padding: "3.5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "2rem", color: "#fff", fontWeight: 400, marginBottom: "0.6rem" }}>
          Ready to find out?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Join analysts and founders using AI to cut due diligence time by 80%.
        </p>
        <button className="btn-primary" onClick={() => setPage("register")}>Start free →</button>
      </div>
    </div>
  );
}

function AuthPage({ mode, setPage, setLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const isLogin = mode === "login";

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;
    const endpoint = isLogin ? "login" : "signup";
    try {
      const res = await fetch(`http://localhost:4000/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, full_name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoggedIn(true);
      setPage("dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="auth-sub">{isLogin ? "Sign in to your KaroStartup account" : "Start analysing pitch decks in minutes"}</p>
        <button className="oauth-btn">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <button className="oauth-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Continue with LinkedIn
        </button>
        <div className="divider">or</div>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" placeholder="Arjun Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="arjun@startup.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button className="form-btn" onClick={handleSubmit}>
          {isLogin ? "Sign in" : "Create account"} →
        </button>
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a onClick={() => setPage(isLogin ? "register" : "login")}>
            {isLogin ? "Sign up" : "Sign in"}
          </a>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ setPage, setViewReport }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:4000/reports", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setHistory(Array.isArray(data) ? data : []));
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["ppt","pptx"].includes(ext)) { alert("Only .ppt or .pptx files accepted."); return; }
    if (f.size > 50 * 1024 * 1024) { alert("File exceeds 50 MB limit."); return; }
    setFile(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const startAnalysis = async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setStepIdx(0); setDone(false);

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 2 + 0.5;
      const s = Math.min(Math.floor(p / 22), PROCESSING_STEPS.length - 2);
      setProgress(Math.min(Math.round(p), 90));
      setStepIdx(s);
    }, 400);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:4000/analyse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      clearInterval(iv);
      setProgress(100);
      setStepIdx(PROCESSING_STEPS.length - 1);
      setDone(true);
      setProcessing(false);

      const report = {
        startup: data.startup_name || file.name.replace(/\.[^.]+$/, ""),
        date: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        overall: data.overall_score,
        recommendation: data.recommendation,
        confidence: data.confidence,
        categories: (data.categories || []).map(c => ({
          name: c.name,
          weight: c.weight + "%",
          score: c.score,
          feedback: c.comment,
        })),
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        recommendations: (data.actionable_advice || []).join(" "),
      };

      // Save to database
      const token = localStorage.getItem("token");
      if (token) {
        const saved = await fetch("http://localhost:4000/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            startup_name: report.startup,
            overall_score: report.overall,
            recommendation: report.recommendation,
            confidence: report.confidence,
            result_json: report,
          }),
        });
        const savedData = await saved.json();
        setHistory(prev => [savedData, ...prev]);
      }

      setCurrentReport(report);
      setViewReport(report);

    } catch (err) {
      clearInterval(iv);
      setProcessing(false);
      setProgress(0);
      setDone(false);
      alert("Analysis failed: " + err.message);
    }
  };

  const sidebarItems = [
    { icon: "⬆️", label: "New analysis", tab: "upload" },
    { icon: "📋", label: "My reports", tab: "history" },
    { icon: "⚙️", label: "Settings", tab: "settings" },
  ];

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        {sidebarItems.map(item => (
          <div key={item.tab} className={`sidebar-item ${activeTab === item.tab ? "active" : ""}`} onClick={() => setActiveTab(item.tab)}>
            <span style={{ fontSize: "14px" }}>{item.icon}</span> {item.label}
          </div>
        ))}
      </aside>
      <main className="dash-main">
        {activeTab === "upload" && (
          <>
            <h1 className="dash-greeting">New analysis</h1>
            <p className="dash-sub">Upload a pitch deck to generate your investment thesis report.</p>

            {!processing && !done && (
              <>
                <div
                  className={`upload-zone ${drag ? "drag" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current.click()}
                >
                  <div className="upload-icon">📑</div>
                  <div className="upload-title">Drop your pitch deck here</div>
                  <p className="upload-hint">or click to browse</p>
                  <p className="upload-constraint">PPT / PPTX only · Max 50 MB · 5–20 slides</p>
                  <input ref={fileRef} type="file" accept=".ppt,.pptx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                </div>
                {file && (
                  <div className="file-chosen">
                    <span style={{ fontSize: "1.4rem" }}>📊</span>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                    <span style={{ cursor: "pointer", color: "#E94560", fontSize: "1rem" }} onClick={() => setFile(null)}>✕</span>
                  </div>
                )}
                <button className="upload-submit" disabled={!file} onClick={startAnalysis}>
                  Analyse pitch deck →
                </button>
              </>
            )}

            {(processing || done) && (
              <div className="progress-wrap">
                <div className="progress-header">
                  <span className="progress-title">{done ? "Analysis complete!" : "Analysing your deck…"}</span>
                  <span className="progress-pct">{progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-steps">
                  {PROCESSING_STEPS.map((s, i) => (
                    <span key={s} className={`p-step ${i < stepIdx ? "done" : i === stepIdx && !done ? "active" : i < PROCESSING_STEPS.length && done ? "done" : ""}`}>
                      {i < stepIdx || done ? "✓ " : i === stepIdx && !done ? "⟳ " : ""}{s}
                    </span>
                  ))}
                </div>
                {done && (
                  <button className="upload-submit" style={{ marginTop: "1.5rem" }} onClick={() => { setViewReport(currentReport); setPage("report"); }}>
                    View report →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "history" && (
          <>
            <h1 className="dash-greeting">My reports</h1>
            <p className="dash-sub">All your past pitch deck analyses.</p>
            <div className="report-list">
              {history.length === 0 && (
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No reports yet. Upload your first pitch deck!</p>
              )}
              {history.map(r => (
                <div key={r.id} className="report-card" onClick={() => { setViewReport(r.result_json); setPage("report"); }}>
                  <div className={`report-score-badge ${badgeClass(r.overall_score)}`}>{r.overall_score}</div>
                  <div className="report-info">
                    <div className="report-name">{r.startup_name}</div>
                    <div className="report-meta">{new Date(r.created_at).toDateString()}</div>
                  </div>
                  <span className={`report-rec ${recClass(r.recommendation)}`}>{r.recommendation}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <div>
            <h1 className="dash-greeting">Settings</h1>
            <p className="dash-sub" style={{ marginBottom: "2rem" }}>Manage your account preferences.</p>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", maxWidth: 480 }}>
              <div className="form-group">
                <label className="form-label">Display name</label>
                <input className="form-input" defaultValue="Arjun Sharma" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" defaultValue="arjun@karostartup.com" />
              </div>
              <button className="upload-submit" style={{ margin: "0.5rem 0 0" }}>Save changes</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ReportPage({ report, setPage }) {
  const r = report;
  if (!r) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <p style={{ color: "var(--muted)" }}>No report selected.</p>
      <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage("dashboard")}>Go to Dashboard</button>
    </div>
  );

  const recBgMap = { "Strong Buy": "#0FB8B8", "Hold": "#F5A623", "Pass": "#E94560" };

  const downloadPDF = async () => {
    try {
      const res = await fetch("http://localhost:4000/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${r.startup}-thesis.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF download failed: " + err.message);
    }
  };

  return (
    <div className="report-view">
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.85rem", padding: 0, fontFamily: "var(--sans)" }}>
          ← Back to dashboard
        </button>
      </div>

      <div className="report-header">
        <h1 className="report-view-title">Investment Thesis — {r.startup}</h1>
        <p className="report-view-meta">Generated: {r.date}</p>
      </div>

      <div className="summary-grid">
        <div className="stat-card">
          <div className="stat-label">Overall score</div>
          <div className="stat-value">{r.overall}</div>
          <div className="stat-sub">out of 100</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recommendation</div>
          <div>
            <span className="rec-pill" style={{ background: recBgMap[r.recommendation] || "#888", color: "#fff", display: "inline-block", marginTop: "0.4rem", fontSize: "1rem", fontWeight: 700 }}>
              {r.recommendation}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Confidence</div>
          <div className="stat-value">{r.confidence}%</div>
          <div className="stat-sub">data completeness</div>
        </div>
      </div>

      <h2 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.8rem", color: "var(--brand)" }}>Category breakdown</h2>
      <div className="categories-grid">
        {(r.categories || []).map(c => (
          <div key={c.name} className="cat-card">
            <div className="cat-header">
              <span className="cat-name">{c.name}</span>
              <div className="cat-score-wrap">
                <span className="cat-score" style={{ color: scoreColor(c.score) }}>{c.score}/10</span>
                <span className="cat-weight">{c.weight}</span>
              </div>
            </div>
            <div className="cat-bar-bg">
              <div className="cat-bar-fill" style={{ width: `${c.score * 10}%`, background: scoreColor(c.score) }} />
            </div>
            <p className="cat-feedback">{c.feedback}</p>
          </div>
        ))}
      </div>

      <div className="sw-grid">
        <div className="sw-card">
          <div className="sw-title"><span style={{ color: "#0FB8B8", fontSize: "12px" }}>▲</span> Strengths</div>
          <ul className="sw-list">
            {(r.strengths || []).map(s => (
              <li key={s}><span className="sw-dot" style={{ background: "#0FB8B8" }} />{s}</li>
            ))}
          </ul>
        </div>
        <div className="sw-card">
          <div className="sw-title"><span style={{ color: "#E94560", fontSize: "12px" }}>▼</span> Weaknesses</div>
          <ul className="sw-list">
            {(r.weaknesses || []).map(w => (
              <li key={w}><span className="sw-dot" style={{ background: "#E94560" }} />{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reco-card">
        <div className="reco-title">📌 Recommendations</div>
        <p className="reco-text">{r.recommendations}</p>
      </div>

      <button className="dl-btn" onClick={downloadPDF}>
        ⬇ Download PDF report
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [viewReport, setViewReport] = useState(null);

  const goPage = (p) => {
    if (["dashboard"].includes(p) && !loggedIn) { setPage("login"); return; }
    setPage(p);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Navbar page={page} setPage={goPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        {page === "landing" && <LandingPage setPage={goPage} />}
        {page === "login" && <AuthPage mode="login" setPage={goPage} setLoggedIn={setLoggedIn} />}
        {page === "register" && <AuthPage mode="register" setPage={goPage} setLoggedIn={setLoggedIn} />}
        {page === "dashboard" && <Dashboard setPage={goPage} setViewReport={setViewReport} />}
        {page === "report" && <ReportPage report={viewReport} setPage={goPage} />}
      </div>
    </>
  );
}
