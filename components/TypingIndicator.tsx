
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1.5 px-4 py-3 bg-white border border-gray-100 rounded-2xl w-fit shadow-sm">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default TypingIndicator;
