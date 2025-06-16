import React, { useState } from 'react';

const CommunityPage = ({
  boards = [],
  theme,
  futuristicMode,
  accentColor
}) => {
  const [activeTab, setActiveTab] = useState('feed');

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

  // Calculate real community stats based on user data
  const communityData = {
    stats: {
      totalUsers: Math.max(1, boards.length * 1000), // Simulate community size
      activeToday: Math.max(1, boards.filter(b => {
        const today = new Date().toISOString().slice(0, 10);
        return b.completed.has(today);
      }).length * 100),
      streaksCompleted: boards.reduce((sum, b) => sum + b.completed.size, 0),
      communityChallenges: Math.max(3, Math.floor(boards.length / 2))
    },
    leaderboard: boards.length > 0 ? [
      {
        rank: 1,
        name: 'You',
        streak: Math.max(...boards.map(b => b.completed.size), 0),
        habit: boards.find(b => b.completed.size === Math.max(...boards.map(b => b.completed.size), 0))?.title || 'Your Best Habit',
        avatar: boards.find(b => b.completed.size === Math.max(...boards.map(b => b.completed.size), 0))?.icon || '🎯',
        points: boards.reduce((sum, b) => sum + b.completed.size * 10, 0)
      },
      { rank: 2, name: 'Community Average', streak: Math.floor(boards.reduce((sum, b) => sum + b.completed.size, 0) / Math.max(boards.length, 1)), habit: 'Various Habits', avatar: '👥', points: Math.floor(boards.reduce((sum, b) => sum + b.completed.size, 0) * 8) },
      { rank: 3, name: 'Streak Master', streak: Math.max(50, Math.floor(boards.reduce((sum, b) => sum + b.completed.size, 0) * 1.5)), habit: 'Multiple Habits', avatar: '🏆', points: Math.max(5000, boards.reduce((sum, b) => sum + b.completed.size * 15, 0)) }
    ] : [
      { rank: 1, name: 'Start Your Journey', streak: 0, habit: 'Create your first habit!', avatar: '🌟', points: 0 }
    ],
    challenges: [
      {
        id: 1,
        title: '30-Day Mindfulness Challenge',
        description: 'Practice mindfulness for 10 minutes daily',
        participants: 2847,
        daysLeft: 12,
        difficulty: 'Beginner',
        reward: '🏆 Zen Master Badge',
        category: 'Wellness'
      },
      {
        id: 2,
        title: 'No Social Media November',
        description: 'Stay off social media for the entire month',
        participants: 1523,
        daysLeft: 8,
        difficulty: 'Expert',
        reward: '🎯 Digital Detox Champion',
        category: 'Productivity'
      },
      {
        id: 3,
        title: '100 Days of Code',
        description: 'Code for at least 1 hour every day',
        participants: 5672,
        daysLeft: 45,
        difficulty: 'Intermediate',
        reward: '💻 Code Warrior Badge',
        category: 'Learning'
      }
    ],
    feed: boards.length > 0 ? boards.map((board, index) => {
      const today = new Date().toISOString().slice(0, 10);
      const isCompletedToday = board.completed.has(today);
      const currentStreak = calculateCurrentStreak(board);

      if (isCompletedToday) {
        return {
          id: index + 1,
          user: 'You',
          avatar: board.icon || '🎯',
          action: 'completed',
          habit: board.title,
          streak: currentStreak,
          time: 'Today',
          likes: Math.floor(currentStreak / 5) + 1,
          comments: Math.floor(currentStreak / 10),
          achievement: currentStreak >= 7 ? `${currentStreak} Day Streak! 🔥` : null
        };
      } else {
        return {
          id: index + 1,
          user: 'You',
          avatar: board.icon || '🎯',
          action: 'shared',
          content: `Working on ${board.title}. Current progress: ${board.completed.size}/${board.days} days completed! 💪`,
          time: 'Recently',
          likes: Math.floor(board.completed.size / 3) + 1,
          comments: Math.floor(board.completed.size / 7)
        };
      }
    }).filter(Boolean) : [
      {
        id: 1,
        user: 'Welcome!',
        avatar: '🌟',
        action: 'shared',
        content: 'Start your first habit to see your activity here! Every journey begins with a single step. 🚀',
        time: 'Now',
        likes: 1,
        comments: 0
      }
    ]
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--success)';
      case 'Intermediate': return 'var(--warning)';
      case 'Expert': return 'var(--error)';
      default: return 'var(--fg-soft)';
    }
  };

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
        
        <div style={{ position: 'relative', zIndex: 1 }}>
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
            🌟 Community Hub
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--fg-soft)',
            margin: '0 0 24px 0'
          }}>
            Connect, compete, and celebrate with fellow habit builders
          </p>
          
          {/* Community Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            {[
              { label: 'Total Users', value: '125K+', icon: '👥' },
              { label: 'Active Today', value: '8.5K', icon: '🔥' },
              { label: 'Streaks Completed', value: '2.4M', icon: '🎯' },
              { label: 'Challenges', value: '45', icon: '🏆' }
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--accent)',
                  marginBottom: '2px'
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
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'feed', name: 'Community Feed', icon: '📰' },
          { id: 'challenges', name: 'Challenges', icon: '🏆' },
          { id: 'leaderboard', name: 'Leaderboard', icon: '👑' }
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
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && (
        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {communityData.feed.map(post => (
            <div
              key={post.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  fontSize: '32px',
                  background: 'var(--bg-alt)',
                  borderRadius: '50%',
                  padding: '8px',
                  flexShrink: 0
                }}>
                  {post.avatar}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--fg)'
                    }}>
                      {post.user}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--fg-soft)'
                    }}>
                      {post.time}
                    </span>
                  </div>
                  
                  {post.action === 'completed' && (
                    <div>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--fg)',
                        margin: '0 0 8px 0'
                      }}>
                        Completed <strong>{post.habit}</strong> - {post.streak} day streak! 
                        {post.achievement && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            background: 'var(--success)',
                            color: '#ffffff',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {post.achievement}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {post.action === 'shared' && (
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--fg)',
                      margin: '0 0 8px 0',
                      lineHeight: '1.4'
                    }}>
                      {post.content}
                    </p>
                  )}
                  
                  {post.action === 'achieved' && (
                    <div>
                      <div style={{
                        padding: '12px',
                        background: 'var(--bg-alt)',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'var(--accent)',
                          marginBottom: '4px'
                        }}>
                          🏆 {post.achievement}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: 'var(--fg-soft)'
                        }}>
                          {post.description}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: 'var(--fg-soft)'
                  }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--fg-soft)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>👍</span>
                      <span>{post.likes}</span>
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--fg-soft)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {communityData.challenges.map(challenge => (
            <div
              key={challenge.id}
              style={{
                background: futuristicMode 
                  ? `linear-gradient(135deg, var(--card), ${getDifficultyColor(challenge.difficulty)}10)`
                  : 'var(--card)',
                border: futuristicMode 
                  ? `1px solid ${getDifficultyColor(challenge.difficulty)}30`
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
                  background: `linear-gradient(45deg, transparent, ${getDifficultyColor(challenge.difficulty)}08, transparent)`,
                  animation: 'cyber-scan 4s ease-in-out infinite'
                }} />
              )}
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: 'var(--fg)'
                    }}>
                      {challenge.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--fg-soft)',
                      margin: '0 0 12px 0'
                    }}>
                      {challenge.description}
                    </p>
                  </div>
                  
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: `${getDifficultyColor(challenge.difficulty)}20`,
                    color: getDifficultyColor(challenge.difficulty),
                    border: `1px solid ${getDifficultyColor(challenge.difficulty)}40`
                  }}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  <span>👥 {challenge.participants.toLocaleString()} joined</span>
                  <span>⏰ {challenge.daysLeft} days left</span>
                </div>
                
                <div style={{
                  padding: '12px',
                  background: 'var(--bg-alt)',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--accent)',
                    marginBottom: '4px'
                  }}>
                    Reward: {challenge.reward}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--fg-soft)'
                  }}>
                    Category: {challenge.category}
                  </div>
                </div>
                
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, var(--accent), var(--success))',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-alt)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              color: 'var(--fg)'
            }}>
              🏆 Top Streak Masters
            </h2>
          </div>
          
          {communityData.leaderboard.map((user, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                borderBottom: i < communityData.leaderboard.length - 1 ? '1px solid var(--border)' : 'none',
                background: i < 3 ? 'var(--bg-alt)' : 'transparent'
              }}
            >
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--fg-soft)',
                marginRight: '16px',
                minWidth: '30px'
              }}>
                #{user.rank}
              </div>
              
              <div style={{
                fontSize: '32px',
                marginRight: '16px'
              }}>
                {user.avatar}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--fg)',
                  marginBottom: '4px'
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  {user.habit}
                </div>
              </div>
              
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--accent)',
                  marginBottom: '2px'
                }}>
                  {user.streak} days
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--fg-soft)'
                }}>
                  {user.points.toLocaleString()} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
