import React, { useState } from 'react';

const HabitsPage = ({ 
  boards, 
  onCreateBoard, 
  onDeleteBoard, 
  theme, 
  futuristicMode,
  accentColor 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

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

  // Calculate real category counts from user's boards
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return boards.length;
    return boards.filter(board =>
      board.category && board.category.toLowerCase() === categoryId
    ).length;
  };

  const categories = [
    { id: 'all', name: 'All Habits', icon: '📋', count: boards.length },
    { id: 'health', name: 'Health & Fitness', icon: '💪', count: getCategoryCount('health') },
    { id: 'learning', name: 'Learning', icon: '🧠', count: getCategoryCount('learning') },
    { id: 'creative', name: 'Creative', icon: '🎨', count: getCategoryCount('creative') },
    { id: 'productivity', name: 'Productivity', icon: '💼', count: getCategoryCount('productivity') }
  ];

  const habitTemplates = [
    {
      category: 'health',
      title: 'Daily Exercise',
      description: 'Build physical strength and endurance',
      icon: '💪',
      difficulty: 'medium',
      duration: 30,
      tips: ['Start with 15 minutes', 'Track your workouts', 'Rest on weekends']
    },
    {
      category: 'health',
      title: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      icon: '💧',
      difficulty: 'easy',
      duration: 21,
      tips: ['Use a water bottle', 'Set hourly reminders', 'Track intake']
    },
    {
      category: 'learning',
      title: 'Read for 30 Minutes',
      description: 'Expand knowledge through daily reading',
      icon: '📚',
      difficulty: 'easy',
      duration: 66,
      tips: ['Choose interesting books', 'Read before bed', 'Take notes']
    },
    {
      category: 'learning',
      title: 'Practice Coding',
      description: 'Improve programming skills daily',
      icon: '💻',
      difficulty: 'hard',
      duration: 100,
      tips: ['Start with small projects', 'Use coding platforms', 'Join communities']
    },
    {
      category: 'creative',
      title: 'Daily Journaling',
      description: 'Reflect and express thoughts in writing',
      icon: '📝',
      difficulty: 'easy',
      duration: 30,
      tips: ['Write 3 pages', 'Be honest', 'No editing while writing']
    },
    {
      category: 'creative',
      title: 'Practice Art',
      description: 'Develop artistic skills through daily practice',
      icon: '🎨',
      difficulty: 'medium',
      duration: 60,
      tips: ['Try different mediums', 'Study masters', 'Share your work']
    },
    {
      category: 'productivity',
      title: 'Meditation',
      description: 'Cultivate mindfulness and inner peace',
      icon: '🧘',
      difficulty: 'medium',
      duration: 21,
      tips: ['Start with 5 minutes', 'Use guided apps', 'Be consistent']
    },
    {
      category: 'productivity',
      title: 'Plan Tomorrow',
      description: 'Prepare for the next day every evening',
      icon: '📅',
      difficulty: 'easy',
      duration: 30,
      tips: ['Review goals', 'Set priorities', 'Prepare materials']
    }
  ];

  const filteredTemplates = habitTemplates.filter(template => 
    filterCategory === 'all' || template.category === filterCategory
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'hard': return 'var(--error)';
      default: return 'var(--fg-soft)';
    }
  };

  const createHabitFromTemplate = (template) => {
    onCreateBoard({
      title: template.title,
      days: template.duration,
      category: template.category,
      icon: template.icon,
      difficulty: template.difficulty
    });
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
            🎯 Habit Library
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--fg-soft)',
            margin: '0 0 24px 0'
          }}>
            Discover proven habits and build your perfect routine
          </p>
          
          {/* Search and Filters */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-alt)',
                color: 'var(--fg)',
                fontSize: '14px'
              }}
            />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-alt)',
                color: 'var(--fg)',
                fontSize: '14px'
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="difficulty">By Difficulty</option>
              <option value="duration">By Duration</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Categories Sidebar */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'var(--fg)'
          }}>
            Categories
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: filterCategory === category.id ? 'var(--accent)' : 'var(--card)',
                  color: filterCategory === category.id ? '#ffffff' : 'var(--fg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{category.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{category.name}</span>
                </div>
                <span style={{
                  fontSize: '12px',
                  background: filterCategory === category.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-alt)',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Habit Templates Grid */}
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {filteredTemplates.map((template, index) => (
              <div
                key={index}
                style={{
                  background: futuristicMode 
                    ? `linear-gradient(135deg, var(--card), ${getDifficultyColor(template.difficulty)}10)`
                    : 'var(--card)',
                  border: futuristicMode 
                    ? `1px solid ${getDifficultyColor(template.difficulty)}30`
                    : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => createHabitFromTemplate(template)}
              >
                {futuristicMode && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, transparent, ${getDifficultyColor(template.difficulty)}08, transparent)`,
                    animation: 'cyber-scan 4s ease-in-out infinite',
                    animationDelay: `${index * 0.2}s`
                  }} />
                )}
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      background: getDifficultyColor(template.difficulty),
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {template.icon}
                    </div>
                    
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: `${getDifficultyColor(template.difficulty)}20`,
                      color: getDifficultyColor(template.difficulty),
                      border: `1px solid ${getDifficultyColor(template.difficulty)}40`
                    }}>
                      {template.difficulty.toUpperCase()}
                    </div>
                  </div>
                  
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: 'var(--fg)'
                  }}>
                    {template.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--fg-soft)',
                    margin: '0 0 16px 0',
                    lineHeight: '1.4'
                  }}>
                    {template.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--fg-soft)'
                    }}>
                      📅 {template.duration} days
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--success)'
                    }}>
                      ⭐ 4.8/5 rating
                    </span>
                  </div>
                  
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '16px'
                  }}>
                    <h4 style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: 'var(--fg)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Pro Tips
                    </h4>
                    <ul style={{
                      margin: 0,
                      padding: '0 0 0 16px',
                      fontSize: '12px',
                      color: 'var(--fg-soft)',
                      lineHeight: '1.4'
                    }}>
                      {template.tips.slice(0, 2).map((tip, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
