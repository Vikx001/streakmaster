import React, { useState } from 'react';

const GoalsPage = ({ 
  boards, 
  theme, 
  futuristicMode,
  accentColor 
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateGoal, setShowCreateGoal] = useState(false);

  const vars = theme === 'dark' 
    ? {
        '--bg': '#1a1a1a',
        '--bg-alt': '#262626',
        '--card': '#2d2d2d',
        '--border': '#3a3a3a',
        '--fg': '#ffffff',
        '--fg-soft': '#a3a3a3',
        '--accent': accentColor,
        '--success': '#00af9b',
        '--warning': '#ffb800',
        '--error': '#ff6b6b'
      }
    : {
        '--bg': '#ffffff',
        '--bg-alt': '#f7f8fa',
        '--card': '#ffffff',
        '--border': '#e5e7eb',
        '--fg': '#262626',
        '--fg-soft': '#6b7280',
        '--accent': accentColor,
        '--success': '#00af9b',
        '--warning': '#ffb800',
        '--error': '#ff6b6b'
      };

  const goalTypes = [
    {
      id: 'streak',
      name: 'Streak Goal',
      description: 'Maintain a habit for consecutive days',
      icon: '🔥',
      color: 'var(--accent)',
      examples: ['30-day meditation', '100 days of code', 'Daily exercise']
    },
    {
      id: 'milestone',
      name: 'Milestone Goal',
      description: 'Reach a specific target or achievement',
      icon: '🎯',
      color: 'var(--success)',
      examples: ['Read 12 books', 'Lose 10 pounds', 'Learn Spanish']
    },
    {
      id: 'habit',
      name: 'Habit Formation',
      description: 'Build a new routine into your daily life',
      icon: '⚡',
      color: 'var(--warning)',
      examples: ['Wake up at 6 AM', 'Drink 8 glasses water', 'Journal daily']
    },
    {
      id: 'challenge',
      name: 'Personal Challenge',
      description: 'Push yourself beyond comfort zone',
      icon: '🚀',
      color: '#8a2be2',
      examples: ['No social media', 'Cold showers', 'Public speaking']
    }
  ];

  // Helper function to calculate current streak
  const calculateCurrentStreak = (board) => {
    if (board.completed.size === 0) return 0;

    const sortedDates = Array.from(board.completed).sort().reverse();
    const today = new Date().toISOString().slice(0, 10);

    let streak = 0;
    let currentDate = today;

    for (const dateStr of sortedDates) {
      if (dateStr === currentDate) {
        streak++;
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        currentDate = date.toISOString().slice(0, 10);
      } else {
        break;
      }
    }

    return streak;
  };

  // Convert boards to goals format with real data
  const realGoals = boards.map(board => {
    const today = new Date();
    const startDate = new Date(board.startDate);
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, board.days - daysPassed);

    // Calculate current streak
    const currentStreak = calculateCurrentStreak(board);

    // Determine status
    let status = 'active';
    if (daysLeft === 0 && board.completed.size >= board.days * 0.8) {
      status = 'completed';
    } else if (currentStreak === 0 && daysPassed > 7) {
      status = 'paused';
    }

    return {
      id: board.id,
      title: board.title,
      type: 'streak',
      progress: board.completed.size,
      target: board.days,
      status: status,
      daysLeft: daysLeft,
      streak: currentStreak,
      category: board.category || 'General',
      priority: board.completed.size > board.days * 0.7 ? 'high' : 'medium',
      startDate: board.startDate,
      endDate: new Date(startDate.getTime() + board.days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'completed': return 'var(--accent)';
      case 'paused': return 'var(--warning)';
      case 'failed': return 'var(--error)';
      default: return 'var(--fg-soft)';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--fg-soft)';
    }
  };

  const filteredGoals = realGoals.filter(goal => {
    if (activeTab === 'active') return goal.status === 'active';
    if (activeTab === 'completed') return goal.status === 'completed';
    if (activeTab === 'all') return true;
    return true;
  });

  return (
    <div style={{ ...vars, minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div style={{
        background: futuristicMode 
          ? 'linear-gradient(135deg, var(--card), rgba(255, 161, 22, 0.05))'
          : 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '32px',
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
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 161, 22, 0.03) 50%, transparent 70%)',
            animation: 'cyber-scan 3s ease-in-out infinite'
          }} />
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              background: futuristicMode 
                ? 'linear-gradient(135deg, var(--accent), var(--success))'
                : 'var(--fg)',
              backgroundClip: futuristicMode ? 'text' : 'initial',
              WebkitBackgroundClip: futuristicMode ? 'text' : 'initial',
              color: futuristicMode ? 'transparent' : 'var(--fg)'
            }}>
              🎯 Goals & Challenges
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--fg-soft)',
              margin: 0
            }}>
              Set ambitious targets and track your progress
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateGoal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--accent), var(--success))',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: futuristicMode ? '0 0 20px rgba(255, 161, 22, 0.4)' : 'none'
            }}
          >
            <span>➕</span>
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'active', name: 'Active Goals', count: realGoals.filter(g => g.status === 'active').length },
          { id: 'completed', name: 'Completed', count: realGoals.filter(g => g.status === 'completed').length },
          { id: 'all', name: 'All Goals', count: realGoals.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : 'var(--fg)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{tab.name}</span>
            <span style={{
              background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-alt)',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '12px'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Goal Types Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {goalTypes.map(type => (
          <div
            key={type.id}
            style={{
              background: futuristicMode 
                ? `linear-gradient(135deg, var(--card), ${type.color}10)`
                : 'var(--card)',
              border: futuristicMode 
                ? `1px solid ${type.color}30`
                : '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {futuristicMode && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, transparent, ${type.color}08, transparent)`,
                animation: 'cyber-scan 4s ease-in-out infinite'
              }} />
            )}
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px',
                background: type.color,
                borderRadius: '8px',
                padding: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {type.icon}
              </div>
              
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: 'var(--fg)'
              }}>
                {type.name}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: 'var(--fg-soft)',
                margin: '0 0 12px 0',
                lineHeight: '1.4'
              }}>
                {type.description}
              </p>
              
              <div style={{
                fontSize: '12px',
                color: 'var(--fg-soft)'
              }}>
                <strong>Examples:</strong> {type.examples.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals List */}
      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {filteredGoals.map(goal => (
          <div
            key={goal.id}
            style={{
              background: futuristicMode 
                ? `linear-gradient(135deg, var(--card), ${getStatusColor(goal.status)}10)`
                : 'var(--card)',
              border: futuristicMode 
                ? `1px solid ${getStatusColor(goal.status)}30`
                : '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {futuristicMode && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, transparent, ${getStatusColor(goal.status)}08, transparent)`,
                animation: 'cyber-scan 4s ease-in-out infinite'
              }} />
            )}
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '24px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: 0,
                    color: 'var(--fg)'
                  }}>
                    {goal.title}
                  </h3>
                  
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: `${getStatusColor(goal.status)}20`,
                    color: getStatusColor(goal.status),
                    border: `1px solid ${getStatusColor(goal.status)}40`
                  }}>
                    {goal.status.toUpperCase()}
                  </span>
                  
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: `${getPriorityColor(goal.priority)}20`,
                    color: getPriorityColor(goal.priority),
                    border: `1px solid ${getPriorityColor(goal.priority)}40`
                  }}>
                    {goal.priority.toUpperCase()}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  <span>📊 {goal.progress}/{goal.target}</span>
                  <span>🔥 {goal.streak} day streak</span>
                  <span>📅 {goal.daysLeft} days left</span>
                  <span>🏷️ {goal.category}</span>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--border)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${getStatusColor(goal.status)}, ${getStatusColor(goal.status)}cc)`,
                    width: `${(goal.progress / goal.target) * 100}%`,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: getStatusColor(goal.status),
                  marginBottom: '4px'
                }}>
                  {Math.round((goal.progress / goal.target) * 100)}%
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--fg-soft)'
                }}>
                  Complete
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
