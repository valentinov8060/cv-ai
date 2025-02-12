"use client";

import React from "react";
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <header className="container mx-auto flex justify-between items-center py-6">
        <div className="text-2xl font-bold text-blue-600">CV-AI</div>
        <nav>
          <ul className="flex space-x-6 text-gray-700">
            <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto mt-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Create Your Professional CV with Ease</h1>
          <p className="text-lg text-gray-600 mb-6">Leverage the power of AI to craft a personalized CV in minutes.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            <Link href={`/cv_builder`}>{`Get Started`}</Link>
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Fast & Easy</h3>
            <p className="text-gray-600 mt-2">Input your CV details and create your CV in just a few clicks—quick, simple, and hassle-free.</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">ATS Optimized</h3>
            <p className="text-gray-600 mt-2">Ensure your CV gets past Applicant Tracking Systems (ATS) effortlessly.</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Download as PDF</h3>
            <p className="text-gray-600 mt-2">Generate and download your CV instantly in high-quality PDF format.</p>
          </div>
        </motion.div>
      </main>

      <footer id="contact" className="mt-24 py-8 bg-blue-600 text-white rounded-lg">
        <div className="container mx-auto text-center px-4">
          <p className="text-lg">
            Have questions? Reach us at <a href="mailto:valentinovbill0@gmail.com" className="underline ml-1">valentinovbill0@gmail.com</a>
          </p>
          <p className="mt-4 font-semibold">Valentinov Software</p>
          <p className="mt-2 text-sm opacity-80">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
