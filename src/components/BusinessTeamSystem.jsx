import React, { useState, useEffect } from 'react';

// Business & Team Productivity System
export default function BusinessTeamSystem({ 
  user, 
  boards = [], 
  theme, 
  futuristicMode,
  onUpdateTeamData
}) {
  const [activeTab, setActiveTab] = useState('team-dashboard');
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamGoals, setTeamGoals] = useState([]);
  const [productivityMetrics, setProductivityMetrics] = useState({});
  const [showAddMember, setShowAddMember] = useState(false);

  // Team roles and permissions
  const teamRoles = [
    { id: 'admin', name: 'Team Admin', icon: '👑', permissions: ['all'] },
    { id: 'manager', name: 'Manager', icon: '👨‍💼', permissions: ['view_all', 'manage_goals', 'view_reports'] },
    { id: 'lead', name: 'Team Lead', icon: '🎯', permissions: ['view_team', 'manage_own', 'view_reports'] },
    { id: 'member', name: 'Team Member', icon: '👤', permissions: ['view_own', 'manage_own'] }
  ];

  // Business habit categories
  const businessCategories = [
    { id: 'productivity', name: 'Productivity', icon: '⚡', color: '#f59e0b' },
    { id: 'communication', name: 'Communication', icon: '💬', color: '#3b82f6' },
    { id: 'leadership', name: 'Leadership', icon: '👑', color: '#8b5cf6' },
    { id: 'learning', name: 'Professional Development', icon: '📚', color: '#10b981' },
    { id: 'wellness', name: 'Work-Life Balance', icon: '⚖️', color: '#06b6d4' },
    { id: 'innovation', name: 'Innovation', icon: '💡', color: '#ef4444' },
    { id: 'networking', name: 'Networking', icon: '🤝', color: '#22c55e' },
    { id: 'sales', name: 'Sales & Revenue', icon: '💰', color: '#f97316' }
  ];

  // Sample team data
  useEffect(() => {
    const sampleTeamMembers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'manager',
        department: 'Marketing',
        avatar: '👩‍💼',
        habits: 5,
        completionRate: 87,
        streakDays: 23,
        productivityScore: 92,
        lastActive: '2 hours ago'
      },
      {
        id: 2,
        name: 'Mike Chen',
        role: 'lead',
        department: 'Engineering',
        avatar: '👨‍💻',
        habits: 7,
        completionRate: 94,
        streakDays: 31,
        productivityScore: 96,
        lastActive: '1 hour ago'
      },
      {
        id: 3,
        name: 'Emily Davis',
        role: 'member',
        department: 'Design',
        avatar: '👩‍🎨',
        habits: 4,
        completionRate: 78,
        streakDays: 12,
        productivityScore: 84,
        lastActive: '30 minutes ago'
      },
      {
        id: 4,
        name: 'Alex Rodriguez',
        role: 'member',
        department: 'Sales',
        avatar: '👨‍💼',
        habits: 6,
        completionRate: 91,
        streakDays: 18,
        productivityScore: 89,
        lastActive: '15 minutes ago'
      }
    ];

    const sampleTeamGoals = [
      {
        id: 1,
        title: 'Q4 Productivity Initiative',
        description: 'Increase team productivity by 20% through consistent habit tracking',
        category: 'productivity',
        target: 20,
        current: 14,
        unit: '% increase',
        deadline: '2024-12-31',
        participants: 12,
        status: 'active'
      },
      {
        id: 2,
        title: 'Daily Standup Attendance',
        description: 'Achieve 95% attendance rate for daily standup meetings',
        category: 'communication',
        target: 95,
        current: 87,
        unit: '% attendance',
        deadline: '2024-11-30',
        participants: 8,
        status: 'active'
      },
      {
        id: 3,
        title: 'Learning & Development Hours',
        description: 'Complete 40 hours of professional development per quarter',
        category: 'learning',
        target: 40,
        current: 28,
        unit: 'hours',
        deadline: '2024-12-31',
        participants: 15,
        status: 'active'
      }
    ];

    setTeamMembers(sampleTeamMembers);
    setTeamGoals(sampleTeamGoals);

    // Calculate productivity metrics
    const metrics = {
      totalMembers: sampleTeamMembers.length,
      avgCompletionRate: Math.round(sampleTeamMembers.reduce((sum, m) => sum + m.completionRate, 0) / sampleTeamMembers.length),
      avgProductivityScore: Math.round(sampleTeamMembers.reduce((sum, m) => sum + m.productivityScore, 0) / sampleTeamMembers.length),
      totalActiveHabits: sampleTeamMembers.reduce((sum, m) => sum + m.habits, 0),
      topPerformer: sampleTeamMembers.reduce((top, member) => 
        member.productivityScore > top.productivityScore ? member : top
      ),
      activeGoals: sampleTeamGoals.filter(g => g.status === 'active').length
    };

    setProductivityMetrics(metrics);
  }, []);

  // Generate team insights
  const generateTeamInsights = () => {
    const insights = [];

    if (productivityMetrics.avgCompletionRate > 85) {
      insights.push({
        type: 'success',
        title: 'Excellent Team Performance',
        message: `Your team maintains an outstanding ${productivityMetrics.avgCompletionRate}% completion rate.`,
        recommendation: 'Consider introducing more challenging goals to maintain growth momentum.',
        icon: '🏆'
      });
    }

    if (productivityMetrics.topPerformer) {
      insights.push({
        type: 'info',
        title: 'Top Performer Recognition',
        message: `${productivityMetrics.topPerformer.name} leads with ${productivityMetrics.topPerformer.productivityScore}% productivity score.`,
        recommendation: 'Consider having them mentor other team members or share best practices.',
        icon: '⭐'
      });
    }

    const lowPerformers = teamMembers.filter(m => m.completionRate < 70);
    if (lowPerformers.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Support Needed',
        message: `${lowPerformers.length} team member(s) may need additional support.`,
        recommendation: 'Schedule one-on-one meetings to identify barriers and provide assistance.',
        icon: '🤝'
      });
    }

    return insights;
  };

  // Calculate ROI metrics
  const calculateROI = () => {
    const baseProductivity = 70; // Baseline productivity percentage
    const currentProductivity = productivityMetrics.avgProductivityScore || 70;
    const improvement = currentProductivity - baseProductivity;
    const estimatedHoursSaved = (improvement / 100) * 40 * productivityMetrics.totalMembers; // 40 hours per week per member
    const hourlyRate = 50; // Average hourly rate
    const weeklySavings = estimatedHoursSaved * hourlyRate;
    const monthlySavings = weeklySavings * 4;
    const annualSavings = monthlySavings * 12;

    return {
      improvement: improvement.toFixed(1),
      hoursSaved: estimatedHoursSaved.toFixed(1),
      weeklySavings: weeklySavings.toFixed(0),
      monthlySavings: monthlySavings.toFixed(0),
      annualSavings: annualSavings.toFixed(0)
    };
  };

  const insights = generateTeamInsights();
  const roiMetrics = calculateROI();

  const tabs = [
    { id: 'team-dashboard', name: 'Team Dashboard', icon: '📊' },
    { id: 'members', name: 'Team Members', icon: '👥' },
    { id: 'goals', name: 'Team Goals', icon: '🎯' },
    { id: 'analytics', name: 'Business Analytics', icon: '📈' },
    { id: 'roi', name: 'ROI Reports', icon: '💰' }
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
                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                : '#f97316',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: futuristicMode ? '0 0 20px rgba(249, 115, 22, 0.3)' : 'none'
            }}>
              🏢
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--fg)'
              }}>
                Business & Team Hub
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)',
                marginTop: '2px'
              }}>
                Enterprise-grade team productivity and performance management
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => setShowAddMember(true)}
              style={{
                padding: '8px 16px',
                background: futuristicMode 
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>➕</span>
              <span>Add Member</span>
            </button>
            
            <div style={{
              padding: '8px 16px',
              background: futuristicMode 
                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                : '#f97316',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🏢</span>
              <span>Enterprise Plan</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Team Members', value: productivityMetrics.totalMembers, icon: '👥', color: '#3b82f6' },
            { label: 'Avg Completion', value: `${productivityMetrics.avgCompletionRate}%`, icon: '✅', color: '#10b981' },
            { label: 'Productivity Score', value: `${productivityMetrics.avgProductivityScore}%`, icon: '📊', color: '#f59e0b' },
            { label: 'Active Habits', value: productivityMetrics.totalActiveHabits, icon: '🎯', color: '#8b5cf6' },
            { label: 'Team Goals', value: productivityMetrics.activeGoals, icon: '🏆', color: '#ef4444' }
          ].map((metric, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: futuristicMode 
                  ? 'linear-gradient(135deg, var(--bg-alt), rgba(249, 115, 22, 0.02))'
                  : 'var(--bg-alt)',
                border: futuristicMode 
                  ? '1px solid rgba(249, 115, 22, 0.2)'
                  : '1px solid var(--border)',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '20px',
                marginBottom: '8px'
              }}>
                {metric.icon}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: metric.color,
                marginBottom: '4px'
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--fg-soft)'
              }}>
                {metric.label}
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
                      ? 'linear-gradient(135deg, #f97316, #ea580c)'
                      : '#f97316')
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
                  ? '0 0 15px rgba(249, 115, 22, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'team-dashboard' && (
          <div>
            {/* Team Insights */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Team Insights & Recommendations
              </h4>
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${
                        insight.type === 'success' ? '#10b981' :
                        insight.type === 'warning' ? '#f59e0b' :
                        insight.type === 'info' ? '#3b82f6' : '#ef4444'
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
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--fg)'
                        }}>
                          {insight.title}
                        </h5>
                        <p style={{
                          margin: '0 0 8px 0',
                          fontSize: '13px',
                          color: 'var(--fg-soft)',
                          lineHeight: '1.4'
                        }}>
                          {insight.message}
                        </p>
                        <div style={{
                          padding: '8px 12px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#3b82f6',
                          fontWeight: '500'
                        }}>
                          💡 {insight.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Top Performers This Week
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {teamMembers
                  .sort((a, b) => b.productivityScore - a.productivityScore)
                  .slice(0, 3)
                  .map((member, index) => (
                    <div
                      key={member.id}
                      style={{
                        padding: '16px',
                        background: futuristicMode 
                          ? 'linear-gradient(135deg, var(--bg-alt), rgba(249, 115, 22, 0.02))'
                          : 'var(--bg-alt)',
                        border: futuristicMode 
                          ? '1px solid rgba(249, 115, 22, 0.2)'
                          : '1px solid var(--border)',
                        borderRadius: '12px',
                        position: 'relative'
                      }}
                    >
                      {index === 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '24px',
                          height: '24px',
                          background: '#ffd700',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          👑
                        </div>
                      )}
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          fontSize: '32px'
                        }}>
                          {member.avatar}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--fg)'
                          }}>
                            {member.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'var(--fg-soft)'
                          }}>
                            {member.department} • {teamRoles.find(r => r.id === member.role)?.name}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '12px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#10b981'
                          }}>
                            {member.productivityScore}%
                          </div>
                          <div style={{ color: 'var(--fg-soft)' }}>
                            Productivity
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#f59e0b'
                          }}>
                            {member.streakDays}
                          </div>
                          <div style={{ color: 'var(--fg-soft)' }}>
                            Day Streak
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Team Members ({teamMembers.length})
            </h4>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {teamMembers.map((member) => {
                const role = teamRoles.find(r => r.id === member.role);
                return (
                  <div
                    key={member.id}
                    style={{
                      padding: '20px',
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
                      gap: '16px',
                      flex: 1
                    }}>
                      <div style={{
                        fontSize: '40px'
                      }}>
                        {member.avatar}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'var(--fg)',
                          marginBottom: '4px'
                        }}>
                          {member.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '12px',
                          color: 'var(--fg-soft)',
                          marginBottom: '8px'
                        }}>
                          <span>{role?.icon} {role?.name}</span>
                          <span>•</span>
                          <span>{member.department}</span>
                          <span>•</span>
                          <span>Active {member.lastActive}</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '12px'
                        }}>
                          <span>📊 {member.completionRate}% completion</span>
                          <span>🔥 {member.streakDays} day streak</span>
                          <span>🎯 {member.habits} active habits</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: member.productivityScore > 90 ? '#10b981' :
                                 member.productivityScore > 75 ? '#f59e0b' : '#ef4444'
                        }}>
                          {member.productivityScore}%
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          Productivity
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
                          View Details
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
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Team Goals & Objectives
            </h4>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {teamGoals.map((goal) => {
                const category = businessCategories.find(c => c.id === goal.category);
                const progress = (goal.current / goal.target) * 100;
                const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={goal.id}
                    style={{
                      padding: '20px',
                      background: futuristicMode
                        ? `linear-gradient(135deg, var(--bg-alt), ${category?.color}10)`
                        : 'var(--bg-alt)',
                      border: futuristicMode
                        ? `1px solid ${category?.color}30`
                        : '1px solid var(--border)',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${category?.color}`
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
                            {category?.icon}
                          </div>
                          <div>
                            <h5 style={{
                              margin: 0,
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'var(--fg)'
                            }}>
                              {goal.title}
                            </h5>
                            <div style={{
                              display: 'flex',
                              gap: '12px',
                              fontSize: '12px',
                              color: 'var(--fg-soft)',
                              marginTop: '4px'
                            }}>
                              <span>{category?.name}</span>
                              <span>•</span>
                              <span>{goal.participants} participants</span>
                              <span>•</span>
                              <span>{daysLeft} days left</span>
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
                        textAlign: 'right'
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: category?.color
                        }}>
                          {progress.toFixed(1)}%
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          complete
                        </div>
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
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          {goal.current} / {goal.target} {goal.unit}
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
                          width: `${Math.min(100, progress)}%`,
                          height: '100%',
                          background: futuristicMode
                            ? `linear-gradient(90deg, ${category?.color}, ${category?.color}dd)`
                            : category?.color,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                      <button style={{
                        padding: '6px 12px',
                        background: category?.color,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
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
              Business Analytics Dashboard
            </h4>

            {/* Department Performance */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h5 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Department Performance
              </h5>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {['Marketing', 'Engineering', 'Design', 'Sales'].map((dept) => {
                  const deptMembers = teamMembers.filter(m => m.department === dept);
                  const avgScore = deptMembers.length > 0
                    ? Math.round(deptMembers.reduce((sum, m) => sum + m.productivityScore, 0) / deptMembers.length)
                    : 0;

                  return (
                    <div
                      key={dept}
                      style={{
                        padding: '16px',
                        background: 'var(--bg-alt)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)',
                        marginBottom: '8px'
                      }}>
                        {dept}
                      </div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: avgScore > 90 ? '#10b981' : avgScore > 75 ? '#f59e0b' : '#ef4444',
                        marginBottom: '4px'
                      }}>
                        {avgScore}%
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)'
                      }}>
                        {deptMembers.length} members
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Productivity Trends */}
            <div>
              <h5 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Productivity Trends
              </h5>
              <div style={{
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--fg-soft)',
                  fontSize: '14px'
                }}>
                  📈 Advanced productivity trend charts and analytics coming soon!
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roi' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Return on Investment Analysis
            </h4>

            {/* ROI Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Productivity Improvement', value: `+${roiMetrics.improvement}%`, icon: '📈', color: '#10b981' },
                { label: 'Hours Saved/Week', value: roiMetrics.hoursSaved, icon: '⏰', color: '#3b82f6' },
                { label: 'Weekly Savings', value: `$${roiMetrics.weeklySavings}`, icon: '💰', color: '#f59e0b' },
                { label: 'Monthly Savings', value: `$${roiMetrics.monthlySavings}`, icon: '📊', color: '#8b5cf6' },
                { label: 'Annual Projection', value: `$${roiMetrics.annualSavings}`, icon: '🏆', color: '#ef4444' }
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    background: futuristicMode
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(249, 115, 22, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode
                      ? '1px solid rgba(249, 115, 22, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '12px'
                  }}>
                    {metric.icon}
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: metric.color,
                    marginBottom: '8px'
                  }}>
                    {metric.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--fg-soft)',
                    lineHeight: '1.3'
                  }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ROI Breakdown */}
            <div style={{
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h5 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                ROI Calculation Breakdown
              </h5>
              <div style={{
                display: 'grid',
                gap: '12px',
                fontSize: '14px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ color: 'var(--fg-soft)' }}>Baseline Productivity:</span>
                  <span style={{ fontWeight: '600', color: 'var(--fg)' }}>70%</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ color: 'var(--fg-soft)' }}>Current Productivity:</span>
                  <span style={{ fontWeight: '600', color: 'var(--fg)' }}>{productivityMetrics.avgProductivityScore}%</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ color: 'var(--fg-soft)' }}>Average Hourly Rate:</span>
                  <span style={{ fontWeight: '600', color: 'var(--fg)' }}>$50</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ color: 'var(--fg-soft)' }}>Team Size:</span>
                  <span style={{ fontWeight: '600', color: 'var(--fg)' }}>{productivityMetrics.totalMembers} members</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  marginTop: '8px'
                }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>Projected Annual ROI:</span>
                  <span style={{ fontWeight: '700', color: '#10b981', fontSize: '16px' }}>${roiMetrics.annualSavings}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
