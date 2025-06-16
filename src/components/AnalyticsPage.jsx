import React, { useState, useMemo } from 'react';

const AnalyticsPage = ({ 
  boards, 
  theme, 
  futuristicMode,
  accentColor 
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('consistency');

  // Helper function to get category colors
  const getCategoryColor = (category) => {
    const colors = {
      'health': '#00af9b',
      'learning': '#ffa116',
      'productivity': '#8a2be2',
      'creative': '#ff6b6b',
      'fitness': '#00af9b',
      'wellness': '#00af9b'
    };
    return colors[category.toLowerCase()] || '#6b7280';
  };

  const generateInsights = (weeklyPattern, categories, consistency, longestStreak) => {
    const insights = [];

    // Find best performing day
    const bestDay = weeklyPattern.reduce((best, day) =>
      day.completion > best.completion ? day : best, weeklyPattern[0] || { day: 'Monday', completion: 0 });

    if (bestDay.completion > 0) {
      insights.push({
        type: 'success',
        icon: '🎯',
        title: 'Peak Performance Day',
        value: bestDay.day,
        description: `You complete ${bestDay.completion}% of habits on ${bestDay.day}s`,
        trend: `+${Math.max(0, bestDay.completion - 70)}%`
      });
    }

    // Find worst performing day
    const worstDay = weeklyPattern.reduce((worst, day) =>
      day.completion < worst.completion ? day : worst, weeklyPattern[0] || { day: 'Sunday', completion: 100 });

    if (worstDay.completion < bestDay.completion - 10) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Improvement Opportunity',
        value: worstDay.day,
        description: `${worstDay.day}s show lower completion rates`,
        trend: `-${Math.max(0, bestDay.completion - worstDay.completion)}%`
      });
    }

    // Consistency insight
    if (consistency > 80) {
      insights.push({
        type: 'success',
        icon: '🔥',
        title: 'Excellent Consistency',
        value: `${consistency}%`,
        description: 'Your habit consistency is outstanding',
        trend: '+High'
      });
    } else if (consistency > 60) {
      insights.push({
        type: 'info',
        icon: '📈',
        title: 'Good Progress',
        value: `${consistency}%`,
        description: 'Keep building your consistency',
        trend: '+Improving'
      });
    } else {
      insights.push({
        type: 'warning',
        icon: '💪',
        title: 'Building Momentum',
        value: `${consistency}%`,
        description: 'Focus on daily consistency',
        trend: 'Growing'
      });
    }

    return insights;
  };

  const generatePredictions = (boards, consistency, averageStreak) => {
    const predictions = [];

    // Next 7 days prediction
    const weekPrediction = Math.min(7, Math.round((consistency / 100) * 7));
    predictions.push({
      metric: 'Next 7 Days',
      prediction: `${weekPrediction}/7 days`,
      confidence: Math.min(95, consistency + 10),
      trend: consistency > 70 ? 'up' : 'stable'
    });

    // Month goal prediction
    const monthPrediction = Math.min(30, Math.round((consistency / 100) * 30));
    predictions.push({
      metric: 'Month Goal',
      prediction: `${monthPrediction}/30 days`,
      confidence: Math.min(90, consistency + 5),
      trend: consistency > 60 ? 'up' : 'stable'
    });

    // Streak extension prediction
    const streakExtension = Math.round(averageStreak * (consistency / 100));
    predictions.push({
      metric: 'Streak Extension',
      prediction: `+${streakExtension} days`,
      confidence: Math.min(85, consistency),
      trend: averageStreak > 5 ? 'up' : 'stable'
    });

    return predictions;
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

  // Calculate real analytics data from actual boards
  const analyticsData = useMemo(() => {
    if (boards.length === 0) {
      return {
        overview: {
          totalStreaks: 0,
          activeStreaks: 0,
          totalDays: 0,
          averageStreak: 0,
          longestStreak: 0,
          consistency: 0
        },
        insights: [],
        predictions: [],
        weeklyPattern: [],
        categories: []
      };
    }

    // Calculate overview stats
    const totalStreaks = boards.length;
    const activeStreaks = boards.filter(b => {
      const today = new Date().toISOString().slice(0, 10);
      return b.completed.has(today) || b.completed.size > 0;
    }).length;
    const totalDays = boards.reduce((sum, b) => sum + b.completed.size, 0);

    // Calculate streaks for each board
    const streakLengths = boards.map(board => {
      const sortedDates = Array.from(board.completed).sort();
      if (sortedDates.length === 0) return 0;

      let currentStreak = 1;
      let maxStreak = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      return maxStreak;
    });

    const averageStreak = streakLengths.length > 0
      ? Math.round(streakLengths.reduce((sum, len) => sum + len, 0) / streakLengths.length * 10) / 10
      : 0;
    const longestStreak = Math.max(...streakLengths, 0);
    const consistency = totalStreaks > 0
      ? Math.round((totalDays / (totalStreaks * 30)) * 100) // Assuming 30-day average
      : 0;

    // Calculate weekly pattern
    const weeklyData = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    boards.forEach(board => {
      Array.from(board.completed).forEach(dateStr => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        const dayName = dayNames[dayOfWeek];

        if (!weeklyData[dayName]) {
          weeklyData[dayName] = { completed: 0, total: 0 };
        }
        weeklyData[dayName].completed++;
        weeklyData[dayName].total++;
      });
    });

    const weeklyPattern = dayNames.map(day => ({
      day: day,
      completion: weeklyData[day]
        ? Math.round((weeklyData[day].completed / Math.max(weeklyData[day].total, 1)) * 100)
        : 0,
      habits: weeklyData[day] ? weeklyData[day].completed : 0
    }));

    // Calculate category performance
    const categoryData = {};
    boards.forEach(board => {
      const category = board.category || 'Other';
      if (!categoryData[category]) {
        categoryData[category] = { completed: 0, total: 0, count: 0 };
      }
      categoryData[category].completed += board.completed.size;
      categoryData[category].total += board.days;
      categoryData[category].count++;
    });

    const categories = Object.entries(categoryData).map(([name, data]) => ({
      name,
      completion: Math.round((data.completed / Math.max(data.total, 1)) * 100),
      count: data.count,
      color: getCategoryColor(name)
    }));

    // Generate insights based on real data
    const insights = generateInsights(weeklyPattern, categories, consistency, longestStreak);

    // Generate predictions based on real data
    const predictions = generatePredictions(boards, consistency, averageStreak);

    return {
      overview: {
        totalStreaks,
        activeStreaks,
        totalDays,
        averageStreak,
        longestStreak,
        consistency
      },
      insights,
      predictions,
      weeklyPattern,
      categories
    };
  }, [boards]);

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'error': return 'var(--error)';
      case 'info': return 'var(--accent)';
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
              📊 Advanced Analytics
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--fg-soft)',
              margin: 0
            }}>
              Deep insights into your habit patterns and performance
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['7d', '30d', '90d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: timeRange === range ? 'var(--accent)' : 'transparent',
                  color: timeRange === range ? '#ffffff' : 'var(--fg)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Total Streaks', value: analyticsData.overview.totalStreaks, icon: '🎯', color: 'var(--accent)' },
          { label: 'Active Streaks', value: analyticsData.overview.activeStreaks, icon: '🔥', color: 'var(--success)' },
          { label: 'Total Days', value: analyticsData.overview.totalDays, icon: '📅', color: 'var(--warning)' },
          { label: 'Avg Streak', value: `${analyticsData.overview.averageStreak} days`, icon: '📈', color: '#8a2be2' },
          { label: 'Longest Streak', value: `${analyticsData.overview.longestStreak} days`, icon: '🏆', color: 'var(--error)' },
          { label: 'Consistency', value: `${analyticsData.overview.consistency}%`, icon: '⚡', color: 'var(--success)' }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: futuristicMode
                ? `linear-gradient(135deg, var(--card), ${stat.color}10)`
                : 'var(--card)',
              border: futuristicMode
                ? `1px solid ${stat.color}30`
                : '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
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
                background: `linear-gradient(45deg, transparent, ${stat.color}08, transparent)`,
                animation: 'cyber-scan 4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }} />
            )}

            <div style={{ position: 'relative', zIndex: 1 }}>
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
                color: 'var(--fg-soft)',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Main Analytics */}
        <div>
          {/* AI Insights */}
          <div style={{
            background: futuristicMode
              ? 'linear-gradient(135deg, var(--card), rgba(0, 255, 255, 0.05))'
              : 'var(--card)',
            border: futuristicMode
              ? '1px solid rgba(0, 255, 255, 0.3)'
              : '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
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

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 20px 0',
                color: 'var(--fg)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🤖</span>
                <span>AI Insights</span>
                {futuristicMode && (
                  <span style={{
                    padding: '2px 8px',
                    background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#000'
                  }}>
                    ACTIVE
                  </span>
                )}
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {analyticsData.insights.map((insight, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      fontSize: '20px',
                      background: `${getInsightColor(insight.type)}20`,
                      borderRadius: '6px',
                      padding: '8px',
                      flexShrink: 0
                    }}>
                      {insight.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          margin: 0,
                          color: 'var(--fg)'
                        }}>
                          {insight.title}
                        </h4>
                        <span style={{
                          fontSize: '11px',
                          color: getInsightColor(insight.type),
                          fontWeight: '600'
                        }}>
                          {insight.trend}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: getInsightColor(insight.type),
                        marginBottom: '4px'
                      }}>
                        {insight.value}
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--fg-soft)',
                        margin: 0,
                        lineHeight: '1.3'
                      }}>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Predictions */}
          <div style={{
            background: futuristicMode
              ? 'linear-gradient(135deg, var(--card), rgba(255, 161, 22, 0.05))'
              : 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: 'var(--fg)'
            }}>
              🔮 AI Predictions
            </h3>

            {analyticsData.predictions.map((pred, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 0',
                  borderBottom: i < analyticsData.predictions.length - 1 ? '1px solid var(--border)' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--fg)'
                  }}>
                    {pred.metric}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--success)',
                    fontWeight: '600'
                  }}>
                    {pred.confidence}% confidence
                  </span>
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--accent)'
                }}>
                  {pred.prediction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
