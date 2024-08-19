// src/app/page.tsx
'use client';

import React from 'react';
import checkAuth from '../hooks/checkAuth';
import { logout } from '../lib/firebase';

const Home: React.FC = () => {
  const { user, status } = checkAuth();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h1>Profile page</h1>
      <p>Name: {user?.displayName}</p>
      <p>Email: {user?.email}</p>
      <p>Status: {status}</p>

      <button onClick={() => logout()} style={buttonStyle}>Logout</button>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  width: '100px',
  padding: '10px',
  margin: '20px 0',
  backgroundColor: '#d9534f',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default Home;
