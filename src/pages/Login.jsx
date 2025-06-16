import React from 'react';

export default function Login() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Login</h2>
      <input style={{ border: '1px solid #d1d5db', padding: '0.5rem', width: '100%', marginBottom: '1rem' }} placeholder="Enter username" />
      <button style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>Log In</button>
    </div>
  );
}