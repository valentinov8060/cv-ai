// src/app/page.tsx
'use client';

import React, { useState, useRef, ChangeEvent, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import checkAuth from '../hooks/checkAuth';
import { logout } from '../lib/firebase';
import { generateCV } from '../lib/generateCV';

const ChatBot: React.FC = () => {
  const { user, status } = checkAuth();
  const router = useRouter();

  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const textareaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Menyesuaikan tinggi textarea secara otomatis
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      // Membatasi height maksimal untuk scrollbar
      if (textareaRef.current.scrollHeight > 150) {
        textareaRef.current.style.height = '150px';
        textareaRef.current.style.overflowY = 'scroll';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  };

  const createCV = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const cvContent = await generateCV(input);
      setOutput(cvContent);
    } catch (error) {
      console.error('Error generating CV:', error);
      setOutput('Failed to generate CV');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unauthenticated') {
    router.push('/login');
  }
  
  if (status !== 'authenticated' ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 bg-gray-700 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">CV-AI</h1>
        <button 
          onClick={logout} 
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </header>

      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-4">
          {output && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-row-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>              
              </div>

              {output}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-200 dark:bg-gray-800">
        <div className="flex">
          <textarea
            ref={textareaRef}
            className="flex-grow p-2 text-black rounded-l-lg border-none focus:outline-none resize-none"
            style={{ maxHeight: '150px' }}
            rows={1}
            placeholder="Create your CV here..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            onClick={createCV}
            className="p-2 bg-blue-600 text-white rounded-r-lg"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Create'}
          </button>
        </div>
      </div>

      <footer className="p-4 bg-gray-300 dark:bg-gray-800 text-center text-sm text-gray-700 dark:text-gray-400">
        © 2024 ChatGPT AI
      </footer>
    </div>
  );
};

export default ChatBot;
