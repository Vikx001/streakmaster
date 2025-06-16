import React, { useState } from 'react';

export default function ManualPage({ theme, futuristicMode }) {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: '🚀',
      content: {
        overview: 'Welcome to StreakMaster - the ultimate habit tracking application!',
        steps: [
          'Create your first streak using the prominent "Create New Streak" button in the sidebar',
          'Choose your habit name, duration, start date, and visual preferences',
          'Click on any day in your streak calendar to add details',
          'Set difficulty levels and add notes to track your progress',
          'Watch your streaks grow and analyze your patterns over time'
        ]
      }
    },
    {
      id: 'creating-streaks',
      title: '✨ Creating Streaks',
      icon: '✨',
      content: {
        overview: 'Learn how to create powerful habit streaks that will transform your life.',
        steps: [
          'Click the "Create New Streak" button at the top of the sidebar',
          'Enter a descriptive name for your habit (e.g., "Daily Exercise", "Reading")',
          'Use the suggestion buttons for quick habit selection',
          'Set the duration (how many days you want to track)',
          'Choose your start date (defaults to today)',
          'Select weekdays-only if you want to skip weekends',
          'Pick your preferred layout: Week View, Month View, or Grid View',
          'Choose cell shape: Square, Rounded, or Circle',
          'Click "Create Streak" to start your journey!'
        ]
      }
    },
    {
      id: 'day-tracking',
      title: '📅 Day-by-Day Tracking',
      icon: '📅',
      content: {
        overview: 'Master the art of detailed daily tracking with our advanced day detail system.',
        steps: [
          'Click on any day dot in your streak calendar to open the Day Detail Modal',
          'View the date and current completion status',
          'Set the difficulty level: Easy 😊, Medium 😐, Hard 😤, or Extreme 🔥',
          'Add detailed notes about your experience, challenges, or wins',
          'Use the completion toggle to mark days complete or incomplete',
          'Click "Save Details" to store everything permanently',
          'Return anytime to view or edit your saved notes and difficulty levels'
        ]
      }
    },
    {
      id: 'difficulty-system',
      title: '🎯 Difficulty Levels',
      icon: '🎯',
      content: {
        overview: 'Track not just completion, but how challenging each day was.',
        steps: [
          'Easy 😊 (Green) - The habit felt natural and effortless',
          'Medium 😐 (Orange) - Required some effort but manageable',
          'Hard 😤 (Red) - Challenging day that required significant willpower',
          'Extreme 🔥 (Purple) - Extremely difficult, pushed through major obstacles',
          'Difficulty levels help you identify patterns and optimize your approach',
          'Use analytics to see which days are typically harder',
          'Adjust your strategy based on difficulty trends'
        ]
      }
    },
    {
      id: 'notes-system',
      title: '📝 Notes & Journaling',
      icon: '📝',
      content: {
        overview: 'Capture the story behind your streaks with detailed daily notes.',
        steps: [
          'Click any day to open the note-taking interface',
          'Write about your experience: what went well, what was challenging',
          'Record specific details: time of day, location, mood, circumstances',
          'Note any obstacles you overcame or strategies that worked',
          'Track external factors that affected your performance',
          'Use notes to identify patterns and improve future performance',
          'Export your notes along with streak data for external analysis'
        ]
      }
    },
    {
      id: 'analytics',
      title: '📊 Analytics & Insights',
      icon: '📊',
      content: {
        overview: 'Gain deep insights into your habits with AI-powered analytics.',
        steps: [
          'View your Consistency Score - AI-calculated reliability index',
          'Check AI Streak Prediction for future performance forecasting',
          'Analyze Performance Insights for behavioral pattern analysis',
          'Monitor Weekly Average, Longest Streak, and Success Rate',
          'Use the advanced metrics dashboard for detailed statistics',
          'Enable Futuristic Mode for enhanced visual analytics',
          'Track multiple time periods: 7D, 30D, 90D, or All time'
        ]
      }
    },
    {
      id: 'diary-reminders',
      title: '📔 Diary & Reminders',
      icon: '📔',
      content: {
        overview: 'Enhance your habit tracking with diary keeping and smart reminders.',
        steps: [
          'Access the Diary page to write daily reflections',
          'Set mood, weather, and tags for comprehensive tracking',
          'Use the Reminders page to never miss important habits',
          'Create reminders for habit starts, goals, and important tasks',
          'Set priority levels and recurring schedules',
          'Watch for notification icons in the header when reminders are due',
          'Export diary entries and manage reminder templates'
        ]
      }
    },
    {
      id: 'futuristic-mode',
      title: '🛸 Futuristic Mode',
      icon: '🛸',
      content: {
        overview: 'Unlock the full sci-fi potential of StreakMaster with advanced visual effects.',
        steps: [
          'Enable Futuristic Mode in Settings for enhanced visual experience',
          'Experience cyber-scan animations across all interfaces',
          'Enjoy holographic effects on streak calendars and modals',
          'See gradient backgrounds and glowing borders throughout the app',
          'Watch particle animations when completing streaks',
          'Hear sci-fi sound effects for interactions (if enabled)',
          'Access enhanced analytics with AI-powered visual indicators',
          'Use different themes: Matrix, Cyberpunk, Hologram, Plasma, and more'
        ]
      }
    },
    {
      id: 'themes-customization',
      title: '🎨 Themes & Customization',
      icon: '🎨',
      content: {
        overview: 'Personalize your StreakMaster experience with themes and visual options.',
        steps: [
          'Choose between Light and Dark themes in Settings',
          'Select from multiple streak color themes: GitHub, Ocean, Sunset, Forest, Purple',
          'Try futuristic themes: Neon, Cyberpunk, Matrix, Hologram, Plasma, Quantum',
          'Customize streak cell shapes: Square, Rounded, or Circle',
          'Pick different layout styles: Week View, Month View, or Grid View',
          'Enable or disable animations and sound effects',
          'Adjust visual preferences for optimal viewing experience'
        ]
      }
    },
    {
      id: 'data-export',
      title: '📤 Data Export & Backup',
      icon: '📤',
      content: {
        overview: 'Keep your data safe and analyze it externally with powerful export features.',
        steps: [
          'Export individual streaks as CSV files with complete data',
          'Download streak calendars as high-quality PNG images',
          'Export diary entries with mood, weather, and tag data',
          'Backup all your streaks, notes, and difficulty levels',
          'Import data into spreadsheet applications for advanced analysis',
          'Share your progress with coaches, friends, or accountability partners',
          'Create reports for personal review and goal setting'
        ]
      }
    },
    {
      id: 'tips-best-practices',
      title: '💡 Tips & Best Practices',
      icon: '💡',
      content: {
        overview: 'Master the art of habit building with proven strategies and expert tips.',
        steps: [
          'Start small: Begin with easy, achievable daily goals',
          'Be consistent: Aim for daily completion rather than perfection',
          'Use difficulty tracking to identify patterns and optimize timing',
          'Write detailed notes to understand what works and what doesn\'t',
          'Set realistic durations: 30-90 days for most habits',
          'Use weekdays-only mode for work-related habits',
          'Review your analytics weekly to spot trends and adjust strategies',
          'Celebrate milestones and use the freeze feature sparingly',
          'Stack habits: Link new habits to existing routines',
          'Use reminders strategically to build automatic behaviors'
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: '🔧 Troubleshooting',
      icon: '🔧',
      content: {
        overview: 'Solve common issues and get the most out of your StreakMaster experience.',
        steps: [
          'If streaks don\'t save: Check your browser\'s local storage settings',
          'For performance issues: Disable futuristic mode or animations',
          'If modals don\'t open: Ensure JavaScript is enabled in your browser',
          'For export problems: Allow downloads in your browser settings',
          'If themes don\'t apply: Clear browser cache and reload the page',
          'For mobile issues: Use landscape mode for better experience',
          'If data is lost: Check if you\'re using the same browser and device',
          'For sync issues: Data is stored locally - use export/import for backup'
        ]
      }
    },
    {
      id: 'keyboard-shortcuts',
      title: '⌨️ Keyboard Shortcuts',
      icon: '⌨️',
      content: {
        overview: 'Navigate StreakMaster efficiently with keyboard shortcuts.',
        steps: [
          'Arrow Keys: Navigate between days in streak calendar',
          'Space/Enter: Toggle completion for the focused day',
          'Escape: Close modals and exit focus mode',
          'Tab: Navigate through form fields and buttons',
          'Ctrl/Cmd + S: Quick save in note-taking areas',
          'Ctrl/Cmd + E: Quick export current streak',
          'Ctrl/Cmd + N: Create new streak (when available)',
          'F: Toggle futuristic mode on/off'
        ]
      }
    }
  ];

  const cssCard = {
    background: 'var(--card)',
    border: futuristicMode ? '1px solid rgba(255, 161, 22, 0.3)' : '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{
      padding: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'var(--bg)',
      color: 'var(--fg)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        ...cssCard,
        background: futuristicMode 
          ? 'linear-gradient(135deg, var(--card), rgba(255, 161, 22, 0.05))'
          : 'var(--card)',
        marginBottom: '32px'
      }}>
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
              📚
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
                StreakMaster Manual
              </h1>
              <p style={{
                margin: 0,
                fontSize: '18px',
                color: 'var(--fg-soft)',
                marginTop: '8px'
              }}>
                Complete guide to mastering your habits and building powerful streaks
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: '8px 16px',
              background: futuristicMode 
                ? 'linear-gradient(135deg, var(--success), #16a34a)'
                : 'var(--success)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🎯</span>
              <span>Complete Feature Guide</span>
            </div>
            <div style={{
              padding: '8px 16px',
              background: futuristicMode 
                ? 'linear-gradient(135deg, var(--accent), #f59e0b)'
                : 'var(--accent)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>⚡</span>
              <span>Step-by-Step Instructions</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '32px'
      }}>
        {/* Navigation Sidebar */}
        <div style={{
          ...cssCard,
          height: 'fit-content',
          position: 'sticky',
          top: '32px'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--fg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📋</span>
            <span>Table of Contents</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: '12px 16px',
                  background: activeSection === section.id 
                    ? (futuristicMode 
                        ? 'linear-gradient(135deg, var(--accent), var(--success))'
                        : 'var(--accent)')
                    : 'transparent',
                  color: activeSection === section.id ? '#ffffff' : 'var(--fg)',
                  border: activeSection === section.id 
                    ? 'none'
                    : '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.background = 'var(--bg-alt)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div>
          {sections.map((section) => (
            activeSection === section.id && (
              <div key={section.id} style={cssCard}>
                {futuristicMode && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 161, 22, 0.03) 50%, transparent 70%)',
                    animation: 'cyber-scan 3s ease-in-out infinite',
                    pointerEvents: 'none',
                    borderRadius: '12px'
                  }} />
                )}
                
                <div style={{ position: 'relative', zIndex: 1 }}>
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
                      {section.icon}
                    </div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '24px',
                      fontWeight: '700',
                      color: 'var(--fg)'
                    }}>
                      {section.title}
                    </h2>
                  </div>

                  <p style={{
                    fontSize: '16px',
                    color: 'var(--fg-soft)',
                    marginBottom: '24px',
                    lineHeight: '1.6'
                  }}>
                    {section.content.overview}
                  </p>

                  <div style={{
                    background: futuristicMode 
                      ? 'linear-gradient(135deg, var(--bg-alt), rgba(255, 161, 22, 0.02))'
                      : 'var(--bg-alt)',
                    border: futuristicMode 
                      ? '1px solid rgba(255, 161, 22, 0.2)'
                      : '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px'
                  }}>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--fg)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>📝</span>
                      <span>Step-by-Step Guide</span>
                    </h3>
                    
                    <ol style={{
                      margin: 0,
                      paddingLeft: '20px',
                      color: 'var(--fg)'
                    }}>
                      {section.content.steps.map((step, index) => (
                        <li key={index} style={{
                          marginBottom: '12px',
                          fontSize: '15px',
                          lineHeight: '1.5'
                        }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
