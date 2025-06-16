import React, { useState, useEffect } from 'react';

// AI Coaching & Smart Insights System
export default function AICoachingSystem({ 
  user, 
  boards = [], 
  theme, 
  futuristicMode,
  completionHistory = {},
  moodData = {},
  weatherData = {}
}) {
  const [activeTab, setActiveTab] = useState('insights');
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // AI Coach personality and responses
  const coachPersonality = {
    name: 'ARIA',
    title: 'AI Habit Coach',
    avatar: '🤖',
    greeting: "Hi! I'm ARIA, your personal AI habit coach. I'm here to help you build lasting habits and achieve your goals!"
  };

  // Initialize chat with greeting
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          sender: 'ai',
          message: coachPersonality.greeting,
          timestamp: new Date(),
          type: 'greeting'
        }
      ]);
    }
  }, []);

  // Generate AI insights based on user data
  const generateInsights = () => {
    const totalHabits = boards.length;
    const totalCompletions = boards.reduce((sum, board) => sum + board.completed.size, 0);
    const avgCompletion = totalHabits > 0 ? (totalCompletions / (totalHabits * 30)) * 100 : 0;
    
    const insights = [];

    // Performance insights
    if (avgCompletion > 80) {
      insights.push({
        type: 'success',
        icon: '🎉',
        title: 'Exceptional Performance!',
        message: `You're crushing it with ${avgCompletion.toFixed(1)}% completion rate! Your consistency is inspiring.`,
        action: 'Consider adding a new challenging habit to keep growing.'
      });
    } else if (avgCompletion > 60) {
      insights.push({
        type: 'good',
        icon: '👍',
        title: 'Great Progress',
        message: `You're doing well with ${avgCompletion.toFixed(1)}% completion rate. Keep up the momentum!`,
        action: 'Focus on your most important habits during busy days.'
      });
    } else if (avgCompletion > 40) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Room for Improvement',
        message: `Your ${avgCompletion.toFixed(1)}% completion rate shows potential. Let's optimize your approach.`,
        action: 'Try reducing habit difficulty or frequency to build consistency.'
      });
    } else {
      insights.push({
        type: 'alert',
        icon: '🚨',
        title: 'Let\'s Refocus',
        message: `With ${avgCompletion.toFixed(1)}% completion, it's time to reassess your habits.`,
        action: 'Consider starting with just 1-2 micro-habits to rebuild momentum.'
      });
    }

    // Timing insights
    const morningHabits = boards.filter(b => b.preferredTime === 'morning').length;
    const eveningHabits = boards.filter(b => b.preferredTime === 'evening').length;
    
    if (morningHabits > eveningHabits * 2) {
      insights.push({
        type: 'tip',
        icon: '🌅',
        title: 'Morning Person Detected',
        message: 'You seem to prefer morning habits. Your energy is highest then!',
        action: 'Schedule your most important habits in the morning for best results.'
      });
    }

    // Streak insights
    const longestStreak = Math.max(...boards.map(b => {
      const streaks = [];
      let current = 0;
      for (let i = 1; i <= b.days; i++) {
        if (b.completed.has(i)) {
          current++;
        } else {
          if (current > 0) streaks.push(current);
          current = 0;
        }
      }
      if (current > 0) streaks.push(current);
      return Math.max(...streaks, 0);
    }), 0);

    if (longestStreak >= 21) {
      insights.push({
        type: 'achievement',
        icon: '🏆',
        title: 'Habit Master',
        message: `Your ${longestStreak}-day streak shows you've mastered habit formation!`,
        action: 'You\'re ready for more complex habit stacks and challenges.'
      });
    }

    return insights;
  };

  // Smart habit suggestions based on user patterns
  const generateHabitSuggestions = () => {
    const suggestions = [
      {
        category: 'Health',
        habit: 'Drink a glass of water upon waking',
        reason: 'Perfect micro-habit to start your day and boost hydration',
        difficulty: 'Easy',
        icon: '💧'
      },
      {
        category: 'Productivity',
        habit: 'Write 3 priorities for tomorrow before bed',
        reason: 'Based on your evening preference, this will improve your mornings',
        difficulty: 'Easy',
        icon: '📝'
      },
      {
        category: 'Mindfulness',
        habit: '2-minute breathing exercise',
        reason: 'Short duration fits your busy schedule and reduces stress',
        difficulty: 'Easy',
        icon: '🧘‍♀️'
      },
      {
        category: 'Learning',
        habit: 'Read 1 page of a book',
        reason: 'Micro-habit that compounds into significant knowledge over time',
        difficulty: 'Easy',
        icon: '📚'
      }
    ];

    return suggestions;
  };

  // Simulate AI chat response
  const generateAIResponse = (userMessage) => {
    const responses = [
      "That's a great question! Based on your current habits, I'd suggest focusing on consistency over intensity.",
      "I've analyzed your patterns and noticed you perform best in the mornings. Have you considered moving some habits earlier?",
      "Your progress is impressive! The key is to celebrate small wins while building toward bigger goals.",
      "I see you're struggling with this habit. Let's break it down into smaller, more manageable steps.",
      "Based on successful habit builders, I recommend the 2-minute rule: start with just 2 minutes daily.",
      "Your streak data shows you're most consistent on weekdays. How can we maintain that energy on weekends?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        message: generateAIResponse(newMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const insights = generateInsights();
  const habitSuggestions = generateHabitSuggestions();

  const tabs = [
    { id: 'insights', name: 'Smart Insights', icon: '🧠' },
    { id: 'suggestions', name: 'Habit Ideas', icon: '💡' },
    { id: 'chat', name: 'AI Coach', icon: '🤖' },
    { id: 'predictions', name: 'Predictions', icon: '🔮' }
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
              ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
              : '#00d4ff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: futuristicMode ? '0 0 20px rgba(0, 212, 255, 0.3)' : 'none'
          }}>
            🤖
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--fg)'
            }}>
              AI Coaching Hub
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--fg-soft)',
              marginTop: '2px'
            }}>
              Powered by advanced machine learning algorithms
            </p>
          </div>
          {futuristicMode && (
            <div style={{
              marginLeft: 'auto',
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
                      ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
                      : '#00d4ff')
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
                  ? '0 0 15px rgba(0, 212, 255, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'insights' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Personalized Insights 🧠
            </h4>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {insights.map((insight, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(0, 212, 255, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode 
                      ? '1px solid rgba(0, 212, 255, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${
                      insight.type === 'success' ? 'var(--success)' :
                      insight.type === 'good' ? 'var(--accent)' :
                      insight.type === 'warning' ? 'var(--warning)' :
                      insight.type === 'alert' ? 'var(--error)' : '#00d4ff'
                    }`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      marginTop: '2px'
                    }}>
                      {insight.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        margin: '0 0 8px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)'
                      }}>
                        {insight.title}
                      </h5>
                      <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        color: 'var(--fg-soft)',
                        lineHeight: '1.4'
                      }}>
                        {insight.message}
                      </p>
                      <div style={{
                        padding: '8px 12px',
                        background: 'rgba(0, 212, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#00d4ff',
                        fontWeight: '500'
                      }}>
                        💡 {insight.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Smart Habit Suggestions 💡
            </h4>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {habitSuggestions.map((suggestion, index) => (
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
                    gap: '12px',
                    flex: 1
                  }}>
                    <div style={{
                      fontSize: '24px'
                    }}>
                      {suggestion.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--fg)'
                        }}>
                          {suggestion.habit}
                        </span>
                        <span style={{
                          padding: '2px 6px',
                          background: 'var(--success)',
                          color: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          {suggestion.difficulty}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        lineHeight: '1.3'
                      }}>
                        {suggestion.reason}
                      </p>
                    </div>
                  </div>
                  <button style={{
                    padding: '8px 16px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                    Add Habit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <div style={{
              height: '300px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '12px 16px',
                background: futuristicMode 
                  ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
                  : '#00d4ff',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {coachPersonality.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.9
                  }}>
                    {coachPersonality.title}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  width: '8px',
                  height: '8px',
                  background: '#00ff88',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
              </div>

              {/* Chat Messages */}
              <div style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      background: msg.sender === 'user' 
                        ? 'var(--accent)'
                        : 'var(--card)',
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--fg)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none'
                    }}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      color: 'var(--fg-soft)'
                    }}>
                      ARIA is typing...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '8px'
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask ARIA about your habits..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'var(--card)',
                    color: 'var(--fg)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    padding: '8px 12px',
                    background: newMessage.trim() ? 'var(--accent)' : 'var(--border)',
                    color: newMessage.trim() ? '#ffffff' : 'var(--fg-soft)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              AI Predictions 🔮
            </h4>
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px dashed var(--border)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Advanced Predictions Coming Soon!
              </h4>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)'
              }}>
                AI will predict your success probability, optimal timing, and habit recommendations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
