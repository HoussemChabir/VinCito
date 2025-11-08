import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-3 sm:py-4 border-b border-red-200">
      <h1
        className="text-3xl xs:text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600"
      >
        VinCito
      </h1>
      <p className="text-gray-500 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base px-4">
        Where speed meets understanding.
      </p>
    </header>
  );
};

export default Header;