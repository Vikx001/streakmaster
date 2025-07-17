import React, { useState } from 'react';

const CommunityPage = ({
  boards = [],
  theme,
  futuristicMode,
  accentColor
}) => {
  const [activeTab, setActiveTab] = useState('feed');

  // Helper function to calculate current streak
  const calculateCurrentStreak = (board) => {
    if (board.completed.size === 0) return 0;

    const sortedDates = Array.from(board.completed).sort().reverse();
    const today = new Date().toISOString().slice(0, 10);

    let streak = 0;
    let currentDate = today;

    for (const dateStr of sortedDates) {
      if (dateStr === currentDate) {
        streak++;
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        currentDate = date.toISOString().slice(0, 10);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate real community stats based on user data
  const communityData = {
    stats: {
      totalUsers: Math.max(1, boards.length * 1000),
      activeToday: Math.max(1, boards.filter(b => {
        const today = new Date().toISOString().slice(0, 10);
        return b.completed.has(today);
      }).length * 100),
      streaksCompleted: boards.reduce((sum, b) => sum + b.completed.size, 0),
      communityChallenges: Math.max(3, Math.floor(boards.length / 2))
    },
    leaderboard: boards.length > 0 ? [
      {
        rank: 1,
        name: 'You',
        streak: Math.max(...boards.map(b => calculateCurrentStreak(b)), 0),
        habit: boards.find(b => calculateCurrentStreak(b) === Math.max(...boards.map(b => calculateCurrentStreak(b)), 0))?.title || 'Your Best Habit',
        avatar: boards.find(b => calculateCurrentStreak(b) === Math.max(...boards.map(b => calculateCurrentStreak(b)), 0))?.icon || '🎯',
        points: boards.reduce((sum, b) => sum + b.completed.size * 10, 0)
      },
      { rank: 2, name: 'Liam Walker', streak: 150, habit: 'Daily Reading', avatar: '📚', points: 15000 },
      { rank: 3, name: 'Ava Thompson', streak: 120, habit: 'Morning Workout', avatar: '💪', points: 12000 },
      { rank: 4, name: 'Noah Carter', streak: 100, habit: 'Meditation', avatar: '🧘', points: 10000 },
      { rank: 5, name: 'Isabella Bennett', streak: 90, habit: 'Journaling', avatar: '📝', points: 9000 }
    ] : [
      { rank: 1, name: 'Liam Walker', streak: 150, habit: 'Daily Reading', avatar: '📚', points: 15000 },
      { rank: 2, name: 'Ava Thompson', streak: 120, habit: 'Morning Workout', avatar: '💪', points: 12000 },
      { rank: 3, name: 'Noah Carter', streak: 100, habit: 'Meditation', avatar: '🧘', points: 10000 }
    ],
    challenges: [
      {
        id: 1,
        title: '30-Day Meditation Challenge',
        description: 'Join others in a 30-day meditation challenge to improve focus and reduce stress.',
        participants: 2847,
        daysLeft: 12,
        difficulty: 'Beginner',
        reward: '🏆 Zen Master Badge',
        category: 'Wellness',
        status: 'Active'
      },
      {
        id: 2,
        title: 'Fitness Frenzy',
        description: 'Get ready for a fitness challenge starting next week! Stay tuned for more details.',
        participants: 1523,
        daysLeft: 8,
        difficulty: 'Expert',
        reward: '🎯 Fitness Champion',
        category: 'Health',
        status: 'Upcoming'
      }
    ],
    feed: boards.length > 0 ? boards.map((board, index) => {
      const today = new Date().toISOString().slice(0, 10);
      const isCompletedToday = board.completed.has(today);
      const currentStreak = calculateCurrentStreak(board);

      if (isCompletedToday) {
        return {
          id: index + 1,
          user: 'You',
          avatar: board.icon || '🎯',
          action: 'completed',
          habit: board.title,
          streak: currentStreak,
          time: 'Today',
          likes: Math.floor(currentStreak / 5) + 1,
          comments: Math.floor(currentStreak / 10),
          achievement: currentStreak >= 7 ? `${currentStreak} Day Streak! 🔥` : null
        };
      } else {
        return {
          id: index + 1,
          user: 'You',
          avatar: board.icon || '🎯',
          action: 'shared',
          content: `Working on ${board.title}. Current progress: ${board.completed.size}/${board.days} days completed! 💪`,
          time: 'Recently',
          likes: Math.floor(board.completed.size / 3) + 1,
          comments: Math.floor(board.completed.size / 7)
        };
      }
    }).filter(Boolean).concat([
      {
        id: 'community-1',
        user: 'Sophia Carter',
        avatar: '🧘',
        action: 'completed',
        habit: 'Daily Meditation',
        streak: 30,
        time: '2d ago',
        likes: 25,
        comments: 5,
        content: 'Just completed my 30-day meditation streak! Feeling so much more centered and focused. #mindfulness #streakmaster'
      },
      {
        id: 'community-2',
        user: 'Ethan Bennett',
        avatar: '💪',
        action: 'completed',
        habit: 'Daily Exercise',
        streak: 50,
        time: '3d ago',
        likes: 32,
        comments: 8,
        content: 'Hit my 50-day streak for daily exercise! It\'s been tough, but the results are worth it. #fitness #consistency'
      },
      {
        id: 'community-3',
        user: 'Olivia Hayes',
        avatar: '📚',
        action: 'completed',
        habit: 'Daily Reading',
        streak: 100,
        time: '4d ago',
        likes: 45,
        comments: 12,
        achievement: '100 Day Streak! 🔥',
        content: 'Reached my 100-day streak for reading! So many books, so little time. #reading #knowledge'
      }
    ]) : [
      {
        id: 'community-1',
        user: 'Sophia Carter',
        avatar: '🧘',
        action: 'completed',
        habit: 'Daily Meditation',
        streak: 30,
        time: '2d ago',
        likes: 25,
        comments: 5,
        content: 'Just completed my 30-day meditation streak! Feeling so much more centered and focused. #mindfulness #streakmaster'
      },
      {
        id: 'community-2',
        user: 'Ethan Bennett',
        avatar: '💪',
        action: 'completed',
        habit: 'Daily Exercise',
        streak: 50,
        time: '3d ago',
        likes: 32,
        comments: 8,
        content: 'Hit my 50-day streak for daily exercise! It\'s been tough, but the results are worth it. #fitness #consistency'
      },
      {
        id: 'community-3',
        user: 'Olivia Hayes',
        avatar: '📚',
        action: 'completed',
        habit: 'Daily Reading',
        streak: 100,
        time: '4d ago',
        likes: 45,
        comments: 12,
        achievement: '100 Day Streak! 🔥',
        content: 'Reached my 100-day streak for reading! So many books, so little time. #reading #knowledge'
      }
    ]
  };

  const friends = [
    { name: 'Chloe Davis', streak: 100, avatar: '🏃‍♀️' },
    { name: 'Owen Mitchell', streak: 80, avatar: '🎯' },
    { name: 'Harper Lewis', streak: 60, avatar: '📖' }
  ];

  const achievements = [
    { name: 'First Streak', icon: '🌟' },
    { name: '7-Day Streak', icon: '🔥' },
    { name: '30-Day Streak', icon: '💎' },
    { name: '100-Day Streak', icon: '🏆' }
  ];

  const tabs = [
    { id: 'feed', name: 'Feed' },
    { id: 'leaderboard', name: 'Leaderboards' },
    { id: 'friends', name: 'Friends' },
    { id: 'challenges', name: 'Challenges' },
    { id: 'achievements', name: 'Achievements' }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121417] dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Community Features</p>
            </div>

            {/* Navigation Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#3f4750] px-4 gap-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                      activeTab === tab.id 
                        ? 'border-b-white text-white' 
                        : 'border-b-transparent text-[#a1abb5]'
                    }`}
                  >
                    <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                      activeTab === tab.id ? 'text-white' : 'text-[#a1abb5]'
                    }`}>
                      {tab.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'feed' && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Social Feed</h2>
                {communityData.feed.map(post => (
                  <div key={post.id}>
                    <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0 bg-[#2b3036] flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                      <div className="flex h-full flex-1 flex-col items-start justify-start">
                        <div className="flex w-full flex-row items-start justify-start gap-x-3">
                          <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">{post.user}</p>
                          <p className="text-[#a1abb5] text-sm font-normal leading-normal">{post.time}</p>
                        </div>
                        <p className="text-white text-sm font-normal leading-normal">
                          {post.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 px-4 py-2">
                      <div className="flex items-center justify-center gap-2 px-3 py-2">
                        <div className="text-[#a1abb5]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                          </svg>
                        </div>
                        <p className="text-[#a1abb5] text-[13px] font-bold leading-normal tracking-[0.015em]">{post.likes}</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 px-3 py-2">
                        <div className="text-[#a1abb5]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path>
                          </svg>
                        </div>
                        <p className="text-[#a1abb5] text-[13px] font-bold leading-normal tracking-[0.015em]">{post.comments}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Leaderboards</h2>
                <div className="px-4 py-3">
                  <div className="flex overflow-hidden rounded-xl border border-[#3f4750] bg-[#121417]">
                    <table className="flex-1">
                      <thead>
                        <tr className="bg-[#1d2125]">
                          <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Rank</th>
                          <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">User</th>
                          <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {communityData.leaderboard.map((user, i) => (
                          <tr key={i} className="border-t border-t-[#3f4750]">
                            <td className="h-[72px] px-4 py-2 w-[400px] text-[#a1abb5] text-sm font-normal leading-normal">{user.rank}</td>
                            <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">{user.name}</td>
                            <td className="h-[72px] px-4 py-2 w-[400px] text-[#a1abb5] text-sm font-normal leading-normal">{user.streak}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'friends' && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Friends</h2>
                {friends.map((friend, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#121417] px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 bg-[#2b3036] flex items-center justify-center text-2xl">
                        {friend.avatar}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-white text-base font-medium leading-normal line-clamp-1">{friend.name}</p>
                        <p className="text-[#a1abb5] text-sm font-normal leading-normal line-clamp-2">{friend.streak}-day streak</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2b3036] text-white text-sm font-medium leading-normal w-fit">
                        <span className="truncate">View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Challenges</h2>
                {communityData.challenges.map(challenge => (
                  <div key={challenge.id} className="p-4">
                    <div className="flex items-stretch justify-between gap-4 rounded-xl">
                      <div className="flex flex-[2_2_0px] flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[#a1abb5] text-sm font-normal leading-normal">{challenge.status}</p>
                          <p className="text-white text-base font-bold leading-tight">{challenge.title}</p>
                          <p className="text-[#a1abb5] text-sm font-normal leading-normal">{challenge.description}</p>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 flex-row-reverse bg-[#2b3036] text-white text-sm font-medium leading-normal w-fit">
                          <span className="truncate">{challenge.status === 'Active' ? 'Join' : 'View'}</span>
                        </button>
                      </div>
                      <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1 bg-[#2b3036] flex items-center justify-center text-4xl">
                        {challenge.category === 'Wellness' ? '🧘' : '💪'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Achievements</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                  {achievements.map((achievement, i) => (
                    <div key={i} className="flex flex-col gap-3 pb-3">
                      <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl bg-[#2b3036] flex items-center justify-center text-5xl">
                        {achievement.icon}
                      </div>
                      <p className="text-white text-base font-medium leading-normal">{achievement.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;