import React, { useState, useEffect } from 'react';

// Habit Stacking & Micro-Habits System
export default function HabitStackingSystem({ 
  user, 
  boards = [], 
  onCreateHabitStack,
  theme, 
  futuristicMode 
}) {
  const [activeTab, setActiveTab] = useState('builder');
  const [currentStack, setCurrentStack] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedHabit, setDraggedHabit] = useState(null);

  // Pre-built habit stack templates
  const stackTemplates = [
    {
      id: 'morning-routine',
      name: 'Perfect Morning Routine',
      description: 'Start your day with energy and focus',
      icon: '🌅',
      difficulty: 'Medium',
      duration: '30 minutes',
      habits: [
        { name: 'Wake up at same time', duration: '1 min', trigger: 'Alarm goes off' },
        { name: 'Drink a glass of water', duration: '1 min', trigger: 'After waking up' },
        { name: 'Make bed', duration: '2 min', trigger: 'After drinking water' },
        { name: '5-minute meditation', duration: '5 min', trigger: 'After making bed' },
        { name: 'Write 3 priorities', duration: '3 min', trigger: 'After meditation' },
        { name: 'Healthy breakfast', duration: '15 min', trigger: 'After writing priorities' }
      ]
    },
    {
      id: 'evening-wind-down',
      name: 'Evening Wind-Down',
      description: 'Prepare for restful sleep and tomorrow',
      icon: '🌙',
      difficulty: 'Easy',
      duration: '20 minutes',
      habits: [
        { name: 'Put devices away', duration: '1 min', trigger: '1 hour before bed' },
        { name: 'Prepare clothes for tomorrow', duration: '3 min', trigger: 'After putting devices away' },
        { name: 'Gratitude journaling', duration: '5 min', trigger: 'After preparing clothes' },
        { name: 'Read for 10 minutes', duration: '10 min', trigger: 'After journaling' },
        { name: 'Deep breathing exercise', duration: '3 min', trigger: 'After reading' }
      ]
    },
    {
      id: 'fitness-stack',
      name: 'Quick Fitness Stack',
      description: 'Build strength and energy throughout the day',
      icon: '💪',
      difficulty: 'Hard',
      duration: '25 minutes',
      habits: [
        { name: '10 push-ups', duration: '2 min', trigger: 'After morning coffee' },
        { name: '2-minute plank', duration: '2 min', trigger: 'After push-ups' },
        { name: 'Stairs instead of elevator', duration: '3 min', trigger: 'Arriving at work' },
        { name: '10-minute walk', duration: '10 min', trigger: 'Lunch break' },
        { name: 'Stretching routine', duration: '8 min', trigger: 'Before dinner' }
      ]
    },
    {
      id: 'learning-stack',
      name: 'Daily Learning Stack',
      description: 'Continuous growth and skill development',
      icon: '📚',
      difficulty: 'Medium',
      duration: '35 minutes',
      habits: [
        { name: 'Read industry news', duration: '10 min', trigger: 'With morning coffee' },
        { name: 'Practice new skill', duration: '15 min', trigger: 'After lunch' },
        { name: 'Listen to podcast', duration: '20 min', trigger: 'During commute' },
        { name: 'Review and take notes', duration: '5 min', trigger: 'Before bed' }
      ]
    }
  ];

  // Micro-habit suggestions
  const microHabits = [
    { name: 'Drink 1 glass of water', category: 'Health', duration: '30 seconds', difficulty: 'Easy' },
    { name: 'Do 1 push-up', category: 'Fitness', duration: '30 seconds', difficulty: 'Easy' },
    { name: 'Write 1 sentence in journal', category: 'Mindfulness', duration: '1 minute', difficulty: 'Easy' },
    { name: 'Read 1 page', category: 'Learning', duration: '2 minutes', difficulty: 'Easy' },
    { name: 'Take 3 deep breaths', category: 'Wellness', duration: '30 seconds', difficulty: 'Easy' },
    { name: 'Organize 1 item', category: 'Productivity', duration: '1 minute', difficulty: 'Easy' },
    { name: 'Say 1 thing you\'re grateful for', category: 'Mindfulness', duration: '30 seconds', difficulty: 'Easy' },
    { name: 'Stretch for 1 minute', category: 'Fitness', duration: '1 minute', difficulty: 'Easy' }
  ];

  // Available triggers for habit stacking
  const commonTriggers = [
    'After waking up', 'After morning coffee', 'After breakfast', 'Arriving at work',
    'Before lunch', 'After lunch', 'Leaving work', 'Arriving home',
    'Before dinner', 'After dinner', 'Before bed', 'After brushing teeth'
  ];

  const addHabitToStack = (habit) => {
    setCurrentStack(prev => [...prev, {
      ...habit,
      id: Date.now(),
      trigger: prev.length === 0 ? 'Choose trigger...' : `After ${prev[prev.length - 1].name.toLowerCase()}`
    }]);
  };

  const removeHabitFromStack = (habitId) => {
    setCurrentStack(prev => prev.filter(h => h.id !== habitId));
  };

  const updateHabitTrigger = (habitId, newTrigger) => {
    setCurrentStack(prev => prev.map(h => 
      h.id === habitId ? { ...h, trigger: newTrigger } : h
    ));
  };

  const loadTemplate = (template) => {
    setCurrentStack(template.habits.map((habit, index) => ({
      ...habit,
      id: Date.now() + index,
      category: template.name
    })));
    setShowTemplates(false);
  };

  const saveStack = () => {
    if (currentStack.length === 0) return;
    
    const stackName = prompt('Name your habit stack:') || 'My Habit Stack';
    const habitStack = {
      id: Date.now(),
      name: stackName,
      habits: currentStack,
      createdAt: new Date(),
      totalDuration: currentStack.reduce((sum, h) => {
        const duration = parseInt(h.duration) || 0;
        return sum + duration;
      }, 0)
    };

    onCreateHabitStack?.(habitStack);
    setCurrentStack([]);
  };

  const tabs = [
    { id: 'builder', name: 'Stack Builder', icon: '🔗' },
    { id: 'templates', name: 'Templates', icon: '📋' },
    { id: 'micro', name: 'Micro-Habits', icon: '🔬' },
    { id: 'my-stacks', name: 'My Stacks', icon: '📚' }
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
              ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
              : '#ff6b6b',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: futuristicMode ? '0 0 20px rgba(255, 107, 107, 0.3)' : 'none'
          }}>
            🔗
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--fg)'
            }}>
              Habit Stacking Lab
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--fg-soft)',
              marginTop: '2px'
            }}>
              Build powerful habit chains and micro-routines
            </p>
          </div>
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
                      ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
                      : '#ff6b6b')
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
                  ? '0 0 15px rgba(255, 107, 107, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'builder' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Habit Library */}
              <div>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  Available Habits
                </h4>
                <div style={{
                  height: '300px',
                  background: 'var(--bg-alt)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  overflowY: 'auto'
                }}>
                  {microHabits.map((habit, index) => (
                    <div
                      key={index}
                      onClick={() => addHabitToStack(habit)}
                      style={{
                        padding: '12px',
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--accent)';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'var(--card)';
                        e.target.style.color = 'var(--fg)';
                      }}
                    >
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {habit.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        opacity: 0.7,
                        display: 'flex',
                        gap: '12px'
                      }}>
                        <span>{habit.category}</span>
                        <span>{habit.duration}</span>
                        <span>{habit.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack Builder */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--fg)'
                  }}>
                    Your Habit Stack ({currentStack.length})
                  </h4>
                  {currentStack.length > 0 && (
                    <button
                      onClick={saveStack}
                      style={{
                        padding: '8px 16px',
                        background: futuristicMode 
                          ? 'linear-gradient(135deg, var(--success), #16a34a)'
                          : 'var(--success)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Save Stack
                    </button>
                  )}
                </div>
                <div style={{
                  height: '300px',
                  background: 'var(--bg-alt)',
                  borderRadius: '12px',
                  border: '2px dashed var(--border)',
                  padding: '16px',
                  overflowY: 'auto'
                }}>
                  {currentStack.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'var(--fg-soft)'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</div>
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        Click habits from the left to build your stack
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {currentStack.map((habit, index) => (
                        <div
                          key={habit.id}
                          style={{
                            padding: '12px',
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            position: 'relative'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: 'var(--accent)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#ffffff'
                            }}>
                              {index + 1}
                            </div>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'var(--fg)',
                              flex: 1
                            }}>
                              {habit.name}
                            </span>
                            <button
                              onClick={() => removeHabitFromStack(habit.id)}
                              style={{
                                width: '20px',
                                height: '20px',
                                background: 'var(--error)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                          </div>
                          <select
                            value={habit.trigger}
                            onChange={(e) => updateHabitTrigger(habit.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              fontSize: '12px',
                              border: '1px solid var(--border)',
                              borderRadius: '4px',
                              background: 'var(--bg-alt)',
                              color: 'var(--fg)'
                            }}
                          >
                            <option>Choose trigger...</option>
                            {commonTriggers.map((trigger, i) => (
                              <option key={i} value={trigger}>{trigger}</option>
                            ))}
                            {index > 0 && (
                              <option value={`After ${currentStack[index - 1].name.toLowerCase()}`}>
                                After {currentStack[index - 1].name.toLowerCase()}
                              </option>
                            )}
                          </select>
                          {index < currentStack.length - 1 && (
                            <div style={{
                              position: 'absolute',
                              bottom: '-12px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: '16px',
                              color: 'var(--accent)'
                            }}>
                              ↓
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Pre-Built Habit Stacks 📋
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {stackTemplates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    padding: '20px',
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(255, 107, 107, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode 
                      ? '1px solid rgba(255, 107, 107, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '32px' }}>{template.icon}</div>
                    <div>
                      <h5 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)'
                      }}>
                        {template.name}
                      </h5>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        marginTop: '2px'
                      }}>
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '16px',
                    fontSize: '12px',
                    color: 'var(--fg-soft)'
                  }}>
                    <span>⏱️ {template.duration}</span>
                    <span>📊 {template.difficulty}</span>
                    <span>🔗 {template.habits.length} habits</span>
                  </div>

                  <div style={{
                    marginBottom: '16px',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    {template.habits.slice(0, 3).map((habit, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{
                          width: '16px',
                          height: '16px',
                          background: 'var(--accent)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: '#ffffff',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                        <span>{habit.name}</span>
                      </div>
                    ))}
                    {template.habits.length > 3 && (
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        fontStyle: 'italic'
                      }}>
                        +{template.habits.length - 3} more habits...
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => loadTemplate(template)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: futuristicMode 
                        ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
                        : '#ff6b6b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Use This Template 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'micro' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Micro-Habits Library 🔬
            </h4>
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: 'var(--fg-soft)',
              lineHeight: '1.4'
            }}>
              Start small with these tiny habits that take less than 2 minutes. Perfect for building momentum and creating lasting change.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '12px'
            }}>
              {microHabits.map((habit, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: 'var(--bg-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => addHabitToStack(habit)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h5 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--fg)',
                      flex: 1
                    }}>
                      {habit.name}
                    </h5>
                    <span style={{
                      padding: '2px 6px',
                      background: 'var(--success)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {habit.difficulty}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--fg-soft)'
                  }}>
                    <span>📂 {habit.category}</span>
                    <span>⏱️ {habit.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-stacks' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              My Habit Stacks 📚
            </h4>
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px dashed var(--border)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                No Habit Stacks Yet
              </h4>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)',
                marginBottom: '16px'
              }}>
                Create your first habit stack using the builder or templates!
              </p>
              <button
                onClick={() => setActiveTab('builder')}
                style={{
                  padding: '10px 20px',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Start Building
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
