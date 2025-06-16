import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ background: '#fff', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>Streakly</Link>
      <Link to="/login" style={{ color: '#4b5563', textDecoration: 'none' }}>Login</Link>
    </nav>
  );
}