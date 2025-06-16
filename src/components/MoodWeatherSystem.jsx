import React, { useState, useEffect } from 'react';

// Mood & Weather Tracking System
export default function MoodWeatherSystem({ 
  user, 
  boards = [], 
  theme, 
  futuristicMode,
  onUpdateMoodData,
  onUpdateWeatherData
}) {
  const [activeTab, setActiveTab] = useState('mood-tracker');
  const [todayMood, setTodayMood] = useState(null);
  const [todayWeather, setTodayWeather] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [moodNotes, setMoodNotes] = useState('');
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Mood options with detailed tracking
  const moodOptions = [
    { id: 'amazing', name: 'Amazing', emoji: '🤩', value: 5, color: '#10b981', description: 'Feeling fantastic and energized' },
    { id: 'great', name: 'Great', emoji: '😊', value: 4, color: '#22c55e', description: 'Very positive and motivated' },
    { id: 'good', name: 'Good', emoji: '🙂', value: 3, color: '#84cc16', description: 'Generally positive mood' },
    { id: 'okay', name: 'Okay', emoji: '😐', value: 2, color: '#f59e0b', description: 'Neutral, neither good nor bad' },
    { id: 'meh', name: 'Meh', emoji: '😕', value: 1, color: '#ef4444', description: 'Slightly down or unmotivated' },
    { id: 'bad', name: 'Bad', emoji: '😞', value: 0, color: '#dc2626', description: 'Feeling low or stressed' }
  ];

  // Weather conditions
  const weatherOptions = [
    { id: 'sunny', name: 'Sunny', emoji: '☀️', description: 'Clear and bright' },
    { id: 'partly-cloudy', name: 'Partly Cloudy', emoji: '⛅', description: 'Some clouds, mostly clear' },
    { id: 'cloudy', name: 'Cloudy', emoji: '☁️', description: 'Overcast skies' },
    { id: 'rainy', name: 'Rainy', emoji: '🌧️', description: 'Light to moderate rain' },
    { id: 'stormy', name: 'Stormy', emoji: '⛈️', description: 'Heavy rain with thunder' },
    { id: 'snowy', name: 'Snowy', emoji: '❄️', description: 'Snow falling' },
    { id: 'foggy', name: 'Foggy', emoji: '🌫️', description: 'Low visibility fog' },
    { id: 'windy', name: 'Windy', emoji: '💨', description: 'Strong winds' }
  ];

  // Energy levels
  const energyLevels = [
    { id: 'exhausted', name: 'Exhausted', emoji: '😴', value: 0, color: '#dc2626' },
    { id: 'low', name: 'Low Energy', emoji: '😪', value: 1, color: '#ef4444' },
    { id: 'moderate', name: 'Moderate', emoji: '😌', value: 2, color: '#f59e0b' },
    { id: 'good', name: 'Good Energy', emoji: '😊', value: 3, color: '#22c55e' },
    { id: 'high', name: 'High Energy', emoji: '⚡', value: 4, color: '#10b981' }
  ];

  // Stress levels
  const stressLevels = [
    { id: 'none', name: 'No Stress', emoji: '😌', value: 0, color: '#10b981' },
    { id: 'low', name: 'Low Stress', emoji: '🙂', value: 1, color: '#22c55e' },
    { id: 'moderate', name: 'Moderate', emoji: '😐', value: 2, color: '#f59e0b' },
    { id: 'high', name: 'High Stress', emoji: '😰', value: 3, color: '#ef4444' },
    { id: 'overwhelming', name: 'Overwhelming', emoji: '😵', value: 4, color: '#dc2626' }
  ];

  // Load today's data
  useEffect(() => {
    const today = new Date().toDateString();
    const savedMoodData = localStorage.getItem('streakmaster-mood-data');
    const savedWeatherData = localStorage.getItem('streakmaster-weather-data');

    if (savedMoodData) {
      const moodData = JSON.parse(savedMoodData);
      setMoodHistory(moodData);
      const todayEntry = moodData.find(entry => entry.date === today);
      if (todayEntry) {
        setTodayMood(todayEntry);
      }
    }

    if (savedWeatherData) {
      const weatherData = JSON.parse(savedWeatherData);
      setWeatherHistory(weatherData);
      const todayEntry = weatherData.find(entry => entry.date === today);
      if (todayEntry) {
        setTodayWeather(todayEntry);
      }
    }
  }, []);

  // Save mood entry
  const saveMoodEntry = (mood, energy, stress, notes) => {
    const today = new Date().toDateString();
    const entry = {
      date: today,
      timestamp: new Date().toISOString(),
      mood: mood.id,
      moodValue: mood.value,
      energy: energy.id,
      energyValue: energy.value,
      stress: stress.id,
      stressValue: stress.value,
      notes: notes || '',
      habitCompletions: boards.reduce((sum, board) => sum + board.completed.size, 0)
    };

    const updatedHistory = moodHistory.filter(h => h.date !== today);
    updatedHistory.push(entry);
    
    setMoodHistory(updatedHistory);
    setTodayMood(entry);
    localStorage.setItem('streakmaster-mood-data', JSON.stringify(updatedHistory));
    onUpdateMoodData?.(updatedHistory);
  };

  // Save weather entry
  const saveWeatherEntry = (weather, temperature, notes) => {
    const today = new Date().toDateString();
    const entry = {
      date: today,
      timestamp: new Date().toISOString(),
      weather: weather.id,
      temperature: temperature || null,
      notes: notes || ''
    };

    const updatedHistory = weatherHistory.filter(h => h.date !== today);
    updatedHistory.push(entry);
    
    setWeatherHistory(updatedHistory);
    setTodayWeather(entry);
    localStorage.setItem('streakmaster-weather-data', JSON.stringify(updatedHistory));
    onUpdateWeatherData?.(updatedHistory);
  };

  // Calculate mood statistics
  const calculateMoodStats = () => {
    if (moodHistory.length === 0) return null;

    const last7Days = moodHistory.slice(-7);
    const last30Days = moodHistory.slice(-30);

    const avgMood7d = last7Days.reduce((sum, entry) => sum + entry.moodValue, 0) / last7Days.length;
    const avgMood30d = last30Days.reduce((sum, entry) => sum + entry.moodValue, 0) / last30Days.length;
    const avgEnergy7d = last7Days.reduce((sum, entry) => sum + entry.energyValue, 0) / last7Days.length;
    const avgStress7d = last7Days.reduce((sum, entry) => sum + entry.stressValue, 0) / last7Days.length;

    return {
      avgMood7d: avgMood7d.toFixed(1),
      avgMood30d: avgMood30d.toFixed(1),
      avgEnergy7d: avgEnergy7d.toFixed(1),
      avgStress7d: avgStress7d.toFixed(1),
      totalEntries: moodHistory.length,
      streak: calculateMoodStreak()
    };
  };

  const calculateMoodStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const entry = moodHistory.find(h => h.date === dateString);
      if (entry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Analyze mood-habit correlations
  const analyzeMoodHabitCorrelation = () => {
    if (moodHistory.length < 7) return null;

    const correlations = [];
    
    // Group by mood levels
    const highMoodDays = moodHistory.filter(h => h.moodValue >= 4);
    const lowMoodDays = moodHistory.filter(h => h.moodValue <= 2);

    if (highMoodDays.length > 0 && lowMoodDays.length > 0) {
      const avgCompletionsHigh = highMoodDays.reduce((sum, h) => sum + h.habitCompletions, 0) / highMoodDays.length;
      const avgCompletionsLow = lowMoodDays.reduce((sum, h) => sum + h.habitCompletions, 0) / lowMoodDays.length;
      
      correlations.push({
        type: 'Mood vs Habit Completion',
        insight: avgCompletionsHigh > avgCompletionsLow 
          ? `You complete ${(avgCompletionsHigh - avgCompletionsLow).toFixed(1)} more habits on high-mood days`
          : `You complete ${(avgCompletionsLow - avgCompletionsHigh).toFixed(1)} more habits on low-mood days`,
        recommendation: avgCompletionsHigh > avgCompletionsLow
          ? 'Focus on mood-boosting activities to improve habit consistency'
          : 'Your habits might be helping improve your mood - keep it up!'
      });
    }

    return correlations;
  };

  const tabs = [
    { id: 'mood-tracker', name: 'Mood Tracker', icon: '😊' },
    { id: 'weather-log', name: 'Weather Log', icon: '🌤️' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'correlations', name: 'Insights', icon: '🔍' }
  ];

  const moodStats = calculateMoodStats();
  const correlations = analyzeMoodHabitCorrelation();

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
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : '#f59e0b',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: futuristicMode ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none'
          }}>
            🌈
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--fg)'
            }}>
              Mood & Weather Tracker
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--fg-soft)',
              marginTop: '2px'
            }}>
              Track your emotional state and environmental factors
            </p>
          </div>
        </div>

        {/* Today's Quick Status */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            background: futuristicMode 
              ? 'linear-gradient(135deg, var(--bg-alt), rgba(245, 158, 11, 0.02))'
              : 'var(--bg-alt)',
            border: futuristicMode 
              ? '1px solid rgba(245, 158, 11, 0.2)'
              : '1px solid var(--border)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '8px'
            }}>
              {todayMood ? moodOptions.find(m => m.id === todayMood.mood)?.emoji : '❓'}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '4px'
            }}>
              Today's Mood
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--fg-soft)'
            }}>
              {todayMood ? moodOptions.find(m => m.id === todayMood.mood)?.name : 'Not logged yet'}
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: futuristicMode 
              ? 'linear-gradient(135deg, var(--bg-alt), rgba(245, 158, 11, 0.02))'
              : 'var(--bg-alt)',
            border: futuristicMode 
              ? '1px solid rgba(245, 158, 11, 0.2)'
              : '1px solid var(--border)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '8px'
            }}>
              {todayWeather ? weatherOptions.find(w => w.id === todayWeather.weather)?.emoji : '❓'}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--fg)',
              marginBottom: '4px'
            }}>
              Today's Weather
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--fg-soft)'
            }}>
              {todayWeather ? weatherOptions.find(w => w.id === todayWeather.weather)?.name : 'Not logged yet'}
            </div>
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
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : '#f59e0b')
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
                  ? '0 0 15px rgba(245, 158, 11, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'mood-tracker' && (
          <div>
            {!todayMood ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px dashed var(--border)',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>😊</div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  How are you feeling today?
                </h4>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  Track your mood to understand patterns and improve your well-being.
                </p>
                <button
                  onClick={() => setShowMoodModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : '#f59e0b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Log Today's Mood
                </button>
              </div>
            ) : (
              <div style={{
                padding: '20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--fg)'
                  }}>
                    Today's Mood Entry
                  </h4>
                  <button
                    onClick={() => setShowMoodModal(true)}
                    style={{
                      padding: '6px 12px',
                      background: 'transparent',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '4px'
                    }}>
                      {moodOptions.find(m => m.id === todayMood.mood)?.emoji}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--fg)'
                    }}>
                      Mood: {moodOptions.find(m => m.id === todayMood.mood)?.name}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '4px'
                    }}>
                      {energyLevels.find(e => e.id === todayMood.energy)?.emoji}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--fg)'
                    }}>
                      Energy: {energyLevels.find(e => e.id === todayMood.energy)?.name}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '4px'
                    }}>
                      {stressLevels.find(s => s.id === todayMood.stress)?.emoji}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--fg)'
                    }}>
                      Stress: {stressLevels.find(s => s.id === todayMood.stress)?.name}
                    </div>
                  </div>
                </div>

                {todayMood.notes && (
                  <div style={{
                    padding: '12px',
                    background: 'var(--card)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--fg-soft)',
                    fontStyle: 'italic'
                  }}>
                    "{todayMood.notes}"
                  </div>
                )}
              </div>
            )}

            {/* Recent Mood History */}
            {moodHistory.length > 0 && (
              <div>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  Recent Mood History
                </h4>
                <div style={{
                  display: 'grid',
                  gap: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {moodHistory.slice(-7).reverse().map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        background: 'var(--bg-alt)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
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
                          fontSize: '24px'
                        }}>
                          {moodOptions.find(m => m.id === entry.mood)?.emoji}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--fg)'
                          }}>
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'var(--fg-soft)'
                          }}>
                            {moodOptions.find(m => m.id === entry.mood)?.name} • 
                            Energy: {energyLevels.find(e => e.id === entry.energy)?.name} • 
                            Stress: {stressLevels.find(s => s.id === entry.stress)?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'weather-log' && (
          <div>
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px dashed var(--border)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌤️</div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Weather Logging Coming Soon!
              </h4>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--fg-soft)'
              }}>
                Track weather conditions and see how they affect your habits and mood.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && moodStats && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Mood Analytics
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: '7-Day Avg Mood', value: moodStats.avgMood7d, icon: '😊', color: '#f59e0b' },
                { label: '30-Day Avg Mood', value: moodStats.avgMood30d, icon: '📊', color: '#8b5cf6' },
                { label: 'Avg Energy', value: moodStats.avgEnergy7d, icon: '⚡', color: '#10b981' },
                { label: 'Avg Stress', value: moodStats.avgStress7d, icon: '😰', color: '#ef4444' },
                { label: 'Tracking Streak', value: `${moodStats.streak} days`, icon: '🔥', color: '#f59e0b' },
                { label: 'Total Entries', value: moodStats.totalEntries, icon: '📝', color: '#3b82f6' }
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: 'var(--bg-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: '24px',
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

            {/* Mood Trend Chart Placeholder */}
            <div style={{
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h5 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Mood Trends Over Time
              </h5>
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-soft)',
                fontSize: '14px'
              }}>
                📈 Advanced mood trend charts coming soon!
              </div>
            </div>
          </div>
        )}

        {activeTab === 'correlations' && (
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              Mood & Habit Insights
            </h4>

            {correlations && correlations.length > 0 ? (
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {correlations.map((correlation, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        fontSize: '24px'
                      }}>
                        🔍
                      </div>
                      <h5 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--fg)'
                      }}>
                        {correlation.type}
                      </h5>
                    </div>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      color: 'var(--fg-soft)',
                      lineHeight: '1.4'
                    }}>
                      {correlation.insight}
                    </p>
                    <div style={{
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#3b82f6',
                      fontWeight: '500'
                    }}>
                      💡 <strong>Recommendation:</strong> {correlation.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  Building Insights
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  Track your mood for at least 7 days to see correlations with your habits.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mood Entry Modal */}
      {showMoodModal && (
        <MoodEntryModal
          moodOptions={moodOptions}
          energyLevels={energyLevels}
          stressLevels={stressLevels}
          currentMood={todayMood}
          onSave={saveMoodEntry}
          onClose={() => setShowMoodModal(false)}
          futuristicMode={futuristicMode}
        />
      )}
    </div>
  );
}

// Mood Entry Modal Component
function MoodEntryModal({
  moodOptions,
  energyLevels,
  stressLevels,
  currentMood,
  onSave,
  onClose,
  futuristicMode
}) {
  const [selectedMood, setSelectedMood] = useState(
    currentMood ? moodOptions.find(m => m.id === currentMood.mood) : null
  );
  const [selectedEnergy, setSelectedEnergy] = useState(
    currentMood ? energyLevels.find(e => e.id === currentMood.energy) : null
  );
  const [selectedStress, setSelectedStress] = useState(
    currentMood ? stressLevels.find(s => s.id === currentMood.stress) : null
  );
  const [notes, setNotes] = useState(currentMood?.notes || '');

  const handleSave = () => {
    if (selectedMood && selectedEnergy && selectedStress) {
      onSave(selectedMood, selectedEnergy, selectedStress, notes);
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
          ? 'linear-gradient(135deg, var(--card), rgba(245, 158, 11, 0.05))'
          : 'var(--card)',
        border: futuristicMode
          ? '1px solid rgba(245, 158, 11, 0.3)'
          : '1px solid var(--border)',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
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
            Log Your Mood
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

        {/* Mood Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--fg)',
            marginBottom: '12px'
          }}>
            How are you feeling?
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                style={{
                  padding: '12px',
                  background: selectedMood?.id === mood.id
                    ? mood.color
                    : 'var(--bg-alt)',
                  color: selectedMood?.id === mood.id ? '#ffffff' : 'var(--fg)',
                  border: selectedMood?.id === mood.id
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
                <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--fg)',
            marginBottom: '12px'
          }}>
            Energy Level
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px'
          }}>
            {energyLevels.map((energy) => (
              <button
                key={energy.id}
                onClick={() => setSelectedEnergy(energy)}
                style={{
                  padding: '12px 8px',
                  background: selectedEnergy?.id === energy.id
                    ? energy.color
                    : 'var(--bg-alt)',
                  color: selectedEnergy?.id === energy.id ? '#ffffff' : 'var(--fg)',
                  border: selectedEnergy?.id === energy.id
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
                <span style={{ fontSize: '16px' }}>{energy.emoji}</span>
                <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>
                  {energy.name.replace(' Energy', '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--fg)',
            marginBottom: '12px'
          }}>
            Stress Level
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px'
          }}>
            {stressLevels.map((stress) => (
              <button
                key={stress.id}
                onClick={() => setSelectedStress(stress)}
                style={{
                  padding: '12px 8px',
                  background: selectedStress?.id === stress.id
                    ? stress.color
                    : 'var(--bg-alt)',
                  color: selectedStress?.id === stress.id ? '#ffffff' : 'var(--fg)',
                  border: selectedStress?.id === stress.id
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
                <span style={{ fontSize: '16px' }}>{stress.emoji}</span>
                <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>
                  {stress.name.replace(' Stress', '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--fg)',
            marginBottom: '12px'
          }}>
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind? Any specific reasons for your mood today?"
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

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
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
            onClick={handleSave}
            disabled={!selectedMood || !selectedEnergy || !selectedStress}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: selectedMood && selectedEnergy && selectedStress
                ? (futuristicMode
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : '#f59e0b')
                : 'var(--border)',
              color: selectedMood && selectedEnergy && selectedStress ? '#ffffff' : 'var(--fg-soft)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: selectedMood && selectedEnergy && selectedStress ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Save Mood Entry
          </button>
        </div>
      </div>
    </div>
  );
}
