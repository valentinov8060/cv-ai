// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { signInWithGoogle } from '../../lib/firebase';

import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebase';

const Login: React.FC = () => {
  const router = useRouter();
  const auth =  getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  return (
    <div style={container}>
      <h1>Log in to the app</h1>
      <button onClick={signInWithGoogle} style={buttonStyle}>Login with Google</button>
    </div>
  );
};

const container: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  padding: '20px', 
  border: '1px solid #ccc', 
  borderRadius: '5px' 
}

const buttonStyle: React.CSSProperties = {
  width: '300px',
  padding: '10px',
  margin: '10px 0',
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default Login;
