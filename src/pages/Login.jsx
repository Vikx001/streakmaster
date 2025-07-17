import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111518', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Login Page</h1>
      <Link to="/app" style={{ color: '#1993e5' }}>Go to App</Link>
    </div>
  );
}
