import React from 'react';

/**
 * Animated "Digital Twin" avatar. Status drives the animation:
 * - idle:      slow ambient pulse
 * - thinking:  fast spinning ring + orbiting dot (Gemini is being called)
 * - speaking:  glowing pulse (reply just landed)
 */
function TwinAvatar({ status = 'idle', size = 40 }) {
  const color = status === 'thinking' ? '#a78bfa' : status === 'speaking' ? '#10b981' : '#06b6d4';
  const spinDuration = status === 'thinking' ? '1.1s' : '6s';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <style>{`
        @keyframes tf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes tf-pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
      `}</style>
      <svg
        width={size} height={size} viewBox="0 0 40 40"
        style={{
          position: 'absolute', inset: 0,
          animation: `tf-spin ${spinDuration} linear infinite`,
        }}
      >
        <circle cx="20" cy="20" r="17" fill="none" stroke={color} strokeWidth="1.4"
          strokeDasharray="10 6" opacity="0.55" />
        <circle cx="20" cy="3" r="1.6" fill={color} />
      </svg>
      <div style={{
        position: 'absolute', inset: 4, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}33, transparent 70%)`,
        border: `1px solid ${color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: status !== 'idle' ? 'tf-pulse 1s ease-in-out infinite' : 'tf-pulse 3s ease-in-out infinite',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </div>
  );
}

export default TwinAvatar;
