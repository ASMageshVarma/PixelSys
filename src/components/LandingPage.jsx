import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Compass, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Zap, 
  Bell, 
  ArrowRight, 
  Mail, 
  Phone, 
  GraduationCap,
  Brain,
  Target,
  Award
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/* TILT: mouse-parallax 3D tilt wrapper                               */
/* ---------------------------------------------------------------- */
function Tilt({ children, max = 8, scale = 1.015 }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ transform: `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})` });
  };
  const onLeave = () => setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.3s ease-out", transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* CARD3D: glass card with tilt + cursor-tracking spotlight glow      */
/* ---------------------------------------------------------------- */
function Card3D({ children, tilt = 6, style = {}, className = "" }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    setTransform(`perspective(900px) rotateX(${(-(py - 0.5) * tilt).toFixed(2)}deg) rotateY(${((px - 0.5) * tilt).toFixed(2)}deg)`);
  };
  const onLeave = () => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`card-3d ${className}`}
      style={{ transform, transition: "transform 0.25s ease-out, box-shadow 0.25s ease, border-color 0.25s ease", ...style }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, borderRadius: 'inherit',
        background: 'radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(56,225,255,0.12), transparent 72%)',
        transition: 'opacity 0.35s ease'
      }} className="spotlight-glow" />
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* COUNTUP: animated number for proof-point stats                     */
/* ---------------------------------------------------------------- */
function CountUp({ to, duration = 1100, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val}{suffix}</>;
}

/* ---------------------------------------------------------------- */
/* SIGNATURE VISUAL: the twin constellation                          */
/* ---------------------------------------------------------------- */
function TwinConstellation({ size = 420 }) {
  const satellites = [
    { x: 50, y: 50, r: 6, label: "Interests", delay: 0 },
    { x: 370, y: 80, r: 5, label: "Skills", delay: 0.6 },
    { x: 380, y: 260, r: 7, label: "Timetable", delay: 1.2 },
    { x: 40, y: 280, r: 5, label: "Clubs", delay: 1.8 },
    { x: 210, y: 25, r: 4, label: "Identity", delay: 0.3 },
    { x: 30, y: 170, r: 4, label: "Goals", delay: 1.5 },
  ];
  return (
    <svg viewBox="0 0 420 340" width="100%" height="100%" style={{ maxWidth: size, overflow: "visible" }}>
      <defs>
        {/* Glow Filters */}
        <filter id="neonGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E6BFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38E1FF" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="tfGlowCoral" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E6BFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2E6BFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tfGlowViolet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38E1FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38E1FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connection grid lines linking to satellites */}
      {satellites.map((s, i) => (
        <g key={i}>
          {/* Main line */}
          <line x1={150} y1={150} x2={s.x} y2={s.y} stroke="#1C2740" strokeWidth="1.5" />
          {/* Outer glow line */}
          <line x1={150} y1={150} x2={s.x} y2={s.y} stroke="rgba(46,107,255,0.15)" strokeWidth="3" opacity="0.4" />
        </g>
      ))}

      {/* Main Connection between YOU and TWIN */}
      <line x1="150" y1="150" x2="270" y2="180" stroke="url(#lineGrad)" strokeWidth="3" />
      <line x1="150" y1="150" x2="270" y2="180" stroke="#38E1FF" strokeWidth="1.5" strokeDasharray="5 7" filter="url(#neonGlowCyan)">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
      </line>

      {/* Orbiting data packet particle */}
      <circle cx="0" cy="0" r="5" fill="#38E1FF" filter="url(#neonGlowCyan)">
        <animateMotion 
          path="M 150 150 L 270 180" 
          dur="2s" 
          repeatCount="indefinite" 
        />
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Satellites */}
      {satellites.map((s, i) => (
        <g key={i} style={{ cursor: "pointer" }}>
          {/* Node glow circle */}
          <circle cx={s.x} cy={s.y} r={s.r + 4} fill="rgba(82,95,135,0.1)" opacity="0.4">
            <animate attributeName="r" values={`${s.r + 2};${s.r + 8};${s.r + 2}`} dur="3s" begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
          {/* Main Node */}
          <circle cx={s.x} cy={s.y} r={s.r} fill="#525F87" filter="url(#neonGlowBlue)">
            <animate attributeName="fill" values="#525F87;#38E1FF;#525F87" dur="3s" begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
          {/* Label text */}
          <text x={s.x} y={s.y - 12} textAnchor="middle" fill="#8A98C2" fontFamily="Space Mono, monospace" fontSize="9" opacity="0.75" style={{ textShadow: "0 0 4px rgba(0,0,0,0.5)" }}>
            {s.label}
          </text>
        </g>
      ))}

      {/* Core Glow Orbs */}
      <circle cx="150" cy="150" r="56" fill="url(#tfGlowCoral)" />
      <circle cx="270" cy="180" r="50" fill="url(#tfGlowViolet)" />

      {/* Outer rings */}
      <circle cx="150" cy="150" r="24" fill="none" stroke="rgba(46,107,255,0.3)" strokeWidth="1" strokeDasharray="3 3">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="270" cy="180" r="20" fill="none" stroke="rgba(56,225,255,0.3)" strokeWidth="1" strokeDasharray="3 3">
        <animateTransform attributeName="transform" type="rotate" from="360 270 180" to="0 270 180" dur="8s" repeatCount="indefinite" />
      </circle>

      {/* Main Core Nodes */}
      <circle cx="150" cy="150" r="16" fill="#2E6BFF" filter="url(#neonGlowBlue)">
        <animate attributeName="r" values="16;18;16" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="270" cy="180" r="13" fill="#38E1FF" filter="url(#neonGlowCyan)">
        <animate attributeName="r" values="13;15;13" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
      </circle>

      {/* Text annotations */}
      <text x="150" y="190" textAnchor="middle" fill="#EEF2FF" fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" style={{ letterSpacing: "0.05em" }}>YOU</text>
      <text x="270" y="222" textAnchor="middle" fill="#EEF2FF" fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" style={{ letterSpacing: "0.05em" }}>TWIN</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* DYNAMIC PREVIEW COMPONENT                                          */
/* ---------------------------------------------------------------- */
function DashboardPreview() {
  const [progress, setProgress] = useState(68);

  const getDynamicContent = (pct) => {
    if (pct < 30) {
      return {
        status: "Twin Status: Calibrating Nodes...",
        color: "#8a99ad",
        cards: [
          { tag: "SYSTEM CALIBRATION", tagColor: "#8a99ad", title: "Scanning academic records..." },
          { tag: "OPPORTUNITY RADAR", tagColor: "#8a99ad", title: "Awaiting onboarding calibration data sync" },
          { tag: "PLANNER · 10% DONE", tagColor: "#8a99ad", title: "Configuring basic freshers timetable maps" }
        ],
        desc: "Awaiting configuration. Drag the slider to simulate digital twin sync progress."
      };
    } else if (pct < 65) {
      return {
        status: "Twin Status: Learning Interests...",
        color: "#6366f1",
        cards: [
          { tag: "INTERESTS SYNC · 45%", tagColor: "#6366f1", title: "Core interests detected: AI and Web Dev" },
          { tag: "MATCHED FOR YOU", tagColor: "#06b6d4", title: "Searching Google developer network channels..." },
          { tag: "TODAY, 2:00 PM", tagColor: "#7DD3FC", title: "Induction Ceremony — Auditorium" }
        ],
        desc: "Establishing student data signature. Spatially filtering academic slots."
      };
    } else if (pct < 90) {
      return {
        status: "Twin Status: Calibrating Opportunity Radar...",
        color: "#06b6d4",
        cards: [
          { tag: "DEADLINE · 2 DAYS", tagColor: "#6366f1", title: "AI Club registration closes" },
          { tag: "MATCHED FOR YOU", tagColor: "#06b6d4", title: "Smart India Hackathon prep session" },
          { tag: "TODAY, 2:00 PM", tagColor: "#7DD3FC", title: "Data Structures — Room 214" }
        ],
        desc: "Constellation calibration stable. 3D opportunity matching active."
      };
    } else {
      return {
        status: "Twin Status: Fully Synchronized!",
        color: "#10b981",
        cards: [
          { tag: "DEADLINE · 3 HOURS", tagColor: "#ef4444", title: "Python Lab #2 Assignment Submission" },
          { tag: "RADAR MATCH · 98%", tagColor: "#10b981", title: "Google GenAI Hackathon (Matches Python, Web Dev)" },
          { tag: "TWIN RECOMMENDATION", tagColor: "#06b6d4", title: "Attend NSS Induction (Fits Friday 4 PM gap)" }
        ],
        desc: "Digital twin active and fully configured. Proactive campus monitoring online."
      };
    }
  };

  const content = getDynamicContent(progress);

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 24px" }}>
      <div className="tf-mono" style={{ fontSize: 12, color: "#06b6d4", textTransform: "uppercase", marginBottom: 10, letterSpacing: '0.05em' }}>A peek inside</div>
      <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, margin: "0 0 30px", fontFamily: 'var(--font-heading)' }}>Your twin's dashboard</h2>
      
      <Card3D tilt={3} style={{ borderRadius: 20, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Good morning,</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", fontFamily: 'var(--font-heading)' }}>Arun's Twin</div>
          </div>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: "50%", 
            background: `linear-gradient(135deg, #6366f1, ${content.color})`,
            boxShadow: `0 0 15px ${content.color}80`,
            transition: 'all 0.4s ease'
          }} />
        </div>

        {/* Dynamic Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }} className="tf-grid-3">
          {content.cards.map((c, idx) => (
            <div key={idx} style={{ 
              borderRadius: 14, 
              padding: 16, 
              borderLeft: `3px solid ${c.tagColor}`, 
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderLeftColor: c.tagColor
            }}>
              <div className="tf-mono" style={{ fontSize: 10, color: c.tagColor, fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>{c.tag}</div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: '#f4f4f9' }}>{c.title}</div>
            </div>
          ))}
        </div>

        {/* Slider control */}
        <div style={{ borderRadius: 14, padding: "16px 18px", background: 'rgba(13,17,32,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="tf-mono" style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>{content.status}</span>
            <span className="tf-mono" style={{ fontSize: 13, color: content.color, fontWeight: 700, transition: 'color 0.3s' }}>{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="tf-slider"
            style={{ 
              width: '100%',
              cursor: 'pointer',
              accentColor: content.color
            }}
            aria-label="Twin learning progress"
          />
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, transition: 'all 0.3s' }}>{content.desc}</div>
        </div>
      </Card3D>
    </div>
  );
}

function LandingPage({ onNavigate, userProfile }) {
  const [heroVisual, setHeroVisual] = useState('constellation');
  const [selectedPoster, setSelectedPoster] = useState('original');
  const features = [
    {
      icon: <Brain size={24} style={{ color: '#6366f1' }} />,
      title: "AI Digital Twin",
      desc: "A living profile that grows with every interaction, not a static form you fill once."
    },
    {
      icon: <Sparkles size={24} style={{ color: '#06b6d4' }} />,
      title: "Twin Intelligence",
      desc: "Understands your department, timetable and goals well enough to speak like a senior, not a search bar."
    },
    {
      icon: <Compass size={24} style={{ color: '#ec4899' }} />,
      title: "Opportunity Radar",
      desc: "Surfaces hackathons, internships and clubs that actually match your interests."
    },
    {
      icon: <Calendar size={24} style={{ color: '#10b981' }} />,
      title: "Smart Planner",
      desc: "Keeps your timetable, deadlines and registrations in one place, before they sneak up on you."
    },
    {
      icon: <MapPin size={24} style={{ color: '#f59e0b' }} />,
      title: "Campus Navigator",
      desc: "Finds the right classroom, faculty cabin or office without three phone calls."
    },
    {
      icon: <Zap size={24} style={{ color: '#8b5cf6' }} />,
      title: "Personalized Journey",
      desc: "Every recommendation is shaped by what you've already done and where you're headed."
    },
    {
      icon: <TrendingUp size={24} style={{ color: '#3b82f6' }} />,
      title: "Growth Analytics",
      desc: "A quiet log of the skills, events and clubs that are shaping your first year."
    },
    {
      icon: <Bell size={24} style={{ color: '#ef4444' }} />,
      title: "Proactive AI Alerts",
      desc: "Nudges you before a deadline passes, not after."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Login",
      desc: "Sign in with your college email in seconds."
    },
    {
      number: "02",
      title: "Build Twin",
      desc: "Answer nine quick onboarding questions about you."
    },
    {
      number: "03",
      title: "AI Learns",
      desc: "Your twin studies your department, goals, and interests."
    },
    {
      number: "04",
      title: "Personalized Guidance",
      desc: "Get a campus journey custom shaped around your daily timetable."
    }
  ];

  return (
    <div style={{ background: '#050508', minHeight: '100vh', paddingBottom: '0' }} className="animate-fade-in">
      {/* Floating Navbar */}
      <header style={{
        position: 'sticky',
        top: '16px',
        zIndex: 50,
        margin: '16px auto',
        width: '90%',
        maxWidth: '1160px',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} className="glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)', 
            padding: '8px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Bot size={22} color="white" />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: '20px', 
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 60%, #a1a1aa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TwinFusion <span style={{ color: '#06b6d4' }}>AI</span>
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="tf-hide-mobile">
          <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} className="tf-navlink">Features</a>
          <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} className="tf-navlink">How It Works</a>
        </nav>

        <div>
          {userProfile ? (
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="btn-3d" 
              style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '10px' }}
            >
              Portal Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={() => onNavigate('login')} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px 16px' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('signup')} 
                className="btn-3d" 
                style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '10px' }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 100px 24px',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '1160px',
        margin: '0 auto'
      }}>
        {/* Moving 3D Grid Perspective */}
        <div className="grid-perspective-container">
          <div className="grid-3d" style={{ opacity: 0.45 }}></div>
        </div>

        {/* Ambient Blur Glows */}
        <div className="glow-blob glow-primary" style={{ top: '-10%', left: '20%', transform: 'translateX(-50%)' }} />
        <div className="glow-blob glow-accent" style={{ bottom: '10%', right: '10%' }} />

        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          display: 'grid', 
          gridTemplateColumns: '1.05fr 0.95fr', 
          gap: '40px', 
          alignItems: 'center',
          textAlign: 'left'
        }} className="tf-grid-2">
          
          {/* Hero Left Column */}
          <div>
            <div className="tf-mono" style={{ fontSize: 12, color: '#6366f1', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Google Student Ambassador Team &middot; Freshers Portal
            </div>

            <h1 style={{ 
              fontSize: 'clamp(34px, 5vw, 56px)', 
              lineHeight: 1.05, 
              letterSpacing: '-0.02em', 
              marginBottom: '22px', 
              background: 'linear-gradient(to right, #ffffff, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800
            }}>
              Every fresher deserves<br />an AI senior who<br /><span style={{ color: '#6366f1' }}>remembers</span> them.
            </h1>

            <p style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: '36px', maxWidth: '480px', lineHeight: 1.6 }}>
              TwinFusion AI builds a personal Digital Twin for every student — one that learns your department, interests and goals, then guides you through clubs, events, deadlines and campus life without you having to ask twice.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={() => onNavigate(userProfile ? 'dashboard' : 'signup')} className="btn-3d" style={{ padding: '14px 28px', fontSize: '16px' }}>
                Get Started <ArrowRight size={16} />
              </button>
              <a href="#how-it-works" className="btn-secondary-3d" style={{ padding: '14px 28px', fontSize: '16px', textDecoration: 'none' }}>
                See how it works
              </a>
            </div>

            {/* Live Counter proofs */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '40px', flexWrap: 'wrap' }}>
              {[
                { value: 8, label: "AI signals tracked" },
                { value: 9, label: "onboarding questions" },
                { value: 24, suffix: "/7", label: "proactive guidance" },
              ].map((s, i) => (
                <div key={i} style={{ transition: 'transform 0.2s ease' }} className="tf-stat">
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#f4f4f9', fontFamily: 'var(--font-heading)' }}>
                    <CountUp to={s.value} suffix={s.suffix || ""} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right Column: Interactive Constellation & Poster Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Visual View Toggle */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              zIndex: 5
            }}>
              <button 
                onClick={() => setHeroVisual('constellation')}
                style={{
                  background: heroVisual === 'constellation' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  color: heroVisual === 'constellation' ? '#ffffff' : '#8e9bb0',
                  padding: '6px 14px',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Network Constellation
              </button>
              <button 
                onClick={() => setHeroVisual('poster')}
                style={{
                  background: heroVisual === 'poster' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  color: heroVisual === 'poster' ? '#ffffff' : '#8e9bb0',
                  padding: '6px 14px',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Launch Campaign Poster
              </button>
            </div>

            {heroVisual === 'constellation' ? (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Tilt max={10}>
                  <TwinConstellation />
                </Tilt>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '380px' }}>
                <Tilt max={8}>
                  <img 
                    src={
                      selectedPoster === 'original' 
                        ? '/original_poster.jpg' 
                        : selectedPoster === 'obsidian' 
                          ? '/obsidian_poster.jpg' 
                          : '/blueprint_poster.jpg'
                    } 
                    alt="Launch Campaign Poster" 
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                    }} 
                  />
                </Tilt>
                {/* Poster Style Switcher */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setSelectedPoster('original')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: selectedPoster === 'original' ? '#06b6d4' : '#8e9bb0',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: selectedPoster === 'original' ? 'underline' : 'none'
                    }}
                  >
                    Original Layout
                  </button>
                  <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '11px' }}>|</span>
                  <button 
                    onClick={() => setSelectedPoster('obsidian')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: selectedPoster === 'obsidian' ? '#06b6d4' : '#8e9bb0',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: selectedPoster === 'obsidian' ? 'underline' : 'none'
                    }}
                  >
                    Obsidian Layout
                  </button>
                  <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '11px' }}>|</span>
                  <button 
                    onClick={() => setSelectedPoster('blueprint')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: selectedPoster === 'blueprint' ? '#06b6d4' : '#8e9bb0',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: selectedPoster === 'blueprint' ? 'underline' : 'none'
                    }}
                  >
                    HUD Blueprint
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{
        padding: '100px 24px',
        maxWidth: '1160px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'left', marginBottom: '60px' }}>
          <div className="tf-mono" style={{ fontSize: 12, color: '#06b6d4', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.05em' }}>What your twin gives you</div>
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 36px)", fontWeight: 700, margin: '0', fontFamily: 'var(--font-heading)' }}>Eight signals your twin is always reading</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {features.map((f, i) => (
            <Card3D key={i} tilt={7} style={{ padding: '24px', height: '100%' }}>
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '11px', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px' 
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>{f.desc}</p>
            </Card3D>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: '100px 24px',
        maxWidth: '1160px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'left', marginBottom: '60px' }}>
          <div className="tf-mono" style={{ fontSize: 12, color: '#6366f1', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.05em' }}>The process</div>
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 36px)", fontWeight: 700, margin: '0', fontFamily: 'var(--font-heading)' }}>How it works</h2>
        </div>

        <div className="card-3d tf-grid-2" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{ 
              padding: 26, 
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" 
            }}>
              <div className="tf-mono" style={{ fontSize: 22, color: "var(--text-muted)", marginBottom: 14 }}>{s.number}</div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Dashboard Preview Card */}
      <DashboardPreview />

      {/* Technology Stack Marquee */}
      <section id="tech" style={{
        padding: '50px 24px 70px',
        maxWidth: '1160px',
        margin: '0 auto'
      }}>
        <div className="tf-mono" style={{ fontSize: 12, color: '#6366f1', textTransform: 'uppercase', marginBottom: 16, textAlign: 'left', letterSpacing: '0.05em' }}>Built with</div>
        <div className="tf-marquee">
          <div className="tf-marquee-track">
            {["React", "Google Gemini", "Node.js", "MySQL", "Express", "REST API"].map((t, idx) => (
              <div key={idx} className="tf-mono tf-tech-pill" style={{ 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: 999, 
                padding: "9px 18px", 
                fontSize: 13, 
                color: "var(--text-muted)", 
                whiteSpace: "nowrap",
                background: 'rgba(255,255,255,0.01)'
              }}>
                {t}
              </div>
            ))}
            {["React", "Google Gemini", "Node.js", "MySQL", "Express", "REST API"].map((t, idx) => (
              <div key={`dup-${idx}`} className="tf-mono tf-tech-pill" style={{ 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: 999, 
                padding: "9px 18px", 
                fontSize: 13, 
                color: "var(--text-muted)", 
                whiteSpace: "nowrap",
                background: 'rgba(255,255,255,0.01)'
              }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'transparent'
      }}>
        <div style={{ 
          maxWidth: '1160px', 
          margin: '0 auto', 
          padding: '28px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            &copy; 2026 TwinFusion AI &middot; Built for the Google Student Ambassador hackathon
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            {/* Inline SVG Github icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>github.com/twinfusion-ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
