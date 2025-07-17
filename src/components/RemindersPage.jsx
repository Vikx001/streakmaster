import React, { useState, useMemo } from 'react';

const RemindersPage = ({ 
  reminders, 
  setReminders, 
  theme, 
  futuristicMode, 
  accentColor 
}) => {
  const [showCreateReminder, setShowCreateReminder] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    type: 'task',
    priority: 'medium',
    recurring: false,
    recurringType: 'daily'
  });

  // CSS Variables
  const vars = {
    '--bg': theme === 'dark' ? '#141414' : '#ffffff',
    '--fg': theme === 'dark' ? '#ffffff' : '#000000',
    '--fg-soft': theme === 'dark' ? '#ababab' : '#666666',
    '--card': theme === 'dark' ? '#303030' : '#f5f5f5',
    '--border': theme === 'dark' ? '#474747' : '#e0e0e0',
    '--accent': accentColor || '#ff6b35',
    '--error': '#ef4444',
    '--warning': '#f59e0b',
    '--success': '#10b981'
  };

  // Calendar functionality
  const currentDate = new Date();
  const [calendarDate, setCalendarDate] = useState(currentDate);
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const getRemindersForDate = (day) => {
    if (!day) return [];
    const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reminders.filter(r => r.date === dateStr);
  };

  // Categorize reminders
  const categorizedReminders = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    
    let filtered = reminders;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter if selected
    if (selectedDate) {
      filtered = filtered.filter(r => r.date === selectedDate);
    }
    
    return {
      overdue: filtered.filter(r => r.date < today && !r.completed),
      today: filtered.filter(r => r.date === today && !r.completed),
      tomorrow: filtered.filter(r => r.date === tomorrow && !r.completed),
      thisWeek: filtered.filter(r => r.date > tomorrow && r.date <= weekFromNow && !r.completed),
      upcoming: filtered.filter(r => r.date > weekFromNow && !r.completed),
      completed: filtered.filter(r => r.completed)
    };
  }, [reminders, searchTerm, selectedDate]);

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
      type: 'task',
      priority: 'medium',
      recurring: false,
      recurringType: 'daily'
    });
    setShowCreateReminder(false);
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
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
    { value: 'habit', label: 'Habit', icon: '🎯' },
    { value: 'task', label: 'Task', icon: '📋' },
    { value: 'event', label: 'Event', icon: '📅' },
    { value: 'goal', label: 'Goal', icon: '🏆' },
    { value: 'health', label: 'Health', icon: '💊' },
    { value: 'work', label: 'Work', icon: '💼' }
  ];

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'today', label: 'Today' },
    { key: 'thisWeek', label: 'This Week' },
    { key: 'completed', label: 'Completed' }
  ];

  const getFilteredSections = () => {
    if (activeFilter === 'all') {
      return [
        { key: 'overdue', title: 'Overdue', items: categorizedReminders.overdue },
        { key: 'today', title: 'Today', items: categorizedReminders.today },
        { key: 'tomorrow', title: 'Tomorrow', items: categorizedReminders.tomorrow },
        { key: 'thisWeek', title: 'This Week', items: categorizedReminders.thisWeek },
        { key: 'upcoming', title: 'Upcoming', items: categorizedReminders.upcoming },
        { key: 'completed', title: 'Completed', items: categorizedReminders.completed }
      ];
    } else {
      return [{ 
        key: activeFilter, 
        title: activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1), 
        items: categorizedReminders[activeFilter] || [] 
      }];
    }
  };

  return (
    <div style={{ 
      ...vars, 
      minHeight: '100vh', 
      background: 'var(--bg)', 
      color: 'var(--fg)',
      fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
    }}>
      <div style={{ display: 'flex', gap: '4px', padding: '24px', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
          {/* Calendar */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: 'var(--fg)',
              fontSize: '22px',
              fontWeight: 'bold',
              padding: '16px',
              paddingBottom: '12px',
              paddingTop: '20px',
              margin: 0
            }}>
              Calendar
            </h2>
            <div style={{ padding: '16px' }}>
              <div style={{ minWidth: '288px', maxWidth: '336px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '4px', justifyContent: 'space-between' }}>
                  <button 
                    onClick={() => navigateCalendar(-1)}
                    style={{ background: 'none', border: 'none', color: 'var(--fg)', cursor: 'pointer' }}
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                    </svg>
                  </button>
                  <p style={{
                    color: 'var(--fg)',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    flex: 1,
                    textAlign: 'center',
                    paddingRight: '40px',
                    margin: 0
                  }}>
                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <p key={i} style={{
                      color: 'var(--fg)',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      display: 'flex',
                      height: '48px',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: '2px',
                      margin: 0
                    }}>
                      {day}
                    </p>
                  ))}
                  {getDaysInMonth(calendarDate).map((day, i) => {
                    if (!day) return <div key={i} style={{ height: '48px', width: '100%' }} />;
                    
                    const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = dateStr === new Date().toISOString().slice(0, 10);
                    const hasReminders = getRemindersForDate(day).length > 0;
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        style={{
                          height: '48px',
                          width: '100%',
                          color: 'var(--fg)',
                          fontSize: '14px',
                          fontWeight: 'medium',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          background: isSelected ? 'var(--accent)' : hasReminders ? 'var(--accent)' : isToday ? '#000000' : 'transparent',
                          color: isSelected || hasReminders || isToday ? '#ffffff' : 'var(--fg)'
                        }}>
                          {day}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: 'var(--fg)',
              fontSize: '22px',
              fontWeight: 'bold',
              padding: '16px',
              paddingBottom: '12px',
              paddingTop: '20px',
              margin: 0
            }}>
              Quick Stats
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 16px 12px 16px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'medium', color: 'var(--fg)' }}>Overdue</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--error)' }}>
                  {categorizedReminders.overdue.length}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'medium', color: 'var(--fg)' }}>Today</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--warning)' }}>
                  {categorizedReminders.today.length}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'medium', color: 'var(--fg)' }}>This Week</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>
                  {categorizedReminders.thisWeek.length}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'medium', color: 'var(--fg)' }}>Completed</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>
                  {categorizedReminders.completed.length}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 style={{
              color: 'var(--fg)',
              fontSize: '22px',
              fontWeight: 'bold',
              padding: '16px',
              paddingBottom: '12px',
              paddingTop: '20px',
              margin: 0
            }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'flex',
                flex: 1,
                gap: '12px',
                maxWidth: '480px',
                flexDirection: 'column',
                padding: '16px 16px 12px 16px'
              }}>
                <button
                  onClick={() => setShowCreateReminder(true)}
                  style={{
                    minWidth: '84px',
                    maxWidth: '480px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50px',
                    height: '40px',
                    padding: '0 16px',
                    background: '#000000',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    width: '100%',
                    border: 'none'
                  }}
                >
                  New Reminder
                </button>
                <button
                  style={{
                    minWidth: '84px',
                    maxWidth: '480px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50px',
                    height: '40px',
                    padding: '0 16px',
                    background: 'var(--card)',
                    color: 'var(--fg)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    width: '100%',
                    border: 'none'
                  }}
                >
                  Export to CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, maxWidth: '960px' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '16px'
          }}>
            <p style={{
              color: 'var(--fg)',
              fontSize: '32px',
              fontWeight: 'bold',
              minWidth: '288px',
              margin: 0
            }}>
              Reminders
            </p>
            <button
              onClick={() => setShowCreateReminder(true)}
              style={{
                minWidth: '84px',
                maxWidth: '480px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50px',
                height: '32px',
                padding: '0 16px',
                background: 'var(--card)',
                color: 'var(--fg)',
                fontSize: '14px',
                fontWeight: 'medium',
                border: 'none'
              }}
            >
              New Reminder
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              minWidth: '158px',
              flex: 1,
              flexDirection: 'column',
              gap: '8px',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}>
              <p style={{
                color: 'var(--fg)',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Total Reminders
              </p>
              <p style={{
                color: 'var(--fg)',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {reminders.length}
              </p>
            </div>
            <div style={{
              display: 'flex',
              minWidth: '158px',
              flex: 1,
              flexDirection: 'column',
              gap: '8px',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}>
              <p style={{
                color: 'var(--fg)',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Active Reminders
              </p>
              <p style={{
                color: 'var(--fg)',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {reminders.filter(r => !r.completed).length}
              </p>
            </div>
            <div style={{
              display: 'flex',
              minWidth: '158px',
              flex: 1,
              flexDirection: 'column',
              gap: '8px',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}>
              <p style={{
                color: 'var(--fg)',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Completed Reminders
              </p>
              <p style={{
                color: 'var(--fg)',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {categorizedReminders.completed.length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--card)',
              borderRadius: '12px',
              padding: '0 16px',
              height: '48px',
              border: '1px solid var(--border)'
            }}>
              <span style={{ marginRight: '12px', color: 'var(--fg-soft)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            flexWrap: 'wrap'
          }}>
            {filterButtons.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                style={{
                  display: 'flex',
                  height: '32px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '50px',
                  background: activeFilter === filter.key ? 'var(--accent)' : 'var(--card)',
                  paddingLeft: '16px',
                  paddingRight: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <p style={{
                  color: activeFilter === filter.key ? '#ffffff' : 'var(--fg)',
                  fontSize: '14px',
                  fontWeight: 'medium',
                  margin: 0
                }}>
                  {filter.label}
                </p>
                <svg width="20" height="20" fill={activeFilter === filter.key ? '#ffffff' : 'var(--fg)'} viewBox="0 0 256 256">
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </button>
            ))}
          </div>

          {/* Reminder Sections */}
          <div style={{ padding: '16px' }}>
            {getFilteredSections().map(section => (
              section.items.length > 0 && (
                <div key={section.key} style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    color: 'var(--fg)',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0'
                  }}>
                    {section.title}
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {section.items.map(reminder => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onToggle={toggleReminder}
                        onDelete={deleteReminder}
                        getTypeIcon={getTypeIcon}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}

            {/* Empty State */}
            {getFilteredSections().every(section => section.items.length === 0) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 32px',
                textAlign: 'center',
                border: '1px solid var(--border)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: 'var(--fg)'
                  }}>
                    No reminders found
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: 'var(--fg-soft)',
                    margin: 0
                  }}>
                    Create your first reminder to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Reminder Modal */}
      {showCreateReminder && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: theme === 'dark' ? '#212121' : '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
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
                placeholder="e.g., Team meeting, Doctor appointment"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: theme === 'dark' ? '#303030' : '#ffffff',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Type
              </label>
              <select
                value={newReminder.type}
                onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: theme === 'dark' ? '#303030' : '#ffffff',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                {reminderTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
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
                    background: theme === 'dark' ? '#303030' : '#ffffff',
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
                    background: theme === 'dark' ? '#303030' : '#ffffff',
                    color: 'var(--fg)',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Priority
              </label>
              <select
                value={newReminder.priority}
                onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: theme === 'dark' ? '#303030' : '#ffffff',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Description
              </label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: theme === 'dark' ? '#303030' : '#ffffff',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowCreateReminder(false)}
                style={{
                  padding: '12px 24px',
                  background: 'var(--card)',
                  color: 'var(--fg)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
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
                  background: newReminder.title.trim() ? accentColor : 'var(--border)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
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
const ReminderCard = ({ reminder, onToggle, onDelete, getTypeIcon }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg)',
      padding: '16px',
      borderRadius: '8px',
      minHeight: '72px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'var(--card)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {reminder.completed ? '✅' : getTypeIcon(reminder.type)}
        </div>
        
        <div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '500',
            margin: '0 0 4px 0',
            color: 'var(--fg)',
            textDecoration: reminder.completed ? 'line-through' : 'none'
          }}>
            {reminder.title}
          </h4>
          <p style={{
            fontSize: '14px',
            color: 'var(--fg-soft)',
            margin: 0
          }}>
            {reminder.completed ? `Completed: ${reminder.date}` : `Due: ${reminder.time}`}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onToggle(reminder.id)}
          style={{
            padding: '8px',
            background: 'var(--success)',
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {reminder.completed ? 'Undo' : 'Done'}
        </button>
        
        <button
          onClick={() => onDelete(reminder.id)}
          style={{
            padding: '8px',
            background: 'var(--error)',
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Delete
        </button>
        
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--fg)',
          cursor: 'pointer',
          fontSize: '18px'
        }}>
          ⋯
        </button>
      </div>
    </div>
  );
};

export default RemindersPage;
