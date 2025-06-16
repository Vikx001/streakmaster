import React, { useState } from 'react';

const SettingsPage = ({ 
  theme, 
  setTheme,
  futuristicMode,
  setFuturisticMode,
  accentColor,
  setAccentColor,
  streakTheme,
  setStreakTheme
}) => {
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    streakMilestones: true,
    weeklyReports: false,
    communityUpdates: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    streaksPublic: false,
    allowFriendRequests: true
  });

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

  const accentColors = [
    { name: 'Orange', value: '#ffa116', emoji: '🟠' },
    { name: 'Blue', value: '#007bff', emoji: '🔵' },
    { name: 'Green', value: '#00af9b', emoji: '🟢' },
    { name: 'Purple', value: '#8a2be2', emoji: '🟣' },
    { name: 'Red', value: '#ff6b6b', emoji: '🔴' },
    { name: 'Pink', value: '#ff69b4', emoji: '🩷' }
  ];

  const themes = [
    { id: 'github', name: '🟢 Classic Green', preview: '#00af9b' },
    { id: 'ocean', name: '🌊 Ocean Blue', preview: '#007bff' },
    { id: 'sunset', name: '🌅 Sunset Orange', preview: '#ffa116' },
    { id: 'forest', name: '🌲 Forest Green', preview: '#228b22' },
    { id: 'purple', name: '💜 Royal Purple', preview: '#8a2be2' },
    { id: 'neon', name: '⚡ Electric Neon', preview: '#00ffff' },
    { id: 'candy', name: '🍭 Candy Pink', preview: '#ff69b4' },
    { id: 'cyberpunk', name: '🤖 Cyberpunk', preview: '#ff0080' },
    { id: 'matrix', name: '🔋 Digital Matrix', preview: '#00ff00' },
    { id: 'hologram', name: '🔮 Holographic', preview: '#ff00ff' },
    { id: 'plasma', name: '⚡ Plasma Energy', preview: '#ffff00' },
    { id: 'quantum', name: '🌌 Quantum Field', preview: '#9400d3' }
  ];

  const SettingSection = ({ title, children }) => (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 20px 0',
        color: 'var(--fg)'
      }}>
        {title}
      </h2>
      {children}
    </div>
  );

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid var(--border)'
    }}>
      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'var(--fg)',
          marginBottom: '4px'
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize: '14px',
            color: 'var(--fg-soft)'
          }}>
            {description}
          </div>
        )}
      </div>
      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: '50px',
        height: '24px',
        cursor: 'pointer'
      }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: checked ? 'var(--accent)' : 'var(--border)',
          borderRadius: '12px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '26px' : '2px',
            width: '20px',
            height: '20px',
            background: '#ffffff',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>
      </label>
    </div>
  );

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
            ⚙️ Settings & Preferences
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--fg-soft)',
            margin: 0
          }}>
            Customize your StreakMaster experience
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div>
          {/* Appearance Settings */}
          <SettingSection title="🎨 Appearance">
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Theme Mode
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['light', 'dark'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      background: theme === mode ? 'var(--accent)' : 'transparent',
                      color: theme === mode ? '#ffffff' : 'var(--fg)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{mode === 'light' ? '☀️' : '🌙'}</span>
                    <span>{mode === 'light' ? 'Light' : 'Dark'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Accent Color
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px'
              }}>
                {accentColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: accentColor === color.value ? '3px solid var(--fg)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      background: color.value,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {color.emoji}
                  </button>
                ))}
              </div>
            </div>

            <ToggleSwitch
              checked={futuristicMode}
              onChange={(e) => setFuturisticMode(e.target.checked)}
              label="🚀 Futuristic Mode"
              description="Enable sci-fi visual effects and animations"
            />
          </SettingSection>

          {/* Streak Themes */}
          <SettingSection title="🎭 Streak Visualization">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px'
            }}>
              {themes.map(themeOption => (
                <button
                  key={themeOption.id}
                  onClick={() => setStreakTheme(themeOption.id)}
                  style={{
                    padding: '12px',
                    border: streakTheme === themeOption.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--bg-alt)',
                    color: 'var(--fg)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '2px',
                    background: themeOption.preview
                  }} />
                  <span>{themeOption.name}</span>
                </button>
              ))}
            </div>
          </SettingSection>
        </div>

        {/* Right Column */}
        <div>
          {/* Notifications */}
          <SettingSection title="🔔 Notifications">
            <ToggleSwitch
              checked={notifications.dailyReminders}
              onChange={(e) => setNotifications({...notifications, dailyReminders: e.target.checked})}
              label="Daily Reminders"
              description="Get reminded to complete your habits"
            />
            <ToggleSwitch
              checked={notifications.streakMilestones}
              onChange={(e) => setNotifications({...notifications, streakMilestones: e.target.checked})}
              label="Streak Milestones"
              description="Celebrate when you reach streak goals"
            />
            <ToggleSwitch
              checked={notifications.weeklyReports}
              onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
              label="Weekly Reports"
              description="Receive weekly progress summaries"
            />
            <ToggleSwitch
              checked={notifications.communityUpdates}
              onChange={(e) => setNotifications({...notifications, communityUpdates: e.target.checked})}
              label="Community Updates"
              description="Stay updated on challenges and friends"
            />
          </SettingSection>

          {/* Privacy */}
          <SettingSection title="🔒 Privacy & Social">
            <ToggleSwitch
              checked={privacy.profileVisible}
              onChange={(e) => setPrivacy({...privacy, profileVisible: e.target.checked})}
              label="Public Profile"
              description="Allow others to view your profile"
            />
            <ToggleSwitch
              checked={privacy.streaksPublic}
              onChange={(e) => setPrivacy({...privacy, streaksPublic: e.target.checked})}
              label="Public Streaks"
              description="Share your streaks with the community"
            />
            <ToggleSwitch
              checked={privacy.allowFriendRequests}
              onChange={(e) => setPrivacy({...privacy, allowFriendRequests: e.target.checked})}
              label="Friend Requests"
              description="Allow others to send friend requests"
            />
          </SettingSection>

          {/* Data & Export */}
          <SettingSection title="💾 Data Management">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-alt)',
                color: 'var(--fg)',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                📥 Export All Data
              </button>
              <button style={{
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-alt)',
                color: 'var(--fg)',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                🔄 Sync with Cloud
              </button>
              <button style={{
                padding: '12px 16px',
                border: '1px solid var(--error)',
                borderRadius: '8px',
                background: 'rgba(255, 107, 107, 0.1)',
                color: 'var(--error)',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                🗑️ Clear All Data
              </button>
            </div>
          </SettingSection>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '48px',
        padding: '24px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          color: 'var(--fg-soft)',
          marginBottom: '8px'
        }}>
          StreakMaster v2.0.0 - Built with ❤️ for habit builders
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '12px',
          color: 'var(--fg-soft)'
        }}>
          <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Support</a>
          <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>GitHub</a>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
