import React, { useState, useEffect } from 'react';

// Gamification System - RPG-style progression
export default function GamificationSystem({ 
  user, 
  onUpdateUser, 
  theme, 
  futuristicMode,
  completedHabits = [],
  streakData = {}
}) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);

  // XP and Level Calculations
  const calculateLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;
  const getXPForNextLevel = (level) => Math.pow(level, 2) * 100;
  const getXPProgress = (xp) => {
    const currentLevel = calculateLevel(xp);
    const currentLevelXP = getXPForNextLevel(currentLevel - 1);
    const nextLevelXP = getXPForNextLevel(currentLevel);
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  // Achievement System
  const achievements = [
    { id: 'first_streak', name: 'First Steps', description: 'Complete your first habit', icon: '🎯', xp: 50 },
    { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', xp: 100 },
    { id: 'month_master', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '🏆', xp: 500 },
    { id: 'habit_collector', name: 'Habit Collector', description: 'Track 5 different habits', icon: '📚', xp: 200 },
    { id: 'consistency_king', name: 'Consistency King', description: 'Achieve 90% completion rate', icon: '👑', xp: 300 },
    { id: 'early_bird', name: 'Early Bird', description: 'Complete morning habits 10 times', icon: '🌅', xp: 150 },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete evening habits 10 times', icon: '🌙', xp: 150 },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Complete all habits for 7 days straight', icon: '💎', xp: 400 },
    { id: 'comeback_kid', name: 'Comeback Kid', description: 'Restart a habit after breaking a streak', icon: '🔄', xp: 100 },
    { id: 'social_butterfly', name: 'Social Butterfly', description: 'Add 3 habit buddies', icon: '🦋', xp: 200 }
  ];

  // Equipment System based on habit categories
  const equipment = {
    fitness: [
      { id: 'running_shoes', name: 'Running Shoes', level: 1, icon: '👟' },
      { id: 'gym_gear', name: 'Gym Gear', level: 5, icon: '🏋️' },
      { id: 'athlete_crown', name: 'Athlete Crown', level: 10, icon: '👑' }
    ],
    learning: [
      { id: 'study_glasses', name: 'Study Glasses', level: 1, icon: '🤓' },
      { id: 'wisdom_hat', name: 'Wisdom Hat', level: 5, icon: '🎓' },
      { id: 'scholar_robe', name: 'Scholar Robe', level: 10, icon: '👨‍🎓' }
    ],
    health: [
      { id: 'health_badge', name: 'Health Badge', level: 1, icon: '🏥' },
      { id: 'wellness_aura', name: 'Wellness Aura', level: 5, icon: '✨' },
      { id: 'vitality_crystal', name: 'Vitality Crystal', level: 10, icon: '💎' }
    ]
  };

  // Check for new achievements
  useEffect(() => {
    if (!user || !completedHabits.length) return;

    const newAchievs = [];
    achievements.forEach(achievement => {
      if (!user.achievements?.includes(achievement.id)) {
        let earned = false;

        switch (achievement.id) {
          case 'first_streak':
            earned = completedHabits.length > 0;
            break;
          case 'week_warrior':
            earned = Object.values(streakData).some(streak => streak >= 7);
            break;
          case 'month_master':
            earned = Object.values(streakData).some(streak => streak >= 30);
            break;
          case 'habit_collector':
            earned = Object.keys(streakData).length >= 5;
            break;
          // Add more achievement logic here
        }

        if (earned) {
          newAchievs.push(achievement);
        }
      }
    });

    if (newAchievs.length > 0) {
      setNewAchievements(newAchievs);
      // Award XP and update user
      const totalXP = newAchievs.reduce((sum, ach) => sum + ach.xp, 0);
      const oldLevel = calculateLevel(user.xp || 0);
      const newXP = (user.xp || 0) + totalXP;
      const newLevel = calculateLevel(newXP);
      
      onUpdateUser({
        ...user,
        xp: newXP,
        level: newLevel,
        achievements: [...(user.achievements || []), ...newAchievs.map(a => a.id)]
      });

      if (newLevel > oldLevel) {
        setShowLevelUp(true);
      }
    }
  }, [completedHabits, streakData, user]);

  const currentLevel = calculateLevel(user?.xp || 0);
  const xpProgress = getXPProgress(user?.xp || 0);

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
            width: '60px',
            height: '60px',
            background: futuristicMode 
              ? 'linear-gradient(135deg, var(--accent), var(--success))'
              : 'var(--accent)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: futuristicMode ? '0 0 30px rgba(255, 161, 22, 0.4)' : 'none'
          }}>
            🎮
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--fg)'
            }}>
              Level {currentLevel} Hero
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--fg-soft)',
              marginTop: '4px'
            }}>
              {user?.xp || 0} XP • {achievements.filter(a => user?.achievements?.includes(a.id)).length} Achievements
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{
          marginBottom: '24px'
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
              Experience Progress
            </span>
            <span style={{
              fontSize: '12px',
              color: 'var(--fg-soft)'
            }}>
              {Math.round(xpProgress)}% to Level {currentLevel + 1}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '12px',
            background: 'var(--border)',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${xpProgress}%`,
              height: '100%',
              background: futuristicMode 
                ? 'linear-gradient(90deg, var(--success), var(--accent))'
                : 'var(--success)',
              borderRadius: '6px',
              transition: 'width 0.5s ease',
              boxShadow: futuristicMode ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
            }} />
            {futuristicMode && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'progress-shine 2s ease-in-out infinite'
              }} />
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          {achievements.slice(0, 6).map((achievement) => {
            const isUnlocked = user?.achievements?.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                style={{
                  padding: '16px',
                  background: isUnlocked 
                    ? (futuristicMode 
                        ? 'linear-gradient(135deg, var(--success), #16a34a)'
                        : 'var(--success)')
                    : 'var(--bg-alt)',
                  border: isUnlocked 
                    ? 'none'
                    : '1px solid var(--border)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  opacity: isUnlocked ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: isUnlocked && futuristicMode 
                    ? '0 0 20px rgba(34, 197, 94, 0.3)'
                    : 'none'
                }}
                title={achievement.description}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  {achievement.icon}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: isUnlocked ? '#ffffff' : 'var(--fg)',
                  lineHeight: '1.2'
                }}>
                  {achievement.name}
                </div>
                {isUnlocked && (
                  <div style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '4px'
                  }}>
                    +{achievement.xp} XP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Up Modal */}
      {showLevelUp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: futuristicMode 
              ? 'linear-gradient(135deg, var(--card), rgba(255, 161, 22, 0.1))'
              : 'var(--card)',
            border: futuristicMode 
              ? '2px solid var(--accent)'
              : '1px solid var(--border)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px',
            animation: 'levelUpPulse 0.6s ease',
            boxShadow: futuristicMode 
              ? '0 0 50px rgba(255, 161, 22, 0.5)'
              : '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              fontSize: '60px',
              marginBottom: '16px',
              animation: 'bounce 1s ease infinite'
            }}>
              🎉
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              background: futuristicMode 
                ? 'linear-gradient(135deg, var(--accent), var(--success))'
                : 'var(--fg)',
              backgroundClip: futuristicMode ? 'text' : 'initial',
              WebkitBackgroundClip: futuristicMode ? 'text' : 'initial',
              color: futuristicMode ? 'transparent' : 'var(--fg)',
              marginBottom: '8px'
            }}>
              LEVEL UP!
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--fg-soft)',
              marginBottom: '24px'
            }}>
              You've reached Level {currentLevel}!
            </p>
            <button
              onClick={() => setShowLevelUp(false)}
              style={{
                padding: '12px 24px',
                background: futuristicMode 
                  ? 'linear-gradient(135deg, var(--accent), var(--success))'
                  : 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: futuristicMode 
                  ? '0 0 20px rgba(255, 161, 22, 0.4)'
                  : 'none'
              }}
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
