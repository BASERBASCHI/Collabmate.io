import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="text-2xl font-bold mt-4 text-gray-800">Loading CollabMate</h1>
        <p className="text-gray-600 mt-2">Connecting AI matching engine...</p>
      </div>
    </div>
  );
};