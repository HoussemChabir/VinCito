import React, { useMemo } from 'react';

interface RSVPReaderProps {
  words: string[];
  position: number;
  chunkSize: number;
  isPlaying: boolean;
}

const RSVPReader: React.FC<RSVPReaderProps> = ({ words, position, chunkSize, isPlaying }) => {
  const chunkWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    return words.slice(position, position + chunkSize);
  }, [words, position, chunkSize]);

  const middleWordIndex = useMemo(() => {
    if (chunkWords.length === 0) return -1;
    // For an even number of words, this will be the word just left of the center.
    // e.g., for 4 words (indices 0,1,2,3), floor((4-1)/2) = 1. The word at index 1 is highlighted.
    return Math.floor((chunkWords.length - 1) / 2);
  }, [chunkWords.length]);

  const preMiddleWordsText = useMemo(() => {
    if (middleWordIndex <= 0) return '';
    return chunkWords.slice(0, middleWordIndex).join(' ');
  }, [chunkWords, middleWordIndex]);

  const middleWord = useMemo(() => {
    return middleWordIndex !== -1 ? chunkWords[middleWordIndex] : null;
  }, [chunkWords, middleWordIndex]);

  const postMiddleWordsText = useMemo(() => {
    if (middleWordIndex === -1 || middleWordIndex >= chunkWords.length - 1) return '';
    return chunkWords.slice(middleWordIndex + 1).join(' ');
  }, [chunkWords, middleWordIndex]);


  return (
    <div className="bg-white p-4 rounded-2xl border-2 border-red-100 flex-grow w-full h-full flex flex-col items-center justify-center font-sans text-4xl sm:text-5xl md:text-6xl font-black select-none tracking-wider overflow-hidden">
        
        {/* Top Focus Indicator */}
        <div className="w-px h-6 bg-red-500/70 mb-2"></div>

        {/* Text Container - Centered by parent flexbox */}
        <div 
          className="text-gray-800 min-h-[1.5em] flex items-center justify-center"
        >
             {(!isPlaying && chunkWords.length === 0) ? (
                <span className="text-gray-400 text-xl sm:text-2xl font-normal text-center">Press Play to start</span>
            ) : middleWord ? (
                <div className="whitespace-nowrap">
                    {preMiddleWordsText && <span>{preMiddleWordsText} </span>}
                    <span className="text-red-600">{middleWord}</span>
                    {postMiddleWordsText && <span> {postMiddleWordsText}</span>}
                </div>
            ) : (
                <div /> // Empty div to maintain height
            )}
        </div>
        
        {/* Bottom Focus Indicator */}
        <div className="w-px h-6 bg-red-500/70 mt-2"></div>

    </div>
  );
};

export default RSVPReader;