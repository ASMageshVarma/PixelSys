import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Calendar, 
  Compass, 
  Map, 
  TrendingUp, 
  LogOut, 
  Users, 
  Award, 
  Bell, 
  Search, 
  AlertTriangle,
  Clock,
  BookOpen,
  MapPin,
  Sparkles
} from 'lucide-react';

function Dashboard({ profile, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub', 'planner', 'navigator'
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Default demo profile in case page is accessed directly or before state loads
  const userProfile = profile || {
    name: "Alex Rivera",
    department: "Computer Science and Engineering",
    year: "1st Year",
    section: "A",
    interests: ["Artificial Intelligence", "Web Development", "Entrepreneurship"],
    careerGoal: "AI/ML Engineer",
    clubs: ["AI Club", "Coding Club"],
    skills: ["Python", "Web Development"],
    helpPreferences: ["Find clubs", "Recommend events", "Plan my timetable", "Find hackathons"]
  };

  // Initialize twin chat with greeting
  useEffect(() => {
    const greeting = `Hey ${userProfile.name}! 👋 I'm your AI Digital Twin. I've finished calibrating with your profile:
- 🎓 **Dept**: ${userProfile.department} (${userProfile.year})
- 🎯 **Career Target**: ${userProfile.careerGoal}
- 💡 **Key Interests**: ${userProfile.interests.join(', ')}

How can I guide you today? You can ask me about:
1. "Which clubs fit my skills?"
2. "Are there any hackathons or events for me?"
3. "Show me my study planner recommendations."
4. "Where is the Google Innovation Lab located?"`;

    setChatMessages([
      { sender: 'twin', text: greeting, timestamp: new Date() }
    ]);
  }, [profile]);

  // AI Chatbot simulation matching rules
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsgList = [...chatMessages, { sender: 'user', text: userText, timestamp: new Date() }];
    setChatMessages(newMsgList);
    setChatInput('');

    // Simulate thinking delay
    setTimeout(() => {
      let replyText = "";
      const lowerText = userText.toLowerCase();

      if (lowerText.includes('club')) {
        replyText = `Based on your interest in **${userProfile.interests[0] || 'engineering'}** and career target as **${userProfile.careerGoal}**, I highly recommend focusing on these campus groups:
- 👥 **${userProfile.clubs.includes('AI Club') ? 'AI Club' : 'Coding Club'}**: They are hosting a workshop next week. Fits your schedule!
- 👥 **Entrepreneurship Club**: Great for building side projects into potential startups.
Would you like me to add their meeting slots to your calendar?`;
      } 
      else if (lowerText.includes('hackathon') || lowerText.includes('event')) {
        replyText = `Opportunity Radar is picking up two high-match events for you:
1. 🏆 **Google GenAI Hackathon** (Starts in 2 weeks): Perfect for your skills in *${userProfile.skills.join(', ') || 'Python'}*. 
2. 💻 **Freshers Web Bootcamp** (Friday at 3 PM): A great way to match with senior mentors.
I can set a proactive alert for registrations if you like!`;
      } 
      else if (lowerText.includes('timetable') || lowerText.includes('planner') || lowerText.includes('schedule') || lowerText.includes('study')) {
        replyText = `Here is my calendar recommendation for **${userProfile.name}**:
- 📅 **Friday 2:00 PM**: AI project study slot (calibrated before your next lab).
- 📅 **Wednesday 4:00 PM**: Club activity session.
I've also flagged the **Python Lab Assignment** deadline due tomorrow at midnight. Let's aim to start it today!`;
      } 
      else if (lowerText.includes('lab') || lowerText.includes('room') || lowerText.includes('where') || lowerText.includes('map') || lowerText.includes('building')) {
        replyText = `I can help with campus navigation! 
- The 🌟 **Google Innovation Lab** is located on the **3rd floor of the Main Academic Block (Room 304)**.
- The **Central Library** is in Building B, open till 8 PM.
You can click on the **Campus Navigator** tab at the top right of your dashboard to view the interactive campus floor map!`;
      } 
      else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        replyText = `Hey ${userProfile.name}! Twin online and fully synced. Ask me about clubs, upcoming hackathons, campus directions, or your planner slots!`;
      } 
      else {
        replyText = `I'm processing that request! As your AI Senior, I suggest looking into your custom **Opportunity Radar** items or checking the **Smart Planner** calendar grid to stay ahead of deadlines. Let me know if you want me to outline specific steps for your goal: **${userProfile.careerGoal}**!`;
      }

      setChatMessages(prev => [...prev, { sender: 'twin', text: replyText, timestamp: new Date() }]);
    }, 800);
  };

  // Mock Campus Buildings Data
  const buildings = [
    {
      id: "academic",
      name: "Main Academic Block",
      description: "Center of engineering departments, lecture halls, and administrative offices.",
      rooms: ["Room 101: Basic Programming Lab", "Room 204: Electronics workshop", "Room 304: Google Innovation Lab"],
      hours: "8:00 AM - 5:00 PM",
      events: "Gemini Dev Meetup (Tues, 2 PM)"
    },
    {
      id: "library",
      name: "Central Library Block",
      description: "Four stories of technical books, reference materials, and quiet digital study capsules.",
      rooms: ["Reference Section (Ground Floor)", "Digital Research Lab (2nd Floor)", "Main Reading Hall (3rd Floor)"],
      hours: "7:00 AM - 8:00 PM",
      events: "None scheduled"
    },
    {
      id: "canteen",
      name: "Student Cafeteria & Hub",
      description: "Food court, recreational rooms, and open air discussion courtyards.",
      rooms: ["Main Dining Hall", "Recreational Table Tennis Room", "Club Committee Cabin"],
      hours: "8:00 AM - 7:00 PM",
      events: "Dance Club Auditions (Friday, 4 PM)"
    },
    {
      id: "auditorium",
      name: "Netaji Seminar Auditorium",
      description: "Main air-conditioned theater for guest lectures, hackathons, and induction programs.",
      rooms: ["Main Stage Hall (600 seats)", "Green Room A & B", "AV control suite"],
      hours: "9:00 AM - 6:00 PM",
      events: "Freshers' Welcome Party (Saturday, 2 PM)"
    }
  ];

  // Helper for rendering messages with simple markdown-like double asterisk rendering
  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Simple regex replacement for **bold** text
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      return (
        <p key={idx} style={{ marginBottom: idx < text.split('\n').length - 1 ? '8px' : '0', lineHeight: 1.5 }}>
          {parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#06b6d4' }}>{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div style={{ background: '#07070a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      {/* Top Header */}
      <header style={{
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0d0d16'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', padding: '6px', borderRadius: '8px' }}>
            <Bot size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-heading)' }}>
            TwinFusion <span style={{ color: '#06b6d4' }}>Portal</span>
          </span>
          <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '999px', marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Synced
          </span>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('hub')}
            style={{
              background: activeTab === 'hub' ? 'rgba(99, 102, 241, 0.12)' : 'none',
              border: activeTab === 'hub' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activeTab === 'hub' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Compass size={16} /> Opportunity Radar
          </button>
          <button 
            onClick={() => setActiveTab('planner')}
            style={{
              background: activeTab === 'planner' ? 'rgba(99, 102, 241, 0.12)' : 'none',
              border: activeTab === 'planner' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activeTab === 'planner' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} /> Smart Planner
          </button>
          <button 
            onClick={() => setActiveTab('navigator')}
            style={{
              background: activeTab === 'navigator' ? 'rgba(99, 102, 241, 0.12)' : 'none',
              border: activeTab === 'navigator' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activeTab === 'navigator' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Map size={16} /> Campus Navigator
          </button>
        </div>

        {/* User profile dropdown & logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <h5 style={{ fontSize: '14px', margin: 0 }}>{userProfile.name}</h5>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{userProfile.department.split(' ')[0]} Section {userProfile.section}</p>
          </div>
          <button 
            onClick={onLogout} 
            style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title="Log Out"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '24px',
        padding: '24px',
        height: 'calc(100vh - 73px)',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {/* Left Section: AI Companion Chatbot Interface */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }} className="glass">
          
          {/* Active Twin Header */}
          <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 100%)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }} className="animate-orb">
              <Bot size={20} color="#06b6d4" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Twin Senior V1</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calibrated on your profile</p>
            </div>
            
            <button 
              onClick={() => {
                const response = confirm("Would you like to recalibrate your AI Digital Twin? This will restart the onboarding process.");
                if (response) onNavigate('onboarding');
              }}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Recalibrate
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(0,0,0,0.1)'
          }}>
            {chatMessages.map((msg, i) => {
              const isTwin = msg.sender === 'twin';
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: isTwin ? 'flex-start' : 'flex-end',
                  width: '100%'
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    borderTopLeftRadius: isTwin ? '2px' : '14px',
                    borderTopRightRadius: isTwin ? '14px' : '2px',
                    background: isTwin ? 'rgba(255,255,255,0.03)' : 'var(--primary)',
                    border: isTwin ? '1px solid var(--border-color)' : 'none',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    textAlign: 'left'
                  }}>
                    {isTwin ? renderMessageText(msg.text) : <p>{msg.text}</p>}
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '6px', textAlign: 'right' }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleSendMessage} style={{
            padding: '16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '10px'
          }}>
            <input 
              type="text" 
              placeholder="Ask your AI Senior a question..."
              className="input-field"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '10px', borderRadius: '10px', width: '38px', height: '38px', justifyContent: 'center' }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>

        {/* Right Section: Core Tabs Rendering */}
        <div style={{
          height: '100%',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          
          {/* TAB 1: Hub Dashboard */}
          {activeTab === 'hub' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
              
              {/* Profile Overview Bar */}
              <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="glass">
                <div>
                  <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Welcome, {userProfile.name}!</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Your virtual companion is calibrated and monitoring college milestones.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</span>
                    <h5 style={{ fontSize: '13px', margin: 0 }}>{userProfile.department.split(' ')[0]}</h5>
                  </div>
                  <div style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Goal</span>
                    <h5 style={{ fontSize: '13px', margin: 0, color: 'var(--accent)' }}>{userProfile.careerGoal}</h5>
                  </div>
                </div>
              </div>

              {/* Grid split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Opportunity Radar matches */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Compass size={18} color="var(--primary)" /> Opportunity Radar Match
                  </h3>

                  <div style={{ padding: '20px' }} className="glass">
                    <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>RECOMMENDED CLUBS</span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                      {userProfile.clubs.map((club, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < userProfile.clubs.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={16} color="#818cf8" />
                          </div>
                          <div>
                            <h5 style={{ fontSize: '14px', margin: 0 }}>{club}</h5>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Matches your interest in: {userProfile.interests[idx % userProfile.interests.length]}</p>
                          </div>
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Active</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '20px' }} className="glass">
                    <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>HACKATHON EVENTS</span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6,182,212,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={16} color="#22d3ee" />
                        </div>
                        <div>
                          <h5 style={{ fontSize: '14px', margin: 0 }}>Google GenAI Hackathon 2026</h5>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>High match for: {userProfile.skills.includes('Python') ? 'Python Dev' : 'Coding'}</p>
                        </div>
                        <button 
                          onClick={() => alert("Added Google GenAI Hackathon to your tracking. Your Twin will remind you 2 days before registration closes.")}
                          style={{ marginLeft: 'auto', background: 'var(--primary)', border: 'none', color: 'white', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Growth & Timeline checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={18} color="var(--accent)" /> Freshers Onboarding Progress
                  </h3>

                  <div style={{ padding: '24px' }} className="glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Calibrated milestones</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>60% Complete</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                      <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '4px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                        <input type="checkbox" checked readOnly style={{ accentColor: '#10b981' }} />
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>Setup Digital Twin profile signature</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                        <input type="checkbox" checked readOnly style={{ accentColor: '#10b981' }} />
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>Map department and section timetable</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                        <input type="checkbox" checked readOnly style={{ accentColor: '#10b981' }} />
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>Select core career goals</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                        <input type="checkbox" readOnly style={{ accentColor: '#10b981' }} />
                        <span>Attend AI Club introductory workshop</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                        <input type="checkbox" readOnly style={{ accentColor: '#10b981' }} />
                        <span>Visit Google Innovation Lab (Academic Block Room 304)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Smart Planner */}
          {activeTab === 'planner' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
              <div>
                <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Calibrated Campus Planner</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Your AI Twin dynamically manages your daily schedule and coursework timeline.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Visual Timetable Grid */}
                <div style={{ padding: '20px' }} className="glass">
                  <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--primary)" /> Timetable (Today)
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>09:00 AM</span>
                      <div>
                        <h5 style={{ fontSize: '13.5px', margin: 0 }}>Applied Mathematics II</h5>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Block A, Lecture Room 102</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>11:30 AM</span>
                      <div>
                        <h5 style={{ fontSize: '13.5px', margin: 0, color: '#818cf8' }}>Python Programming Lab</h5>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Main Academic Block, Room 101</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>01:30 PM</span>
                      <div>
                        <h5 style={{ fontSize: '13.5px', margin: 0 }}>LUNCH BREAK</h5>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Student Cafeteria Hub</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>03:00 PM</span>
                      <div>
                        <h5 style={{ fontSize: '13.5px', margin: 0 }}>Professional Communication</h5>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Block A, Lecture Room 204</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deadlines and Proactive alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '20px' }} className="glass">
                    <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={16} color="#f59e0b" /> Proactive AI Alerts
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', display: 'flex', gap: '10px' }}>
                        <Clock size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <h5 style={{ fontSize: '13px', margin: 0, color: '#f59e0b' }}>Python Assignment #2 due in 3 hours</h5>
                          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Lab files must be pushed to Google Drive submission portal by 5 PM.</p>
                        </div>
                      </div>

                      <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '10px', display: 'flex', gap: '10px' }}>
                        <Sparkles size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <h5 style={{ fontSize: '13px', margin: 0, color: '#818cf8' }}>Timetable Optimization Complete</h5>
                          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Blocked 4 PM to 5 PM today for self study to cover Python assignment.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: Campus Navigator */}
          {activeTab === 'navigator' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
              <div>
                <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Interactive Campus Floor Navigator</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Click on a building on the map blueprint below to view department labs, classrooms, timings, and events.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* SVG Blueprint Map */}
                <div style={{ padding: '24px', position: 'relative' }} className="glass">
                  <h4 style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="var(--accent)" /> Campus Layout Blueprint
                  </h4>
                  
                  {/* Map Grid */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '280px',
                    background: '#09090f',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* SVG map blueprint representation */}
                    <svg width="100%" height="100%" viewBox="0 0 400 240" style={{ pointerEvents: 'all' }}>
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Paths and Roads */}
                      <path d="M 200 10 L 200 230" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="12" strokeDasharray="5,5" fill="none" />
                      <path d="M 20 120 L 380 120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="12" strokeDasharray="5,5" fill="none" />

                      {/* Main Academic Block Card (Interactive) */}
                      <g 
                        onClick={() => setSelectedBuilding(buildings[0])}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect x="40" y="30" width="110" height="60" rx="6" fill={selectedBuilding?.id === 'academic' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.02)'} stroke={selectedBuilding?.id === 'academic' ? 'var(--primary)' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
                        <text x="95" y="65" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Academic Block</text>
                        <circle cx="95" cy="45" r="4" fill="var(--primary)" />
                      </g>

                      {/* Central Library Block (Interactive) */}
                      <g 
                        onClick={() => setSelectedBuilding(buildings[1])}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect x="250" y="30" width="110" height="60" rx="6" fill={selectedBuilding?.id === 'library' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.02)'} stroke={selectedBuilding?.id === 'library' ? 'var(--accent)' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
                        <text x="305" y="65" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Central Library</text>
                        <circle cx="305" cy="45" r="4" fill="var(--accent)" />
                      </g>

                      {/* Cafeteria (Interactive) */}
                      <g 
                        onClick={() => setSelectedBuilding(buildings[2])}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect x="40" y="150" width="110" height="60" rx="6" fill={selectedBuilding?.id === 'canteen' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.02)'} stroke={selectedBuilding?.id === 'canteen' ? '#f59e0b' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
                        <text x="95" y="185" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Student Canteen</text>
                        <circle cx="95" cy="165" r="4" fill="#f59e0b" />
                      </g>

                      {/* Auditorium (Interactive) */}
                      <g 
                        onClick={() => setSelectedBuilding(buildings[3])}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect x="250" y="150" width="110" height="60" rx="6" fill={selectedBuilding?.id === 'auditorium' ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255,255,255,0.02)'} stroke={selectedBuilding?.id === 'auditorium' ? '#ec4899' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
                        <text x="305" y="185" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Main Auditorium</text>
                        <circle cx="305" cy="165" r="4" fill="#ec4899" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Building details side box */}
                <div style={{ height: '100%' }}>
                  {selectedBuilding ? (
                    <div style={{ padding: '24px', textAlign: 'left' }} className="glass animate-slide-up">
                      <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', tracking: '0.1em' }}>Building Selected</span>
                      <h3 style={{ fontSize: '18px', marginTop: '4px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>{selectedBuilding.name}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{selectedBuilding.description}</p>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>ROOM DIRECTORY</span>
                        <ul style={{ paddingLeft: '16px', fontSize: '12px', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {selectedBuilding.rooms.map((room, idx) => (
                            <li key={idx}>{room}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>OPEN HOURS</span>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{selectedBuilding.hours}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>TODAY'S EVENT</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>{selectedBuilding.events}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }} className="glass">
                      <MapPin size={36} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                      <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>No Location Selected</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Click any building block on the blueprint layout map to query the digital campus guide directory.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
