import React, { useState, useEffect } from 'react';

// Data Export & Backup System
export default function DataExportSystem({ 
  user, 
  boards = [], 
  theme, 
  futuristicMode 
}) {
  const [activeTab, setActiveTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    habits: true,
    completions: true,
    streaks: true,
    goals: true,
    mood: true,
    achievements: true,
    analytics: true,
    settings: true
  });
  const [backupHistory, setBackupHistory] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Export formats
  const formats = [
    { id: 'json', name: 'JSON', description: 'Complete data with full structure', icon: '📄' },
    { id: 'csv', name: 'CSV', description: 'Spreadsheet-compatible format', icon: '📊' },
    { id: 'pdf', name: 'PDF Report', description: 'Formatted report for sharing', icon: '📋' },
    { id: 'backup', name: 'Full Backup', description: 'Complete app backup file', icon: '💾' }
  ];

  // Load backup history
  useEffect(() => {
    const savedBackups = localStorage.getItem('streakmaster-backup-history');
    if (savedBackups) {
      setBackupHistory(JSON.parse(savedBackups));
    }
  }, []);

  // Collect all data for export
  const collectAllData = () => {
    const data = {};

    if (exportOptions.habits) {
      data.habits = boards.map(board => ({
        id: board.id,
        title: board.title,
        description: board.description,
        category: board.category,
        difficulty: board.difficulty,
        days: board.days,
        startDate: board.startDate,
        completed: Array.from(board.completed),
        counts: board.counts,
        notes: board.notes
      }));
    }

    if (exportOptions.completions) {
      data.completions = boards.reduce((acc, board) => {
        const completions = Array.from(board.completed).map(day => ({
          habitId: board.id,
          habitTitle: board.title,
          day: day,
          date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: board.counts?.[day] || 1,
          notes: board.notes?.[day] || ''
        }));
        return acc.concat(completions);
      }, []);
    }

    if (exportOptions.streaks) {
      data.streaks = boards.map(board => {
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (let i = 1; i <= board.days; i++) {
          if (board.completed.has(i)) {
            tempStreak++;
            if (i === board.days) currentStreak = tempStreak;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return {
          habitId: board.id,
          habitTitle: board.title,
          currentStreak,
          longestStreak,
          completionRate: (board.completed.size / board.days) * 100
        };
      });
    }

    if (exportOptions.goals) {
      const goals = localStorage.getItem('streakmaster-goals');
      if (goals) {
        data.goals = JSON.parse(goals);
      }
    }

    if (exportOptions.mood) {
      const moodData = localStorage.getItem('streakmaster-mood-data');
      if (moodData) {
        data.moodEntries = JSON.parse(moodData);
      }
    }

    if (exportOptions.achievements) {
      data.achievements = user?.achievements || [];
      data.userStats = {
        level: user?.level || 1,
        xp: user?.xp || 0,
        totalCompletions: boards.reduce((sum, board) => sum + board.completed.size, 0),
        totalHabits: boards.length
      };
    }

    if (exportOptions.analytics) {
      data.analytics = {
        exportDate: new Date().toISOString(),
        totalDays: Math.max(...boards.map(b => b.days), 0),
        averageCompletion: boards.length > 0 
          ? boards.reduce((sum, board) => sum + (board.completed.size / board.days * 100), 0) / boards.length
          : 0,
        habitCategories: boards.reduce((acc, board) => {
          acc[board.category] = (acc[board.category] || 0) + 1;
          return acc;
        }, {}),
        difficultyDistribution: boards.reduce((acc, board) => {
          acc[board.difficulty] = (acc[board.difficulty] || 0) + 1;
          return acc;
        }, {})
      };
    }

    if (exportOptions.settings) {
      data.settings = {
        theme: theme,
        futuristicMode: futuristicMode,
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };
    }

    return data;
  };

  // Export to JSON
  const exportToJSON = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streakmaster-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to CSV
  const exportToCSV = (data) => {
    if (!data.completions) {
      alert('Please include completions data for CSV export');
      return;
    }

    const headers = ['Habit', 'Date', 'Day', 'Difficulty', 'Notes'];
    const rows = data.completions.map(completion => [
      completion.habitTitle,
      completion.date.split('T')[0],
      completion.day,
      completion.difficulty,
      completion.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streakmaster-completions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate PDF Report
  const generatePDFReport = (data) => {
    const reportContent = `
STREAKMASTER PROGRESS REPORT
Generated: ${new Date().toLocaleDateString()}

=== SUMMARY ===
Total Habits: ${data.habits?.length || 0}
Total Completions: ${data.userStats?.totalCompletions || 0}
Current Level: ${data.userStats?.level || 1}
Total XP: ${data.userStats?.xp || 0}

=== HABIT PERFORMANCE ===
${data.streaks?.map(streak => 
  `${streak.habitTitle}: ${streak.completionRate.toFixed(1)}% completion, ${streak.longestStreak} day longest streak`
).join('\n') || 'No streak data available'}

=== ANALYTICS ===
Average Completion Rate: ${data.analytics?.averageCompletion?.toFixed(1) || 0}%
Total Active Days: ${data.analytics?.totalDays || 0}

This report was generated by StreakMaster Pro.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streakmaster-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Create full backup
  const createFullBackup = (data) => {
    const backup = {
      ...data,
      backupInfo: {
        version: '2.0.0',
        created: new Date().toISOString(),
        type: 'full_backup',
        itemCount: Object.keys(data).length
      }
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streakmaster-backup-${new Date().toISOString().split('T')[0]}.smb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Save to backup history
    const newBackup = {
      id: Date.now(),
      date: new Date().toISOString(),
      size: jsonString.length,
      items: Object.keys(data).length,
      type: 'manual'
    };

    const updatedHistory = [newBackup, ...backupHistory].slice(0, 10);
    setBackupHistory(updatedHistory);
    localStorage.setItem('streakmaster-backup-history', JSON.stringify(updatedHistory));
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const data = collectAllData();
      
      switch (exportFormat) {
        case 'json':
          exportToJSON(data);
          break;
        case 'csv':
          exportToCSV(data);
          break;
        case 'pdf':
          generatePDFReport(data);
          break;
        case 'backup':
          createFullBackup(data);
          break;
        default:
          exportToJSON(data);
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Import data
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (window.confirm('This will replace your current data. Are you sure you want to continue?')) {
          // Here you would implement the import logic
          console.log('Imported data:', importedData);
          alert('Import functionality will be implemented in the next update!');
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid StreakMaster backup file.');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'export', name: 'Export Data', icon: '📤' },
    { id: 'import', name: 'Import Data', icon: '📥' },
    { id: 'backup', name: 'Backup History', icon: '💾' },
    { id: 'sync', name: 'Cloud Sync', icon: '☁️' }
  ];

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
              ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
              : '#06b6d4',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: futuristicMode ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none'
          }}>
            💾
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--fg)'
            }}>
              Data Management Center
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--fg-soft)',
              marginTop: '2px'
            }}>
              Export, import, and backup your habit tracking data
            </p>
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
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : '#06b6d4')
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
                  ? '0 0 15px rgba(6, 182, 212, 0.3)'
                  : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'export' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Export Format Selection */}
              <div>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  Export Format
                </h4>
                <div style={{
                  display: 'grid',
                  gap: '12px'
                }}>
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id)}
                      style={{
                        padding: '16px',
                        background: exportFormat === format.id 
                          ? (futuristicMode 
                              ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                              : '#06b6d4')
                          : 'var(--bg-alt)',
                        color: exportFormat === format.id ? '#ffffff' : 'var(--fg)',
                        border: exportFormat === format.id 
                          ? 'none'
                          : '1px solid var(--border)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '20px' }}>{format.icon}</span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {format.name}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        opacity: 0.8
                      }}>
                        {format.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  Data to Include
                </h4>
                <div style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  {Object.entries(exportOptions).map(([key, value]) => (
                    <label
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setExportOptions({
                          ...exportOptions,
                          [key]: e.target.checked
                        })}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#06b6d4'
                        }}
                      />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--fg)',
                        textTransform: 'capitalize'
                      }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isExporting || !Object.values(exportOptions).some(v => v)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    marginTop: '20px',
                    background: isExporting || !Object.values(exportOptions).some(v => v)
                      ? 'var(--border)'
                      : (futuristicMode 
                          ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                          : '#06b6d4'),
                    color: isExporting || !Object.values(exportOptions).some(v => v)
                      ? 'var(--fg-soft)'
                      : '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: isExporting || !Object.values(exportOptions).some(v => v)
                      ? 'not-allowed'
                      : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isExporting ? (
                    <>
                      <span>⏳</span>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Export Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div>
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '2px dashed var(--border)',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📥</div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Import Your Data
              </h4>
              <p style={{
                margin: '0 0 20px 0',
                fontSize: '14px',
                color: 'var(--fg-soft)',
                lineHeight: '1.4'
              }}>
                Upload a StreakMaster backup file (.smb) or JSON export to restore your data.
                This will replace your current data.
              </p>

              <input
                type="file"
                accept=".json,.smb"
                onChange={handleImport}
                style={{ display: 'none' }}
                id="import-file"
              />
              <label
                htmlFor="import-file"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: futuristicMode
                    ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                    : '#06b6d4',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>📁</span>
                <span>Choose File to Import</span>
              </label>
            </div>

            {/* Import Instructions */}
            <div style={{
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h5 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Import Instructions
              </h5>
              <div style={{
                display: 'grid',
                gap: '12px',
                fontSize: '14px',
                color: 'var(--fg-soft)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#06b6d4', fontWeight: '600' }}>1.</span>
                  <span>Select a valid StreakMaster backup file (.smb) or JSON export</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#06b6d4', fontWeight: '600' }}>2.</span>
                  <span>Review the import preview to ensure data integrity</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#06b6d4', fontWeight: '600' }}>3.</span>
                  <span>Confirm the import - this will replace all current data</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#06b6d4', fontWeight: '600' }}>4.</span>
                  <span>Restart the app to ensure all data is properly loaded</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Backup History
              </h4>
              <button
                onClick={() => {
                  const data = collectAllData();
                  createFullBackup(data);
                }}
                style={{
                  padding: '8px 16px',
                  background: futuristicMode
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>💾</span>
                <span>Create Backup</span>
              </button>
            </div>

            {backupHistory.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-alt)',
                borderRadius: '12px',
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💾</div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--fg)'
                }}>
                  No Backups Yet
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'var(--fg-soft)'
                }}>
                  Create your first backup to keep your data safe!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {backupHistory.map((backup) => (
                  <div
                    key={backup.id}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
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
                        💾
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--fg)',
                          marginBottom: '4px'
                        }}>
                          Backup - {new Date(backup.date).toLocaleDateString()}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--fg-soft)'
                        }}>
                          {backup.items} items • {(backup.size / 1024).toFixed(1)} KB • {backup.type}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--fg-soft)'
                    }}>
                      {new Date(backup.date).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sync' && (
          <div>
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px dashed var(--border)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>☁️</div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--fg)'
              }}>
                Cloud Sync Coming Soon!
              </h4>
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                color: 'var(--fg-soft)',
                lineHeight: '1.4'
              }}>
                Automatic cloud synchronization across all your devices will be available in the next update.
                Features will include:
              </p>
              <div style={{
                textAlign: 'left',
                maxWidth: '300px',
                margin: '0 auto',
                fontSize: '14px',
                color: 'var(--fg-soft)'
              }}>
                <div style={{ marginBottom: '8px' }}>• Real-time sync across devices</div>
                <div style={{ marginBottom: '8px' }}>• Automatic daily backups</div>
                <div style={{ marginBottom: '8px' }}>• Conflict resolution</div>
                <div style={{ marginBottom: '8px' }}>• Offline mode support</div>
                <div>• Team collaboration features</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
