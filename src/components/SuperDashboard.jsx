import React, { useState, useEffect } from 'react';
import GamificationSystem from './GamificationSystem';
import SocialSystem from './SocialSystem';
import AICoachingSystem from './AICoachingSystem';
import HabitStackingSystem from './HabitStackingSystem';
import TimeTrackingSystem from './TimeTrackingSystem';
import AdvancedAnalytics from './AdvancedAnalytics';
import MoodWeatherSystem from './MoodWeatherSystem';
import GoalAchievementSystem from './GoalAchievementSystem';
import BusinessTeamSystem from './BusinessTeamSystem';
import DataExportSystem from './DataExportSystem';

// Super Dashboard - All-in-One Productivity Hub
export default function SuperDashboard({ 
  user, 
  boards = [], 
  theme, 
  futuristicMode,
  onUpdateUser,
  onUpdateBoards
}) {
  const [activeWidget, setActiveWidget] = useState('overview');
  const [friends, setFriends] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [habitStacks, setHabitStacks] = useState([]);

  // Sample user data with gamification
  const [gamifiedUser, setGamifiedUser] = useState({
    ...user,
    xp: user?.xp || 0,
    level: user?.level || 1,
    achievements: user?.achievements || [],
    friendCode: user?.friendCode || `SM${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  });

  // Calculate completion data for gamification
  const completedHabits = boards.reduce((acc, board) => {
    return acc.concat([...board.completed].map(day => ({
      boardId: board.id,
      day,
      title: board.title
    })));
  }, []);

  const streakData = boards.reduce((acc, board) => {
    // Calculate current streak for each board
    let currentStreak = 0;
    for (let i = board.days; i >= 1; i--) {
      if (board.completed.has(i)) {
        currentStreak++;
      } else {
        break;
      }
    }
    acc[board.id] = currentStreak;
    return acc;
  }, {});

  // Widget configurations
  const widgets = [
    { id: 'overview', name: 'Overview', icon: '📊', component: 'overview' },
    { id: 'gamification', name: 'Achievements', icon: '🎮', component: GamificationSystem },
    { id: 'social', name: 'Social Hub', icon: '👥', component: SocialSystem },
    { id: 'ai-coach', name: 'AI Coach', icon: '🤖', component: AICoachingSystem },
    { id: 'habit-stacking', name: 'Habit Stacks', icon: '🔗', component: HabitStackingSystem },
    { id: 'time-tracking', name: 'Time & Focus', icon: '⏰', component: TimeTrackingSystem },
    { id: 'advanced-analytics', name: 'Advanced Analytics', icon: '🧠', component: AdvancedAnalytics },
    { id: 'mood-weather', name: 'Mood & Weather', icon: '🌈', component: MoodWeatherSystem },
    { id: 'goals', name: 'Goal Center', icon: '🎯', component: GoalAchievementSystem },
    { id: 'business-team', name: 'Business & Teams', icon: '🏢', component: BusinessTeamSystem },
    { id: 'data-export', name: 'Data Management', icon: '💾', component: DataExportSystem }
  ];

  // Overview statistics
  const stats = {
    totalHabits: boards.length,
    totalCompletions: boards.reduce((sum, board) => sum + board.completed.size, 0),
    longestStreak: Math.max(...Object.values(streakData), 0),
    averageCompletion: boards.length > 0
      ? Math.round((boards.reduce((sum, board) => sum + (board.completed.size / board.days * 100), 0) / boards.length))
      : 0,
    currentLevel: gamifiedUser.level,
    totalXP: gamifiedUser.xp,
    achievements: gamifiedUser.achievements.length,
    activeFriends: friends.length,
    habitStacks: habitStacks.length,
    focusTime: timeData.reduce((sum, session) => sum + (session.duration || 0), 0),
    moodEntries: JSON.parse(localStorage.getItem('streakmaster-mood-data') || '[]').length,
    activeGoals: JSON.parse(localStorage.getItem('streakmaster-goals') || '[]').filter(g => g.status === 'active').length
  };

  const handleCreateHabitStack = (stack) => {
    setHabitStacks(prev => [...prev, stack]);
  };

  const handleUpdateTimeData = (session) => {
    setTimeData(prev => [...prev, session]);
  };

  const handleUpdateUser = (updatedUser) => {
    setGamifiedUser(updatedUser);
    onUpdateUser?.(updatedUser);
  };

  const renderWidget = (widget) => {
    if (widget.component === 'overview') {
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
                  ? 'linear-gradient(135deg, var(--accent), var(--success))'
                  : 'var(--accent)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: futuristicMode ? '0 0 20px rgba(255, 161, 22, 0.3)' : 'none'
              }}>
                🚀
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--fg)'
                }}>
                  Productivity Overview
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'var(--fg-soft)',
                  marginTop: '2px'
                }}>
                  Your complete habit mastery dashboard
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Active Habits', value: stats.totalHabits, icon: '🎯', color: 'var(--accent)' },
                { label: 'Total Completions', value: stats.totalCompletions, icon: '✅', color: 'var(--success)' },
                { label: 'Longest Streak', value: `${stats.longestStreak} days`, icon: '🔥', color: '#f59e0b' },
                { label: 'Avg Completion', value: `${stats.averageCompletion}%`, icon: '📊', color: '#8b5cf6' },
                { label: 'Current Level', value: stats.currentLevel, icon: '⭐', color: '#10b981' },
                { label: 'Total XP', value: stats.totalXP, icon: '💎', color: '#3b82f6' },
                { label: 'Achievements', value: stats.achievements, icon: '🏆', color: '#ef4444' },
                { label: 'Habit Buddies', value: stats.activeFriends, icon: '👥', color: '#06b6d4' },
                { label: 'Habit Stacks', value: stats.habitStacks, icon: '🔗', color: '#ff6b6b' },
                { label: 'Focus Time', value: `${stats.focusTime}h`, icon: '⏰', color: '#10b981' },
                { label: 'Mood Entries', value: stats.moodEntries, icon: '😊', color: '#f59e0b' },
                { label: 'Active Goals', value: stats.activeGoals, icon: '🎯', color: '#3b82f6' }
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(255, 161, 22, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode 
                      ? '1px solid rgba(255, 161, 22, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = futuristicMode 
                      ? '0 8px 25px rgba(255, 161, 22, 0.2)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '8px'
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{
                    fontSize: '20px',
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

            {/* Quick Actions */}
            <div>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Quick Actions
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {[
                  { name: 'Start Focus Session', icon: '🎯', action: () => setActiveWidget('time-tracking') },
                  { name: 'Build Habit Stack', icon: '🔗', action: () => setActiveWidget('habit-stacking') },
                  { name: 'Chat with AI Coach', icon: '🤖', action: () => setActiveWidget('ai-coach') },
                  { name: 'Check Achievements', icon: '🏆', action: () => setActiveWidget('gamification') },
                  { name: 'Log Mood', icon: '😊', action: () => setActiveWidget('mood-weather') },
                  { name: 'View Analytics', icon: '🧠', action: () => setActiveWidget('advanced-analytics') },
                  { name: 'Set New Goal', icon: '🎯', action: () => setActiveWidget('goals') },
                  { name: 'Connect Friends', icon: '👥', action: () => setActiveWidget('social') }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      padding: '12px 16px',
                      background: futuristicMode 
                        ? 'linear-gradient(135deg, var(--accent), var(--success))'
                        : 'var(--accent)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: futuristicMode 
                        ? '0 0 15px rgba(255, 161, 22, 0.3)'
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      if (futuristicMode) {
                        e.target.style.boxShadow = '0 0 20px rgba(255, 161, 22, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      if (futuristicMode) {
                        e.target.style.boxShadow = '0 0 15px rgba(255, 161, 22, 0.3)';
                      }
                    }}
                  >
                    <span>{action.icon}</span>
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const Component = widget.component;
    return (
      <Component
        user={gamifiedUser}
        boards={boards}
        theme={theme}
        futuristicMode={futuristicMode}
        onUpdateUser={handleUpdateUser}
        completedHabits={completedHabits}
        streakData={streakData}
        friends={friends}
        onUpdateFriends={setFriends}
        onCreateHabitStack={handleCreateHabitStack}
        onUpdateTimeData={handleUpdateTimeData}
        timeData={timeData}
        moodData={{}}
        weatherData={{}}
        onUpdateMoodData={(data) => console.log('Mood data updated:', data)}
        onUpdateWeatherData={(data) => console.log('Weather data updated:', data)}
        onUpdateGoals={(goals) => console.log('Goals updated:', goals)}
      />
    );
  };

  return (
    <div style={{
      padding: '32px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'var(--bg)',
      color: 'var(--fg)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: futuristicMode 
              ? 'linear-gradient(135deg, var(--accent), var(--success))'
              : 'var(--accent)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: futuristicMode ? '0 0 30px rgba(255, 161, 22, 0.4)' : 'none'
          }}>
            🚀
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              background: futuristicMode 
                ? 'linear-gradient(135deg, var(--accent), var(--success))'
                : 'var(--fg)',
              backgroundClip: futuristicMode ? 'text' : 'initial',
              WebkitBackgroundClip: futuristicMode ? 'text' : 'initial',
              color: futuristicMode ? 'transparent' : 'var(--fg)'
            }}>
              StreakMaster Pro
            </h1>
            <p style={{
              margin: 0,
              fontSize: '18px',
              color: 'var(--fg-soft)',
              marginTop: '4px'
            }}>
              The Ultimate All-in-One Productivity Powerhouse
            </p>
          </div>
        </div>

        {/* Widget Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {widgets.map((widget) => (
            <button
              key={widget.id}
              onClick={() => setActiveWidget(widget.id)}
              style={{
                padding: '12px 16px',
                background: activeWidget === widget.id 
                  ? (futuristicMode 
                      ? 'linear-gradient(135deg, var(--accent), var(--success))'
                      : 'var(--accent)')
                  : 'transparent',
                color: activeWidget === widget.id ? '#ffffff' : 'var(--fg)',
                border: activeWidget === widget.id 
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
                boxShadow: activeWidget === widget.id && futuristicMode 
                  ? '0 0 15px rgba(255, 161, 22, 0.3)'
                  : 'none'
              }}
            >
              <span>{widget.icon}</span>
              <span>{widget.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Widget */}
      <div>
        {renderWidget(widgets.find(w => w.id === activeWidget))}
      </div>
    </div>
  );
}
