import React, { useState, useMemo } from 'react';

const DiaryPage = ({ 
  diaryEntries, 
  setDiaryEntries, 
  theme, 
  futuristicMode, 
  accentColor 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [showCreateEntry, setShowCreateEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '😊',
    tags: [],
    weather: '☀️'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');

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

  // Get entry for selected date
  const selectedEntry = useMemo(() => {
    return diaryEntries.find(entry => entry.date === selectedDate);
  }, [diaryEntries, selectedDate]);

  // Filter entries based on search and mood
  const filteredEntries = useMemo(() => {
    return diaryEntries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
      
      return matchesSearch && matchesMood;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [diaryEntries, searchQuery, selectedMood]);

  // Mood statistics
  const moodStats = useMemo(() => {
    const stats = {};
    diaryEntries.forEach(entry => {
      stats[entry.mood] = (stats[entry.mood] || 0) + 1;
    });
    return stats;
  }, [diaryEntries]);

  const createEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    const entry = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEntry.title.trim(),
      content: newEntry.content.trim(),
      mood: newEntry.mood,
      weather: newEntry.weather,
      tags: newEntry.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDiaryEntries(prev => [...prev, entry]);
    setNewEntry({
      title: '',
      content: '',
      mood: '😊',
      tags: [],
      weather: '☀️'
    });
    setShowCreateEntry(false);
  };

  const updateEntry = (entryId, updates) => {
    setDiaryEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    ));
  };

  const deleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setDiaryEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const addTag = (tag) => {
    if (tag && !newEntry.tags.includes(tag)) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const moods = ['😊', '😢', '😡', '😴', '🤔', '😍', '😰', '🤗', '😎', '🤯'];
  const weathers = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌨️', '🌈', '🌙', '⭐'];
  const commonTags = ['work', 'personal', 'health', 'travel', 'family', 'friends', 'goals', 'reflection'];

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
              📔 Personal Diary
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--fg-soft)',
              margin: 0
            }}>
              Capture your thoughts, memories, and daily reflections
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateEntry(true)}
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
            <span>✍️</span>
            <span>New Entry</span>
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
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--accent)',
            marginBottom: '4px'
          }}>
            {diaryEntries.length}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Total Entries
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
            color: 'var(--success)',
            marginBottom: '4px'
          }}>
            {new Set(diaryEntries.map(e => e.date)).size}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Days Recorded
          </div>
        </div>

        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {Object.keys(moodStats).length > 0 
              ? Object.entries(moodStats).reduce((a, b) => moodStats[a[0]] > moodStats[b[0]] ? a : b)[0]
              : '😊'
            }
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--warning)',
            marginBottom: '4px'
          }}>
            {Object.keys(moodStats).length > 0 
              ? Math.max(...Object.values(moodStats))
              : 0
            }
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Most Common Mood
          </div>
        </div>

        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔥</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--error)',
            marginBottom: '4px'
          }}>
            {(() => {
              const dates = diaryEntries.map(e => e.date).sort();
              let streak = 0;
              let maxStreak = 0;
              for (let i = 1; i < dates.length; i++) {
                const prev = new Date(dates[i-1]);
                const curr = new Date(dates[i]);
                const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                  streak++;
                  maxStreak = Math.max(maxStreak, streak);
                } else {
                  streak = 0;
                }
              }
              return maxStreak;
            })()}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--fg-soft)',
            fontWeight: '500'
          }}>
            Longest Streak
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
        {/* Main Content */}
        <div>
          {/* Search and Filters */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '16px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-alt)',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />

              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-alt)',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="all">All Moods</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-alt)',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Entries List */}
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {filteredEntries.length === 0 ? (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '64px 32px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📔</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: 'var(--fg)'
                }}>
                  No entries found
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'var(--fg-soft)',
                  margin: 0
                }}>
                  {searchQuery || selectedMood !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start writing your first diary entry!'
                  }
                </p>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    background: futuristicMode
                      ? 'linear-gradient(135deg, var(--card), rgba(0, 255, 255, 0.05))'
                      : 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px',
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
                      background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.03), transparent)',
                      animation: 'cyber-scan 4s ease-in-out infinite'
                    }} />
                  )}

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                          color: 'var(--fg)'
                        }}>
                          {entry.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '14px',
                          color: 'var(--fg-soft)'
                        }}>
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                          <span>{entry.mood}</span>
                          <span>{entry.weather}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            const newTitle = prompt('Edit title:', entry.title);
                            if (newTitle && newTitle !== entry.title) {
                              updateEntry(entry.id, { title: newTitle });
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--accent)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--error)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'var(--fg)',
                      margin: '0 0 16px 0',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {entry.content}
                    </p>

                    {entry.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {entry.tags.map((tag, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '4px 8px',
                              background: 'var(--accent)',
                              color: '#ffffff',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Calendar View */}
          <div style={{
            background: 'var(--card)',
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
              📅 Entry Calendar
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              fontSize: '12px'
            }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} style={{
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'var(--fg-soft)'
                }}>
                  {day}
                </div>
              ))}

              {(() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());

                const days = [];
                for (let i = 0; i < 42; i++) {
                  const date = new Date(startDate);
                  date.setDate(startDate.getDate() + i);
                  const dateStr = date.toISOString().slice(0, 10);
                  const hasEntry = diaryEntries.some(e => e.date === dateStr);
                  const isToday = dateStr === new Date().toISOString().slice(0, 10);
                  const isCurrentMonth = date.getMonth() === today.getMonth();

                  days.push(
                    <div
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      style={{
                        padding: '8px 4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        background: hasEntry ? 'var(--accent)' :
                                   isToday ? 'var(--success)' : 'transparent',
                        color: hasEntry || isToday ? '#ffffff' :
                               isCurrentMonth ? 'var(--fg)' : 'var(--fg-soft)',
                        fontWeight: hasEntry || isToday ? '600' : '400',
                        opacity: isCurrentMonth ? 1 : 0.5,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {date.getDate()}
                    </div>
                  );
                }
                return days;
              })()}
            </div>
          </div>

          {/* Mood Tracker */}
          <div style={{
            background: 'var(--card)',
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
              😊 Mood Tracker
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px'
            }}>
              {moods.map(mood => (
                <div
                  key={mood}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    background: 'var(--bg-alt)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {mood}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--accent)'
                  }}>
                    {moodStats[mood] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: 'var(--fg)'
            }}>
              ⚡ Quick Actions
            </h3>

            <div style={{ display: 'grid', gap: '8px' }}>
              <button
                onClick={() => setShowCreateEntry(true)}
                style={{
                  padding: '12px 16px',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>✍️</span>
                <span>Write New Entry</span>
              </button>

              <button
                onClick={() => {
                  const csv = diaryEntries.map(e =>
                    `"${e.date}","${e.title}","${e.mood}","${e.weather}","${e.content.replace(/"/g, '""')}","${e.tags.join(';')}"`
                  ).join('\n');
                  const blob = new Blob([`Date,Title,Mood,Weather,Content,Tags\n${csv}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'diary-entries.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  padding: '12px 16px',
                  background: 'var(--success)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>📥</span>
                <span>Export Entries</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Entry Modal */}
      {showCreateEntry && (
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
                ✍️ New Diary Entry
              </h2>
              <button
                onClick={() => setShowCreateEntry(false)}
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
                Title
              </label>
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's on your mind today?"
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Content
              </label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your thoughts, experiences, or reflections..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-alt)',
                  color: 'var(--fg)',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
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
                  Mood
                </label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))}
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
                >
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--fg)',
                  marginBottom: '8px'
                }}>
                  Weather
                </label>
                <select
                  value={newEntry.weather}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, weather: e.target.value }))}
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
                >
                  {weathers.map(weather => (
                    <option key={weather} value={weather}>{weather}</option>
                  ))}
                </select>
              </div>

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
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--fg)',
                marginBottom: '8px'
              }}>
                Tags
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}>
                {newEntry.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--accent)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {commonTags.filter(tag => !newEntry.tags.includes(tag)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--fg-soft)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowCreateEntry(false)}
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
                onClick={createEntry}
                disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                style={{
                  padding: '12px 24px',
                  background: newEntry.title.trim() && newEntry.content.trim() ? 'var(--accent)' : 'var(--border)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: newEntry.title.trim() && newEntry.content.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
