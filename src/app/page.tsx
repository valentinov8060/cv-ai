// src/app/page.tsx
'use client';

import React, { useState, useRef, ChangeEvent, RefObject } from 'react';
import Image from 'next/image'
import { generateCv, formattedCv, generateCvPdf } from '../lib/cvGenerator';

const Page: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const textareaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInput(text);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      if (textareaRef.current.scrollHeight > 150) {
        textareaRef.current.style.height = '150px';
        textareaRef.current.style.overflowY = 'scroll';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  };

  const getCv = async () => {
    if (!input) return;
    const wordCount = input.trim().split(/\s+/).length;
    const maxWord = 1450;
    if (wordCount > maxWord) {
      alert(`Maximum ${maxWord} words allowed.`);
    } else {
      setLoading(true);
      try {
        const response = await generateCv(input);
        setResponse(response);
        setOutput(formattedCv(response));
        console.log(response)
        console.log(formattedCv(response))
      } catch (error) {
        console.error('Error generating CV:', error);
        setOutput('Failed to generate CV');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 bg-gray-700 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">CV-AI</h1>
      </header>

      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-4">
          {loading ? (
            <Image
              src="/loading.gif"
              alt="Loading Image"
              width={180}
              height={20}
            />
          ) : (
            <>
              {output ? (
                <div className="text-white bg-gray-800 p-4 rounded-lg">
                  <div className="flex flex-row-reverse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                      onClick={() => generateCvPdf(response)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: output }} />
                </div>
              ) : (
                <p className="text-gray-500">No CV generated yet.</p>
              )}
            </>
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
            placeholder="Write about yourself..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            onClick={getCv}
            className="p-2 bg-blue-600 text-white rounded-r-lg"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Create'}
          </button>
        </div>
      </div>

      <footer className="p-4 bg-gray-300 dark:bg-gray-800 text-center text-sm text-gray-700 dark:text-gray-400">
        © 2024 Groq AI
      </footer>
    </div>
  );
};

export default Page;
