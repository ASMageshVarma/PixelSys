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
  Sparkles,
  UserCheck,
  CheckCircle2,
  Copy,
  Download
} from 'lucide-react';
import { 
  twinChat, 
  fetchChatHistory, 
  fetchOpportunities, 
  fetchStudyTwins, 
  fetchTwinAnalytics 
} from '../services/api';

function Dashboard({ profile, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub', 'planner', 'twins', 'analytics', 'navigator'
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickChips, setQuickChips] = useState([
    "What clubs fit my skills?",
    "Are there any hackathons for me?",
    "Show me study planner recommendations",
    "Where is the Innovation Lab located?"
  ]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [peers, setPeers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, text: "Python Assignment #2 due in 3 hours", urgent: true },
    { id: 2, text: "Google GenAI Hackathon registration closing soon", urgent: false },
    { id: 3, text: "GDSC Club meetup in Academic Block 304 tomorrow", urgent: false }
  ]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [joinedOpps, setJoinedOpps] = useState({});
  const [connectedPeers, setConnectedPeers] = useState({});
  const messagesEndRef = React.useRef(null);

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

  // Load initial backend data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [history, opps, studyTwins, stats] = await Promise.allSettled([
          fetchChatHistory(),
          fetchOpportunities(),
          fetchStudyTwins(),
          fetchTwinAnalytics()
        ]);

        if (history.status === 'fulfilled' && history.value && history.value.length > 0) {
          setChatMessages(history.value.map(m => ({
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
          })));
        } else {
          const greeting = `Hey ${userProfile.name}! 👋 I'm your AI Digital Twin. I've finished calibrating with your profile:
- 🎓 **Dept**: ${userProfile.department} (${userProfile.year})
- 🎯 **Career Target**: ${userProfile.careerGoal}
- 💡 **Key Interests**: ${(userProfile.interests || []).join(', ')}

How can I guide you today? You can ask me about:
1. "Which clubs fit my skills?"
2. "Are there any hackathons or events for me?"
3. "Show me my study planner recommendations."
4. "Where is the Google Innovation Lab located?"`;
          setChatMessages([{ sender: 'twin', text: greeting, timestamp: new Date() }]);
        }

        if (opps.status === 'fulfilled' && opps.value) setOpportunities(opps.value);
        if (studyTwins.status === 'fulfilled' && studyTwins.value) setPeers(studyTwins.value);
        if (stats.status === 'fulfilled' && stats.value) setAnalytics(stats.value);
      } catch (err) {
        console.warn("Using offline fallback:", err);
      }
    };
    loadInitialData();
  }, [profile]);

  // AI Chatbot with SSE Streaming & Gemini Fallback
  const handleSendMessage = async (inputVal) => {
    const userText = (typeof inputVal === 'string' ? inputVal : chatInput).trim();
    if (!userText) return;

    const newMsgList = [...chatMessages, { sender: 'user', text: userText, timestamp: new Date() }];
    setChatMessages(newMsgList);
    setChatInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const streamUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5173'
        ? 'http://127.0.0.1:8000/api/v1/twin/chat/stream'
        : '/api/v1/twin/chat/stream';
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: userText,
          profile: userProfile,
          history: newMsgList.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok || !response.body) throw new Error("Stream failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialText = "";

      setChatMessages(prev => [...prev, { sender: 'twin', text: "", timestamp: new Date() }]);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value, { stream: true });
        const lines = raw.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                partialText += parsed.chunk;
                setChatMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: partialText
                  };
                  return updated;
                });
              }
            } catch {
              // ignore json parse error on non-json chunks
            }
          }
        }
      }
    } catch {
      try {
        const res = await twinChat(userText, userProfile, newMsgList.slice(-6).map(m => ({ sender: m.sender, text: m.text })));
        setChatMessages(prev => [...prev, { sender: 'twin', text: res.reply, timestamp: new Date() }]);
        if (res.quick_replies && res.quick_replies.length > 0) setQuickChips(res.quick_replies);
      } catch {
        setTimeout(() => {
          let replyText = "";
          const lower = userText.toLowerCase();
          if (lower.includes('club')) {
            replyText = `Based on your interest in **${userProfile.interests[0] || 'AI'}** and career target as **${userProfile.careerGoal}**, I highly recommend the **Google Developer Student Club** and **AI Innovation Club**!`;
          } else if (lower.includes('hackathon')) {
            replyText = `Opportunity Radar detected:\n- 🏆 **Google GenAI Hackathon 2026** (Closes in 4 days)\n- 💻 **Smart India Hackathon College Round**`;
          } else if (lower.includes('timetable') || lower.includes('schedule')) {
            replyText = `Here is your schedule calibration for **${userProfile.name}**:\n- 📅 Morning: Core theory & lab sessions\n- 💡 1:30 PM - 3:00 PM: Open collaboration gap!\n- 📚 Evening: Self-study and project assignment wrap-up.`;
          } else {
            replyText = `Understood, ${userProfile.name}! I've calibrated this with your profile. Check the **Study Twins** tab to find study partners for your target: **${userProfile.careerGoal}**!`;
          }
          setChatMessages(prev => [...prev, { sender: 'twin', text: replyText, timestamp: new Date() }]);
        }, 600);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportPDF = () => {
    const reportWindow = window.open('', '_blank');
    const contentHtml = `
      <html>
        <head>
          <title>TwinFusion AI - Student Opportunity Dossier</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h1 { color: #4338ca; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; }
            .badge { display: inline-block; padding: 4px 8px; background: #e0e7ff; color: #3730a3; border-radius: 4px; font-size: 11px; margin-right: 6px; }
            .section { margin-top: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>🚀 TwinFusion AI &middot; Digital Twin Dossier</h1>
          <p><strong>Student Name:</strong> ${userProfile.name}</p>
          <p><strong>Department:</strong> ${userProfile.department} (${userProfile.year}) &middot; <strong>Section:</strong> ${userProfile.section}</p>
          <p><strong>Target Goal:</strong> ${userProfile.careerGoal}</p>
          <div class="section">
            <h3>Key Skills & Interests</h3>
            <p>${(userProfile.interests || []).map(i => `<span class="badge">${i}</span>`).join('')}</p>
            <p>${(userProfile.skills || []).map(s => `<span class="badge">${s}</span>`).join('')}</p>
          </div>
          <div class="section">
            <h3>Recent Digital Twin Recommendations</h3>
            ${chatMessages.filter(m => m.sender === 'twin').slice(-4).map(m => `<p>${m.text.replace(/\n/g, '<br/>')}</p>`).join('')}
          </div>
          <p style="margin-top: 30px; font-size: 11px; color: #6b7280;">Generated automatically by TwinFusion AI Portal &middot; ${new Date().toLocaleDateString()}</p>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    reportWindow.document.write(contentHtml);
    reportWindow.document.close();
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
            onClick={() => setActiveTab('twins')}
            style={{
              background: activeTab === 'twins' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: activeTab === 'twins' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activeTab === 'twins' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Users size={15} /> Study Twins
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{
              background: activeTab === 'analytics' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: activeTab === 'analytics' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activeTab === 'analytics' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <TrendingUp size={15} /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('navigator')}
            style={{
              background: activeTab === 'navigator' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: activeTab === 'navigator' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activeTab === 'navigator' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Map size={15} /> Campus Navigator
          </button>
        </div>

        {/* User profile dropdown & logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={handleExportPDF}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Download Twin Dossier PDF"
          >
            <Download size={14} /> Export Dossier
          </button>

          <div style={{ textAlign: 'right' }}>
            <h5 style={{ fontSize: '13.5px', margin: 0 }}>{userProfile.name}</h5>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{userProfile.department?.split(' ')[0]} Section {userProfile.section}</p>
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
                    {isTwin ? renderMessageText(msg.text) : <p style={{ margin: 0 }}>{msg.text}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      {isTwin && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, i)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: copiedIndex === i ? '#10b981' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: 0
                          }}
                        >
                          <Copy size={11} /> {copiedIndex === i ? "Copied!" : "Copy"}
                        </button>
                      )}
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {msg.timestamp?.toLocaleTimeString ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={13} /> Generating Twin advice...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-reply chip suggestions */}
          <div style={{
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.04)'
          }}>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: '#c7d2fe',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInput);
            }} 
            style={{
              padding: '14px 16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px'
            }}
          >
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Calibrated Campus Planner</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Your AI Twin dynamically manages your daily schedule and coursework timeline.</p>
                </div>
                <button
                  onClick={() => onNavigate('onboarding')}
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#c7d2fe',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Edit Timetable
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Visual Timetable Grid from Profile */}
                <div style={{ padding: '20px' }} className="glass">
                  <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--primary)" /> Configured Schedule Slots
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {((userProfile.timetable && userProfile.timetable.length > 0) ? userProfile.timetable : [
                      { time: "09:00 AM - 10:30 AM", subject: "Applied Mathematics II", room: "Block A, Room 102" },
                      { time: "11:00 AM - 01:00 PM", subject: "Python Programming & AI Lab", room: "Main Academic Block, Room 101" },
                      { time: "01:00 PM - 02:00 PM", subject: "Lunch Break & Peer Discussion", room: "Student Cafeteria Hub" },
                      { time: "02:00 PM - 03:30 PM", subject: "Data Structures & Algorithms", room: "Block B, Room 204" },
                      { time: "03:45 PM - 05:00 PM", subject: "Open Collaborative Study / Clubs", room: "Google Innovation Lab 304" }
                    ]).map((slot, idx) => (
                      <div key={idx} style={{
                        display: 'grid',
                        gridTemplateColumns: '130px 1fr',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '12px',
                        background: slot.subject.toLowerCase().includes('lab') ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${slot.subject.toLowerCase().includes('lab') ? 'rgba(99,102,241,0.18)' : 'var(--border-color)'}`,
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--accent)', fontWeight: 600 }}>{slot.time}</span>
                        <div>
                          <h5 style={{ fontSize: '13.5px', margin: 0 }}>{slot.subject}</h5>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{slot.room}</p>
                        </div>
                      </div>
                    ))}
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
                          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Detected 1-hour free gap at 1:00 PM for project collaboration.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: Study Twins / Peer Matching */}
          {activeTab === 'twins' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <div>
                <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Peer Matching: Find Your Study Twin</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  Algorithmic compatibility matching students by shared interests, skills, and goals.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {(peers.length > 0 ? peers : [
                  {
                    id: 101,
                    name: "Priya Sharma",
                    department: "Computer Science and Engineering",
                    year: "1st Year",
                    careerGoal: "AI/ML Engineer",
                    sharedInterests: ["Artificial Intelligence", "Data Science"],
                    sharedSkills: ["Python"],
                    matchScore: 94
                  },
                  {
                    id: 102,
                    name: "Karthik Raja",
                    department: "Information Technology",
                    year: "2nd Year",
                    careerGoal: "Software Engineer",
                    sharedInterests: ["Web Development", "Cloud Computing"],
                    sharedSkills: ["Web Development"],
                    matchScore: 88
                  },
                  {
                    id: 103,
                    name: "Sneha Verma",
                    department: "Artificial Intelligence and Data Science",
                    year: "1st Year",
                    careerGoal: "Data Scientist",
                    sharedInterests: ["Artificial Intelligence", "Entrepreneurship"],
                    sharedSkills: ["Python", "UI/UX Design"],
                    matchScore: 82
                  }
                ]).map((peer) => (
                  <div key={peer.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                          {peer.name.charAt(0)}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14.5px', margin: 0 }}>{peer.name}</h4>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{peer.year} &middot; {peer.department?.split(' ')[0]}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '999px' }}>
                        {peer.matchScore}%
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Goal</span>
                      <p style={{ fontSize: '12.5px', color: 'var(--accent)', margin: 0, fontWeight: 600 }}>{peer.careerGoal}</p>
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shared Skills & Interests</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {(peer.sharedInterests || []).concat(peer.sharedSkills || []).slice(0, 3).map((item, idx) => (
                          <span key={idx} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px', color: '#ffffff' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setConnectedPeers(prev => ({ ...prev, [peer.id]: true }));
                        alert(`Connected with ${peer.name}! Your Digital Twin linked study notes and shared hackathon calendars.`);
                      }}
                      style={{
                        marginTop: 'auto',
                        background: connectedPeers[peer.id] ? '#10b981' : 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: connectedPeers[peer.id] ? '#ffffff' : '#c7d2fe',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {connectedPeers[peer.id] ? <><CheckCircle2 size={13} /> Linked</> : <><UserCheck size={13} /> Link Study Twin</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <div>
                <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>Twin Analytics & Growth Engine</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  Quantified metrics of your academic telemetry and campus readiness.
                </p>
              </div>

              {/* Top KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ padding: '18px', textAlign: 'center' }} className="glass">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sync Calibration</span>
                  <h3 style={{ fontSize: '26px', margin: '6px 0 0', color: '#06b6d4' }}>{analytics?.syncScore || 95}%</h3>
                </div>
                <div style={{ padding: '18px', textAlign: 'center' }} className="glass">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interactions</span>
                  <h3 style={{ fontSize: '26px', margin: '6px 0 0', color: '#818cf8' }}>{analytics?.totalInteractions || 28}</h3>
                </div>
                <div style={{ padding: '18px', textAlign: 'center' }} className="glass">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Opportunities</span>
                  <h3 style={{ fontSize: '26px', margin: '6px 0 0', color: '#10b981' }}>{analytics?.opportunitiesMatched || 8}</h3>
                </div>
                <div style={{ padding: '18px', textAlign: 'center' }} className="glass">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Focus Gap</span>
                  <h3 style={{ fontSize: '26px', margin: '6px 0 0', color: '#f59e0b' }}>{analytics?.weeklyFocusHours || 14.5}h</h3>
                </div>
              </div>

              {/* Skills distribution */}
              <div style={{ padding: '24px' }} className="glass">
                <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Student Competency Distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(analytics?.skillDistribution || [
                    { name: "AI & Machine Learning", score: 88 },
                    { name: "Python Development", score: 92 },
                    { name: "Web & Cloud Architecture", score: 76 },
                    { name: "Campus Club Engagement", score: 85 }
                  ]).map((skill, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span>{skill.name}</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{skill.score}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${skill.score}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
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
