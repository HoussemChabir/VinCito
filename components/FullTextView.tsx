import React, { useRef, useEffect, Fragment } from 'react';

interface FullTextViewProps {
  words: string[];
  currentPosition: number;
  chunkSize: number;
  isPlaying: boolean;
  onWordClick: (position: number) => void;
}

const FullTextView: React.FC<FullTextViewProps> = ({ words, currentPosition, chunkSize, isPlaying, onWordClick }) => {
  const activeWordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isPlaying && activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentPosition, isPlaying]);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl h-full overflow-y-auto border-2 border-red-100 touch-manipulation">
      <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed sm:leading-loose select-none font-serif-bionic">
        {words.map((word, index) => {
          const isHighlighted = index >= currentPosition && index < currentPosition + chunkSize;
          const splitPoint = Math.ceil(word.length / 2);
          const boldPart = word.substring(0, splitPoint);
          const regularPart = word.substring(splitPoint);

          return (
            <Fragment key={index}>
              <span
                ref={isHighlighted && index === currentPosition ? activeWordRef : null}
                onClick={() => onWordClick(index)}
                className={`transition-all duration-150 ease-in-out rounded px-1 py-0.5 cursor-pointer inline-block ${
                  isHighlighted
                    ? 'bg-red-500/20 text-red-600 font-semibold'
                    : 'text-gray-600 hover:bg-red-100 active:bg-red-200'
                }`}
              >
                <span className="font-bold">{boldPart}</span>
                <span>{regularPart}</span>
              </span>
              {index < words.length - 1 && ' '}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
};

export default FullTextView;