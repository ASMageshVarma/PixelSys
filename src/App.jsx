import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import Dashboard from './components/Dashboard';

/* ---------------------------------------------------------------- */
/* AMBIENT 3D BACKGROUND: depth field + perspective grid + glow mesh  */
/* ---------------------------------------------------------------- */
function AmbientBackground() {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 8,
        y: (e.clientY / window.innerHeight - 0.5) * 8
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // depth-sorted particle field
    const COUNT = 60;
    const particles = Array.from({ length: COUNT }).map(() => {
      const z = Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: 0.5 + z * 1.6,
        vx: (Math.random() - 0.5) * 0.00035 * (0.5 + z),
        vy: (Math.random() - 0.5) * 0.00035 * (0.5 + z),
      };
    });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = 1; else if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; else if (p.y > 1) p.y = 0;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const reach = 120 * ((a.z + b.z) / 2 + 0.35);
          if (dist < reach) {
            const alpha = (1 - dist / reach) * 0.14 * ((a.z + b.z) / 2 + 0.2);
            ctx.strokeStyle = `rgba(6,182,212,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = p.z > 0.62 ? "rgba(6,182,212,0.7)" : "rgba(138,58,255,0.45)";
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* 3D Glowing Neon background blobs */}
      <div style={{ position: "absolute", top: "-12%", left: "-8%", width: "58%", height: "58%", background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)", filter: "blur(90px)" }} />
      <div style={{ position: "absolute", bottom: "-18%", right: "-10%", width: "62%", height: "62%", background: "radial-gradient(circle, rgba(6,182,212,0.22), transparent 70%)", filter: "blur(100px)" }} />
      <div style={{ position: "absolute", top: "40%", left: "40%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(138,58,255,0.08), transparent 70%)", filter: "blur(80px)" }} />
      
      {/* 3D Scrolling Perspective Grid with Mouse-Parallax */}
      <div
        className="tf-grid-animated"
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(6,182,212,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.06) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          transform: `perspective(600px) rotateX(${62 + mouse.y}deg) rotateY(${mouse.x}deg) scale(2.6) translateY(8%)`,
          transformOrigin: "top center",
          maskImage: "linear-gradient(to bottom, black, transparent 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 65%)",
          opacity: 0.65,
          transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)"
        }}
      />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }} />
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userProfile, setUserProfile] = useState(null);
  const [userCredentials, setUserCredentials] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (credentials) => {
    setUserCredentials(credentials);
    if (userProfile) {
      handleNavigate('dashboard');
    } else {
      handleNavigate('onboarding');
    }
  };

  const handleSignupSuccess = (credentials) => {
    setUserCredentials(credentials);
    handleNavigate('onboarding');
  };

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUserCredentials(null);
    setUserProfile(null);
    handleNavigate('landing');
  };

  return (
    <div className="page-container" style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <AmbientBackground />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {currentView === 'landing' && (
          <LandingPage onNavigate={handleNavigate} userProfile={userProfile} />
        )}
        {(currentView === 'login' || currentView === 'signup') && (
          <AuthPage 
            mode={currentView} 
            onNavigate={handleNavigate} 
            onLoginSuccess={handleLoginSuccess}
            onSignupSuccess={handleSignupSuccess}
          />
        )}
        {currentView === 'onboarding' && (
          <OnboardingPage 
            onComplete={handleOnboardingComplete}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'dashboard' && (
          <Dashboard 
            profile={userProfile} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
}

export default App;
