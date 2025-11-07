import React from 'react';

interface TextInputProps {
  onTextChange: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextChange }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-2xl p-4 sm:p-6 border-2 border-red-100">
      <textarea
        placeholder="Paste your text here to begin..."
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-full bg-white text-gray-800 p-4 border-2 border-dashed border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-base sm:text-lg placeholder-gray-400"
      />
      <p className="text-gray-500 mt-4 text-center text-sm sm:text-base">...or use the "Upload" button below to load a text or PDF file.</p>
    </div>
  );
};

export default TextInput;