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
  const [selectedWeather, setSelectedWeather] = useState('all');
  const [selectedTags, setSelectedTags] = useState('all');

  const moods = ['😊', '😢', '😡', '😴', '🤔', '😍', '😰', '🤗', '😎', '🤯'];
  const weathers = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌨️', '🌈', '🌙', '⭐'];
  const commonTags = ['work', 'personal', 'health', 'travel', 'family', 'friends', 'goals', 'reflection'];

  // Get entry for selected date
  const selectedEntry = useMemo(() => {
    return diaryEntries.find(entry => entry.date === selectedDate);
  }, [diaryEntries, selectedDate]);

  // Filter entries based on search, mood, weather, and tags
  const filteredEntries = useMemo(() => {
    return diaryEntries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
      const matchesWeather = selectedWeather === 'all' || entry.weather === selectedWeather;
      const matchesTags = selectedTags === 'all' || entry.tags.includes(selectedTags);
      
      return matchesSearch && matchesMood && matchesWeather && matchesTags;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [diaryEntries, searchQuery, selectedMood, selectedWeather, selectedTags]);

  // Mood statistics
  const moodStats = useMemo(() => {
    const stats = {};
    diaryEntries.forEach(entry => {
      stats[entry.mood] = (stats[entry.mood] || 0) + 1;
    });
    return stats;
  }, [diaryEntries]);

  // Get most common mood
  const mostCommonMood = useMemo(() => {
    const moodCounts = {};
    diaryEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    return Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b, ['😊', 0])[0];
  }, [diaryEntries]);

  // Calculate longest streak
  const longestStreak = useMemo(() => {
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
    return maxStreak + 1;
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

  const deleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setDiaryEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const editEntryTitle = (id, currentTitle) => {
    const newTitle = prompt('Edit entry title:', currentTitle);
    if (newTitle && newTitle.trim() !== currentTitle) {
      setDiaryEntries(prev => prev.map(entry => 
        entry.id === id 
          ? { ...entry, title: newTitle.trim(), updatedAt: new Date().toISOString() }
          : entry
      ));
    }
  };

  const addTag = (tag) => {
    if (tag.trim() && !newEntry.tags.includes(tag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Calendar generation
  const generateCalendar = () => {
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

      days.push({
        date: date.getDate(),
        dateStr,
        hasEntry,
        isToday,
        isCurrentMonth
      });
    }
    return days;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#141414', 
      color: 'white',
      fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
    }}>
      <div style={{ display: 'flex', gap: '4px', padding: '24px', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
          {/* Calendar */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: 'white',
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
                  <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                    </svg>
                  </button>
                  <p style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    flex: 1,
                    textAlign: 'center',
                    paddingRight: '40px',
                    margin: 0
                  }}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <p key={i} style={{
                      color: 'white',
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
                  {generateCalendar().map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day.dateStr)}
                      style={{
                        height: '48px',
                        width: '100%',
                        color: day.isCurrentMonth ? 'white' : '#666',
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
                        background: day.hasEntry ? accentColor : day.isToday ? 'black' : 'transparent'
                      }}>
                        {day.date}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mood Tracker */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: 'bold',
              padding: '16px',
              paddingBottom: '12px',
              paddingTop: '20px',
              margin: 0
            }}>
              Mood Tracker
            </h2>
            <div style={{ padding: '16px 16px 12px 16px' }}>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                style={{
                  width: '100%',
                  minWidth: '160px',
                  height: '56px',
                  borderRadius: '12px',
                  color: 'white',
                  border: '1px solid #474747',
                  background: '#212121',
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: 'normal'
                }}
              >
                <option value="all">All Moods</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood} ({moodStats[mood] || 0})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 style={{
              color: 'white',
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
                  onClick={() => setShowCreateEntry(true)}
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
                    background: 'black',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    width: '100%',
                    border: 'none'
                  }}
                >
                  New Entry
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
                    minWidth: '84px',
                    maxWidth: '480px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50px',
                    height: '40px',
                    padding: '0 16px',
                    background: '#303030',
                    color: 'white',
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
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              minWidth: '288px',
              margin: 0
            }}>
              Diary
            </p>
            <button
              onClick={() => setShowCreateEntry(true)}
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
                background: '#303030',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'medium',
                border: 'none'
              }}
            >
              New Entry
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
              border: '1px solid #474747'
            }}>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Total Entries
              </p>
              <p style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {diaryEntries.length}
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
              border: '1px solid #474747'
            }}>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Days Recorded
              </p>
              <p style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {new Set(diaryEntries.map(e => e.date)).size}
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
              border: '1px solid #474747'
            }}>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Most Common Mood
              </p>
              <p style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {mostCommonMood}
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
              border: '1px solid #474747'
            }}>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Longest Writing Streak
              </p>
              <p style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {longestStreak}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ padding: '16px 16px 12px 16px' }}>
            <div style={{
              display: 'flex',
              width: '100%',
              height: '48px',
              borderRadius: '12px'
            }}>
              <div style={{
                color: '#ababab',
                display: 'flex',
                border: 'none',
                background: '#303030',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '16px',
                borderRadius: '12px 0 0 12px'
              }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search entries"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  borderRadius: '0 12px 12px 0',
                  color: 'white',
                  border: 'none',
                  background: '#303030',
                  height: '100%',
                  padding: '0 16px 0 8px',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px',
            flexWrap: 'wrap',
            paddingRight: '16px'
          }}>
            <button
              onClick={() => setSelectedMood(selectedMood === 'all' ? moods[0] : 'all')}
              style={{
                display: 'flex',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '50px',
                background: '#303030',
                paddingLeft: '16px',
                paddingRight: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <p style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Mood: {selectedMood === 'all' ? 'All' : selectedMood}
              </p>
              <svg width="20" height="20" fill="white" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </button>
            <button
              onClick={() => setSelectedWeather(selectedWeather === 'all' ? weathers[0] : 'all')}
              style={{
                display: 'flex',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '50px',
                background: '#303030',
                paddingLeft: '16px',
                paddingRight: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <p style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Weather: {selectedWeather === 'all' ? 'All' : selectedWeather}
              </p>
              <svg width="20" height="20" fill="white" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </button>
            <button
              onClick={() => setSelectedTags(selectedTags === 'all' ? commonTags[0] : 'all')}
              style={{
                display: 'flex',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '50px',
                background: '#303030',
                paddingLeft: '16px',
                paddingRight: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <p style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'medium',
                margin: 0
              }}>
                Tags: {selectedTags === 'all' ? 'All' : selectedTags}
              </p>
              <svg width="20" height="20" fill="white" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </button>
          </div>

          {/* Entries Section */}
          <h2 style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: 'bold',
            padding: '16px',
            paddingBottom: '12px',
            paddingTop: '20px',
            margin: 0
          }}>
            Entries
          </h2>

          {/* Entries List */}
          <div style={{ padding: '16px' }}>
            {filteredEntries.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 32px',
                textAlign: 'center',
                border: '1px solid #474747',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📔</div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: 'white'
                  }}>
                    No entries found
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#ababab',
                    margin: 0
                  }}>
                    {searchQuery || selectedMood !== 'all' || selectedWeather !== 'all' || selectedTags !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Start writing your first diary entry!'
                    }
                  </p>
                </div>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div key={entry.id} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    gap: '16px',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #474747'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      flex: '2 2 0'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '4px'
                      }}>
                        <p style={{
                          color: '#ababab',
                          fontSize: '14px',
                          fontWeight: 'normal',
                          margin: 0
                        }}>
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <span style={{ fontSize: '16px' }}>{entry.mood}</span>
                        <span style={{ fontSize: '16px' }}>{entry.weather}</span>
                      </div>
                      <p
                        onClick={() => editEntryTitle(entry.id, entry.title)}
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          margin: '0 0 8px 0',
                          cursor: 'pointer'
                        }}
                      >
                        {entry.title}
                      </p>
                      <p style={{
                        color: '#ababab',
                        fontSize: '14px',
                        fontWeight: 'normal',
                        margin: 0
                      }}>
                        {entry.content.substring(0, 100)}...
                      </p>
                      {entry.tags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginTop: '8px'
                        }}>
                          {entry.tags.map((tag, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '4px 8px',
                                background: accentColor,
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
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '8px'
                      }}>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          style={{
                            padding: '4px 8px',
                            background: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      borderRadius: '12px',
                      flex: 1,
                      background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {entry.mood}
                    </div>
                  </div>
                </div>
              ))
            )}
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
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#212121',
            border: '1px solid #474747',
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
                color: 'white'
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
                  color: '#ababab'
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
                color: 'white',
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
                  border: '1px solid #474747',
                  borderRadius: '8px',
                  background: '#303030',
                  color: 'white',
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
                color: 'white',
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
                  border: '1px solid #474747',
                  borderRadius: '8px',
                  background: '#303030',
                  color: 'white',
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
                color: 'white',
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
                  border: '1px solid #474747',
                  borderRadius: '8px',
                  background: '#303030',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
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
                  color: 'white',
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
                    border: '1px solid #474747',
                    borderRadius: '8px',
                    background: '#303030',
                    color: 'white',
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
                  color: 'white',
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
                    border: '1px solid #474747',
                    borderRadius: '8px',
                    background: '#303030',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  {weathers.map(weather => (
                    <option key={weather} value={weather}>{weather}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
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
                    onClick={() => removeTag(tag)}
                    style={{
                      padding: '4px 8px',
                      background: accentColor,
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    #{tag} ×
                  </span>
                ))}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {commonTags.filter(tag => !newEntry.tags.includes(tag)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    style={{
                      padding: '4px 8px',
                      background: '#303030',
                      color: 'white',
                      border: '1px solid #474747',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowCreateEntry(false)}
                style={{
                  padding: '12px 24px',
                  background: '#303030',
                  color: 'white',
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
                onClick={createEntry}
                style={{
                  padding: '12px 24px',
                  background: accentColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
             
