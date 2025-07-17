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

  // Calculate real category counts from user's boards
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return boards.length;
    return boards.filter(board =>
      board.category && board.category.toLowerCase() === categoryId
    ).length;
  };

  const categories = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'health', name: 'Health', icon: '💪' },
    { id: 'productivity', name: 'Productivity', icon: '💼' },
    { id: 'learning', name: 'Learning', icon: '🧠' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' }
  ];

  const habitTemplates = [
    {
      category: 'health',
      title: 'Morning Yoga',
      description: 'Start your day with mindful movement',
      icon: '🧘‍♀️',
      difficulty: 'easy',
      duration: 30,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyVdQXZv5MghtDW7ZoWDzX243KIjAebihPHroojj6obYc5O1WcNF8RmQsEmdrDhq_fd9pEuAYs2tfinu8GdpxjYxUINtb3gH4d68nkUp1ggzyeIsV_Z19KStY1AmWcLYd9u6Lb4cbULxZVvyKJ_I6YxRtp-5ctO7ifZFndpNoHSBzpCe9O2_h_NB3biAb36jSXscMnYVTLnilzN9PMGLqgCpbHGKEVJSBpJuyWVllW0Pbf3v8YKGUU7Wb15hDQ7p_K7hg4-iZdIbA'
    },
    {
      category: 'creative',
      title: 'Daily Journaling',
      description: 'Reflect and express thoughts in writing',
      icon: '�',
      difficulty: 'medium',
      duration: 21,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG_tEZNNy0IUSPqkFgU7iST0gYfMBYP6wC8Q3fjPBAVIWrWUeebbo4l1u0Qazr0-3HINxVvOhukAaZbpPTYpQeWnlu2PaCOknW8radzKrmdEMJqCGRjR-vSsZWyo7SuEV95sQP9y_6dnS_-RKJV_1YFSYLBkbtWXUsFCRnIOCOvdO97WwS4GzRP-kS0uITz1npDkC8I_bvFNygSgd_N0EHjlBX7rU6I8XVRT1ip08k1DqVDF3kkAeAJj7mJ0zUovqjjOiZVuBx87M'
    },
    {
      category: 'mindfulness',
      title: 'Evening Meditation',
      description: 'End your day with peaceful reflection',
      icon: '🧘',
      difficulty: 'easy',
      duration: 21,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGF87gCV9iNUlW_Pm7Ij7FSNO4FWsoAaqKPF_Gk00GKIULOvLLgzByaxNS5Qq-l6n-oXYD8Uexyeh1mxcSkb_f2KwFMT9bfazVjja7KwG9H5MG5Modnw7ed_Srk70ZcghgpuGA3W7OfOy4BQzWEsHkYg93pjC0uuFesziLHL0Imm0NYRDkYNjSn_b8AMaDU0gLq-ZHGmWDLmQwxWN_bYY4rk8_q7cUZgzMS_kkbpSMfVo74hsTxHjnrImWG15s-Yg2AE-Zz_xIcys'
    },
    {
      category: 'learning',
      title: 'Reading 20 Pages',
      description: 'Expand knowledge through daily reading',
      icon: '�',
      difficulty: 'medium',
      duration: 66,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4TeIVGZC291PQ1iDpsgeoPUBwA5dNx8eJFmOfI2NfjnH8y3DJSG8OHCU64O7vcmcZa1o9Pf6j1fQaUahsRD_o5Ai9Au1DsKRvHWHy9vXvZs5vRp5xxJro4mECAv25rhvhUk5sfhZnhN0mPAYOQQ9h7Nzf4VzE3CCOuoKP2uob4Sp5hdjzJgqWRnztoSs4bRcgSTRUkBExtmy2RIql_TnWANJ6MNebHwPvKtWhrhTI-GiqetEOSS4oLU3QkggllONL9-aO_4RwM8'
    },
    {
      category: 'productivity',
      title: 'No Social Media',
      description: 'Digital detox for better focus',
      icon: '�',
      difficulty: 'hard',
      duration: 30,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh8RF4kI8FnFP1BDJNKx3L7Fw2AtT75TFrdrBzcxuzaZRRPqlRQmG7XQ48p9oERjYLBTuNJkJTfoIsdyyxP_9BfiACymHVQP38pJ-tSulW1jzHehP4mclwfGX6dpm6GUavuZd9U_NMk6dUyTXk3IXMXloOJHetVDiowWUq3DMmC2rmaNX9qUD73u9_Dd72OhPiSrvyYlSJVicHgS3kd-03eup9PVoGn5khf8yJwrTW_tX1iytrL34PmW2jKMwtGSGam1hjA1DDGAY'
    },
    {
      category: 'learning',
      title: 'Learn a New Skill',
      description: 'Develop new abilities daily',
      icon: '💻',
      difficulty: 'medium',
      duration: 100,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR1WSJvP27kTTk32OReDCBDyfbxCoctv3FAl8xXVl7vsXOEwGwqPCT702bBGXcDJBliA9sepOHINxJ1egI92Qk766m86MdYsr_Q6KVRumUymAllnIieXVGMliD2dnv_afFfXT0nCo75sCnJ8P4jSj2byhi9-hmYh6CYB8XGkY91SQcZZqm8YFxT-9fQolID_OOAkR3-ZcQvvyw-i7eGMnOZF3iwYj9DwsBIF-WyK8jH7j_6dyBj9at3TiVfj3K2bb757W7hLsC70M'
    }
  ];

  const filteredTemplates = habitTemplates.filter(template => 
    filterCategory === 'all' || template.category === filterCategory
  );

  const createHabitFromTemplate = (template) => {
    onCreateBoard({
      title: template.title,
      days: template.duration,
      category: template.category,
      icon: template.icon,
      difficulty: template.difficulty
    });
  };

  const getProgressPercentage = (board) => {
    return Math.round((board.completed.size / board.days) * 100);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121417] dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Habits</p>
                <p className="text-[#a1abb5] text-sm font-normal leading-normal">Explore and manage your habits to build a better you.</p>
              </div>
            </div>

            {/* Habit Library Section */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Habit Library</h2>
            
            {/* Category Filters */}
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              {categories.map(category => (
                <div
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 cursor-pointer transition-all ${
                    filterCategory === category.id 
                      ? 'bg-[#ffa116] text-black' 
                      : 'bg-[#2b3036] text-white hover:bg-[#3a4047]'
                  }`}
                >
                  <p className="text-sm font-medium leading-normal">{category.name}</p>
                </div>
              ))}
            </div>

            {/* Habit Templates Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {filteredTemplates.map((template, index) => (
                <div 
                  key={index}
                  className="flex flex-col gap-3 pb-3 cursor-pointer hover:transform hover:scale-105 transition-all"
                  onClick={() => createHabitFromTemplate(template)}
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: `url("${template.image}")`}}
                  />
                  <div>
                    <p className="text-white text-base font-medium leading-normal">{template.title}</p>
                    <p className="text-[#a1abb5] text-sm font-normal leading-normal capitalize">{template.difficulty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Custom Habit Button */}
            <div className="flex px-4 py-3 justify-start">
              <button
                onClick={() => onCreateBoard({})}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#2b3036] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#3a4047] transition-all"
              >
                <span className="truncate">Create Custom Habit</span>
              </button>
            </div>

            {/* Your Habits Section */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Your Habits</h2>
            
            {boards.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-[#a1abb5] text-lg">No habits created yet</div>
                <div className="text-[#a1abb5] text-sm mt-2">Start by creating your first habit above!</div>
              </div>
            ) : (
              <div className="px-4 py-3">
                <div className="flex overflow-hidden rounded-xl border border-[#3f4750] bg-[#121417]">
                  <table className="flex-1">
                    <thead>
                      <tr className="bg-[#1d2125]">
                        <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Habit</th>
                        <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Category</th>
                        <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Difficulty</th>
                        <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Progress</th>
                        <th className="px-4 py-3 text-left text-white w-60 text-[#a1abb5] text-sm font-medium leading-normal">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boards.map((board, index) => {
                        const progress = getProgressPercentage(board);
                        return (
                          <tr key={board.id} className="border-t border-t-[#3f4750]">
                            <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                              {board.title}
                            </td>
                            <td className="h-[72px] px-4 py-2 w-[400px] text-[#a1abb5] text-sm font-normal leading-normal capitalize">
                              {board.category || 'General'}
                            </td>
                            <td className="h-[72px] px-4 py-2 w-[400px] text-[#a1abb5] text-sm font-normal leading-normal capitalize">
                              {board.difficulty || 'Medium'}
                            </td>
                            <td className="h-[72px] px-4 py-2 w-[400px] text-sm font-normal leading-normal">
                              <div className="flex items-center gap-3">
                                <div className="w-[88px] overflow-hidden rounded-sm bg-[#3f4750]">
                                  <div className="h-1 rounded-full bg-white" style={{width: `${progress}%`}} />
                                </div>
                                <p className="text-white text-sm font-medium leading-normal">{progress}</p>
                              </div>
                            </td>
                            <td className="h-[72px] px-4 py-2 w-60 text-[#a1abb5] text-sm font-bold leading-normal tracking-[0.015em] cursor-pointer hover:text-white">
                              View Details
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
