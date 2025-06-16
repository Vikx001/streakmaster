import React, { useState, useEffect, useRef } from 'react';

// Time Tracking & Focus System
export default function TimeTrackingSystem({
  user,
  boards = [],
  theme,
  futuristicMode,
  onUpdateTimeData
}) {
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [currentSession, setCurrentSession] = useState('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [deepWorkSessions, setDeepWorkSessions] = useState([]);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Pomodoro settings
  const pomodoroSettings = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  // Focus session types
  const focusTypes = [
    { id: 'deep-work', name: 'Deep Work', duration: 90, icon: '🧠', color: '#8b5cf6' },
    { id: 'creative', name: 'Creative Flow', duration: 60, icon: '🎨', color: '#f59e0b' },
    { id: 'learning', name: 'Learning Session', duration: 45, icon: '📚', color: '#10b981' },
    { id: 'planning', name: 'Planning & Review', duration: 30, icon: '📋', color: '#3b82f6' }
  ];

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    playNotificationSound();

    if (currentSession === 'work') {
      setSessionCount(prev => prev + 1);
      // Switch to break
      const isLongBreak = (sessionCount + 1) % 4 === 0;
      setCurrentSession(isLongBreak ? 'longBreak' : 'shortBreak');
      setTimeLeft(isLongBreak ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak);
    } else {
      // Switch back to work
      setCurrentSession('work');
      setTimeLeft(pomodoroSettings.work);
    }

    // Record session data
    if (selectedHabit && currentSession === 'work') {
      recordTimeSession();
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const recordTimeSession = () => {
    const session = {
      id: Date.now(),
      habitId: selectedHabit?.id,
      habitName: selectedHabit?.title,
      duration: pomodoroSettings.work / 60,
      type: currentSession,
      completedAt: new Date(),
      focusScore: Math.floor(Math.random() * 20) + 80 // Simulated focus score
    };

    onUpdateTimeData?.(session);
  };

  const startTimer = () => {
    setIsRunning(true);
    if (focusMode) {
      // Enable focus mode features
      document.body.style.filter = 'blur(0px)';
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroSettings[currentSession]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = pomodoroSettings[currentSession];
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Time blocking for today
  const generateTimeBlocks = () => {
    const blocks = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      blocks.push({
        id: `${hour}-00`,
        time: `${hour}:00`,
        duration: 60,
        type: 'available',
        title: 'Available',
        habit: null
      });
    }

    // Add some sample scheduled blocks
    blocks[0] = { ...blocks[0], type: 'scheduled', title: 'Morning Routine', habit: 'morning-habits' };
    blocks[2] = { ...blocks[2], type: 'deep-work', title: 'Deep Work Session', habit: 'focus-work' };
    blocks[4] = { ...blocks[4], type: 'break', title: 'Lunch Break', habit: null };

    return blocks;
  };

  const tabs = [
    { id: 'pomodoro', name: 'Pomodoro Timer', icon: '🍅' },
    { id: 'focus', name: 'Focus Sessions', icon: '🎯' },
    { id: 'time-blocks', name: 'Time Blocking', icon: '📅' },
    { id: 'analytics', name: 'Time Analytics', icon: '📊' }
  ];

  return (
    <div style={{
      background: futuristicMode
        ? 'linear-gradient(135deg, var(--card), rgba(255, 161, 22, 0.05))'
        : 'var(--card)',
      border: futuristicMode
        ? '1px solid rgba(255, 161, 22, 0.3)'
        : '1px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>

      {/* Futuristic Background Effect */}
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: futuristicMode
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : '#10b981',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: futuristicMode ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
          }}>
            ⏰
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--fg)'
            }}>
              Time & Focus Hub
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--fg-soft)',
              marginTop: '2px'
            }}>
              Maximize productivity with smart time management
            </p>
          </div>
          {isRunning && (
            <div style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              background: futuristicMode
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : '#ef4444',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'pulse 2s infinite'
            }}>
              <span>🔴</span>
              <span>ACTIVE SESSION</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                background: activeTab === tab.id
                  ? (futuristicMode
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : '#10b981')
                  : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--fg)',
                border: activeTab === tab.id
                  ? 'none'
                  : '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.id && futuristicMode
                  ? '0 0 15px rgba(16, 185, 129, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'pomodoro' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Timer Display */}
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  margin: '0 auto 24px',
                  position: 'relative',
                  background: futuristicMode
                    ? 'linear-gradient(135deg, var(--bg-alt), rgba(16, 185, 129, 0.05))'
                    : 'var(--bg-alt)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: futuristicMode
                    ? '3px solid rgba(16, 185, 129, 0.3)'
                    : '3px solid var(--border)'
                }}>
                  {/* Progress Ring */}
                  <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(-90deg)'
                  }}>
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke={futuristicMode ? '#10b981' : 'var(--success)'}
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 85}`}
                      strokeDashoffset={`${2 * Math.PI * 85 * (1 - getProgressPercentage() / 100)}`}
                      style={{
                        transition: 'stroke-dashoffset 1s ease',
                        filter: futuristicMode ? 'drop-shadow(0 0 8px #10b981)' : 'none'
                      }}
                    />
                  </svg>

                  <div style={{
                    textAlign: 'center',
                    zIndex: 1
                  }}>
                    <div style={{
                      fontSize: '36px',
                      fontWeight: '700',
                      color: 'var(--fg)',
                      marginBottom: '8px',
                      fontFamily: 'monospace'
                    }}>
                      {formatTime(timeLeft)}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--fg-soft)',
                      textTransform: 'capitalize'
                    }}>
                      {currentSession === 'work' ? 'Focus Time' :
                       currentSession === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <button
                    onClick={isRunning ? pauseTimer : startTimer}
                    style={{
                      padding: '12px 24px',
                      background: futuristicMode
                        ? (isRunning
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #10b981, #059669)')
                        : (isRunning ? '#ef4444' : '#10b981'),
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: futuristicMode
                        ? `0 0 20px ${isRunning ? '#ef4444' : '#10b981'}40`
                        : 'none'
                    }}
                  >
                    <span>{isRunning ? '⏸️' : '▶️'}</span>
                    <span>{isRunning ? 'Pause' : 'Start'}</span>
                  </button>
                  <button
                    onClick={resetTimer}
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      color: 'var(--fg)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>🔄</span>
                    <span>Reset</span>
                  </button>
                </div>

                {/* Session Counter */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: i < sessionCount ? 'var(--success)' : 'var(--border)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--fg-soft)'
                }}>
                  Completed Sessions: {sessionCount}
                </p>
              </div>

              {/* Settings & Habit Selection */}
              <div>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  Session Settings
                </h4>

                {/* Habit Selection */}
                <div style={{
                  marginBottom: '20px'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--fg)',
                    marginBottom: '8px'
                  }}>
                    Focus on Habit
                  </label>
                  <select
                    value={selectedHabit?.id || ''}
                    onChange={(e) => {
                      const habit = boards.find(b => b.id === e.target.value);
                      setSelectedHabit(habit);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'var(--bg-alt)',
                      color: 'var(--fg)'
                    }}
                  >
                    <option value="">Select a habit...</option>
                    {boards.map((board) => (
                      <option key={board.id} value={board.id}>
                        {board.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Focus Mode Toggle */}
                <div style={{
                  marginBottom: '20px'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={focusMode}
                      onChange={(e) => setFocusMode(e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--accent)'
                      }}
                    />
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--fg)'
                      }}>
                        Focus Mode
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        Block distractions during sessions
                      </div>
                    </div>
                  </label>
                </div>

                {/* Session Statistics */}
                <div style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h5 style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--fg)'
                  }}>
                    Today's Progress
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--success)'
                      }}>
                        {sessionCount}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        Sessions
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--accent)'
                      }}>
                        {Math.floor(sessionCount * 25 / 60)}h {(sessionCount * 25) % 60}m
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        Focus Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'focus' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Deep Focus Sessions 🎯
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {focusTypes.map((type) => (
                <div
                  key={type.id}
                  style={{
                    padding: '20px',
                    background: futuristicMode
                      ? `linear-gradient(135deg, var(--bg-alt), ${type.color}10)`
                      : 'var(--bg-alt)',
                    border: futuristicMode
                      ? `1px solid ${type.color}30`
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    setCurrentSession('work');
                    setTimeLeft(type.duration * 60);
                    setActiveTab('pomodoro');
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 25px ${type.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: type.color,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {type.icon}
                    </div>
                    <div>
                      <h5 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)'
                      }}>
                        {type.name}
                      </h5>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        {type.duration} minutes
                      </p>
                    </div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '10px',
                    background: type.color,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Start Session
                  </button>
                </div>
              ))}
            </div>

            {/* Recent Focus Sessions */}
            <div>
              <h5 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Recent Sessions
              </h5>
              <div style={{
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: 'var(--fg-soft)',
                  fontSize: '14px'
                }}>
                  No focus sessions yet. Start your first session above!
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time-blocks' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Time Blocking for Today 📅
            </h4>
            <div style={{
              display: 'grid',
              gap: '8px'
            }}>
              {generateTimeBlocks().map((block) => (
                <div
                  key={block.id}
                  style={{
                    padding: '12px 16px',
                    background: block.type === 'available' ? 'var(--bg-alt)' :
                               block.type === 'scheduled' ? 'rgba(59, 130, 246, 0.1)' :
                               block.type === 'deep-work' ? 'rgba(139, 92, 246, 0.1)' :
                               'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${
                      block.type === 'available' ? 'var(--border)' :
                      block.type === 'scheduled' ? '#3b82f6' :
                      block.type === 'deep-work' ? '#8b5cf6' :
                      '#f59e0b'
                    }`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--fg)',
                      minWidth: '60px'
                    }}>
                      {block.time}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--fg)'
                      }}>
                        {block.title}
                      </div>
                      {block.habit && (
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          Related to: {block.habit}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--fg-soft)'
                  }}>
                    {block.duration}m
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Time Analytics 📊
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Total Focus Time', value: '2h 15m', icon: '⏱️', color: 'var(--success)' },
                { label: 'Sessions Completed', value: '5', icon: '✅', color: 'var(--accent)' },
                { label: 'Average Session', value: '27m', icon: '📊', color: '#8b5cf6' },
                { label: 'Focus Score', value: '87%', icon: '🎯', color: '#f59e0b' }
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    background: futuristicMode
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(255, 161, 22, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode
                      ? '1px solid rgba(255, 161, 22, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '8px'
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: stat.color,
                    marginBottom: '4px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--fg-soft)'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Chart Placeholder */}
            <div style={{
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h5 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Weekly Focus Trends
              </h5>
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-soft)',
                fontSize: '14px'
              }}>
                📈 Advanced analytics charts coming soon!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}