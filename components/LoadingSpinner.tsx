import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-red-100">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base font-medium">
        Processing file...
      </p>
      <p className="mt-2 text-gray-400 text-xs sm:text-sm">
        This may take a moment for large files
      </p>
    </div>
  );
};

export default LoadingSpinner;
