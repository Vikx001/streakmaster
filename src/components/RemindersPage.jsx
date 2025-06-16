import React, { useState, useMemo } from 'react';

const RemindersPage = ({ 
  reminders, 
  setReminders, 
  theme, 
  futuristicMode, 
  accentColor 
}) => {
  const [showCreateReminder, setShowCreateReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    type: 'habit',
    priority: 'medium',
    recurring: false,
    recurringType: 'daily'
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

  // Categorize reminders
  const categorizedReminders = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    
    return {
      overdue: reminders.filter(r => r.date < today && !r.completed),
      today: reminders.filter(r => r.date === today),
      tomorrow: reminders.filter(r => r.date === tomorrow),
      upcoming: reminders.filter(r => r.date > tomorrow),
      completed: reminders.filter(r => r.completed)
    };
  }, [reminders]);

  const createReminder = () => {
    if (!newReminder.title.trim()) return;
    
    const reminder = {
      id: Date.now().toString(),
      title: newReminder.title.trim(),
      description: newReminder.description.trim(),
      date: newReminder.date,
      time: newReminder.time,
      type: newReminder.type,
      priority: newReminder.priority,
      recurring: newReminder.recurring,
      recurringType: newReminder.recurringType,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      time: '09:00',
      type: 'habit',
      priority: 'medium',
      recurring: false,
      recurringType: 'daily'
    });
    setShowCreateReminder(false);
  };

  const toggleReminder = (reminderId) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  const deleteReminder = (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--fg-soft)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'habit': return '🎯';
      case 'task': return '📋';
      case 'event': return '📅';
      case 'goal': return '🏆';
      case 'health': return '💊';
      case 'work': return '💼';
      default: return '🔔';
    }
  };

  const reminderTypes = [
    { value: 'habit', label: 'Habit Start', icon: '🎯' },
    { value: 'task', label: 'Task', icon: '📋' },
    { value: 'event', label: 'Event', icon: '📅' },
    { value: 'goal', label: 'Goal', icon: '🏆' },
    { value: 'health', label: 'Health', icon: '💊' },
    { value: 'work', label: 'Work', icon: '💼' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'var(--success)' },
    { value: 'medium', label: 'Medium', color: 'var(--warning)' },
    { value: 'high', label: 'High', color: 'var(--error)' }
  ];

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
              🔔 Smart Reminders
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--fg-soft)',
              margin: 0
            }}>
              Never miss important habits, tasks, or goals again
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateReminder(true)}
            style={{
              padding: '12px 24px',
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>➕</span>
            <span>New Reminder</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--error)',
            marginBottom: '4px'
          }}>
            {categorizedReminders.overdue.length}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Overdue
          </div>
        </div>

        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--warning)',
            marginBottom: '4px'
          }}>
            {categorizedReminders.today.length}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Today
          </div>
        </div>

        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔮</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--accent)',
            marginBottom: '4px'
          }}>
            {categorizedReminders.upcoming.length}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Upcoming
          </div>
        </div>

        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--success)',
            marginBottom: '4px'
          }}>
            {categorizedReminders.completed.length}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Completed
          </div>
        </div>
      </div>

      {/* Main Content */}
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
          margin: '0 0 16px 0',
          color: 'var(--fg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📅</span>
          <span>Today's Reminders ({categorizedReminders.today.length})</span>
        </h2>

        {categorizedReminders.today.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: 'var(--fg-soft)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <p>No reminders for today! Enjoy your free time.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {categorizedReminders.today.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
                futuristicMode={futuristicMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Reminder Modal */}
      {showCreateReminder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
                color: 'var(--fg)'
              }}>
                🔔 New Reminder
              </h2>
              <button
                onClick={() => setShowCreateReminder(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--fg-soft)'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Title *
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Start morning workout routine"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-alt)',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--fg)',
                  marginBottom: '8px'
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--bg-alt)',
                    color: 'var(--fg)',
                    fontSize: '16px',
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
                  Time
                </label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--bg-alt)',
                    color: 'var(--fg)',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowCreateReminder(false)}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={createReminder}
                disabled={!newReminder.title.trim()}
                style={{
                  padding: '12px 24px',
                  background: newReminder.title.trim() ? 'var(--accent)' : 'var(--border)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: newReminder.title.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Create Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reminder Card Component
const ReminderCard = ({
  reminder,
  onToggle,
  onDelete,
  getPriorityColor,
  getTypeIcon,
  futuristicMode
}) => {
  return (
    <div style={{
      background: futuristicMode
        ? 'linear-gradient(135deg, var(--bg-alt), rgba(0, 255, 255, 0.03))'
        : 'var(--bg-alt)',
      border: `1px solid ${reminder.completed ? 'var(--success)' : 'var(--border)'}`,
      borderRadius: '8px',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      opacity: reminder.completed ? 0.7 : 1
    }}>
      {futuristicMode && !reminder.completed && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.03), transparent)',
          animation: 'cyber-scan 4s ease-in-out infinite'
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}>
            <button
              onClick={() => onToggle(reminder.id)}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${reminder.completed ? 'var(--success)' : 'var(--border)'}`,
                background: reminder.completed ? 'var(--success)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px'
              }}
            >
              {reminder.completed && '✓'}
            </button>

            <span style={{ fontSize: '20px' }}>
              {getTypeIcon(reminder.type)}
            </span>

            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: 'var(--fg)',
                textDecoration: reminder.completed ? 'line-through' : 'none'
              }}>
                {reminder.title}
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12px',
                color: 'var(--fg-soft)'
              }}>
                <span>{reminder.time}</span>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: getPriorityColor(reminder.priority),
                  color: '#ffffff',
                  fontWeight: '500'
                }}>
                  {reminder.priority}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(reminder.id)}
            style={{
              padding: '4px 8px',
              background: 'var(--error)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>

        {reminder.description && (
          <p style={{
            fontSize: '14px',
            color: 'var(--fg-soft)',
            margin: '8px 0 0 28px',
            lineHeight: '1.4'
          }}>
            {reminder.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;
