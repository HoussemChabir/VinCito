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
    <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-red-100 flex-grow w-full h-full flex flex-col items-center justify-center font-sans text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black select-none tracking-wide sm:tracking-wider overflow-hidden touch-manipulation">

        <div className="w-px h-4 sm:h-6 bg-red-500/70 mb-1.5 sm:mb-2"></div>

        <div className="text-gray-800 min-h-[1.2em] sm:min-h-[1.5em] flex items-center justify-center px-2 max-w-full">
          {(!isPlaying && chunkWords.length === 0) ? (
            <span className="text-gray-400 text-base xs:text-lg sm:text-xl md:text-2xl font-normal text-center px-4">
              Press Play to start
            </span>
          ) : middleWord ? (
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap max-w-full">
              {preMiddleWordsText && (
                <span className="text-gray-700">{preMiddleWordsText}</span>
              )}
              <span className="text-red-600 font-extrabold">{middleWord}</span>
              {postMiddleWordsText && (
                <span className="text-gray-700">{postMiddleWordsText}</span>
              )}
            </div>
          ) : (
            <div className="h-[1.2em]"></div>
          )}
        </div>

        <div className="w-px h-4 sm:h-6 bg-red-500/70 mt-1.5 sm:mt-2"></div>
    </div>
  );
};

export default RSVPReader;