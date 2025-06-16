import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/* FUTURISTIC color palettes with holographic effects */
const COLOR_THEMES = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  ocean: ['#f0f9ff', '#7dd3fc', '#0ea5e9', '#0284c7', '#0c4a6e'],
  sunset: ['#fef3c7', '#fbbf24', '#f59e0b', '#d97706', '#92400e'],
  forest: ['#f0fdf4', '#86efac', '#22c55e', '#16a34a', '#15803d'],
  purple: ['#faf5ff', '#c084fc', '#a855f7', '#9333ea', '#7c3aed'],
  neon: ['#0a0a0a', '#1a0033', '#330066', '#6600cc', '#9933ff'],
  candy: ['#fff0f5', '#ffb3d9', '#ff80cc', '#ff4db3', '#e6005c'],
  cyberpunk: ['#000000', '#ff0080', '#00ff80', '#8000ff', '#ff8000'],
  matrix: ['#000000', '#003300', '#006600', '#00ff00', '#33ff33'],
  hologram: ['#001122', '#0066cc', '#00ccff', '#66ffff', '#ffffff'],
  plasma: ['#1a0033', '#4d0099', '#8000ff', '#cc00ff', '#ff66ff'],
  quantum: ['#000011', '#001133', '#003366', '#0066cc', '#00ccff']
};

const RADIUS = { square:2, rounded:6, circle:'50%' };

/* FUTURISTIC celebration particles and effects */
const CELEBRATION_EMOJIS = ['🎉', '✨', '🌟', '💫', '🎊', '🔥', '💪', '🚀', '⚡', '🌈', '💎', '🔮'];
const FUTURISTIC_EMOJIS = ['⚡', '🔮', '💎', '🌌', '🛸', '🤖', '👾', '🔬', '⚛️', '🧬', '🌐', '💫'];
const SOUND_EFFECTS = {
  complete: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  },
  hover: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
};

/* FUTURISTIC CSS animations with holographic effects */
const ANIMATION_STYLES = `
  @keyframes celebration {
    0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
    25% { transform: scale(1.4) rotate(90deg); filter: hue-rotate(90deg); }
    50% { transform: scale(1.3) rotate(180deg); filter: hue-rotate(180deg); }
    75% { transform: scale(1.35) rotate(270deg); filter: hue-rotate(270deg); }
    100% { transform: scale(1) rotate(360deg); filter: hue-rotate(360deg); }
  }

  @keyframes holographic-pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.3);
      filter: hue-rotate(0deg);
    }
    50% {
      transform: scale(1.08);
      box-shadow: 0 0 25px rgba(255, 0, 255, 0.8), inset 0 0 15px rgba(0, 255, 255, 0.5);
      filter: hue-rotate(180deg);
    }
  }

  @keyframes neon-glow {
    0%, 100% {
      box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
      filter: brightness(1);
    }
    50% {
      box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor;
      filter: brightness(1.3);
    }
  }

  @keyframes matrix-rain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  @keyframes quantum-shift {
    0%, 100% { transform: translateX(0) translateY(0); }
    25% { transform: translateX(1px) translateY(-1px); }
    50% { transform: translateX(-1px) translateY(1px); }
    75% { transform: translateX(1px) translateY(1px); }
  }

  @keyframes particle-explosion {
    0% {
      transform: translateY(0px) rotate(0deg) scale(1);
      opacity: 1;
      filter: hue-rotate(0deg);
    }
    100% {
      transform: translateY(-80px) rotate(720deg) scale(0.3);
      opacity: 0;
      filter: hue-rotate(360deg);
    }
  }

  @keyframes cyber-scan {
    0% { background-position: -100% 0; }
    100% { background-position: 100% 0; }
  }

  @keyframes hologram-flicker {
    0%, 100% { opacity: 1; filter: brightness(1); }
    2% { opacity: 0.8; filter: brightness(1.2); }
    4% { opacity: 1; filter: brightness(0.9); }
    6% { opacity: 0.9; filter: brightness(1.1); }
    8% { opacity: 1; filter: brightness(1); }
  }

  @keyframes data-stream {
    0% { transform: scaleY(0); opacity: 0; }
    50% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(0); opacity: 0; }
  }
`;

/**
 * Enhanced StreakBoard
 * ───────────────────────────────────────────────────────────
 * ▸ Works controlled (via props) or uncontrolled (local state)
 * ▸ Shades squares by counts[idx] (0-4), with enhanced visual feedback.
 * ▸ Supports multiple themes, animations, and accessibility features.
 * ▸ Interactive features: hover effects, keyboard navigation, context menus.
 */
export default function StreakBoard({
  days,
  shape = 'square',
  layout,
  completed,        // Set<number>
  counts = {},      // { [idx]: number }
  onToggleDay,      // (idx:number)=>void
  onEditNote,       // (idx:number)=>void
  notes = {},       // { [idx]: string } - notes for each day
  onUpdateNote,     // (idx:number, note:string)=>void
  onUpdateDifficulty, // (idx:number, difficulty:number)=>void
  freezes = new Set(), // Set<number> of frozen idx
  theme = 'github', // Color theme
  showDayLabels = true, // Show day abbreviations
  enableAnimations = true, // Enable celebrations and animations
  enableKeyboard = true, // Enable keyboard navigation
  enableHover = true, // Enable hover effects
  accentColor = '#007AFF', // Accent color for today indicator
  showStreaks = true, // Show streak indicators
  showStats = true, // Show mini statistics
  // FUTURISTIC FEATURES 🚀
  enableSoundEffects = true, // Sci-fi sound effects
  enableHolographicMode = false, // Holographic visual effects
  enableMatrixMode = false, // Matrix rain effect
  enableQuantumMode = false, // Quantum glitch effects
  enableCyberScan = false, // Cyberpunk scanning lines
  futuristicParticles = false, // Use futuristic emojis
  enableDataStream = false, // Data stream visualization
  enableNeonGlow = false, // Neon glow effects
  aiPrediction = null, // AI streak prediction data
  enableVoiceControl = false // Voice commands (future feature)
}) {
  /* Enhanced state management */
  const [localSet, setLocalSet] = useState(new Set());
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [celebratingIdx, setCelebratingIdx] = useState(null);
  const [particles, setParticles] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [dragSelection, setDragSelection] = useState({ start: null, end: null, active: false });
  const [dayDetailModal, setDayDetailModal] = useState(null);
  const [modalDifficulty, setModalDifficulty] = useState(1);
  const [modalNote, setModalNote] = useState('');

  const boardRef = useRef(null);
  const animationRef = useRef(null);

  const ctrl = completed instanceof Set && typeof onToggleDay === 'function';
  const doneSet = ctrl ? completed : localSet;
  const colors = COLOR_THEMES[theme] || COLOR_THEMES.github;

  /* Inject CSS animations */
  useEffect(() => {
    const styleId = 'streak-board-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = ANIMATION_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  /* Enhanced toggle with celebrations */
  const toggle = useCallback((idx) => {
    const wasCompleted = doneSet.has(idx);

    if (ctrl) {
      onToggleDay(idx);
    } else {
      const nxt = new Set(localSet);
      if (wasCompleted) nxt.delete(idx);
      else nxt.add(idx);
      setLocalSet(nxt);
    }

    // Trigger celebration for new completions
    if (!wasCompleted && enableAnimations) {
      setCelebratingIdx(idx);
      createCelebrationParticles(idx);
      setTimeout(() => setCelebratingIdx(null), 600);
    }
  }, [ctrl, onToggleDay, localSet, doneSet, enableAnimations]);

  /* Open day detail modal */
  const openDayDetail = useCallback((idx) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() + idx - 1);

    setDayDetailModal({
      idx,
      date: dayDate,
      isCompleted: doneSet.has(idx),
      currentNote: notes[idx] || '',
      currentDifficulty: counts[idx] || 1
    });
    setModalNote(notes[idx] || '');
    setModalDifficulty(counts[idx] || 1);
  }, [doneSet, notes, counts]);

  /* today @ midnight */
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /* Create FUTURISTIC celebration particles with sound effects */
  const createCelebrationParticles = useCallback((idx) => {
    if (!enableAnimations) return;

    // Play sound effect
    if (enableSoundEffects) {
      try {
        SOUND_EFFECTS.complete();
      } catch (e) {
        console.log('Audio not supported');
      }
    }

    const emojiSet = futuristicParticles ? FUTURISTIC_EMOJIS : CELEBRATION_EMOJIS;
    const particleCount = enableHolographicMode ? 12 : 8;

    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `${idx}-${i}-${Date.now()}`,
        emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)],
        x: Math.random() * 60 - 30,
        y: Math.random() * 60 - 30,
        delay: i * (enableHolographicMode ? 50 : 100),
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        type: enableHolographicMode ? 'holographic' : 'normal'
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Clean up particles after animation
    const cleanupTime = enableHolographicMode ? 3000 : 2000;
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, cleanupTime);
  }, [enableAnimations, enableSoundEffects, futuristicParticles, enableHolographicMode]);

  /* Play hover sound effect */
  const playHoverSound = useCallback(() => {
    if (enableSoundEffects && enableHover) {
      try {
        SOUND_EFFECTS.hover();
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  }, [enableSoundEffects, enableHover]);

  /* Calculate streak information */
  const streakInfo = useMemo(() => {
    const sortedDays = [...doneSet].sort((a, b) => a - b);
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let streakRanges = [];
    let currentRange = null;

    for (let i = 0; i < sortedDays.length; i++) {
      const day = sortedDays[i];
      const prevDay = sortedDays[i - 1];

      if (i === 0 || day === prevDay + 1) {
        tempStreak++;
        if (!currentRange) currentRange = { start: day, end: day };
        currentRange.end = day;
      } else {
        if (currentRange) streakRanges.push(currentRange);
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
        currentRange = { start: day, end: day };
      }
    }

    if (currentRange) streakRanges.push(currentRange);
    maxStreak = Math.max(maxStreak, tempStreak);

    // Calculate current streak (ending today)
    const todayIdx = Math.floor((Date.now() - today.getTime()) / 86400000) + 1;
    if (doneSet.has(todayIdx)) {
      let streak = 1;
      for (let i = todayIdx - 1; i >= 1; i--) {
        if (doneSet.has(i)) streak++;
        else break;
      }
      currentStreak = streak;
    }

    return { currentStreak, maxStreak, streakRanges };
  }, [doneSet, today]);

  /* FUTURISTIC cell styling with holographic and cyber effects */
  const getCellStyle = useCallback((shade, idx, isToday, isClickable, isHovered, isCelebrating, isInStreak) => {
    const baseColor = colors[shade] || colors[0];
    const isCompleted = shade > 0;
    const isFuturistic = enableHolographicMode || enableMatrixMode || enableQuantumMode || enableNeonGlow;

    let background = baseColor;
    if (isCompleted && shade > 1) {
      if (enableHolographicMode) {
        background = `linear-gradient(45deg, ${baseColor}, ${colors[Math.min(shade + 1, colors.length - 1)]}, ${baseColor})`;
      } else if (enableMatrixMode && theme === 'matrix') {
        background = `radial-gradient(circle, ${baseColor}, #001100)`;
      } else {
        background = `linear-gradient(135deg, ${baseColor}, ${colors[Math.min(shade + 1, colors.length - 1)]})`;
      }
    }

    // Cyber scan overlay
    if (enableCyberScan && isHovered) {
      background += `, linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.3) 50%, transparent 100%)`;
    }

    const boxShadowEffects = [
      'inset 0 1px 1px rgba(0,0,0,.1)',
      isToday ? `0 0 0 2px ${accentColor}` : '',
      isHovered && enableHover ? '0 4px 12px rgba(0,0,0,.2)' : '',
      isCelebrating ? '0 0 20px rgba(255,215,0,.8)' : ''
    ];

    // Add futuristic glow effects
    if (enableHolographicMode && isCompleted) {
      boxShadowEffects.push(`0 0 15px ${baseColor}, inset 0 0 15px rgba(255,255,255,0.1)`);
    }
    if (enableNeonGlow && isCompleted) {
      boxShadowEffects.push(`0 0 10px ${baseColor}, 0 0 20px ${baseColor}, 0 0 30px ${baseColor}`);
    }
    if (isInStreak && showStreaks) {
      boxShadowEffects.push('0 0 8px rgba(34, 197, 94, 0.4)');
    }

    const animations = [];
    if (isCelebrating && enableAnimations) {
      animations.push('celebration 0.6s ease-out');
    }
    if (isToday && enableAnimations) {
      animations.push(enableHolographicMode ? 'holographic-pulse 2s ease-in-out infinite' : 'today-indicator 2s ease-in-out infinite');
    }
    if (enableHolographicMode && isCompleted && enableAnimations) {
      animations.push('hologram-flicker 4s ease-in-out infinite');
    }
    if (enableQuantumMode && enableAnimations) {
      animations.push('quantum-shift 0.1s ease-in-out infinite');
    }
    if (enableNeonGlow && isCompleted && enableAnimations) {
      animations.push('neon-glow 2s ease-in-out infinite');
    }
    if (isInStreak && showStreaks && enableAnimations) {
      animations.push('streak-glow 3s ease-in-out infinite');
    }

    return {
      width: 20,
      height: 20,
      borderRadius: RADIUS[shape] ?? 2,
      background,
      backgroundSize: enableCyberScan ? '200% 100%' : 'auto',
      boxShadow: boxShadowEffects.filter(Boolean).join(', '),
      transition: enableAnimations
        ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s ease'
        : 'background 0.15s',
      transform: [
        isHovered && isClickable && enableHover ? 'scale(1.15)' : '',
        isCelebrating ? 'scale(1.2)' : '',
        isToday ? 'scale(1.05)' : ''
      ].filter(Boolean).join(' ') || 'scale(1)',
      cursor: isClickable ? 'pointer' : 'not-allowed',
      position: 'relative',
      opacity: freezes.has(idx) ? 0.6 : 1,
      animation: animations.join(', '),
      border: isCompleted ? `1px solid ${colors[Math.min(shade + 1, colors.length - 1)]}` : '1px solid transparent',
      zIndex: isCelebrating ? 10 : isHovered ? 5 : 1,
      filter: enableHolographicMode && isCompleted ? 'saturate(1.2) contrast(1.1)' : 'none',
      backdropFilter: enableHolographicMode ? 'blur(0.5px)' : 'none'
    };
  }, [colors, shape, accentColor, enableAnimations, enableHover, freezes, showStreaks,
      enableHolographicMode, enableMatrixMode, enableQuantumMode, enableNeonGlow, enableCyberScan, theme]);

  const outer = {
    display: 'flex',
    gap: 16,
    padding: 16,
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    overflowX: 'auto',
    boxShadow: '0 2px 4px rgba(0,0,0,.05)',
    position: 'relative'
  };

  const grid = {
    display: 'grid',
    gridTemplateRows: 'repeat(7,20px)',
    gridAutoFlow: 'column',
    gridAutoColumns: '20px',
    gap: 4
  };

  /* Enhanced render cell with all the amazing features */
  const renderCell = (obj, key) => {
    if (!obj) {
      return showDayLabels && key < 7 ? (
        <div key={key} style={{
          width: 20, height: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 10, color: '#666', fontWeight: 'bold'
        }}>
          {DAYS[key]}
        </div>
      ) : <div key={key} style={{ width: 20, height: 20 }} />;
    }

    const isToday = obj.date.toDateString() === today.toDateString();
    const clickable = isToday;
    const shade = Math.min(counts[obj.idx] ?? (doneSet.has(obj.idx) ? 1 : 0), 4);
    const frozen = freezes.has(obj.idx);
    const isHovered = hoveredIdx === obj.idx;
    const isCelebrating = celebratingIdx === obj.idx;
    const isCompleted = shade > 0;
    const isInStreak = streakInfo.streakRanges.some(range =>
      obj.idx >= range.start && obj.idx <= range.end && range.end - range.start >= 2
    );

    const style = getCellStyle(shade, obj.idx, isToday, clickable, isHovered, isCelebrating, isInStreak);

    return (
      <div
        key={key}
        ref={obj.idx === celebratingIdx ? animationRef : null}
        onClick={() => openDayDetail(obj.idx)}
        onMouseEnter={() => {
          if (enableHover) {
            setHoveredIdx(obj.idx);
            playHoverSound();
          }
        }}
        onMouseLeave={() => enableHover && setHoveredIdx(null)}
        onContextMenu={(e) => onEditNote && handleContextMenu(e, obj.idx)}
        onFocus={() => enableKeyboard && setFocusedIdx(obj.idx)}
        onBlur={() => enableKeyboard && setFocusedIdx(null)}
        tabIndex={0}
        title={`${obj.date.toLocaleDateString()}${frozen ? ' (Frozen)' : ''}${isInStreak ? ' (In Streak!)' : ''}${notes[obj.idx] ? ' - Has note' : ''}`}
        style={style}
        role="button"
        aria-label={`Day ${obj.idx}, ${obj.date.toLocaleDateString()}, ${doneSet.has(obj.idx) ? 'completed' : 'not completed'}`}
      >
        {/* Frozen indicator */}
        {frozen && (
          <span style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 12, zIndex: 2
          }}>🧊</span>
        )}

        {/* Today indicator */}
        {isToday && (
          <div style={{
            position: 'absolute', top: -2, right: -2,
            width: 6, height: 6, borderRadius: '50%',
            background: accentColor, zIndex: 3,
            animation: enableAnimations ? 'pulse 2s infinite' : ''
          }} />
        )}

        {/* Streak indicator */}
        {isInStreak && showStreaks && (
          <div style={{
            position: 'absolute', bottom: -1, left: '50%',
            transform: 'translateX(-50%)', width: '80%', height: 2,
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            borderRadius: 1, zIndex: 2
          }} />
        )}

        {/* FUTURISTIC celebration particles */}
        {isCelebrating && particles
          .filter(p => p.id.startsWith(`${obj.idx}-`))
          .map(particle => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `calc(50% + ${particle.x}px)`,
                top: `calc(50% + ${particle.y}px)`,
                transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${particle.scale})`,
                fontSize: enableHolographicMode ? 20 : 16,
                pointerEvents: 'none',
                zIndex: 20,
                animation: particle.type === 'holographic'
                  ? `particle-explosion 3s ease-out ${particle.delay}ms forwards`
                  : `particle-float 2s ease-out ${particle.delay}ms forwards`,
                filter: enableHolographicMode ? 'drop-shadow(0 0 5px currentColor)' : 'none',
                textShadow: enableNeonGlow ? '0 0 10px currentColor' : 'none'
              }}
            >
              {particle.emoji}
            </div>
          ))
        }

        {/* Matrix rain effect */}
        {enableMatrixMode && theme === 'matrix' && isCompleted && (
          <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${20 + i * 30}%`,
                  width: 2,
                  height: '100%',
                  background: 'linear-gradient(to bottom, transparent, #00ff00, transparent)',
                  animation: `matrix-rain 2s linear ${i * 0.5}s infinite`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        )}

        {/* Data stream visualization */}
        {enableDataStream && isInStreak && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1,
            height: '200%',
            background: 'linear-gradient(to top, transparent, #00ffff, transparent)',
            animation: 'data-stream 1.5s ease-in-out infinite',
            zIndex: 1
          }} />
        )}

        {/* Cyber scan line */}
        {enableCyberScan && isHovered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.5) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'cyber-scan 1s ease-in-out infinite',
            zIndex: 2,
            pointerEvents: 'none'
          }} />
        )}

        {/* Holographic overlay */}
        {enableHolographicMode && isCompleted && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
            backgroundSize: '400% 400%',
            animation: 'holographic-pulse 3s ease-in-out infinite',
            borderRadius: 'inherit',
            zIndex: 1,
            pointerEvents: 'none'
          }} />
        )}
      </div>
    );
  };

  /* Context menu handler */
  const handleContextMenu = useCallback((e, idx) => {
    e.preventDefault();
    if (!onEditNote) return;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      idx
    });
  }, [onEditNote]);

  /* Keyboard navigation */
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e) => {
      if (!focusedIdx || contextMenu) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIdx(Math.max(1, focusedIdx - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIdx(Math.min(days, focusedIdx + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIdx(Math.max(1, focusedIdx - 7));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIdx(Math.min(days, focusedIdx + 7));
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          const todayIdx = Math.floor((Date.now() - today.getTime()) / 86400000) + 1;
          if (focusedIdx === todayIdx) {
            toggle(focusedIdx);
          }
          break;
        case 'Escape':
          setFocusedIdx(null);
          setContextMenu(null);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, focusedIdx, days, toggle, today, contextMenu]);

  /* Close context menu on click outside */
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  /* build slot arrays (same calendar logic you already had) */
  const makeMonthBlocks = useMemo(()=>{
    if(layout!=='month') return [];
    const t=new Date(); let y=t.getFullYear(),m=t.getMonth(),d0=t.getDate();
    let remain=days, idx=1, out=[];
    const pushBlock=(mlabel,slots)=>{out.push({label:mlabel,slots})};

    const first=Array(d0%7).fill(null);
    const len0=new Date(y,m+1,0).getDate();
    const take0=Math.min(remain,len0-d0+1);
    for(let d=0;d<take0;d++) first.push({idx:idx++,date:new Date(y,m,d0+d)});
    remain-=take0;
    if(first.length%7) first.push(...Array(7-first.length%7).fill(null));
    pushBlock(`${MONTH[m]} ${y}`,first);

    m++; if(m>11){m=0;y++}
    while(remain>0){
      const slots=Array(new Date(y,m,1).getDay()).fill(null);
      const ml=new Date(y,m+1,0).getDate();
      const take=Math.min(ml,remain);
      for(let d=1;d<=take;d++) slots.push({idx:idx++,date:new Date(y,m,d)});
      remain-=take;
      if(slots.length%7) slots.push(...Array(7-slots.length%7).fill(null));
      pushBlock(`${MONTH[m]} ${y}`,slots);
      m++; if(m>11){m=0;y++}
    }
    return out;
  },[days,layout]);

  const makeWeekBlocks = useMemo(()=>{
    if(layout!=='week') return [];
    const t=new Date();
    const start=t.getDay();
    const arr=[...Array(start).fill(null)];
    for(let i=1;i<=days;i++){
      arr.push({idx:i,date:new Date(t.getFullYear(),t.getMonth(),t.getDate()+i-1)});
    }
    if(arr.length%7) arr.push(...Array(7-arr.length%7).fill(null));
    const res=[]; for(let w=0;w<arr.length/7;w++) res.push({week:w+1,slots:arr.slice(w*7,w*7+7)});
    return res;
  },[days,layout]);

  /* JSX with enhanced features */
  return (
    <div ref={boardRef} style={{ position: 'relative' }}>
      {/* Day labels header */}
      {showDayLabels && (layout === 'month' || layout === 'week') && (
        <div style={{
          display: 'flex', gap: 16, padding: '0 16px 8px 16px',
          fontSize: 12, color: '#666', fontWeight: 'bold'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 20px)', gap: 4 }}>
            {DAYS.map((day, i) => (
              <div key={i} style={{ textAlign: 'center' }}>{day}</div>
            ))}
          </div>
        </div>
      )}

      {/* Month layout */}
      {layout === 'month' && (
        <div style={outer}>
          {makeMonthBlocks.map(({ label, slots }, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={grid}>{slots.map(renderCell)}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Week layout */}
      {layout === 'week' && (
        <div style={outer}>
          {makeWeekBlocks.map(({ week, slots }) => (
            <div key={week} style={{ textAlign: 'center' }}>
              <div style={grid}>{slots.map(renderCell)}</div>
              <div style={{
                marginTop: 6, padding: '2px 6px', background: '#f0f0f0',
                borderRadius: 12, fontSize: 12, color: '#333', display: 'inline-block'
              }}>
                W{week}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Random layout */}
      {layout === 'random' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7,20px)',
          gap: 4, padding: 8, background: '#fff', border: '1px solid #ddd',
          borderRadius: 8, overflowX: 'auto'
        }}>
          {Array.from({ length: days }).map((_, i) => {
            const shade = Math.min(counts[i + 1] ?? (doneSet.has(i + 1) ? 1 : 0), 4);
            return (
              <div
                key={i}
                style={getCellStyle(shade, i + 1, false, false, false, false, false)}
              />
            );
          })}
        </div>
      )}

      {/* Enhanced statistics */}
      <div style={{ marginTop: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
          {doneSet.size} / {days} days completed ({Math.round((doneSet.size / days) * 100)}%)
        </div>

        {showStats && (
          <>
            <div style={{
              padding: '4px 8px', background: colors[2], color: 'white',
              borderRadius: 12, fontSize: 12, fontWeight: 'bold'
            }}>
              🔥 Current: {streakInfo.currentStreak}
            </div>
            <div style={{
              padding: '4px 8px', background: colors[4], color: 'white',
              borderRadius: 12, fontSize: 12, fontWeight: 'bold'
            }}>
              🏆 Best: {streakInfo.maxStreak}
            </div>
            <div style={{
              padding: '4px 8px', background: '#6366f1', color: 'white',
              borderRadius: 12, fontSize: 12, fontWeight: 'bold'
            }}>
              🎯 {Math.round((doneSet.size / days) * 100)}% Complete
            </div>
          </>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: 120
          }}
        >
          <button
            onClick={() => {
              onEditNote && onEditNote(contextMenu.idx);
              setContextMenu(null);
            }}
            style={{
              width: '100%', padding: '8px 12px', border: 'none',
              background: 'transparent', textAlign: 'left', cursor: 'pointer',
              fontSize: 14, borderRadius: '8px 8px 0 0'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            📝 Add Note
          </button>
          <button
            onClick={() => {
              toggle(contextMenu.idx);
              setContextMenu(null);
            }}
            style={{
              width: '100%', padding: '8px 12px', border: 'none',
              background: 'transparent', textAlign: 'left', cursor: 'pointer',
              fontSize: 14, borderRadius: '0 0 8px 8px'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {doneSet.has(contextMenu.idx) ? '❌ Mark Incomplete' : '✅ Mark Complete'}
          </button>
        </div>
      )}

      {/* Keyboard navigation hint */}
      {enableKeyboard && focusedIdx && (
        <div style={{
          position: 'absolute', bottom: -30, left: 0,
          fontSize: 11, color: '#666', fontStyle: 'italic'
        }}>
          Use arrow keys to navigate, Space/Enter to toggle, Esc to exit
        </div>
      )}

      {/* Day Detail Modal */}
      {dayDetailModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: enableHolographicMode
              ? 'linear-gradient(135deg, #ffffff, rgba(255, 161, 22, 0.05))'
              : '#ffffff',
            border: enableHolographicMode
              ? '1px solid rgba(255, 161, 22, 0.3)'
              : '1px solid #ddd',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: enableHolographicMode
              ? '0 20px 60px rgba(255, 161, 22, 0.2)'
              : '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {enableHolographicMode && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 161, 22, 0.03) 50%, transparent 70%)',
                animation: 'cyber-scan 3s ease-in-out infinite',
                pointerEvents: 'none',
                borderRadius: '20px'
              }} />
            )}

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: dayDetailModal.isCompleted
                      ? (enableHolographicMode
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : '#22c55e')
                      : '#e5e7eb',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: enableHolographicMode && dayDetailModal.isCompleted ? '0 0 20px rgba(34, 197, 94, 0.4)' : 'none'
                  }}>
                    {dayDetailModal.isCompleted ? '✅' : '📅'}
                  </div>
                  <div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}>
                      Day {dayDetailModal.idx}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#6b7280',
                      marginTop: '2px'
                    }}>
                      {dayDetailModal.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDayDetailModal(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Completion Toggle */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => {
                    toggle(dayDetailModal.idx);
                    setDayDetailModal(prev => ({
                      ...prev,
                      isCompleted: !prev.isCompleted
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: dayDetailModal.isCompleted
                      ? (enableHolographicMode
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : '#ef4444')
                      : (enableHolographicMode
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : '#22c55e'),
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {dayDetailModal.isCompleted ? (
                    <>
                      <span>❌</span>
                      <span>Mark as Incomplete</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Mark as Complete</span>
                    </>
                  )}
                </button>
              </div>

              {/* Difficulty Selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Difficulty Level
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { level: 1, label: 'Easy', emoji: '😊', color: '#22c55e' },
                    { level: 2, label: 'Medium', emoji: '😐', color: '#f59e0b' },
                    { level: 3, label: 'Hard', emoji: '😤', color: '#ef4444' },
                    { level: 4, label: 'Extreme', emoji: '🔥', color: '#8b5cf6' }
                  ].map(({ level, label, emoji, color }) => (
                    <button
                      key={level}
                      onClick={() => setModalDifficulty(level)}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '12px 16px',
                        background: modalDifficulty === level
                          ? (enableHolographicMode
                              ? `linear-gradient(135deg, ${color}, ${color}dd)`
                              : color)
                          : '#f9fafb',
                        color: modalDifficulty === level ? '#ffffff' : '#374151',
                        border: modalDifficulty === level
                          ? `2px solid ${color}`
                          : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                        boxShadow: modalDifficulty === level && enableHolographicMode
                          ? `0 0 20px ${color}40`
                          : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (modalDifficulty !== level) {
                          e.target.style.background = '#f3f4f6';
                          e.target.style.borderColor = color;
                        }
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        if (modalDifficulty !== level) {
                          e.target.style.background = '#f9fafb';
                          e.target.style.borderColor = '#e5e7eb';
                        }
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Daily Note
                </label>
                <textarea
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="How did today go? Any thoughts, challenges, or wins to remember..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '16px',
                    fontSize: '14px',
                    background: enableHolographicMode
                      ? 'linear-gradient(135deg, #f9fafb, rgba(255, 161, 22, 0.02))'
                      : '#f9fafb',
                    border: enableHolographicMode
                      ? '1px solid rgba(255, 161, 22, 0.2)'
                      : '1px solid #d1d5db',
                    borderRadius: '12px',
                    color: '#1f2937',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    if (enableHolographicMode) {
                      e.target.style.boxShadow = '0 0 20px rgba(255, 161, 22, 0.2)';
                      e.target.style.borderColor = '#ffa516';
                    } else {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (enableHolographicMode) {
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = 'rgba(255, 161, 22, 0.2)';
                    } else {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setDayDetailModal(null)}
                  style={{
                    flex: '0 0 auto',
                    padding: '12px 20px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    // Save the note and difficulty
                    if (onUpdateNote) {
                      onUpdateNote(dayDetailModal.idx, modalNote);
                    }
                    if (onUpdateDifficulty) {
                      onUpdateDifficulty(dayDetailModal.idx, modalDifficulty);
                    }

                    setDayDetailModal(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: enableHolographicMode
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: enableHolographicMode
                      ? '0 4px 20px rgba(59, 130, 246, 0.3)'
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    if (enableHolographicMode) {
                      e.target.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.4)';
                    } else {
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    if (enableHolographicMode) {
                      e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
                    } else {
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {enableHolographicMode && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      animation: 'cyber-scan 2s ease-in-out infinite',
                      borderRadius: '12px'
                    }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>💾</span>
                  <span style={{ position: 'relative', zIndex: 1 }}>Save Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
