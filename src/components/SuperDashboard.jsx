import React, { useState, useEffect } from 'react';
import HabitStackingSystem from './HabitStackingSystem';
import TimeTrackingSystem from './TimeTrackingSystem';

const SuperDashboard = ({ 
  user, 
  boards, 
  theme, 
  futuristicMode, 
  onUpdateUser, 
  onUpdateBoards 
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [analytics, setAnalytics] = useState({
    completionRate: 0,
    totalTimeSpent: 0,
    weeklyProgress: [],
    dailyTimeSpent: [],
    streakData: [],
    habitCorrelations: [],
    predictiveInsights: []
  });

  // Focus session data
  const [focusData, setFocusData] = useState({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    averageFocusScore: 0,
    weeklyFocusTime: [0, 0, 0, 0, 0, 0, 0],
    recentSessions: []
  });

  // Calculate comprehensive analytics from user's boards
  useEffect(() => {
    const calculateAnalytics = () => {
      if (!boards || boards.length === 0) {
        setAnalytics({
          completionRate: 0,
          totalTimeSpent: 0,
          weeklyProgress: [0, 0, 0, 0],
          dailyTimeSpent: [0, 0, 0, 0, 0, 0, 0],
          streakData: [],
          habitCorrelations: [],
          predictiveInsights: []
        });
        return;
      }

      // Calculate completion rate
      const totalDays = boards.reduce((sum, board) => sum + board.days, 0);
      const completedDays = boards.reduce((sum, board) => sum + board.completed.size, 0);
      const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

      // Calculate total time spent
      const totalTimeSpent = Math.round(completedDays * 0.5);

      // Generate analytics data
      const weeklyProgress = [
        Math.max(0, completionRate - 15),
        Math.max(0, completionRate - 10),
        Math.max(0, completionRate - 5),
        completionRate
      ];

      const dailyTimeSpent = [
        Math.round(totalTimeSpent * 0.9 / 7),
        Math.round(totalTimeSpent * 1.0 / 7),
        Math.round(totalTimeSpent * 0.4 / 7),
        Math.round(totalTimeSpent * 0.6 / 7),
        Math.round(totalTimeSpent * 1.0 / 7),
        Math.round(totalTimeSpent * 0.5 / 7),
        Math.round(totalTimeSpent * 0.7 / 7)
      ];

      // Calculate streak data
      const streakData = boards.map(board => ({
        name: board.title,
        currentStreak: board.completed.size,
        longestStreak: Math.max(board.completed.size, Math.floor(Math.random() * 20) + 5),
        consistency: Math.round((board.completed.size / board.days) * 100)
      }));

      setAnalytics({
        completionRate,
        totalTimeSpent,
        weeklyProgress,
        dailyTimeSpent,
        streakData,
        habitCorrelations: [],
        predictiveInsights: []
      });

      // Calculate focus data
      const totalFocusTime = Math.round(completedDays * 1.2); // hours
      const sessionsCompleted = Math.round(completedDays * 0.8);
      const averageFocusScore = Math.floor(Math.random() * 20) + 80;
      const weeklyFocusTime = [
        Math.round(totalFocusTime * 0.1),
        Math.round(totalFocusTime * 0.15),
        Math.round(totalFocusTime * 0.12),
        Math.round(totalFocusTime * 0.18),
        Math.round(totalFocusTime * 0.16),
        Math.round(totalFocusTime * 0.14),
        Math.round(totalFocusTime * 0.15)
      ];

      setFocusData({
        totalFocusTime,
        sessionsCompleted,
        averageFocusScore,
        weeklyFocusTime,
        recentSessions: [
          { type: 'Deep Work', duration: 90, score: 92, date: 'Today' },
          { type: 'Creative Flow', duration: 60, score: 88, date: 'Yesterday' },
          { type: 'Learning', duration: 45, score: 85, date: '2 days ago' }
        ]
      });
    };

    calculateAnalytics();
  }, [boards]);

  const getProgressPercentage = (board) => {
    return Math.round((board.completed.size / board.days) * 100);
  };

  const maxDailyTime = Math.max(...analytics.dailyTimeSpent, 1);
  const maxFocusTime = Math.max(...focusData.weeklyFocusTime, 1);

  const handleTimeDataUpdate = (session) => {
    setFocusData(prev => ({
      ...prev,
      totalFocusTime: prev.totalFocusTime + (session.duration / 60),
      sessionsCompleted: prev.sessionsCompleted + 1,
      recentSessions: [session, ...prev.recentSessions.slice(0, 4)]
    }));
  };

  const renderOverviewSection = () => (
    <>
      {/* Advanced Analytics Section */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Advanced Analytics</h2>
      <div className="flex flex-wrap gap-4 px-4 py-6">
        {/* Habit Completion Rate Card */}
        <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#40474f] p-6">
          <p className="text-white text-base font-medium leading-normal">Habit Completion Rate</p>
          <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">{analytics.completionRate}%</p>
          <div className="flex gap-1">
            <p className="text-[#a2abb3] text-base font-normal leading-normal">Last 30 Days</p>
            <p className="text-[#0bda5b] text-base font-medium leading-normal">+{Math.max(0, analytics.completionRate - 80)}%</p>
          </div>
          <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
            <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                fill="url(#paint0_linear_1131_5935)"
              />
              <path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                stroke="#a2abb3"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2c3035" />
                  <stop offset="1" stopColor="#2c3035" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-around">
              <p className="text-[#a2abb3] text-[13px] font-bold leading-normal tracking-[0.015em]">Week 1</p>
              <p className="text-[#a2abb3] text-[13px] font-bold leading-normal tracking-[0.015em]">Week 2</p>
              <p className="text-[#a2abb3] text-[13px] font-bold leading-normal tracking-[0.015em]">Week 3</p>
              <p className="text-[#a2abb3] text-[13px] font-bold leading-normal tracking-[0.015em]">Week 4</p>
            </div>
          </div>
        </div>

        {/* Time Spent Card */}
        <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#40474f] p-6">
          <p className="text-white text-base font-medium leading-normal">Time Spent on Habits</p>
          <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">{analytics.totalTimeSpent} hours</p>
          <div className="flex gap-1">
            <p className="text-[#a2abb3] text-base font-normal leading-normal">This Week</p>
            <p className="text-[#0bda5b] text-base font-medium leading-normal">+10%</p>
          </div>
          <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
            {analytics.dailyTimeSpent.map((time, index) => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const height = maxDailyTime > 0 ? (time / maxDailyTime) * 100 : 0;
              return (
                <React.Fragment key={index}>
                  <div className="border-[#a2abb3] bg-[#2c3035] border-t-2 w-full" style={{height: `${Math.max(height, 10)}%`}} />
                  <p className="text-[#a2abb3] text-[13px] font-bold leading-normal tracking-[0.015em]">{days[index]}</p>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Data Button */}
      <div className="flex px-4 py-3 justify-end">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#2c3035] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#3a4047] transition-all">
          <span className="truncate">Export Data</span>
        </button>
      </div>

      {/* Time Tracking Section */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Time Tracking</h2>
      {boards.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <div className="text-[#a2abb3] text-lg">No habits to track yet</div>
          <div className="text-[#a2abb3] text-sm mt-2">Create your first habit to see time tracking data!</div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="flex overflow-hidden rounded-xl border border-[#40474f] bg-[#121416]">
            <table className="flex-1">
              <thead>
                <tr className="bg-[#1e2124]">
                  <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Habit</th>
                  <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Time Spent</th>
                  <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Goal</th>
                  <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Progress</th>
                </tr>
              </thead>
              <tbody>
                {boards.slice(0, 5).map((board, index) => {
                  const timeSpent = Math.round(board.completed.size * 0.5);
                  const goalTime = Math.round(board.days * 0.5);
                  const progress = getProgressPercentage(board);
                  
                  return (
                    <tr key={board.id} className="border-t border-t-[#40474f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                        {board.title}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">
                        {timeSpent} hours
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">
                        {goalTime} hours
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-sm font-normal leading-normal">
                        <div className="flex items-center gap-3">
                          <div className="w-[88px] overflow-hidden rounded-sm bg-[#40474f]">
                            <div className="h-1 rounded-full bg-white" style={{width: `${progress}%`}} />
                          </div>
                          <p className="text-white text-sm font-medium leading-normal">{progress}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Streak Analytics */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Streak Analytics</h2>
      <div className="flex flex-wrap gap-4 px-4 py-6">
        {analytics.streakData.slice(0, 3).map((streak, index) => (
          <div key={index} className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#40474f] p-6">
            <p className="text-white text-base font-medium leading-normal">{streak.name}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white tracking-light text-[24px] font-bold leading-tight">{streak.currentStreak} days</p>
                <p className="text-[#a2abb3] text-sm">Current Streak</p>
              </div>
              <div className="text-right">
                <p className="text-[#0bda5b] text-lg font-bold">{streak.longestStreak}</p>
                <p className="text-[#a2abb3] text-sm">Best</p>
              </div>
            </div>
            <div className="w-full bg-[#40474f] rounded-full h-2">
              <div className="bg-[#0bda5b] h-2 rounded-full" style={{width: `${streak.consistency}%`}} />
            </div>
            <p className="text-[#a2abb3] text-sm">{streak.consistency}% consistency</p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Pro Dashboard</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 px-4 mb-6">
              {[
                { id: 'overview', name: '📊 Overview', icon: '📊' },
                { id: 'focus', name: '🎯 Focus Hub', icon: '🎯' },
                { id: 'stacking', name: '🔗 Habit Stacking', icon: '🔗' },
                { id: 'analytics', name: '📈 Deep Analytics', icon: '📈' },
                { id: 'goals', name: '🏆 Goal Tracking', icon: '🏆' },
                { id: 'gamification', name: '🎮 Gamification', icon: '🎮' },
                { id: 'insights', name: '🧠 AI Insights', icon: '🧠' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === tab.id
                      ? 'bg-[#2c3035] text-white border border-[#40474f]'
                      : 'text-[#a2abb3] hover:text-white hover:bg-[#1e2124]'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            {activeSection === 'overview' && renderOverviewSection()}

            {activeSection === 'focus' && (
              <div className="px-4">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">🎯 Focus & Productivity Hub</h2>
                
                {/* Focus Stats Overview */}
                <div className="flex flex-wrap gap-4 py-6">
                  <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl border border-[#40474f] p-6">
                    <p className="text-white text-base font-medium leading-normal">Total Focus Time</p>
                    <p className="text-white tracking-light text-[32px] font-bold leading-tight">{focusData.totalFocusTime}h</p>
                    <p className="text-[#0bda5b] text-sm">+12% this week</p>
                  </div>
                  <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl border border-[#40474f] p-6">
                    <p className="text-white text-base font-medium leading-normal">Sessions Completed</p>
                    <p className="text-white tracking-light text-[32px] font-bold leading-tight">{focusData.sessionsCompleted}</p>
                    <p className="text-[#0bda5b] text-sm">+5 this week</p>
                  </div>
                  <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl border border-[#40474f] p-6">
                    <p className="text-white text-base font-medium leading-normal">Average Focus Score</p>
                    <p className="text-white tracking-light text-[32px] font-bold leading-tight">{focusData.averageFocusScore}%</p>
                    <p className="text-[#0bda5b] text-sm">Excellent focus!</p>
                  </div>
                </div>

                {/* Time Tracking System Integration */}
                <div className="rounded-xl border border-[#40474f] p-6 mb-6">
                  <TimeTrackingSystem
                    user={user}
                    boards={boards}
                    theme={theme}
                    futuristicMode={futuristicMode}
                    onUpdateTimeData={handleTimeDataUpdate}
                  />
                </div>

                {/* Recent Focus Sessions */}
                <div className="rounded-xl border border-[#40474f] p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Recent Focus Sessions</h3>
                  <div className="space-y-3">
                    {focusData.recentSessions.map((session, index) => (
                      <div key={index} className="flex justify-between items-center bg-[#1e2124] rounded-lg p-4">
                        <div>
                          <p className="text-white text-sm font-medium">{session.type}</p>
                          <p className="text-[#a2abb3] text-xs">{session.date} • {session.duration} minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#0bda5b] text-sm font-bold">{session.score}%</p>
                          <p className="text-[#a2abb3] text-xs">Focus Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'stacking' && (
              <div className="px-4">
                <HabitStackingSystem
                  user={user}
                  boards={boards}
                  onCreateHabitStack={(stack) => console.log('Created stack:', stack)}
                  theme={theme}
                  futuristicMode={futuristicMode}
                />
              </div>
            )}

            {activeSection === 'analytics' && (
              <div className="px-4">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Deep Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Habit Correlations */}
                  <div className="rounded-xl border border-[#40474f] p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Habit Correlations</h3>
                    <p className="text-[#a2abb3] text-sm">Discover which habits influence each other</p>
                    <div className="mt-4 space-y-3">
                      {boards.slice(0, 3).map((board, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-white text-sm">{board.title}</span>
                          <span className="text-[#0bda5b] text-sm">+{Math.floor(Math.random() * 20 + 10)}% boost</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Trends */}
                  <div className="rounded-xl border border-[#40474f] p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Performance Trends</h3>
                    <p className="text-[#a2abb3] text-sm">Your habit performance over time</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#a2abb3]">This Month</span>
                        <span className="text-[#0bda5b]">+15%</span>
                      </div>
                      <div className="w-full bg-[#40474f] rounded-full h-2">
                        <div className="bg-[#0bda5b] h-2 rounded-full" style={{width: '85%'}} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'goals' && (
              <div className="px-4">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Goal Tracking</h2>
                <div className="space-y-4">
                  {boards.map((board, index) => (
                    <div key={index} className="rounded-xl border border-[#40474f] p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white text-lg font-semibold">{board.title}</h3>
                          <p className="text-[#a2abb3] text-sm">Target: {board.days} days</p>
                        </div>
                        <span className="text-[#0bda5b] text-sm font-medium">{getProgressPercentage(board)}% complete</span>
                      </div>
                      <div className="w-full bg-[#40474f] rounded-full h-3">
                        <div className="bg-[#0bda5b] h-3 rounded-full" style={{width: `${getProgressPercentage(board)}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'gamification' && (
              <div className="px-4">
                <div className="flex min-w-72 flex-col gap-3 mb-6">
                  <p className="text-white tracking-light text-[32px] font-bold leading-tight">🎮 Gamification & Rewards</p>
                  <p className="text-[#a2abb3] text-sm font-normal leading-normal">
                    Celebrate your achievements and stay motivated with StreakMaster's gamification features. Earn badges, unlock rewards, and track your progress as you build lasting habits.
                  </p>
                </div>

                {/* Achievements Section */}
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Achievements</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 mb-8">
                  {[
                    {
                      title: "First Week Streak",
                      description: "Maintain a habit for one week",
                      earned: boards.some(board => board.completed.size >= 7),
                      icon: "🏆"
                    },
                    {
                      title: "100 Days of Consistency",
                      description: "Track habits for 100 consecutive days",
                      earned: boards.some(board => board.completed.size >= 100),
                      icon: "💯"
                    },
                    {
                      title: "Habit Master",
                      description: "Complete 10 habits",
                      earned: boards.filter(board => getProgressPercentage(board) === 100).length >= 10,
                      icon: "🎯"
                    },
                    {
                      title: "Productivity Pro",
                      description: "Achieve peak productivity for a month",
                      earned: analytics.completionRate >= 90,
                      icon: "⚡"
                    },
                    {
                      title: "Early Riser",
                      description: "Wake up early for 30 days",
                      earned: boards.some(board => board.title.toLowerCase().includes('morning') && board.completed.size >= 30),
                      icon: "🌅"
                    },
                    {
                      title: "Night Owl",
                      description: "Stay productive late into the night for a month",
                      earned: analytics.totalTimeSpent >= 100,
                      icon: "🦉"
                    }
                  ].map((achievement, index) => (
                    <div key={index} className="flex flex-col gap-3 pb-3">
                      <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-6xl ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-[#0bda5b] to-[#00af9b]' 
                          : 'bg-[#303030] grayscale opacity-50'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="text-white text-center">
                        <h3 className="text-lg font-semibold">{achievement.title}</h3>
                        <p className="text-[#a2abb3] text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* XP and Level Section */}
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">XP & Level</h2>
                <div className="flex flex-wrap gap-4 p-4">
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#2c3035]">
                    <p className="text-white text-base font-medium leading-normal">XP</p>
                    <p className="text-white tracking-light text-2xl font-bold leading-tight">{user.xp || 0}</p>
                  </div>
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#2c3035]">
                    <p className="text-white text-base font-medium leading-normal">Level</p>
                    <p className="text-white tracking-light text-2xl font-bold leading-tight">{user.level || 1}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'insights' && (
              <div className="px-4">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">AI Insights</h2>
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#40474f] p-6">
                    <h3 className="text-white text-lg font-semibold mb-3">🤖 Personalized Recommendations</h3>
                    <div className="space-y-3">
                      <div className="bg-[#1e2124] rounded-lg p-4">
                        <p className="text-white text-sm">💡 Your best performance day is Tuesday. Consider scheduling challenging habits then.</p>
                      </div>
                      <div className="bg-[#1e2124] rounded-lg p-4">
                        <p className="text-white text-sm">🎯 You're 23% more likely to complete habits when paired with morning routines.</p>
                      </div>
                      <div className="bg-[#1e2124] rounded-lg p-4">
                        <p className="text-white text-sm">⚡ Consider adding a 5-minute buffer between stacked habits for better success rates.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gamification Section - Always visible */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Gamification</h2>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#2c3035]">
                <p className="text-white text-base font-medium leading-normal">XP</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{user.xp || 0}</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#2c3035]">
                <p className="text-white text-base font-medium leading-normal">Level</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{user.level || 1}</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#2c3035]">
                <p className="text-white text-base font-medium leading-normal">Achievements</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{user.achievements?.length || 0}</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#2c3035]">
                <p className="text-white text-base font-medium leading-normal">Active Streaks</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{boards.length}</p>
              </div>
            </div>

            {/* Team Collaboration Section - Always visible */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Team Collaboration</h2>
            <div className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1">Team Habit Tracking</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal line-clamp-2">Track habits together and share progress</p>
              </div>
              <div className="shrink-0">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2c3035] text-white text-sm font-medium leading-normal w-fit hover:bg-[#3a4047] transition-all">
                  <span className="truncate">Manage</span>
                </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;
