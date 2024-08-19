// src/hooks/checkAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../lib/firebase';

const checkAuth = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else if (!currentUser) {
        setUser(null);
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return { user: null, status: 'loading' };
  }

  return { user, status: user ? 'authenticated' : 'unauthenticated' };
};

export default checkAuth;
