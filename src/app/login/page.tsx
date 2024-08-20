// src/app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { signInWithGoogle } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebase';

const Login: React.FC = () => {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  return (
    <div className="flex flex-col items-center justify-center border border-gray-300 h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to the CV-AI</h1>
        <p>You can make your cv here, with AI</p>
      </div>
      <div className="flex flex-col items-center p-5 border border-gray-300 rounded-md">
        <h1 className="text-2xl mb-4">Log in to the app</h1>
        <button 
          onClick={signInWithGoogle} 
          className="w-72 p-2 mt-2 mb-2 bg-gray-800 text-white rounded-md text-lg hover:bg-gray-700"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
