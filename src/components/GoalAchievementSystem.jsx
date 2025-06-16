import React, { useState, useEffect } from 'react';

// Goal Setting & Achievement System
export default function GoalAchievementSystem({ 
  user, 
  boards = [], 
  theme, 
  futuristicMode,
  onUpdateGoals
}) {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [milestones, setMilestones] = useState([]);

  // Goal categories
  const goalCategories = [
    { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#10b981' },
    { id: 'learning', name: 'Learning & Skills', icon: '📚', color: '#3b82f6' },
    { id: 'productivity', name: 'Productivity', icon: '⚡', color: '#f59e0b' },
    { id: 'relationships', name: 'Relationships', icon: '❤️', color: '#ef4444' },
    { id: 'finance', name: 'Finance', icon: '💰', color: '#22c55e' },
    { id: 'creativity', name: 'Creativity', icon: '🎨', color: '#8b5cf6' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', color: '#06b6d4' },
    { id: 'career', name: 'Career', icon: '🚀', color: '#f97316' }
  ];

  // Goal time frames
  const timeFrames = [
    { id: 'week', name: '1 Week', days: 7 },
    { id: 'month', name: '1 Month', days: 30 },
    { id: 'quarter', name: '3 Months', days: 90 },
    { id: 'half-year', name: '6 Months', days: 180 },
    { id: 'year', name: '1 Year', days: 365 }
  ];

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('streakmaster-goals');
    const savedMilestones = localStorage.getItem('streakmaster-milestones');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    
    if (savedMilestones) {
      setMilestones(JSON.parse(savedMilestones));
    }
  }, []);

  // Save goals to localStorage
  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem('streakmaster-goals', JSON.stringify(updatedGoals));
    onUpdateGoals?.(updatedGoals);
  };

  // Create new goal
  const createGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      createdAt: new Date().toISOString(),
      progress: 0,
      status: 'active',
      milestones: [],
      linkedHabits: []
    };
    
    saveGoals([...goals, newGoal]);
  };

  // Update goal progress
  const updateGoalProgress = (goalId, progress) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: Math.min(100, Math.max(0, progress)) }
        : goal
    );
    saveGoals(updatedGoals);
  };

  // Complete goal
  const completeGoal = (goalId) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'completed', progress: 100, completedAt: new Date().toISOString() }
        : goal
    );
    saveGoals(updatedGoals);
    
    // Create achievement milestone
    const completedGoal = goals.find(g => g.id === goalId);
    if (completedGoal) {
      const newMilestone = {
        id: Date.now(),
        type: 'goal_completed',
        title: `Goal Achieved: ${completedGoal.title}`,
        description: `Successfully completed "${completedGoal.title}" goal`,
        date: new Date().toISOString(),
        category: completedGoal.category,
        icon: '🏆',
        xpReward: calculateXPReward(completedGoal)
      };
      
      const updatedMilestones = [...milestones, newMilestone];
      setMilestones(updatedMilestones);
      localStorage.setItem('streakmaster-milestones', JSON.stringify(updatedMilestones));
    }
  };

  // Calculate XP reward based on goal difficulty and timeframe
  const calculateXPReward = (goal) => {
    const baseXP = 100;
    const timeFrameMultiplier = {
      'week': 1,
      'month': 2,
      'quarter': 4,
      'half-year': 6,
      'year': 10
    };
    
    return baseXP * (timeFrameMultiplier[goal.timeFrame] || 1);
  };

  // Calculate goal statistics
  const calculateGoalStats = () => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    const avgProgress = goals.length > 0 ? totalProgress / goals.length : 0;
    
    return {
      total: goals.length,
      active: activeGoals.length,
      completed: completedGoals.length,
      avgProgress: avgProgress.toFixed(1),
      totalXPEarned: milestones.reduce((sum, m) => sum + (m.xpReward || 0), 0)
    };
  };

  // Get goals by category
  const getGoalsByCategory = () => {
    const categorized = {};
    goalCategories.forEach(category => {
      categorized[category.id] = goals.filter(goal => goal.category === category.id);
    });
    return categorized;
  };

  // Generate SMART goal suggestions
  const generateGoalSuggestions = () => {
    const suggestions = [
      {
        title: 'Complete 30-Day Meditation Challenge',
        description: 'Meditate for at least 10 minutes every day for 30 days',
        category: 'mindfulness',
        timeFrame: 'month',
        targetValue: 30,
        unit: 'days',
        difficulty: 'medium'
      },
      {
        title: 'Read 12 Books This Year',
        description: 'Read one book per month to expand knowledge and vocabulary',
        category: 'learning',
        timeFrame: 'year',
        targetValue: 12,
        unit: 'books',
        difficulty: 'medium'
      },
      {
        title: 'Exercise 5 Times Per Week',
        description: 'Maintain consistent fitness routine with 5 workout sessions weekly',
        category: 'health',
        timeFrame: 'quarter',
        targetValue: 60,
        unit: 'workouts',
        difficulty: 'hard'
      },
      {
        title: 'Learn a New Programming Language',
        description: 'Master the basics of a new programming language in 3 months',
        category: 'learning',
        timeFrame: 'quarter',
        targetValue: 1,
        unit: 'language',
        difficulty: 'hard'
      },
      {
        title: 'Save $1000 Emergency Fund',
        description: 'Build financial security with a $1000 emergency fund',
        category: 'finance',
        timeFrame: 'half-year',
        targetValue: 1000,
        unit: 'dollars',
        difficulty: 'medium'
      }
    ];
    
    return suggestions;
  };

  const stats = calculateGoalStats();
  const categorizedGoals = getGoalsByCategory();
  const suggestions = generateGoalSuggestions();

  const tabs = [
    { id: 'goals', name: 'My Goals', icon: '🎯' },
    { id: 'categories', name: 'Categories', icon: '📂' },
    { id: 'milestones', name: 'Milestones', icon: '🏆' },
    { id: 'suggestions', name: 'Suggestions', icon: '💡' }
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
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: futuristicMode ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
            }}>
              🎯
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--fg)'
              }}>
                Goal Achievement Center
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)',
                marginTop: '2px'
              }}>
                Set SMART goals and track your progress to success
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateGoal(true)}
            style={{
              padding: '12px 20px',
              background: futuristicMode 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: futuristicMode ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            <span>➕</span>
            <span>New Goal</span>
          </button>
        </div>

        {/* Goal Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Goals', value: stats.total, icon: '🎯', color: '#3b82f6' },
            { label: 'Active Goals', value: stats.active, icon: '⚡', color: '#f59e0b' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#10b981' },
            { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: '📊', color: '#8b5cf6' },
            { label: 'XP Earned', value: stats.totalXPEarned, icon: '💎', color: '#ef4444' }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: futuristicMode 
                  ? 'linear-gradient(135deg, var(--bg-alt), rgba(59, 130, 246, 0.02))'
                  : 'var(--bg-alt)',
                border: futuristicMode 
                  ? '1px solid rgba(59, 130, 246, 0.2)'
                  : '1px solid var(--border)',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '20px',
                marginBottom: '8px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '18px',
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
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : '#3b82f6')
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
                  ? '0 0 15px rgba(59, 130, 246, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'goals' && (
          <div>
            {goals.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  No Goals Set Yet
                </h4>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  Start your journey by setting your first SMART goal!
                </p>
                <button
                  onClick={() => setShowCreateGoal(true)}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Create Your First Goal
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {goals.map((goal) => {
                  const category = goalCategories.find(c => c.id === goal.category);
                  const timeFrame = timeFrames.find(t => t.id === goal.timeFrame);
                  const daysLeft = goal.status === 'active' ? 
                    Math.max(0, timeFrame?.days - Math.floor((new Date() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24))) : 0;
                  
                  return (
                    <div
                      key={goal.id}
                      style={{
                        padding: '20px',
                        background: futuristicMode 
                          ? 'linear-gradient(135deg, var(--bg-alt), rgba(59, 130, 246, 0.02))'
                          : 'var(--bg-alt)',
                        border: futuristicMode 
                          ? '1px solid rgba(59, 130, 246, 0.2)'
                          : '1px solid var(--border)',
                        borderRadius: '12px',
                        borderLeft: `4px solid ${category?.color || '#3b82f6'}`
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              fontSize: '24px'
                            }}>
                              {category?.icon || '🎯'}
                            </div>
                            <div>
                              <h4 style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--fg)'
                              }}>
                                {goal.title}
                              </h4>
                              <div style={{
                                display: 'flex',
                                gap: '12px',
                                fontSize: '12px',
                                color: 'var(--fg-soft)',
                                marginTop: '4px'
                              }}>
                                <span>{category?.name}</span>
                                <span>•</span>
                                <span>{timeFrame?.name}</span>
                                {goal.status === 'active' && (
                                  <>
                                    <span>•</span>
                                    <span>{daysLeft} days left</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <p style={{
                            margin: '0 0 16px 0',
                            fontSize: '14px',
                            color: 'var(--fg-soft)',
                            lineHeight: '1.4'
                          }}>
                            {goal.description}
                          </p>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {goal.status === 'completed' ? (
                            <div style={{
                              padding: '6px 12px',
                              background: '#10b981',
                              color: '#ffffff',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <span>✅</span>
                              <span>Completed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => completeGoal(goal.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'var(--success)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--fg)'
                          }}>
                            Progress
                          </span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: category?.color || '#3b82f6'
                          }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: 'var(--border)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${goal.progress}%`,
                            height: '100%',
                            background: futuristicMode 
                              ? `linear-gradient(90deg, ${category?.color || '#3b82f6'}, ${category?.color || '#3b82f6'}dd)`
                              : category?.color || '#3b82f6',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>

                      {/* Target Information */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        <span>Target: {goal.targetValue} {goal.unit}</span>
                        <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Goals by Category
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {goalCategories.map((category) => {
                const categoryGoals = categorizedGoals[category.id] || [];
                const completedCount = categoryGoals.filter(g => g.status === 'completed').length;

                return (
                  <div
                    key={category.id}
                    style={{
                      padding: '20px',
                      background: futuristicMode
                        ? `linear-gradient(135deg, var(--bg-alt), ${category.color}10)`
                        : 'var(--bg-alt)',
                      border: futuristicMode
                        ? `1px solid ${category.color}30`
                        : '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: category.color,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {category.icon}
                      </div>
                      <div>
                        <h5 style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'var(--fg)'
                        }}>
                          {category.name}
                        </h5>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          {categoryGoals.length} goals • {completedCount} completed
                        </div>
                      </div>
                    </div>

                    {categoryGoals.length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gap: '8px'
                      }}>
                        {categoryGoals.slice(0, 3).map((goal) => (
                          <div
                            key={goal.id}
                            style={{
                              padding: '8px 12px',
                              background: 'var(--card)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}
                          >
                            <div style={{
                              fontWeight: '600',
                              color: 'var(--fg)',
                              marginBottom: '2px'
                            }}>
                              {goal.title}
                            </div>
                            <div style={{
                              color: 'var(--fg-soft)'
                            }}>
                              {goal.progress}% complete
                            </div>
                          </div>
                        ))}
                        {categoryGoals.length > 3 && (
                          <div style={{
                            fontSize: '12px',
                            color: 'var(--fg-soft)',
                            textAlign: 'center',
                            fontStyle: 'italic'
                          }}>
                            +{categoryGoals.length - 3} more goals...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'var(--fg-soft)',
                        fontSize: '14px'
                      }}>
                        No goals in this category yet
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Achievement Milestones
            </h4>

            {milestones.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  No Milestones Yet
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  Complete your first goal to earn achievement milestones!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {milestones.reverse().map((milestone) => (
                  <div
                    key={milestone.id}
                    style={{
                      padding: '16px',
                      background: futuristicMode
                        ? 'linear-gradient(135deg, var(--bg-alt), rgba(245, 158, 11, 0.05))'
                        : 'var(--bg-alt)',
                      border: futuristicMode
                        ? '1px solid rgba(245, 158, 11, 0.3)'
                        : '1px solid var(--border)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: futuristicMode
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : '#f59e0b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: futuristicMode ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none'
                    }}>
                      {milestone.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)',
                        marginBottom: '4px'
                      }}>
                        {milestone.title}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--fg-soft)',
                        marginBottom: '4px'
                      }}>
                        {milestone.description}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        {new Date(milestone.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#f59e0b'
                      }}>
                        +{milestone.xpReward} XP
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        earned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              SMART Goal Suggestions
            </h4>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {suggestions.map((suggestion, index) => {
                const category = goalCategories.find(c => c.id === suggestion.category);
                const timeFrame = timeFrames.find(t => t.id === suggestion.timeFrame);

                return (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      background: futuristicMode
                        ? `linear-gradient(135deg, var(--bg-alt), ${category?.color}10)`
                        : 'var(--bg-alt)',
                      border: futuristicMode
                        ? `1px solid ${category?.color}30`
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
                        {category?.icon}
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
                            {suggestion.title}
                          </h5>
                          <span style={{
                            padding: '2px 8px',
                            background: suggestion.difficulty === 'easy' ? '#10b981' :
                                       suggestion.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
                            color: '#ffffff',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {suggestion.difficulty}
                          </span>
                        </div>
                        <p style={{
                          margin: '0 0 12px 0',
                          fontSize: '14px',
                          color: 'var(--fg-soft)',
                          lineHeight: '1.4'
                        }}>
                          {suggestion.description}
                        </p>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          <span>📂 {category?.name}</span>
                          <span>⏰ {timeFrame?.name}</span>
                          <span>🎯 {suggestion.targetValue} {suggestion.unit}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        createGoal(suggestion);
                        setActiveTab('goals');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: futuristicMode
                          ? `linear-gradient(135deg, ${category?.color}, ${category?.color}dd)`
                          : category?.color,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Adopt This Goal 🚀
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <CreateGoalModal
          goalCategories={goalCategories}
          timeFrames={timeFrames}
          onSave={createGoal}
          onClose={() => setShowCreateGoal(false)}
          futuristicMode={futuristicMode}
        />
      )}
    </div>
  );
}

// Create Goal Modal Component
function CreateGoalModal({ goalCategories, timeFrames, onSave, onClose, futuristicMode }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    timeFrame: '',
    targetValue: '',
    unit: ''
  });

  const handleSubmit = () => {
    if (formData.title && formData.category && formData.timeFrame && formData.targetValue) {
      onSave(formData);
      onClose();
    }
  };

  return (
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
        background: futuristicMode
          ? 'linear-gradient(135deg, var(--card), rgba(59, 130, 246, 0.05))'
          : 'var(--card)',
        border: futuristicMode
          ? '1px solid rgba(59, 130, 246, 0.3)'
          : '1px solid var(--border)',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--fg)'
          }}>
            Create New Goal
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'var(--fg-soft)'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Goal Title */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '8px'
            }}>
              Goal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Read 12 books this year"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--fg)',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '8px'
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your goal and why it's important to you..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                fontSize: '14px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--fg)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '8px'
            }}>
              Category *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {goalCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFormData({...formData, category: category.id})}
                  style={{
                    padding: '12px 8px',
                    background: formData.category === category.id
                      ? category.color
                      : 'var(--bg-alt)',
                    color: formData.category === category.id ? '#ffffff' : 'var(--fg)',
                    border: formData.category === category.id
                      ? 'none'
                      : '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{category.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>
                    {category.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Frame */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '8px'
            }}>
              Time Frame *
            </label>
            <select
              value={formData.timeFrame}
              onChange={(e) => setFormData({...formData, timeFrame: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--fg)',
                outline: 'none'
              }}
            >
              <option value="">Select time frame...</option>
              {timeFrames.map((timeFrame) => (
                <option key={timeFrame.id} value={timeFrame.id}>
                  {timeFrame.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target & Unit */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Target Value *
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                placeholder="e.g., 12"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Unit *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="e.g., books"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: '0 0 auto',
              padding: '12px 20px',
              background: 'transparent',
              color: 'var(--fg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.category || !formData.timeFrame || !formData.targetValue}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: formData.title && formData.category && formData.timeFrame && formData.targetValue
                ? (futuristicMode
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : '#3b82f6')
                : 'var(--border)',
              color: formData.title && formData.category && formData.timeFrame && formData.targetValue
                ? '#ffffff' : 'var(--fg-soft)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: formData.title && formData.category && formData.timeFrame && formData.targetValue
                ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Create Goal 🎯
          </button>
        </div>
      </div>
    </div>
  );
}
