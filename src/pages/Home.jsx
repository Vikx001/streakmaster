import React, { useState } from 'react';
import StreakBoard from '../components/StreakBoard';

export default function Home() {
  const [title, setTitle] = useState('');
  const [days, setDays] = useState('');
  const [boards, setBoards] = useState([]);

  const createBoard = () => {
  const streakDays = parseInt(days);
  if (!title || !streakDays || streakDays <= 0) return;

  // Ask for shape
  const shape = prompt("Choose shape: square, rounded, or circle", "square");

  let layout = 'week';
  if (streakDays > 31) {
    layout = prompt("You entered more than 31 days. Display layout as `week` or `month`?", "week")?.toLowerCase();
  } else {
    layout = prompt("Choose layout: week, month, or random", "week")?.toLowerCase();
  }

  const newBoard = {
    id: Date.now(),
    title,
    days: streakDays,
    shape: shape?.toLowerCase() || 'square',
    layout: layout || 'week'
  };

  setBoards([...boards, newBoard]);
  setTitle('');
  setDays('');
};


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create a Streak</h2>
      <input
        style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        type="text"
        placeholder="e.g. 100 Days of Code"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        type="number"
        placeholder="How many days? (e.g. 100)"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />
      <button
        onClick={createBoard}
        style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        Create Streak
      </button>

      <div style={{ marginTop: '30px' }}>
        {boards.map((board) => (
          <div key={board.id} style={{ marginBottom: '40px' }}>
            <h3>{board.title}</h3>
            <StreakBoard
              days={board.days}
              shape={board.shape}
              layout={board.layout}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
