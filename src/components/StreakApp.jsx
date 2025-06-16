import React, { useState, useMemo, useRef, useEffect } from 'react';
import StreakBoard from './StreakBoard';
import html2canvas from 'html2canvas';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import HabitsPage from './HabitsPage';
import GoalsPage from './GoalsPage';
import AnalyticsPage from './AnalyticsPage';
import CommunityPage from './CommunityPage';
import SettingsPage from './SettingsPage';
import DiaryPage from './DiaryPage';
import RemindersPage from './RemindersPage';
import ManualPage from './ManualPage';
import SuperDashboard from './SuperDashboard';

/* tiny radial gauge (unchanged) */
const Gauge = ({ value, total, futuristicMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const pct = total ? value / total : 0;
  const deg = Math.round(pct * 360);
  const circumference = 2 * Math.PI * 70; // radius of 70
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (pct * circumference);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setAnimationKey(prev => prev + 1); // Force re-animation
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={{
        position:'relative',width:160,height:160,flexShrink:0,
        borderRadius:'50%',
        background: futuristicMode
          ? `conic-gradient(#00ff88 0deg ${deg}deg, rgba(0, 255, 136, 0.2) ${deg}deg 360deg)`
          : `conic-gradient(var(--accent) 0deg ${deg}deg,var(--border) ${deg}deg 360deg)`,
        boxShadow: futuristicMode ? '0 0 30px rgba(0, 255, 136, 0.4)' : 'none',
        animation: futuristicMode ? 'pulse 3s ease-in-out infinite' : 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG Progress Animation on Hover */}
      {isHovered && (
        <svg
          key={animationKey}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)',
            zIndex: 1
          }}
          viewBox="0 0 160 160"
        >
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={futuristicMode ? 'rgba(0, 255, 136, 0.2)' : 'var(--border)'}
            strokeWidth="10"
          />
          {/* Animated progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={futuristicMode ? '#00ff88' : 'var(--accent)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDasharray}
            style={{
              animation: `progressCircleDraw 2s ease-out forwards`,
              filter: futuristicMode ? 'drop-shadow(0 0 8px #00ff88)' : 'none',
              '--final-offset': strokeDashoffset
            }}
          />
        </svg>
      )}

      {/* Outer glow rings */}
      {futuristicMode && (
        <>
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            right: '-8px',
            bottom: '-8px',
            borderRadius: '50%',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            animation: isHovered
              ? 'pulse 1s ease-in-out infinite, glowIntensify 2s ease-out forwards'
              : 'pulse 3s ease-in-out infinite 1s'
          }} />
          <div style={{
            position: 'absolute',
            top: '-16px',
            left: '-16px',
            right: '-16px',
            bottom: '-16px',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            animation: isHovered
              ? 'pulse 1s ease-in-out infinite 0.5s, glowIntensify 2s ease-out forwards 0.5s'
              : 'pulse 3s ease-in-out infinite 2s'
          }} />
        </>
      )}

      <div style={{
        position:'absolute',inset:12,borderRadius:'50%',
        background: futuristicMode
          ? 'radial-gradient(circle, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))'
          : 'var(--card)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        border: futuristicMode ? '2px solid rgba(0, 255, 136, 0.4)' : 'none',
        backdropFilter: futuristicMode ? 'blur(10px)' : 'none',
        zIndex: 2,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}>
        {/* Central glow dot */}
        {futuristicMode && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: isHovered ? '0 0 20px #00ff88' : '0 0 12px #00ff88',
            animation: isHovered
              ? 'pulse 0.5s ease-in-out infinite, centralGlow 2s ease-out forwards'
              : 'pulse 2s ease-in-out infinite',
            transition: 'box-shadow 0.3s ease'
          }} />
        )}

        <span style={{
          fontSize: futuristicMode ? '2.4rem' : '2rem',
          fontWeight: futuristicMode ? 700 : 600,
          color: futuristicMode ? '#00ff88' : 'var(--fg)',
          textShadow: futuristicMode
            ? (isHovered ? '0 0 25px rgba(0, 255, 136, 1)' : '0 0 15px rgba(0, 255, 136, 0.8)')
            : 'none',
          position: 'relative',
          zIndex: 1,
          transition: 'text-shadow 0.3s ease',
          animation: isHovered ? 'numberCount 2s ease-out forwards' : 'none'
        }}>
          {value}
        </span>
        <span style={{
          fontSize: futuristicMode ? '1rem' : '0.9rem',
          color: futuristicMode ? 'rgba(0, 255, 136, 0.8)' : 'var(--fg-soft)',
          fontWeight: futuristicMode ? '500' : 'normal',
          position: 'relative',
          zIndex: 1,
          opacity: isHovered ? 1 : 0.8,
          transition: 'opacity 0.3s ease'
        }}>
          / {total}
        </span>
        <span style={{
          fontSize: futuristicMode ? '0.8rem' : '0.75rem',
          marginTop: 4,
          color: futuristicMode ? '#00ff88' : 'limegreen',
          fontWeight: futuristicMode ? '600' : 'normal',
          textTransform: futuristicMode ? 'uppercase' : 'none',
          letterSpacing: futuristicMode ? '1px' : 'normal',
          textShadow: futuristicMode
            ? (isHovered ? '0 0 15px rgba(0, 255, 136, 0.8)' : '0 0 8px rgba(0, 255, 136, 0.6)')
            : 'none',
          position: 'relative',
          zIndex: 1,
          transition: 'text-shadow 0.3s ease'
        }}>
          {futuristicMode ? 'COMPLETE' : 'Finished'}
        </span>
      </div>
    </div>
  );
};

export default function StreakApp () {
  /* ── state ───────────────────────────────────────────── */
  const [boards,setBoards]         = useState([]);
  const [selectedId,setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  /* Diary and Reminders state */
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [reminders, setReminders] = useState([]);

  /* UI prefs */
  const prefersDark = typeof window!=='undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
  const [theme,setTheme]           = useState(prefersDark ? 'dark':'light');
  const [accentColor,setAccentColor]=useState('#ffa116');
  const [streakTheme,setStreakTheme]=useState('github');
  const [futuristicMode,setFuturisticMode]=useState(false);

  /* form inputs */
  const [title,setTitle]           = useState('');
  const [rawDays,setRawDays]       = useState('');
  const [layout,setLayout]         = useState('month');
  const [shape,setShape]           = useState('square');
  const [startDate,setStartDate]   = useState(()=>new Date().toISOString().slice(0,10));
  const [weekdaysOnly,setWeekdaysOnly]=useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRocketAnimation, setShowRocketAnimation] = useState(false);

  const shareRef=useRef();

  /* follow OS theme changes */
  useEffect(()=>{
    const mq=window.matchMedia('(prefers-color-scheme: dark)');
    const fn=e=>setTheme(t=>t==='system'? (e.matches?'dark':'light') : t);
    mq.addEventListener('change',fn);
    return ()=>mq.removeEventListener('change',fn);
  },[]);

  /* ── selectors ───────────────────────────────────────── */
  const selected=useMemo(()=>boards.find(b=>b.id===selectedId)||null,[boards,selectedId]);

  const finishDate=useMemo(()=>{
    if(!selected) return '';
    const d=new Date(selected.startDate); d.setDate(d.getDate()+selected.days-1);
    return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  },[selected]);

  const chartData=useMemo(()=>{
    if(!selected) return [];
    const s=new Date(selected.startDate); s.setHours(0,0,0,0);
    const pad=Array(s.getDay()).fill(null); let cum=0;
    const pts=[];
    for(let i=0;i<selected.days;i++){
      const dt=new Date(s); dt.setDate(dt.getDate()+i);
      if(selected.weekdaysOnly&&(dt.getDay()===0||dt.getDay()===6)) continue;
      pts.push({date:dt,idx:i+1});
    }
    return pad.concat(pts).filter(Boolean).map(({date,idx})=>{
      if(selected.completed.has(idx)) cum++;
      return {date:date.toLocaleDateString(undefined,{month:'short',day:'numeric'}),completed:cum};
    });
  },[selected]);

  const streakStats=useMemo(()=>{
    if(!selected) return {current:0,max:0};
    let max=0,cur=0,last=0;
    const arr=[...selected.completed].sort((a,b)=>a-b);
    arr.forEach(idx=>{
      if(idx===last+1) cur++; else cur=1;
      last=idx; max=Math.max(max,cur);
    });
    const todayIdx=Math.floor((Date.now()-new Date(selected.startDate))/86400000)+1;
    const current=selected.completed.has(todayIdx)?cur:0;
    return {current,max};
  },[selected]);

  /* ── handlers ───────────────────────────────────────── */
  const createStreak=()=>{
    if(!title.trim()) return;

    // Trigger rocket animation
    setShowRocketAnimation(true);

    // Delay the actual creation to show the animation
    setTimeout(() => {
      const days=parseInt(rawDays,10)>0?parseInt(rawDays,10):365;
      const id=Date.now().toString();
      setBoards(bs=>[...bs,{
        id,title:title.trim(),days,layout,shape,startDate,weekdaysOnly,
        completed:new Set(),counts:{},notes:{},freezesLeft:3,freezes:new Set()
      }]);
      setSelectedId(id);
      setTitle('');
      setRawDays('');
      setShowCreateModal(false);

      // Hide rocket animation after completion
      setTimeout(() => {
        setShowRocketAnimation(false);
      }, 1000);
    }, 2500); // Wait for rocket animation to complete
  };

  const toggleDay=idx=>{
    setBoards(bs=>bs.map(b=>{
      if(b.id!==selectedId) return b;
      const nxt=new Set(b.completed); nxt.has(idx)?nxt.delete(idx):nxt.add(idx);

      /* bump counts for heat-map */
      const cts={...b.counts};
      cts[idx]=(cts[idx]||0)+1;
      return {...b,completed:nxt,counts:cts};
    }));
  };

  const freezeToday=()=>{
    if(!selected||selected.freezesLeft<=0) return;
    const todayIdx=Math.floor((Date.now()-new Date(selected.startDate))/86400000)+1;
    if(selected.completed.has(todayIdx)) return; // already done
    setBoards(bs=>bs.map(b=>{
      if(b.id!==selectedId) return b;
      const comp=new Set(b.completed); comp.add(todayIdx);
      const frz=new Set(b.freezes);   frz.add(todayIdx);
      return {...b,completed:comp,freezes:frz,freezesLeft:b.freezesLeft-1};
    }));
  };

  const editNote=idx=>{
    const note=prompt(`Note for Day ${idx}`,selected.notes[idx]||'')||'';
    setBoards(bs=>bs.map(b=>b.id===selectedId?{...b,notes:{...b.notes,[idx]:note}}:b));
  };

  const exportCSV=()=>{
    if(!selected) return;
    const rows=[['idx','date','done','count','note']];
    for(let i=1;i<=selected.days;i++){
      const d=new Date(selected.startDate); d.setDate(d.getDate()+i-1);
      rows.push([
        i,
        d.toISOString().slice(0,10),
        selected.completed.has(i)?1:0,
        selected.counts[i]||0,
        (selected.notes[i]||'').replace(/"/g,'""')
      ]);
    }
    const csv=rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    const a=document.createElement('a'); a.href=url; a.download=`${selected.title}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG=async()=>{
    if(!shareRef.current) return;
    const canvas=await html2canvas(shareRef.current);
    const a=document.createElement('a'); a.href=canvas.toDataURL(); a.download=`${selected.title}.png`; a.click();
  };



  /* LeetCode-style theme variables */
  const leetcodeTheme = {
    dark: {
      '--bg': '#1a1a1a',
      '--bg-alt': '#262626',
      '--card': '#2d2d2d',
      '--border': '#3a3a3a',
      '--fg': '#ffffff',
      '--fg-soft': '#a3a3a3',
      '--accent': '#ffa116',
      '--success': '#00af9b',
      '--warning': '#ffb800',
      '--error': '#ff6b6b',
      '--easy': '#00af9b',
      '--medium': '#ffa116',
      '--hard': '#ff375f'
    },
    light: {
      '--bg': '#ffffff',
      '--bg-alt': '#f7f8fa',
      '--card': '#ffffff',
      '--border': '#e5e7eb',
      '--fg': '#262626',
      '--fg-soft': '#6b7280',
      '--accent': '#ffa116',
      '--success': '#00af9b',
      '--warning': '#ffb800',
      '--error': '#ff6b6b',
      '--easy': '#00af9b',
      '--medium': '#ffa116',
      '--hard': '#ff375f'
    }
  };

  const vars = leetcodeTheme[theme] || leetcodeTheme.dark;

  /* LeetCode-style components */
  const cssApp = {
    ...vars,
    display: 'grid',
    gridTemplateRows: '60px 1fr',
    gridTemplateColumns: '320px 1fr',
    height: '100vh',
    background: 'var(--bg)',
    color: 'var(--fg)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const cssSide = {
    background: 'var(--bg-alt)',
    padding: '24px',
    overflowY: 'auto',
    borderRight: '1px solid var(--border)'
  };

  const cssMain = {
    padding: '32px',
    overflowY: 'auto',
    background: 'var(--bg)'
  };

  const cssCard = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: theme === 'dark'
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };

  const cssInput = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    background: 'var(--card)',
    color: 'var(--fg)',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none'
  };

  const cssBtn = (variant = 'primary', size = 'md') => ({
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: size === 'sm' ? '8px 12px' : size === 'lg' ? '12px 24px' : '10px 16px',
    background: variant === 'primary' ? 'var(--accent)' :
                variant === 'success' ? 'var(--success)' :
                variant === 'secondary' ? 'transparent' : 'var(--accent)',
    color: variant === 'secondary' ? 'var(--fg)' : '#ffffff',
    border: variant === 'secondary' ? '1px solid var(--border)' : 'none'
  });

  const cssTag = (difficulty) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    background: difficulty === 'easy' ? 'rgba(0, 175, 155, 0.1)' :
                difficulty === 'medium' ? 'rgba(255, 161, 22, 0.1)' :
                'rgba(255, 55, 95, 0.1)',
    color: difficulty === 'easy' ? 'var(--easy)' :
           difficulty === 'medium' ? 'var(--medium)' :
           'var(--hard)',
    border: `1px solid ${difficulty === 'easy' ? 'var(--easy)' :
                         difficulty === 'medium' ? 'var(--medium)' :
                         'var(--hard)'}`
  });

  /* ── JSX ─────────────────────────────────────────────── */
  return (
    <div style={cssApp}>

      {/* LeetCode-style header */}
      <header style={{
        gridColumn: '1/3',
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--accent), var(--success))',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              S
            </div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              color: 'var(--fg)'
            }}>
              StreakMaster
            </h1>
          </div>

          <nav style={{ display: 'flex', gap: '24px' }}>
            {[
              { id: 'dashboard', name: 'Dashboard', icon: '📊' },
              { id: 'super-dashboard', name: 'Pro Dashboard', icon: '🚀' },
              { id: 'habits', name: 'Habits', icon: '🎯' },
              { id: 'goals', name: 'Goals', icon: '🏆' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'diary', name: 'Diary', icon: '📔' },
              { id: 'reminders', name: 'Reminders', icon: '🔔' },
              { id: 'manual', name: 'Manual', icon: '📚' },
              { id: 'community', name: 'Community', icon: '🌟' },
              { id: 'settings', name: 'Settings', icon: '⚙️' }
            ].map(page => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentPage === page.id ? 'var(--fg)' : 'var(--fg-soft)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderBottom: currentPage === page.id ? '2px solid var(--accent)' : '2px solid transparent',
                  opacity: currentPage === page.id ? 1 : 0.7,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{page.icon}</span>
                <span>{page.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {selected && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'var(--bg-alt)',
              borderRadius: '6px',
              fontSize: '13px',
              color: 'var(--fg-soft)'
            }}>
              <span>🎯</span>
              <span>Target: <strong style={{ color: 'var(--fg)' }}>{finishDate}</strong></span>
            </div>
          )}

          {/* Reminder Notification Icon */}
          {reminders.filter(r => {
            const today = new Date().toISOString().slice(0, 10);
            return r.date === today && !r.completed;
          }).length > 0 && (
            <div
              onClick={() => setCurrentPage('reminders')}
              style={{
                position: 'relative',
                width: '32px',
                height: '32px',
                background: 'var(--warning)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                animation: futuristicMode ? 'pulse 2s infinite' : 'none'
              }}
            >
              <span style={{ fontSize: '16px' }}>🔔</span>
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                background: 'var(--error)',
                borderRadius: '50%',
                fontSize: '8px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {reminders.filter(r => {
                  const today = new Date().toISOString().slice(0, 10);
                  return r.date === today && !r.completed;
                }).length}
              </div>
            </div>
          )}

          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--bg-alt)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: '16px' }}>👤</span>
          </div>
        </div>
      </header>

      {/* LeetCode-style sidebar */}
      <aside style={cssSide}>
        {/* Quick Stats Section */}
        <div style={cssCard}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Quick Stats
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              background: 'var(--bg-alt)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--accent)',
                marginBottom: '4px'
              }}>
                {boards.length}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--fg-soft)',
                fontWeight: '500'
              }}>
                Active Streaks
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'var(--bg-alt)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--success)',
                marginBottom: '4px'
              }}>
                {boards.reduce((total, board) => total + board.completed.size, 0)}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--fg-soft)',
                fontWeight: '500'
              }}>
                Total Days
              </div>
            </div>
          </div>

          {selected && (
            <div style={{
              padding: '16px',
              background: 'var(--bg-alt)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--fg)'
                }}>
                  {selected.title}
                </span>
                <span style={{
                  ...cssTag(Math.round((selected.completed.size / selected.days) * 100) >= 80 ? 'easy' :
                           Math.round((selected.completed.size / selected.days) * 100) >= 50 ? 'medium' : 'hard'),
                  fontSize: '11px'
                }}>
                  ACTIVE
                </span>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--fg-soft)',
                marginBottom: '12px'
              }}>
                Building consistency day by day
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  flex: 1,
                  height: '6px',
                  background: 'var(--border)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--success), var(--accent))',
                    width: `${Math.round((selected.completed.size / selected.days) * 100)}%`,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--fg-soft)'
                }}>
                  {Math.round((selected.completed.size / selected.days) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Habit Categories */}
        <div style={cssCard}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Popular Categories
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '20px'
          }}>
            {[
              { icon: '💪', label: 'Health & Fitness', count: '12k+' },
              { icon: '🧠', label: 'Learning', count: '8k+' },
              { icon: '🎨', label: 'Creative', count: '5k+' },
              { icon: '💼', label: 'Productivity', count: '15k+' }
            ].map((category, i) => (
              <div key={i} style={{
                padding: '12px',
                background: 'var(--bg-alt)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                  {category.icon}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--fg)',
                  marginBottom: '2px'
                }}>
                  {category.label}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--fg-soft)'
                }}>
                  {category.count} users
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Streaks */}
        <div style={cssCard}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '18px' }}>🔥</span>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Your Streaks
            </h3>
          </div>

          {boards.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              color: 'var(--fg-soft)',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
              <div>No streaks yet</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Create your first streak below
              </div>
            </div>
          ) : (
            boards.map(b => {
              const pct = Math.round(b.completed.size / b.days * 100);
              const active = b.id === selectedId;
              const difficulty = pct >= 80 ? 'easy' : pct >= 50 ? 'medium' : 'hard';

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    background: active ? 'var(--accent)' : 'var(--bg-alt)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    color: active ? '#ffffff' : 'var(--fg)',
                    transition: 'all 0.2s ease',
                    transform: active ? 'translateY(-1px)' : 'none',
                    boxShadow: active ? '0 4px 12px rgba(255, 161, 22, 0.3)' : 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '1.4'
                    }}>
                      {b.title}
                    </div>
                    <div style={{
                      ...cssTag(difficulty),
                      background: active ? 'rgba(255,255,255,0.2)' : cssTag(difficulty).background,
                      color: active ? '#ffffff' : cssTag(difficulty).color,
                      border: active ? '1px solid rgba(255,255,255,0.3)' : cssTag(difficulty).border
                    }}>
                      {pct}%
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    opacity: active ? 0.9 : 0.7,
                    marginBottom: '8px'
                  }}>
                    {b.completed.size} / {b.days} days completed
                  </div>
                  <div style={{
                    height: '4px',
                    background: active ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: active ? '#ffffff' : 'var(--success)',
                      width: `${pct}%`,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* streak list */}
        <div style={cssCard}>
          <h3 style={{margin:'0 0 16px 0',fontSize:'1.1rem'}}>Your Streaks</h3>
          {boards.length===0
            ? <p style={{color:'var(--fg-soft)',fontSize:'0.85rem'}}>No streaks yet</p>
            : boards.map(b=>{
                const pct=Math.round(b.completed.size/b.days*100);
                const active=b.id===selectedId;
                return (
                  <div key={b.id} onClick={()=>setSelectedId(b.id)}
                       style={{padding:'10px 12px',borderRadius:8,cursor:'pointer',marginBottom:8,
                               background:active?'var(--accent)':'transparent',
                               color:active?'#fff':'var(--fg)',display:'flex',justifyContent:'space-between',
                               fontWeight:500,fontSize:'0.9rem'}}>
                    {b.title}<span style={{fontWeight:400}}>{pct}%</span>
                  </div>)})}
        </div>

        {/* Create New Streak Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            width: '100%',
            padding: '20px',
            background: futuristicMode
              ? 'linear-gradient(135deg, var(--accent), var(--success))'
              : 'var(--accent)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            boxShadow: futuristicMode
              ? '0 8px 32px rgba(255, 161, 22, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(0)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '24px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            if (futuristicMode) {
              e.target.style.boxShadow = '0 12px 40px rgba(255, 161, 22, 0.4)';
            } else {
              e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            if (futuristicMode) {
              e.target.style.boxShadow = '0 8px 32px rgba(255, 161, 22, 0.3)';
            } else {
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          {futuristicMode && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              animation: 'cyber-scan 2s ease-in-out infinite'
            }} />
          )}
          <span style={{ fontSize: '24px', position: 'relative', zIndex: 1 }}>🚀</span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>Create New Streak</div>
            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '400' }}>Build powerful habits</div>
          </div>
        </button>

        {/* Settings */}
        <div style={cssCard}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Preferences
            </h3>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--fg)',
              marginBottom: '6px'
            }}>
              Theme
            </label>
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              style={{
                ...cssBtn('secondary', 'sm'),
                width: '100%',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </span>
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--fg)',
              marginBottom: '6px'
            }}>
              Accent Color
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--fg)',
              marginBottom: '6px'
            }}>
              Visualization Theme
            </label>
            <select
              value={streakTheme}
              onChange={e => setStreakTheme(e.target.value)}
              style={cssInput}
            >
              <option value="github">🟢 Classic Green</option>
              <option value="ocean">🌊 Ocean Blue</option>
              <option value="sunset">🌅 Sunset Orange</option>
              <option value="forest">🌲 Forest Green</option>
              <option value="purple">💜 Royal Purple</option>
              <option value="neon">⚡ Electric Neon</option>
              <option value="candy">🍭 Candy Pink</option>
              <option value="cyberpunk">🤖 Cyberpunk</option>
              <option value="matrix">🔋 Digital Matrix</option>
              <option value="hologram">🔮 Holographic</option>
              <option value="plasma">⚡ Plasma Energy</option>
              <option value="quantum">🌌 Quantum Field</option>
            </select>
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--fg)',
            cursor: 'pointer',
            padding: '8px 0'
          }}>
            <input
              type="checkbox"
              checked={futuristicMode}
              onChange={e => setFuturisticMode(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--accent)'
              }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚀</span>
              <span>Enable Futuristic Mode</span>
            </span>
          </label>
        </div>
      </aside>

      {/* LeetCode-style main content */}
      <main style={cssMain}>
        {currentPage === 'super-dashboard' ? (
          <SuperDashboard
            user={{ name: 'User', xp: 0, level: 1, achievements: [] }}
            boards={boards}
            theme={theme}
            futuristicMode={futuristicMode}
            onUpdateUser={(user) => console.log('User updated:', user)}
            onUpdateBoards={setBoards}
          />
        ) : currentPage === 'dashboard' && !selected ? (
          <div style={{
            ...cssCard,
            textAlign: 'center',
            padding: '64px 32px',
            background: 'var(--card)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '8px'
            }}>
              Welcome to StreakMaster
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--fg-soft)',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Track any habit, goal, or routine with beautiful visualizations.<br />
              Create your first streak to get started.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <span style={{
                padding: '8px 16px',
                background: 'var(--bg-alt)',
                borderRadius: '20px',
                fontSize: '14px',
                color: 'var(--fg-soft)',
                border: '1px solid var(--border)'
              }}>
                💪 Build Habits
              </span>
              <span style={{
                padding: '8px 16px',
                background: 'var(--bg-alt)',
                borderRadius: '20px',
                fontSize: '14px',
                color: 'var(--fg-soft)',
                border: '1px solid var(--border)'
              }}>
                📈 Track Progress
              </span>
              <span style={{
                padding: '8px 16px',
                background: 'var(--bg-alt)',
                borderRadius: '20px',
                fontSize: '14px',
                color: 'var(--fg-soft)',
                border: '1px solid var(--border)'
              }}>
                🏆 Achieve Goals
              </span>
            </div>
          </div>
        ) : currentPage === 'dashboard' ? (
          <>
            {/* LeetCode-style header with streak info */}
            <div style={{
              ...cssCard,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, var(--card), var(--bg-alt))',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: 'var(--fg)',
                    margin: '0 0 8px 0'
                  }}>
                    {selected.title}
                  </h1>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '14px',
                    color: 'var(--fg-soft)'
                  }}>
                    <span>📅 {selected.days} days total</span>
                    <span>🎯 Target: {finishDate}</span>
                    <span>📊 {selected.layout} layout</span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Gauge value={selected.completed.size} total={selected.days} futuristicMode={futuristicMode} />
                </div>
              </div>

              {/* Stats cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px'
              }}>
                {[
                  { label: 'Current Streak', value: streakStats.current, icon: '🔥', color: '#ff6b6b' },
                  { label: 'Longest Streak', value: streakStats.max, icon: '🏆', color: '#feca57' },
                  { label: 'Completion Rate', value: `${Math.round((selected.completed.size / selected.days) * 100)}%`, icon: '📊', color: '#48dbfb' },
                  { label: 'Freezes Available', value: selected.freezesLeft, icon: '❄️', color: '#0abde3' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: futuristicMode
                      ? 'rgba(0, 0, 0, 0.4)'
                      : 'var(--card)',
                    border: futuristicMode
                      ? `1px solid ${stat.color}30`
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    backdropFilter: futuristicMode ? 'blur(10px)' : 'none',
                    minHeight: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (futuristicMode) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 20px ${stat.color}20`;
                      e.currentTarget.style.borderColor = `${stat.color}60`;
                    } else {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    if (futuristicMode) {
                      e.currentTarget.style.borderColor = `${stat.color}30`;
                    }
                  }}
                  >
                    <div style={{
                      fontSize: '20px',
                      marginBottom: '8px',
                      filter: futuristicMode ? `drop-shadow(0 0 4px ${stat.color})` : 'none'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: futuristicMode ? stat.color : stat.color,
                      marginBottom: '4px',
                      textShadow: futuristicMode ? `0 0 8px ${stat.color}40` : 'none'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: futuristicMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--fg-soft)',
                      fontWeight: '500',
                      textTransform: futuristicMode ? 'uppercase' : 'none',
                      letterSpacing: futuristicMode ? '0.5px' : 'normal'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement badges and actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[0.25, 0.5, 0.75, 1].map((threshold, i) => {
                  const pct = selected.completed.size / selected.days;
                  if (pct < threshold) return null;
                  const isComplete = threshold === 1;
                  return (
                    <span key={i} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '13px',
                      fontWeight: '500',
                      background: isComplete ? 'var(--success)' : 'var(--accent)',
                      color: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <span>{isComplete ? '🏆' : '🎉'}</span>
                      <span>{Math.round(threshold * 100)}% Complete</span>
                    </span>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={freezeToday}
                  style={{
                    ...cssBtn('secondary', 'sm'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🧊</span>
                  <span>Freeze Today</span>
                </button>
                <button
                  onClick={downloadPNG}
                  style={{
                    ...cssBtn('secondary', 'sm'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📥</span>
                  <span>Export PNG</span>
                </button>
                <button
                  onClick={exportCSV}
                  style={{
                    ...cssBtn('secondary', 'sm'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📄</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* LeetCode-style streak visualization */}
            <div ref={shareRef} style={{
              ...cssCard,
              padding: '32px',
              background: 'var(--card)',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'var(--fg)',
                    margin: '0 0 4px 0'
                  }}>
                    Streak Visualization
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--fg-soft)',
                    margin: 0
                  }}>
                    {selected.completed.size} completed days in the last {selected.days} days
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--fg-soft)'
                  }}>
                    <span>Less</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[0, 1, 2, 3, 4].map(level => (
                        <div key={level} style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '2px',
                          background: level === 0 ? 'var(--border)' :
                                     streakTheme === 'github' ? ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'][level] :
                                     'var(--accent)',
                          opacity: level === 0 ? 1 : level * 0.25
                        }} />
                      ))}
                    </div>
                    <span>More</span>
                  </div>

                  {futuristicMode && (
                    <div style={{
                      padding: '4px 8px',
                      background: 'linear-gradient(135deg, var(--accent), var(--success))',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>🚀</span>
                      <span>FUTURISTIC MODE</span>
                    </div>
                  )}
                </div>
              </div>

              <StreakBoard
                days={selected.days}
                layout={selected.layout}
                shape={selected.shape}
                completed={selected.completed}
                counts={selected.counts}
                freezes={selected.freezes}
                notes={selected.notes}
                onToggleDay={toggleDay}
                onEditNote={editNote}
                onUpdateNote={(idx, note) => {
                  setBoards(boards => boards.map(b =>
                    b.id === selectedId
                      ? { ...b, notes: { ...b.notes, [idx]: note } }
                      : b
                  ));
                }}
                onUpdateDifficulty={(idx, difficulty) => {
                  setBoards(boards => boards.map(b =>
                    b.id === selectedId
                      ? {
                          ...b,
                          counts: { ...b.counts, [idx]: difficulty },
                          completed: new Set([...b.completed, idx]) // Ensure the day is marked as completed
                        }
                      : b
                  ));
                }}
                theme={streakTheme}
                showDayLabels={true}
                enableAnimations={true}
                enableKeyboard={true}
                enableHover={true}
                accentColor={accentColor}
                showStreaks={true}
                showStats={true}
                // FUTURISTIC FEATURES 🚀
                enableSoundEffects={futuristicMode}
                enableHolographicMode={futuristicMode && ['hologram', 'plasma', 'quantum'].includes(streakTheme)}
                enableMatrixMode={futuristicMode && streakTheme === 'matrix'}
                enableQuantumMode={futuristicMode && streakTheme === 'quantum'}
                enableCyberScan={futuristicMode && ['cyberpunk', 'neon', 'matrix'].includes(streakTheme)}
                futuristicParticles={futuristicMode}
                enableDataStream={futuristicMode && ['matrix', 'cyberpunk', 'quantum'].includes(streakTheme)}
                enableNeonGlow={futuristicMode && ['neon', 'cyberpunk', 'plasma'].includes(streakTheme)}
              />
            </div>

            {/* FUTURISTIC ANALYTICS SYSTEM 🚀 */}
            <div style={{
              ...cssCard,
              background: futuristicMode
                ? 'linear-gradient(135deg, var(--card), rgba(255, 161, 22, 0.05))'
                : 'var(--card)',
              border: futuristicMode
                ? '1px solid rgba(255, 161, 22, 0.3)'
                : '1px solid var(--border)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Futuristic background effect */}
              {futuristicMode && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 161, 22, 0.03) 50%, transparent 70%)',
                  animation: 'cyber-scan 3s ease-in-out infinite',
                  pointerEvents: 'none'
                }} />
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                position: 'relative',
                zIndex: 1
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--fg)',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, var(--accent), var(--success))',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '20px'
                    }}>
                      🧠
                    </span>
                    AI-Powered Analytics
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: 'var(--fg-soft)',
                    margin: 0
                  }}>
                    Advanced insights powered by machine learning algorithms
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {futuristicMode && (
                    <div style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      animation: 'holographic-pulse 2s ease-in-out infinite'
                    }}>
                      <span>🤖</span>
                      <span>AI ACTIVE</span>
                    </div>
                  )}

                  {['7D', '30D', '90D', 'All'].map((period, i) => (
                    <button key={period} style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: futuristicMode
                        ? '1px solid rgba(255, 161, 22, 0.3)'
                        : '1px solid var(--border)',
                      background: i === 3
                        ? (futuristicMode
                          ? 'linear-gradient(135deg, var(--accent), var(--success))'
                          : 'var(--accent)')
                        : 'transparent',
                      color: i === 3 ? '#ffffff' : 'var(--fg)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: futuristicMode && i === 3
                        ? '0 0 20px rgba(255, 161, 22, 0.4)'
                        : 'none'
                    }}>
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Analytics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Consistency Score */}
                <div style={{
                  background: futuristicMode
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.1))'
                    : 'var(--bg-alt)',
                  border: futuristicMode
                    ? '1px solid rgba(0, 255, 136, 0.3)'
                    : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)',
                        margin: '0 0 4px 0'
                      }}>
                        Consistency Score
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        margin: 0
                      }}>
                        AI-calculated reliability index
                      </p>
                    </div>
                    <div style={{
                      fontSize: '24px',
                      background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      🎯
                    </div>
                  </div>

                  <div style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, var(--success), var(--accent))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    marginBottom: '8px'
                  }}>
                    {Math.round((selected.completed.size / selected.days) * 100)}%
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: selected.completed.size > selected.days * 0.7 ? 'var(--success)' : 'var(--warning)',
                    fontWeight: '500'
                  }}>
                    <span>{selected.completed.size > selected.days * 0.7 ? '↗️' : '📈'}</span>
                    <span>{selected.completed.size > selected.days * 0.7 ? 'Excellent progress!' : 'Keep building momentum!'}</span>
                  </div>

                  {/* Elegant Progress Ring with Hover Animation */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: futuristicMode
                        ? `conic-gradient(#00ff88 ${(selected.completed.size / selected.days) * 360}deg, rgba(0, 255, 136, 0.2) 0deg)`
                        : `conic-gradient(var(--success) ${(selected.completed.size / selected.days) * 360}deg, var(--border) 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: futuristicMode ? '0 0 15px rgba(0, 255, 136, 0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (futuristicMode) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5)';

                        // Add animated SVG overlay
                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.style.position = 'absolute';
                        svg.style.top = '0';
                        svg.style.left = '0';
                        svg.style.width = '100%';
                        svg.style.height = '100%';
                        svg.style.transform = 'rotate(-90deg)';
                        svg.style.zIndex = '10';
                        svg.setAttribute('viewBox', '0 0 60 60');

                        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        circle.setAttribute('cx', '30');
                        circle.setAttribute('cy', '30');
                        circle.setAttribute('r', '25');
                        circle.setAttribute('fill', 'none');
                        circle.setAttribute('stroke', '#00ff88');
                        circle.setAttribute('stroke-width', '3');
                        circle.setAttribute('stroke-linecap', 'round');
                        circle.setAttribute('stroke-dasharray', '157');
                        circle.setAttribute('stroke-dashoffset', '157');
                        circle.style.animation = 'progressCircleSmall 1.5s ease-out forwards';
                        circle.style.filter = 'drop-shadow(0 0 6px #00ff88)';

                        svg.appendChild(circle);
                        e.currentTarget.appendChild(svg);
                        e.currentTarget._animationSvg = svg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (futuristicMode) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';

                        // Remove animated SVG
                        if (e.currentTarget._animationSvg) {
                          e.currentTarget.removeChild(e.currentTarget._animationSvg);
                          delete e.currentTarget._animationSvg;
                        }
                      }
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: futuristicMode
                        ? 'radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))'
                        : 'var(--card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: futuristicMode ? '#00ff88' : 'var(--fg)',
                      border: futuristicMode ? '1px solid rgba(0, 255, 136, 0.3)' : 'none',
                      textShadow: futuristicMode ? '0 0 6px rgba(0, 255, 136, 0.6)' : 'none',
                      position: 'relative',
                      zIndex: 5
                    }}>
                      {Math.round((selected.completed.size / selected.days) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Streak Prediction */}
                <div style={{
                  background: futuristicMode
                    ? 'linear-gradient(135deg, rgba(255, 161, 22, 0.1), rgba(255, 55, 95, 0.1))'
                    : 'var(--bg-alt)',
                  border: futuristicMode
                    ? '1px solid rgba(255, 161, 22, 0.3)'
                    : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)',
                        margin: '0 0 4px 0'
                      }}>
                        AI Streak Prediction
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        margin: 0
                      }}>
                        Machine learning forecast
                      </p>
                    </div>
                    <div style={{
                      fontSize: '24px',
                      background: 'linear-gradient(135deg, var(--accent), #ff375f)',
                      borderRadius: '8px',
                      padding: '8px'
                    }}>
                      🔮
                    </div>
                  </div>

                  <div style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, var(--accent), #ff375f)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    marginBottom: '8px'
                  }}>
                    {streakStats.current + Math.floor((selected.completed.size / selected.days) * 7)}
                  </div>

                  <div style={{
                    fontSize: '14px',
                    color: 'var(--fg-soft)',
                    marginBottom: '12px'
                  }}>
                    Predicted streak in 7 days
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--accent)',
                    fontWeight: '500'
                  }}>
                    <span>🎯</span>
                    <span>{Math.min(95, Math.round((selected.completed.size / selected.days) * 100) + 10)}% confidence level</span>
                  </div>
                </div>

                {/* Performance Insights */}
                <div style={{
                  background: futuristicMode
                    ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.1))'
                    : 'var(--bg-alt)',
                  border: futuristicMode
                    ? '1px solid rgba(138, 43, 226, 0.3)'
                    : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)',
                        margin: '0 0 4px 0'
                      }}>
                        Performance Insights
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        margin: 0
                      }}>
                        Behavioral pattern analysis
                      </p>
                    </div>
                    <div style={{
                      fontSize: '24px',
                      background: 'linear-gradient(135deg, #8a2be2, #4b0082)',
                      borderRadius: '8px',
                      padding: '8px'
                    }}>
                      📊
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gap: '12px'
                  }}>
                    {[
                      {
                        label: 'Current Streak',
                        value: `${streakStats.current} days`,
                        trend: streakStats.current > 0 ? '🔥' : '💪'
                      },
                      {
                        label: 'Completion Rate',
                        value: `${Math.round((selected.completed.size / selected.days) * 100)}%`,
                        trend: selected.completed.size > selected.days * 0.7 ? 'Excellent' : 'Growing'
                      },
                      {
                        label: 'Motivation',
                        value: selected.completed.size > selected.days * 0.8 ? 'High' : selected.completed.size > selected.days * 0.5 ? 'Good' : 'Building',
                        trend: selected.completed.size > 0 ? '↗️' : '🚀'
                      }
                    ].map((insight, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          color: 'var(--fg-soft)'
                        }}>
                          {insight.label}
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--fg)'
                          }}>
                            {insight.value}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: 'var(--success)',
                            fontWeight: '500'
                          }}>
                            {insight.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Metrics Dashboard */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
                position: 'relative',
                zIndex: 1
              }}>
                {[
                  {
                    label: 'Weekly Average',
                    value: `${(selected.completed.size / Math.ceil(selected.days / 7)).toFixed(1)} days`,
                    icon: '📈',
                    color: 'var(--success)',
                    trend: selected.completed.size > selected.days * 0.7 ? '+Excellent' : '+Growing'
                  },
                  {
                    label: 'Longest Streak',
                    value: `${streakStats.max} days`,
                    icon: '🏆',
                    color: 'var(--accent)',
                    trend: streakStats.max === streakStats.current ? 'Current!' : 'Record!'
                  },
                  {
                    label: 'Success Rate',
                    value: `${Math.round((selected.completed.size / selected.days) * 100)}%`,
                    icon: '🎯',
                    color: '#8a2be2',
                    trend: selected.completed.size > selected.days * 0.8 ? '+Excellent' : '+Good'
                  },
                  {
                    label: 'Days Remaining',
                    value: `${Math.max(0, selected.days - Math.floor((new Date() - new Date(selected.startDate)) / (1000 * 60 * 60 * 24)))} days`,
                    icon: '⏰',
                    color: '#ff6b6b',
                    trend: Math.max(0, selected.days - Math.floor((new Date() - new Date(selected.startDate)) / (1000 * 60 * 60 * 24))) > 7 ? '⏳' : '🏃‍♂️'
                  }
                ].map((metric, i) => (
                  <div key={i} style={{
                    background: futuristicMode
                      ? `linear-gradient(135deg, ${metric.color}15, ${metric.color}05)`
                      : 'var(--bg-alt)',
                    border: futuristicMode
                      ? `1px solid ${metric.color}30`
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    {futuristicMode && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(45deg, transparent, ${metric.color}08, transparent)`,
                        animation: 'cyber-scan 4s ease-in-out infinite',
                        animationDelay: `${i * 0.5}s`
                      }} />
                    )}

                    <div style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {metric.icon}
                    </div>

                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: metric.color,
                      marginBottom: '4px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {metric.value}
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: 'var(--fg)',
                      fontWeight: '500',
                      marginBottom: '8px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {metric.label}
                    </div>

                    <div style={{
                      fontSize: '11px',
                      color: 'var(--success)',
                      fontWeight: '600',
                      background: 'rgba(0, 175, 155, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {metric.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recommendations */}
              <div style={{
                background: futuristicMode
                  ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05))'
                  : 'var(--bg-alt)',
                border: futuristicMode
                  ? '1px solid rgba(0, 255, 255, 0.3)'
                  : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {futuristicMode && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.03), transparent)',
                    animation: 'cyber-scan 2s ease-in-out infinite'
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '20px'
                  }}>
                    🤖
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--fg)',
                      margin: '0 0 4px 0'
                    }}>
                      AI Recommendations
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--fg-soft)',
                      margin: 0
                    }}>
                      Personalized insights to optimize your streak
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '16px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {(() => {
                    const recommendations = [];
                    const completionRate = (selected.completed.size / selected.days) * 100;
                    const currentStreak = streakStats.current;

                    // Dynamic recommendations based on actual performance
                    if (completionRate >= 80) {
                      recommendations.push({
                        type: 'success',
                        icon: '🎯',
                        title: 'Excellent Performance!',
                        message: `You're crushing it with ${Math.round(completionRate)}% completion rate. Keep this momentum going!`,
                        confidence: '95%'
                      });
                    } else if (completionRate >= 60) {
                      recommendations.push({
                        type: 'info',
                        icon: '📈',
                        title: 'Good Progress',
                        message: `You're at ${Math.round(completionRate)}% completion. Try setting daily reminders to boost consistency.`,
                        confidence: '88%'
                      });
                    } else {
                      recommendations.push({
                        type: 'warning',
                        icon: '💪',
                        title: 'Building Momentum',
                        message: `Start small and focus on daily consistency. Even 1% improvement compounds over time.`,
                        confidence: '92%'
                      });
                    }

                    if (currentStreak === 0) {
                      recommendations.push({
                        type: 'info',
                        icon: '🚀',
                        title: 'Fresh Start',
                        message: 'Today is perfect for starting your streak! The best time to plant a tree was 20 years ago. The second best time is now.',
                        confidence: '100%'
                      });
                    } else if (currentStreak >= 7) {
                      recommendations.push({
                        type: 'success',
                        icon: '🔥',
                        title: 'Streak Master',
                        message: `Amazing ${currentStreak}-day streak! You've proven you can do this. Keep the fire burning!`,
                        confidence: '96%'
                      });
                    }

                    if (selected.days - Math.floor((new Date() - new Date(selected.startDate)) / (1000 * 60 * 60 * 24)) <= 7) {
                      recommendations.push({
                        type: 'warning',
                        icon: '⏰',
                        title: 'Final Sprint',
                        message: 'You\'re in the final stretch! Push through these last few days to complete your goal.',
                        confidence: '89%'
                      });
                    }

                    return recommendations.slice(0, 3);
                  })().map((rec, i) => (
                    <div key={i} style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        background: rec.type === 'success' ? 'rgba(0, 175, 155, 0.1)' :
                                   rec.type === 'warning' ? 'rgba(255, 184, 0, 0.1)' :
                                   'rgba(0, 123, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '8px',
                        flexShrink: 0
                      }}>
                        {rec.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--fg)',
                            margin: 0
                          }}>
                            {rec.title}
                          </h4>
                          <span style={{
                            fontSize: '11px',
                            color: 'var(--fg-soft)',
                            background: 'var(--bg-alt)',
                            padding: '2px 6px',
                            borderRadius: '10px'
                          }}>
                            {rec.confidence} confidence
                          </span>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: 'var(--fg-soft)',
                          margin: 0,
                          lineHeight: '1.4'
                        }}>
                          {rec.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : currentPage === 'habits' ? (
          <HabitsPage
            boards={boards}
            onCreateBoard={(data) => {
              const id = Date.now().toString();
              setBoards(bs => [...bs, {
                id,
                title: data.title,
                days: data.days || 30,
                layout: 'month',
                shape: 'square',
                startDate: new Date().toISOString().slice(0,10),
                weekdaysOnly: false,
                completed: new Set(),
                counts: {},
                notes: {},
                freezesLeft: 3,
                freezes: new Set(),
                category: data.category,
                icon: data.icon,
                difficulty: data.difficulty
              }]);
              setSelectedId(id);
              setCurrentPage('dashboard');
            }}
            onDeleteBoard={(id) => {
              setBoards(bs => bs.filter(b => b.id !== id));
              if (selectedId === id) setSelectedId(null);
            }}
            theme={theme}
            futuristicMode={futuristicMode}
            accentColor={accentColor}
          />
        ) : currentPage === 'goals' ? (
          <GoalsPage
            boards={boards}
            theme={theme}
            futuristicMode={futuristicMode}
            accentColor={accentColor}
          />
        ) : currentPage === 'analytics' ? (
          <AnalyticsPage
            boards={boards}
            theme={theme}
            futuristicMode={futuristicMode}
            accentColor={accentColor}
          />
        ) : currentPage === 'diary' ? (
          <DiaryPage
            diaryEntries={diaryEntries}
            setDiaryEntries={setDiaryEntries}
            theme={theme}
            futuristicMode={futuristicMode}
            accentColor={accentColor}
          />
        ) : currentPage === 'reminders' ? (
          <RemindersPage
            reminders={reminders}
            setReminders={setReminders}
            theme={theme}
            futuristicMode={futuristicMode}
            accentColor={accentColor}
          />
        ) : currentPage === 'manual' ? (
          <ManualPage
            theme={theme}
            futuristicMode={futuristicMode}
          />
        ) : currentPage === 'community' ? (
          <CommunityPage
            boards={boards}
            theme={theme}
            futuristicMode={futuristicMode}
            accentColor={accentColor}
          />
        ) : currentPage === 'settings' ? (
          <SettingsPage
            theme={theme}
            setTheme={setTheme}
            futuristicMode={futuristicMode}
            setFuturisticMode={setFuturisticMode}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            streakTheme={streakTheme}
            setStreakTheme={setStreakTheme}
          />
        ) : null}
      </main>

      {/* Create Streak Modal - Futuristic Command Center */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: futuristicMode
            ? 'radial-gradient(circle at center, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))'
            : 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>


          <div style={{
            background: futuristicMode
              ? 'rgba(0, 0, 0, 0.95)'
              : 'var(--card)',
            border: futuristicMode
              ? '1px solid rgba(0, 255, 136, 0.2)'
              : '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            boxShadow: futuristicMode
              ? '0 20px 60px rgba(0, 0, 0, 0.8)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>


            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Minimalist Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: futuristicMode
                      ? 'rgba(0, 255, 136, 0.1)'
                      : 'var(--accent)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    border: futuristicMode ? '1px solid rgba(0, 255, 136, 0.3)' : 'none'
                  }}>
                    🚀
                  </div>
                  <div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '24px',
                      fontWeight: '600',
                      color: futuristicMode ? '#00ff88' : 'var(--fg)',
                      letterSpacing: futuristicMode ? '1px' : 'normal'
                    }}>
                      {futuristicMode ? 'Create Streak' : 'Create New Streak'}
                    </h2>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: futuristicMode ? 'rgba(0, 255, 136, 0.7)' : 'var(--fg-soft)',
                      marginTop: '4px'
                    }}>
                      {futuristicMode ? 'Initialize new habit protocol' : 'Build a new habit that sticks'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: futuristicMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'var(--bg-alt)',
                    color: futuristicMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--fg-soft)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = futuristicMode ? 'rgba(255, 255, 255, 0.2)' : 'var(--error)';
                    e.target.style.color = futuristicMode ? '#ffffff' : '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = futuristicMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-alt)';
                    e.target.style.color = futuristicMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--fg-soft)';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Futuristic Form Interface */}
              <div style={{ marginBottom: '24px' }}>
                {/* Habit Name Input */}
                <div style={{
                  marginBottom: '24px',
                  position: 'relative'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: futuristicMode ? '#00ff88' : 'var(--fg)',
                    marginBottom: '12px'
                  }}>
                    {futuristicMode ? 'Habit Name' : 'Streak Name'}
                  </label>

                  <div style={{ position: 'relative' }}>
                    <input
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '16px',
                        background: futuristicMode
                          ? 'rgba(0, 0, 0, 0.3)'
                          : 'var(--bg-alt)',
                        border: futuristicMode
                          ? '1px solid rgba(0, 255, 136, 0.3)'
                          : '1px solid var(--border)',
                        borderRadius: '12px',
                        color: futuristicMode ? '#00ff88' : 'var(--fg)',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontWeight: '500'
                      }}
                      value={title}
                      placeholder={futuristicMode
                        ? "Enter habit name..."
                        : "e.g., Daily Exercise, Reading, Meditation..."}
                      onChange={e => setTitle(e.target.value)}
                      onFocus={(e) => {
                        if (futuristicMode) {
                          e.target.style.borderColor = 'rgba(0, 255, 136, 0.6)';
                          e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                        }
                      }}
                      onBlur={(e) => {
                        if (futuristicMode) {
                          e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                          e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Futuristic Habit Templates */}
                <div style={{
                  marginBottom: '24px'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: futuristicMode ? 'rgba(255, 255, 255, 0.6)' : 'var(--fg-soft)',
                    marginBottom: '12px'
                  }}>
                    {futuristicMode ? 'Quick Templates' : 'Quick Suggestions'}
                  </label>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px'
                  }}>
                    {[
                      { icon: '💪', name: 'Daily Exercise', category: 'FITNESS' },
                      { icon: '📚', name: 'Reading', category: 'LEARNING' },
                      { icon: '🧘', name: 'Meditation', category: 'WELLNESS' },
                      { icon: '💻', name: 'Coding', category: 'SKILL' },
                      { icon: '💧', name: 'Drink Water', category: 'HEALTH' },
                      { icon: '🌅', name: 'Early Wake Up', category: 'ROUTINE' },
                      { icon: '📝', name: 'Journaling', category: 'MINDFUL' },
                      { icon: '🎨', name: 'Creative Work', category: 'CREATE' }
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setTitle(suggestion.name)}
                        style={{
                          padding: '12px',
                          fontSize: '13px',
                          background: futuristicMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'var(--bg-alt)',
                          border: futuristicMode
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid var(--border)',
                          borderRadius: '8px',
                          color: futuristicMode ? 'rgba(255, 255, 255, 0.8)' : 'var(--fg-soft)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          if (futuristicMode) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          } else {
                            e.target.style.background = 'var(--accent)';
                            e.target.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (futuristicMode) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          } else {
                            e.target.style.background = 'var(--bg-alt)';
                            e.target.style.color = 'var(--fg-soft)';
                          }
                        }}
                      >
                        <div style={{
                          fontSize: '24px',
                          marginBottom: '4px'
                        }}>
                          {suggestion.icon}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          {suggestion.name}
                        </div>
                        {futuristicMode && (
                          <div style={{
                            fontSize: '9px',
                            color: 'rgba(78, 205, 196, 0.6)',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                          }}>
                            {suggestion.category}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Futuristic Configuration Panel */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {/* Duration Input */}
                  <div style={{ position: 'relative' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: futuristicMode ? 'rgba(254, 202, 87, 0.9)' : 'var(--fg)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {futuristicMode ? '⏱️ MISSION DURATION' : 'Duration'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        style={{
                          width: '100%',
                          padding: '18px 60px 18px 24px',
                          fontSize: '20px',
                          background: futuristicMode
                            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(254, 202, 87, 0.05))'
                            : 'var(--bg-alt)',
                          border: futuristicMode
                            ? '2px solid rgba(254, 202, 87, 0.3)'
                            : '1px solid var(--border)',
                          borderRadius: '16px',
                          color: futuristicMode ? '#feca57' : 'var(--fg)',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontWeight: '700',
                          textAlign: 'center'
                        }}
                        type="number"
                        value={rawDays}
                        placeholder="30"
                        min="1"
                        max="365"
                        onChange={e => setRawDays(e.target.value)}
                        onFocus={(e) => {
                          if (futuristicMode) {
                            e.target.style.boxShadow = '0 0 40px rgba(254, 202, 87, 0.4), inset 0 0 20px rgba(254, 202, 87, 0.1)';
                            e.target.style.borderColor = 'rgba(254, 202, 87, 0.8)';
                            e.target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(254, 202, 87, 0.08))';
                          }
                        }}
                        onBlur={(e) => {
                          if (futuristicMode) {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = 'rgba(254, 202, 87, 0.3)';
                            e.target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(254, 202, 87, 0.05))';
                          }
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '14px',
                        color: futuristicMode ? 'rgba(254, 202, 87, 0.7)' : 'var(--fg-soft)',
                        pointerEvents: 'none',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {futuristicMode ? 'DAYS' : 'days'}
                      </span>

                      {/* Duration Indicator */}
                      {futuristicMode && rawDays && (
                        <div style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#feca57',
                          boxShadow: '0 0 8px #feca57',
                          animation: 'pulse 2s ease-in-out infinite'
                        }} />
                      )}
                    </div>
                  </div>

                  {/* Start Date Input */}
                  <div style={{ position: 'relative' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: futuristicMode ? 'rgba(165, 94, 234, 0.9)' : 'var(--fg)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {futuristicMode ? '📅 LAUNCH DATE' : 'Start Date'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          fontSize: '18px',
                          background: futuristicMode
                            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(165, 94, 234, 0.05))'
                            : 'var(--bg-alt)',
                          border: futuristicMode
                            ? '2px solid rgba(165, 94, 234, 0.3)'
                            : '1px solid var(--border)',
                          borderRadius: '16px',
                          color: futuristicMode ? '#a55eea' : 'var(--fg)',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontWeight: '600'
                        }}
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        onFocus={(e) => {
                          if (futuristicMode) {
                            e.target.style.boxShadow = '0 0 40px rgba(165, 94, 234, 0.4), inset 0 0 20px rgba(165, 94, 234, 0.1)';
                            e.target.style.borderColor = 'rgba(165, 94, 234, 0.8)';
                            e.target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(165, 94, 234, 0.08))';
                          }
                        }}
                        onBlur={(e) => {
                          if (futuristicMode) {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = 'rgba(165, 94, 234, 0.3)';
                            e.target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(165, 94, 234, 0.05))';
                          }
                        }}
                      />

                      {/* Date Indicator */}
                      {futuristicMode && startDate && (
                        <div style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#a55eea',
                          boxShadow: '0 0 8px #a55eea',
                          animation: 'pulse 2s ease-in-out infinite 0.5s'
                        }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Futuristic Schedule Configuration */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    fontSize: '16px',
                    color: futuristicMode ? 'rgba(255, 107, 107, 0.9)' : 'var(--fg)',
                    cursor: 'pointer',
                    padding: '24px',
                    background: futuristicMode
                      ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 107, 107, 0.05))'
                      : 'var(--bg-alt)',
                    border: futuristicMode
                      ? '2px solid rgba(255, 107, 107, 0.3)'
                      : '1px solid var(--border)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (futuristicMode) {
                      e.target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(255, 107, 107, 0.08))';
                      e.target.style.borderColor = 'rgba(255, 107, 107, 0.5)';
                      e.target.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (futuristicMode) {
                      e.target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 107, 107, 0.05))';
                      e.target.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  >
                    {/* Custom Checkbox */}
                    <div style={{
                      position: 'relative',
                      width: '24px',
                      height: '24px',
                      border: futuristicMode
                        ? '2px solid rgba(255, 107, 107, 0.6)'
                        : '2px solid var(--border)',
                      borderRadius: '6px',
                      background: weekdaysOnly
                        ? (futuristicMode ? '#ff6b6b' : 'var(--accent)')
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {weekdaysOnly && (
                        <div style={{
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}>
                          ✓
                        </div>
                      )}
                      {futuristicMode && weekdaysOnly && (
                        <div style={{
                          position: 'absolute',
                          top: '-2px',
                          left: '-2px',
                          right: '-2px',
                          bottom: '-2px',
                          border: '1px solid rgba(255, 107, 107, 0.8)',
                          borderRadius: '6px',
                          animation: 'pulse 2s ease-in-out infinite'
                        }} />
                      )}
                    </div>

                    <input
                      type="checkbox"
                      checked={weekdaysOnly}
                      onChange={e => setWeekdaysOnly(e.target.checked)}
                      style={{ display: 'none' }}
                    />

                    <div>
                      <div style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        marginBottom: '4px',
                        textTransform: futuristicMode ? 'uppercase' : 'none',
                        letterSpacing: futuristicMode ? '1px' : 'normal'
                      }}>
                        {futuristicMode ? '📅 WEEKDAY PROTOCOL' : 'Weekdays only (Mon-Fri)'}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: futuristicMode ? 'rgba(255, 107, 107, 0.7)' : 'var(--fg-soft)',
                        fontWeight: '500'
                      }}>
                        {futuristicMode
                          ? 'Exclude weekend cycles from mission parameters'
                          : 'Skip weekends automatically'}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Futuristic Interface Configuration */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {/* Layout Selector */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: futuristicMode ? 'rgba(0, 255, 136, 0.9)' : 'var(--fg)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {futuristicMode ? '🔲 DISPLAY MATRIX' : 'Layout Style'}
                    </label>

                    <div style={{
                      background: futuristicMode
                        ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 255, 136, 0.05))'
                        : 'var(--bg-alt)',
                      border: futuristicMode
                        ? '2px solid rgba(0, 255, 136, 0.3)'
                        : '1px solid var(--border)',
                      borderRadius: '16px',
                      padding: '4px',
                      position: 'relative'
                    }}>
                      <select
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          fontSize: '16px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '12px',
                          color: futuristicMode ? '#00ff88' : 'var(--fg)',
                          outline: 'none',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        value={layout}
                        onChange={e => setLayout(e.target.value)}
                      >
                        <option value="week" style={{ background: 'var(--card)', color: 'var(--fg)' }}>
                          {futuristicMode ? '📅 WEEKLY MATRIX' : '📅 Week View'}
                        </option>
                        <option value="month" style={{ background: 'var(--card)', color: 'var(--fg)' }}>
                          {futuristicMode ? '🗓️ MONTHLY GRID' : '🗓️ Month View'}
                        </option>
                        <option value="random" style={{ background: 'var(--card)', color: 'var(--fg)' }}>
                          {futuristicMode ? '⚡ NEURAL GRID' : '⚡ Grid View'}
                        </option>
                      </select>

                      {futuristicMode && (
                        <div style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#00ff88',
                          boxShadow: '0 0 8px #00ff88',
                          animation: 'pulse 2s ease-in-out infinite'
                        }} />
                      )}
                    </div>
                  </div>

                  {/* Shape Selector */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: futuristicMode ? 'rgba(78, 205, 196, 0.9)' : 'var(--fg)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {futuristicMode ? '🔷 NODE GEOMETRY' : 'Cell Shape'}
                    </label>

                    <div style={{
                      background: futuristicMode
                        ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(78, 205, 196, 0.05))'
                        : 'var(--bg-alt)',
                      border: futuristicMode
                        ? '2px solid rgba(78, 205, 196, 0.3)'
                        : '1px solid var(--border)',
                      borderRadius: '16px',
                      padding: '4px',
                      position: 'relative'
                    }}>
                      <select
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          fontSize: '16px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '12px',
                          color: futuristicMode ? '#4ecdc4' : 'var(--fg)',
                          outline: 'none',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        value={shape}
                        onChange={e => setShape(e.target.value)}
                      >
                        <option value="square" style={{ background: 'var(--card)', color: 'var(--fg)' }}>
                          {futuristicMode ? '⬜ CUBIC FORM' : '⬜ Square'}
                        </option>
                        <option value="rounded" style={{ background: 'var(--card)', color: 'var(--fg)' }}>
                          {futuristicMode ? '🔲 SOFT CUBE' : '🔲 Rounded'}
                        </option>
                        <option value="circle" style={{ background: 'var(--card)', color: 'var(--fg)' }}>
                          {futuristicMode ? '⭕ SPHERICAL' : '⭕ Circle'}
                        </option>
                      </select>

                      {futuristicMode && (
                        <div style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#4ecdc4',
                          boxShadow: '0 0 8px #4ecdc4',
                          animation: 'pulse 2s ease-in-out infinite 0.5s'
                        }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Futuristic Action Panel */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '24px',
                  paddingTop: '24px',
                  borderTop: futuristicMode
                    ? '1px solid rgba(0, 255, 136, 0.2)'
                    : '1px solid var(--border)'
                }}>
                  {/* Cancel Button */}
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      flex: '0 0 auto',
                      padding: '14px 24px',
                      background: futuristicMode
                        ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))'
                        : 'var(--bg-alt)',
                      color: futuristicMode ? '#ff6b6b' : 'var(--fg)',
                      border: futuristicMode
                        ? '2px solid rgba(255, 107, 107, 0.3)'
                        : '1px solid var(--border)',
                      borderRadius: '16px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: futuristicMode ? 'uppercase' : 'none',
                      letterSpacing: futuristicMode ? '1px' : 'normal'
                    }}
                    onMouseEnter={(e) => {
                      if (futuristicMode) {
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1))';
                        e.target.style.borderColor = 'rgba(255, 107, 107, 0.5)';
                        e.target.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
                      } else {
                        e.target.style.background = 'var(--border)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (futuristicMode) {
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))';
                        e.target.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                        e.target.style.boxShadow = 'none';
                      } else {
                        e.target.style.background = 'var(--bg-alt)';
                      }
                    }}
                  >
                    {futuristicMode ? 'ABORT MISSION' : 'Cancel'}
                  </button>

                  {/* Create Button */}
                  <button
                    onClick={createStreak}
                    disabled={!title.trim() || !rawDays}
                    style={{
                      flex: 1,
                      padding: '16px 32px',
                      background: title.trim() && rawDays
                        ? (futuristicMode
                            ? 'linear-gradient(135deg, #00ff88, #00cc6a)'
                            : 'var(--accent)')
                        : (futuristicMode
                            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))'
                            : 'var(--border)'),
                      color: title.trim() && rawDays
                        ? (futuristicMode ? '#000000' : '#ffffff')
                        : (futuristicMode ? 'rgba(255, 255, 255, 0.3)' : 'var(--fg-soft)'),
                      border: futuristicMode
                        ? `2px solid ${title.trim() && rawDays ? 'rgba(0, 255, 136, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`
                        : 'none',
                      borderRadius: '16px',
                      fontSize: '20px',
                      fontWeight: '700',
                      cursor: title.trim() && rawDays ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      transition: 'all 0.3s ease',
                      boxShadow: title.trim() && rawDays && futuristicMode
                        ? '0 0 40px rgba(0, 255, 136, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        : 'none',
                      transform: 'translateY(0)',
                      position: 'relative',
                      overflow: 'hidden',
                      textTransform: futuristicMode ? 'uppercase' : 'none',
                      letterSpacing: futuristicMode ? '2px' : 'normal'
                    }}
                    onMouseEnter={(e) => {
                      if (title.trim() && rawDays) {
                        e.target.style.transform = 'translateY(-3px) scale(1.02)';
                        if (futuristicMode) {
                          e.target.style.boxShadow = '0 0 60px rgba(0, 255, 136, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                          e.target.style.background = 'linear-gradient(135deg, #00ff88, #26de81)';
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (title.trim() && rawDays) {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        if (futuristicMode) {
                          e.target.style.boxShadow = '0 0 40px rgba(0, 255, 136, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                          e.target.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
                        }
                      }
                    }}
                  >
                    {/* Futuristic Button Effects */}
                    {futuristicMode && title.trim() && rawDays && (
                      <>
                        {/* Scanning Line */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                          animation: 'scan 3s ease-in-out infinite'
                        }} />

                        {/* Energy Particles */}
                        <div style={{
                          position: 'absolute',
                          top: '20%',
                          left: '10%',
                          width: '2px',
                          height: '2px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          boxShadow: '0 0 4px #ffffff',
                          animation: 'pulse 1s ease-in-out infinite'
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '70%',
                          right: '15%',
                          width: '1px',
                          height: '1px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          boxShadow: '0 0 3px #ffffff',
                          animation: 'pulse 1s ease-in-out infinite 0.5s'
                        }} />
                      </>
                    )}

                    <span style={{
                      fontSize: '24px',
                      position: 'relative',
                      zIndex: 1,
                      filter: futuristicMode ? 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))' : 'none'
                    }}>
                      🚀
                    </span>
                    <span style={{
                      position: 'relative',
                      zIndex: 1,
                      fontWeight: '700',
                      textShadow: futuristicMode ? '0 0 8px rgba(0, 0, 0, 0.3)' : 'none'
                    }}>
                      {futuristicMode ? 'INITIALIZE STREAK' : 'Create Streak'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rocket Launch Animation */}
      {showRocketAnimation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Stars Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
              radial-gradient(2px 2px at 40px 70px, #ffffff, transparent),
              radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),
              radial-gradient(1px 1px at 130px 80px, #ffffff, transparent),
              radial-gradient(2px 2px at 160px 30px, #ffffff, transparent),
              radial-gradient(1px 1px at 200px 50px, #ffffff, transparent),
              radial-gradient(2px 2px at 240px 90px, #ffffff, transparent),
              radial-gradient(1px 1px at 280px 20px, #ffffff, transparent)
            `,
            backgroundSize: '300px 200px',
            animation: 'twinkle 2s ease-in-out infinite alternate'
          }} />

          {/* Rocket */}
          <div style={{
            fontSize: '80px',
            animation: 'rocketLaunch 2.5s ease-out forwards',
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))'
          }}>
            🚀
          </div>

          {/* Launch Text */}
          <div style={{
            position: 'absolute',
            bottom: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#00ff88',
            fontSize: '24px',
            fontWeight: '700',
            textAlign: 'center',
            animation: 'fadeInUp 1s ease-out 0.5s both',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
          }}>
            <div style={{ marginBottom: '8px' }}>STREAK INITIALIZED</div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(0, 255, 136, 0.8)',
              fontWeight: '500'
            }}>
              Mission Control: Habit Protocol Active
            </div>
          </div>

          {/* Exhaust Trail */}
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(255, 165, 0, 0.8), rgba(255, 69, 0, 0.6), transparent)',
            animation: 'exhaustTrail 2.5s ease-out forwards',
            borderRadius: '2px'
          }} />
        </div>
      )}
    </div>
  );
}
