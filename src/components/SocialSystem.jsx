import React, { useState, useEffect } from 'react';

// Social & Accountability System
export default function SocialSystem({ 
  user, 
  friends = [], 
  onUpdateFriends,
  theme, 
  futuristicMode,
  boards = []
}) {
  const [activeTab, setActiveTab] = useState('buddies');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [challenges, setChallenges] = useState([]);

  // Generate user's friend code
  const generateFriendCode = () => {
    return `SM${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const userFriendCode = user?.friendCode || generateFriendCode();

  // Sample challenges data
  useEffect(() => {
    setChallenges([
      {
        id: 1,
        name: '30-Day Fitness Challenge',
        description: 'Complete any fitness habit for 30 days',
        participants: 156,
        daysLeft: 23,
        reward: '500 XP + Fitness Badge',
        icon: '🏃‍♂️',
        difficulty: 'Medium'
      },
      {
        id: 2,
        name: 'Reading Marathon',
        description: 'Read for 30 minutes daily for 2 weeks',
        participants: 89,
        daysLeft: 8,
        reward: '300 XP + Scholar Badge',
        icon: '📚',
        difficulty: 'Easy'
      },
      {
        id: 3,
        name: 'Meditation Master',
        description: 'Meditate daily for 21 days',
        participants: 234,
        daysLeft: 15,
        reward: '400 XP + Zen Master Badge',
        icon: '🧘‍♀️',
        difficulty: 'Hard'
      }
    ]);
  }, []);

  // Sample leaderboard data
  const leaderboard = [
    { name: 'Alex Chen', level: 15, streaks: 3, totalDays: 245, avatar: '👨‍💻' },
    { name: 'Sarah Kim', level: 12, streaks: 5, totalDays: 198, avatar: '👩‍🎨' },
    { name: 'Mike Johnson', level: 11, streaks: 2, totalDays: 167, avatar: '👨‍🏫' },
    { name: 'You', level: user?.level || 1, streaks: boards.length, totalDays: boards.reduce((sum, b) => sum + b.completed.size, 0), avatar: '🎯' },
    { name: 'Emma Davis', level: 9, streaks: 4, totalDays: 134, avatar: '👩‍⚕️' }
  ].sort((a, b) => b.totalDays - a.totalDays);

  const tabs = [
    { id: 'buddies', name: 'Habit Buddies', icon: '👥' },
    { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' },
    { id: 'challenges', name: 'Challenges', icon: '⚔️' },
    { id: 'feed', name: 'Activity Feed', icon: '📱' }
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
              background: futuristicMode 
                ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                : '#8b5cf6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: futuristicMode ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none'
            }}>
              👥
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--fg)'
              }}>
                Social Hub
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)',
                marginTop: '2px'
              }}>
                Connect, compete, and achieve together
              </p>
            </div>
          </div>

          <div style={{
            padding: '8px 16px',
            background: futuristicMode 
              ? 'linear-gradient(135deg, var(--accent), #f59e0b)'
              : 'var(--accent)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>🔗</span>
            <span>Code: {userFriendCode}</span>
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
                      ? 'linear-gradient(135deg, var(--accent), var(--success))'
                      : 'var(--accent)')
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
                  ? '0 0 15px rgba(255, 161, 22, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'buddies' && (
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
                Your Habit Buddies ({friends.length})
              </h4>
              <button
                onClick={() => setShowAddFriend(true)}
                style={{
                  padding: '8px 16px',
                  background: futuristicMode 
                    ? 'linear-gradient(135deg, var(--success), #16a34a)'
                    : 'var(--success)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>➕</span>
                <span>Add Buddy</span>
              </button>
            </div>

            {friends.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  No Habit Buddies Yet
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'var(--fg-soft)',
                  marginBottom: '16px'
                }}>
                  Add friends to stay accountable and motivated together!
                </p>
                <button
                  onClick={() => setShowAddFriend(true)}
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
                  Add Your First Buddy
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {friends.map((friend, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--accent)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {friend.avatar || '👤'}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--fg)'
                        }}>
                          {friend.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          Level {friend.level} • {friend.streaks} active streaks
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        View Progress
                      </button>
                      <button style={{
                        padding: '6px 12px',
                        background: 'var(--success)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        Send Cheer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Weekly Leaderboard 🏆
            </h4>
            <div style={{
              display: 'grid',
              gap: '8px'
            }}>
              {leaderboard.map((user, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: user.name === 'You' 
                      ? (futuristicMode 
                          ? 'linear-gradient(135deg, var(--accent), rgba(255, 161, 22, 0.1))'
                          : 'rgba(255, 161, 22, 0.1)')
                      : 'var(--bg-alt)',
                    border: user.name === 'You' 
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: index < 3 
                        ? (index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32')
                        : 'var(--border)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: index < 3 ? '#000' : 'var(--fg)'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{
                      fontSize: '24px'
                    }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--fg)'
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        Level {user.level} • {user.streaks} streaks
                      </div>
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'var(--success)'
                    }}>
                      {user.totalDays}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--fg-soft)'
                    }}>
                      total days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Community Challenges ⚔️
            </h4>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  style={{
                    padding: '20px',
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(255, 161, 22, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode 
                      ? '1px solid rgba(255, 161, 22, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '32px'
                    }}>
                      {challenge.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <h5 style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'var(--fg)'
                        }}>
                          {challenge.name}
                        </h5>
                        <span style={{
                          padding: '4px 8px',
                          background: challenge.difficulty === 'Easy' ? 'var(--success)' :
                                     challenge.difficulty === 'Medium' ? 'var(--warning)' : 'var(--error)',
                          color: '#ffffff',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        color: 'var(--fg-soft)',
                        lineHeight: '1.4'
                      }}>
                        {challenge.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        <span>👥 {challenge.participants} participants</span>
                        <span>⏰ {challenge.daysLeft} days left</span>
                        <span>🎁 {challenge.reward}</span>
                      </div>
                    </div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, var(--accent), var(--success))'
                      : 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    Join Challenge 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Activity Feed 📱
            </h4>
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px dashed var(--border)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Activity Feed Coming Soon!
              </h4>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)'
              }}>
                See your friends' achievements, milestones, and celebrations here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Add Habit Buddy
            </h3>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: 'var(--fg-soft)'
            }}>
              Enter your friend's code to connect and stay accountable together!
            </p>
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Enter friend code (e.g., SMAB12CD)"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
                background: 'var(--bg-alt)',
                color: 'var(--fg)'
              }}
            />
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowAddFriend(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  color: 'var(--fg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add friend logic here
                  setShowAddFriend(false);
                  setFriendCode('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Buddy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
