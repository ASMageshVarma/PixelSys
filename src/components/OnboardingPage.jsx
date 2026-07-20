import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  Target, 
  Users, 
  Wrench, 
  HelpCircle,
  Cpu
} from 'lucide-react';

function OnboardingPage({ onComplete, onNavigate }) {
  const [step, setStep] = useState(1);
  
  // State variables for form fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [year, setYear] = useState('1st Year');
  const [section, setSection] = useState('A');
  
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedHelp, setSelectedHelp] = useState([]);

  // Option lists
  const departments = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Artificial Intelligence and Data Science"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const sections = ["A", "B", "C"];

  const interestsList = [
    "Artificial Intelligence", "Web Development", "Cloud Computing", 
    "Cyber Security", "Data Science", "Mobile App Development", 
    "UI/UX Design", "Robotics", "IoT", "Competitive Programming", 
    "Sports", "Music", "Photography", "Entrepreneurship"
  ];

  const careersList = [
    "Software Engineer", "AI/ML Engineer", "Data Scientist", 
    "Cloud Engineer", "Cyber Security Engineer", "UI/UX Designer", 
    "Entrepreneur", "Higher Studies", "Government Jobs", "Not Sure Yet"
  ];

  const clubsList = [
    "AI Club", "Coding Club", "Robotics Club", "Photography Club", 
    "Music Club", "Dance Club", "Sports Club", "NSS", "NCC", "Entrepreneurship Club"
  ];

  const skillsList = [
    "Python", "Java", "C/C++", "Web Development", "Flutter", 
    "UI/UX Design", "Public Speaking", "Leadership", "Video Editing", 
    "Graphic Design", "None Yet"
  ];

  const helpList = [
    "Find clubs", "Recommend events", "Plan my timetable", 
    "Find hackathons", "Track deadlines", "Recommend courses", 
    "Career guidance", "Find mentors"
  ];

  // Helper toggle functions
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleClub = (club) => {
    if (selectedClubs.includes(club)) {
      setSelectedClubs(selectedClubs.filter(c => c !== club));
    } else {
      setSelectedClubs([...selectedClubs, club]);
    }
  };

  const toggleSkill = (skill) => {
    if (skill === "None Yet") {
      setSelectedSkills(["None Yet"]);
      return;
    }
    const filtered = selectedSkills.filter(s => s !== "None Yet");
    if (filtered.includes(skill)) {
      setSelectedSkills(filtered.filter(s => s !== skill));
    } else {
      setSelectedSkills([...filtered, skill]);
    }
  };

  const toggleHelp = (help) => {
    if (selectedHelp.includes(help)) {
      setSelectedHelp(selectedHelp.filter(h => h !== help));
    } else {
      setSelectedHelp([...selectedHelp, help]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      alert("Please enter your name to proceed.");
      return;
    }
    if (step === 2 && selectedInterests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }
    if (step === 3 && !selectedCareer) {
      alert("Please select your career goal.");
      return;
    }
    if (step === 4 && selectedSkills.length === 0) {
      alert("Please select your skills (or select 'None Yet').");
      return;
    }
    if (step === 5 && selectedHelp.length === 0) {
      alert("Please select at least one preference.");
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Completed onboarding
      const profile = {
        name,
        department,
        year,
        section,
        interests: selectedInterests,
        careerGoal: selectedCareer,
        clubs: selectedClubs,
        skills: selectedSkills,
        helpPreferences: selectedHelp
      };
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onNavigate('signup');
    }
  };

  // Dynamic Twin Calibration Status text
  const getOrbStatus = () => {
    switch (step) {
      case 1: return { status: "Awaiting Identity...", detail: "Waiting for student data signature" };
      case 2: return { status: "Syncing Interests...", detail: `Mapping ${selectedInterests.length} interest nodes` };
      case 3: return { status: "Plotting Career Trajectory...", detail: selectedCareer ? `Target: ${selectedCareer}` : "Evaluating goals" };
      case 4: return { status: "Linking Clubs & Skills...", detail: `${selectedClubs.length} Clubs | ${selectedSkills.length} Skills` };
      case 5: return { status: "Finalizing Synchronization...", detail: "Merging parameters into AI Digital Twin" };
      default: return { status: "Processing...", detail: "" };
    }
  };

  const orbStatus = getOrbStatus();

  return (
    <div style={{
      background: '#07070a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }} className="animate-fade-in">
      {/* Moving 3D Grid Perspective */}
      <div className="grid-perspective-container">
        <div className="grid-3d" style={{ opacity: 0.35 }}></div>
      </div>
      
      {/* Ambient Blur Glows */}
      <div className="glow-blob glow-primary" style={{ top: '10%', left: '15%' }} />
      <div className="glow-blob glow-accent" style={{ bottom: '10%', right: '15%' }} />
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '40px',
        minHeight: '600px',
        alignItems: 'stretch',
        flexWrap: 'wrap'
      }}>
        
        {/* Left Side: Twin Calibration Animation Visualizer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }} className="card-3d">
          <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="#06b6d4" />
            <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Calibration Core</span>
          </div>

          {/* Glowing Calibration Neural Orb */}
          <div style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Pulsing Back Glow */}
            <div style={{
              position: 'absolute',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: step === 5 
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(6, 182, 212, 0.3) 50%, rgba(0,0,0,0) 70%)',
              zIndex: 0
            }} className="animate-orb" />

            {/* Simulated Grid SVG inside */}
            <svg width="180" height="180" viewBox="0 0 100 100" style={{ position: 'relative', zIndex: 1 }} className="animate-spin-slow">
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              
              {/* Central Core */}
              <circle cx="50" cy="50" r="10" fill="url(#coreGrad)" />
              
              {/* Nodes and Links (Dynamic based on steps) */}
              {step >= 1 && <circle cx="50" cy="20" r="3" fill="#6366f1" />}
              {step >= 2 && <circle cx="76" cy="35" r="3" fill="#06b6d4" />}
              {step >= 3 && <circle cx="76" cy="65" r="3" fill="#ec4899" />}
              {step >= 4 && <circle cx="50" cy="80" r="3" fill="#10b981" />}
              {step >= 5 && <circle cx="24" cy="65" r="3" fill="#f59e0b" />}
              
              {step >= 2 && <line x1="50" y1="20" x2="76" y2="35" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />}
              {step >= 3 && <line x1="76" y1="35" x2="76" y2="65" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="1" />}
              {step >= 4 && <line x1="76" y1="65" x2="50" y2="80" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />}
              {step >= 5 && <line x1="50" y1="80" x2="24" y2="65" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" />}
              {step >= 5 && <line x1="24" y1="65" x2="50" y2="20" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" />}

              <defs>
                <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{orbStatus.status}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>{orbStatus.detail}</p>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                style={{
                  width: s === step ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: s === step 
                    ? 'linear-gradient(135deg, #6366f1, #06b6d4)' 
                    : s < step 
                      ? '#10b981' 
                      : 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Step Questionnaire Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '40px'
        }} className="card-3d">
          
          {/* Header info */}
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Step {step} of 5</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
              {step === 1 && "Identity Verification"}
              {step === 2 && "Interest Matching"}
              {step === 3 && "Career Blueprint"}
              {step === 4 && "Clubs & Skill Calibrator"}
              {step === 5 && "Digital Integration"}
            </span>
          </div>

          {/* Form Step Renderers */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="animate-slide-up" style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Who is this Twin for?</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Let's authenticate your identity signature. Your Digital Twin will be registered on these parameters.</p>
                
                <div className="input-group">
                  <span className="input-label">Full Name</span>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <span className="input-label">Department</span>
                  <select 
                    className="input-field" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: '100%', background: '#0e0e15' }}
                  >
                    {departments.map((dept, i) => (
                      <option key={i} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <span className="input-label">Academic Year</span>
                    <select 
                      className="input-field" 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      style={{ width: '100%', background: '#0e0e15' }}
                    >
                      {years.map((y, i) => (
                        <option key={i} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <span className="input-label">Section</span>
                    <select 
                      className="input-field" 
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      style={{ width: '100%', background: '#0e0e15' }}
                    >
                      {sections.map((sec, i) => (
                        <option key={i} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div className="animate-slide-up" style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Select Your Core Interests</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Select the subjects or activities you are eager to engage in. This maps events on your Opportunity Radar.</p>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px', 
                  maxHeight: '320px', 
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}>
                  {interestsList.map((interest, i) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        style={{
                          background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Compass size={14} color={isSelected ? '#818cf8' : 'currentColor'} />
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Career Goal */}
            {step === 3 && (
              <div className="animate-slide-up" style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Target Career Endpoint</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Choose your primary aim. Your AI Senior calibrates dashboard courses and skill suggestions around this goal.</p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px', 
                  maxHeight: '320px', 
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}>
                  {careersList.map((career, i) => {
                    const isSelected = selectedCareer === career;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedCareer(career)}
                        style={{
                          background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%', 
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'
                        }}>
                          {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                        </div>
                        {career}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Clubs & Skills */}
            {step === 4 && (
              <div className="animate-slide-up" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Clubs & Active Skills</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Select which clubs spark your curiosity and what tech skills you bring to campus.</p>
                </div>

                {/* Clubs Sub-Section */}
                <div>
                  <h4 style={{ fontSize: '14px', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="#818cf8" /> Which clubs would you like to join?
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                    {clubsList.map((club, i) => {
                      const isSelected = selectedClubs.includes(club);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleClub(club)}
                          style={{
                            background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {club}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills Sub-Section */}
                <div>
                  <h4 style={{ fontSize: '14px', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wrench size={14} color="#06b6d4" /> What skills do you already have?
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                    {skillsList.map((skill, i) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          style={{
                            background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Help Preferences */}
            {step === 5 && (
              <div className="animate-slide-up" style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>AI Companion Preferences</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Select the main tasks you would like your Digital Twin to manage and monitor.</p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px', 
                  maxHeight: '320px', 
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}>
                  {helpList.map((help, i) => {
                    const isSelected = selectedHelp.includes(help);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleHelp(help)}
                        style={{
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${isSelected ? '#10b981' : 'var(--border-color)'}`,
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          readOnly
                          style={{ accentColor: '#10b981', cursor: 'pointer' }}
                        />
                        {help}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Stepper Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '40px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px'
          }}>
            <button 
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              onClick={handleNext}
              className="btn-3d"
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            >
              {step === 5 ? "Deploy Digital Twin" : "Proceed"} <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default OnboardingPage;
