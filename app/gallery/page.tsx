"use client";

import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import Link from 'next/link';

export default function Gallery() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Content</h1>
              <p className="text-gray-600 mt-1">Upload and manage your content</p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Files</h2>
                <p className="text-gray-600">Select a file to upload to your gallery</p>
              </div>
              <FileUpload />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Files</h2>
                <p className="text-gray-600">View and download your uploaded files</p>
              </div>
              <FileList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 